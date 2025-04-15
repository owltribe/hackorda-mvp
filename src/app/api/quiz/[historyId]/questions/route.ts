import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { quizHistory, questions } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

// This endpoint gets questions for a specific quiz session
export async function GET(
  request: NextRequest,
  { params }: { params: { historyId: string } }
) {
  try {
    const historyId = parseInt(params.historyId);

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

    // Check if the quiz is in progress
    if (quizRecord[0].status !== 'in_progress') {
      return NextResponse.json({
        success: false,
        error: `Quiz session is ${quizRecord[0].status}`,
        status: quizRecord[0].status
      }, { status: 400 });
    }

    // Get the question IDs from the history record
    const questionIds = quizRecord[0].questionIds;

    // Fetch the questions in the exact order they were stored
    // This requires a bit more complex query to preserve the order
    const questionsData = await db.select()
      .from(questions)
      .where(inArray(questions.id, questionIds));

    // Reorder to match the original order from questionIds
    const orderedQuestions = questionIds.map(id => 
      questionsData.find(q => q.id === id)
    ).filter(Boolean); // Remove any undefined (in case a question was deleted)

    return NextResponse.json({
      success: true,
      data: orderedQuestions,
      quizStatus: quizRecord[0].status,
    });
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    }, { status: 500 });
  }
} 