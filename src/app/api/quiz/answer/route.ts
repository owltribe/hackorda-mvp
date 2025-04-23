import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { quizSession, quizAnswers, questions } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { sessionId, questionId, selectedOptionKey } = await request.json();

    if (!sessionId || !questionId || !selectedOptionKey) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields: sessionId, questionId, selectedOptionKey",
      }, { status: 400 });
    }

    // Check if the quiz is still in progress (and exists)
    const quizRecord = await db.select()
      .from(quizSession)
      .where(eq(quizSession.id, sessionId))
      .limit(1);

    if (quizRecord.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Quiz session not found",
      }, { status: 404 });
    }

    if (quizRecord[0].status !== 'in_progress') {
      return NextResponse.json({
        success: false,
        error: `Quiz session is ${quizRecord[0].status}`,
      }, { status: 400 });
    }

    // Get the question to check if the answer is correct
    const questionRecord = await db.select()
      .from(questions)
      .where(eq(questions.id, questionId))
      .limit(1);

    if (questionRecord.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Question not found",
      }, { status: 404 });
    }

    const isCorrect = selectedOptionKey === questionRecord[0].correctOptionKey;
  
    // --- Start Transaction ---
    let quizComplete = false;
    let totalAnswered = 0;
    let score = 0;

    try {
      await db.transaction(async (tx) => {
        // 1. Record the answer using the transaction instance (tx)
        await tx.insert(quizAnswers)
          .values({
            sessionId,
            questionId,
            selectedOptionKey,
            isCorrect,
          });

        // 2. Count total answered questions using tx
        const answeredQuestions = await tx.select({ count: sql<number>`COUNT(*)` })
          .from(quizAnswers)
          .where(eq(quizAnswers.sessionId, sessionId));

        totalAnswered = Number(answeredQuestions[0]?.count || 0);
        const totalQuestions = quizRecord[0].questionIds.length; // Comes from outside transaction, safe

        // 3. Calculate the current score using tx
        const correctAnswers = await tx.select({ count: sql<number>`COUNT(*)` })
          .from(quizAnswers)
          .where(and(
            eq(quizAnswers.sessionId, sessionId),
            eq(quizAnswers.isCorrect, true)
          ));
        score = Number(correctAnswers[0]?.count || 0);
        // console.log("score (in tx): ", score); // Optional logging within tx

        // 4. Prepare data for update
        const updateData: Partial<typeof quizSession.$inferInsert> = {
          score: score, 
          updatedAt: new Date(), 
        };

        // 5. Check if quiz is complete
        if (totalAnswered >= totalQuestions) {
          quizComplete = true; // Set flag for response outside tx
          updateData.status = 'completed';
        }

        // 6. Update the quiz session using tx
        await tx.update(quizSession)
          .set(updateData)
          .where(eq(quizSession.id, sessionId));
      });
      // --- Transaction End ---

    } catch (txError) {
      console.error("Transaction failed:", txError);
      // Throw or return a specific transaction error response
      return NextResponse.json(
        { success: false, error: "Failed to save answer due to a database issue." },
        { status: 500 }
      );
    }

    // Use the results calculated within the transaction for the response
    const totalQuestions = quizRecord[0].questionIds.length; // Recalculate or pass from outside tx scope if needed
    return NextResponse.json({
      success: true,
      data: {
        isCorrect,
        quizComplete,
        progress: {
          answered: totalAnswered,
          total: totalQuestions,
          percentage: totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0
        }
      },
    });
  } catch (error) {
    console.error("Error recording answer:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    }, { status: 500 });
  }
} 