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
  
    // Record the answer
    await db.insert(quizAnswers)
      .values({
        sessionId,
        questionId,
        selectedOptionKey,
        isCorrect,
      });

    // Count total answered questions
    const answeredQuestions = await db.select({ count: sql`COUNT(*)` })
      .from(quizAnswers)
      .where(eq(quizAnswers.sessionId, sessionId));

    const totalAnswered = Number(answeredQuestions[0]?.count || 0);
    const totalQuestions = quizRecord[0].questionIds.length;

    // Calculate the current score regardless of completion status
    const correctAnswers = await db.select({ count: sql`COUNT(*)` })
      .from(quizAnswers)
      .where(and(
        eq(quizAnswers.sessionId, sessionId),
        eq(quizAnswers.isCorrect, true)
      ));
    const score = Number(correctAnswers[0]?.count || 0);
    console.log("correctAnswers: ", correctAnswers); // Keep logs if needed
    console.log("score: ", score); // Keep logs if needed

    // Prepare data for update
    const updateData: Partial<typeof quizSession.$inferInsert> = {
      score: score, // Always update score
      updatedAt: new Date(), // Always update timestamp
    };

    let quizComplete = false;

    // If all questions are answered, add status to the update data
    if (totalAnswered >= totalQuestions) {
      quizComplete = true;
      updateData.status = 'completed';
    }

    // Single update call
    await db.update(quizSession)
      .set(updateData)
      .where(eq(quizSession.id, sessionId));

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