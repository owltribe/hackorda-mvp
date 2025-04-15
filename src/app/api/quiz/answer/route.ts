import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { quizHistory, quizAnswers, questions } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { historyId, questionId, selectedOptionKey } = await request.json();

    if (!historyId || !questionId || !selectedOptionKey) {
      return NextResponse.json({
        success: false,
        error: "Missing required fields: historyId, questionId, selectedOptionKey",
      }, { status: 400 });
    }

    // Check if the quiz is still in progress
    const quizRecord = await db.select()
      .from(quizHistory)
      .where(eq(quizHistory.id, historyId))
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
        historyId,
        questionId, 
        selectedOptionKey,
        isCorrect,
      });

    // Count total answered questions
    const answeredQuestions = await db.select({ count: sql`COUNT(*)` })
      .from(quizAnswers)
      .where(eq(quizAnswers.historyId, historyId));
    
    const totalAnswered = Number(answeredQuestions[0]?.count || 0);
    const totalQuestions = quizRecord[0].questionIds.length;
    
    let quizComplete = false;
    
    // If all questions are answered, update the quiz status and calculate the score
    if (totalAnswered >= totalQuestions) {
      // Count correct answers
      const correctAnswers = await db.select({ count: sql`COUNT(*)` })
        .from(quizAnswers)
        .where(and(
          eq(quizAnswers.historyId, historyId),
          eq(quizAnswers.isCorrect, true)
        ));
      
      const score = Number(correctAnswers[0]?.count || 0);
      
      // Update quiz record
      await db.update(quizHistory)
        .set({ 
          status: 'completed',
          completedAt: new Date(),
          score: score
        })
        .where(eq(quizHistory.id, historyId));
      
      quizComplete = true;
    }

    return NextResponse.json({
      success: true,
      data: {
        isCorrect,
        quizComplete,
        progress: {
          answered: totalAnswered,
          total: totalQuestions,
          percentage: Math.round((totalAnswered / totalQuestions) * 100)
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