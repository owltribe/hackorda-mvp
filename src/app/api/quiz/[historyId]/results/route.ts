import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { quizHistory, quizAnswers, questions } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ historyId: string }> }
) {
  try {
    const paramsData = await params;
    const historyId = parseInt(paramsData.historyId);

    if (isNaN(historyId)) {
      return NextResponse.json({
        success: false,
        error: "Invalid history ID",
      }, { status: 400 });
    }

    // Get the quiz history record
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

    // Get all answers for this quiz
    const answers = await db.select({
      id: quizAnswers.id,
      questionId: quizAnswers.questionId,
      selectedOptionKey: quizAnswers.selectedOptionKey,
      isCorrect: quizAnswers.isCorrect,
      answeredAt: quizAnswers.answeredAt
    })
    .from(quizAnswers)
    .where(eq(quizAnswers.historyId, historyId));

    // Get the questions
    const questionIds = answers.map(a => a.questionId);
    const questionData = await db.select()
      .from(questions)
      .where(inArray(questions.id, questionIds));

    // Match questions with answers
    const questionsWithAnswers = answers.map(answer => {
      const question = questionData.find(q => q.id === answer.questionId);
      return {
        ...answer,
        question: question || null
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        quiz: quizRecord[0],
        answers: questionsWithAnswers,
        summary: {
          totalQuestions: quizRecord[0].numberOfQuestions,
          answered: answers.length,
          correct: answers.filter(a => a.isCorrect).length,
          score: quizRecord[0].score,
          status: quizRecord[0].status
        }
      }
    });
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    }, { status: 500 });
  }
} 