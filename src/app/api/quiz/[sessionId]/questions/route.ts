import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { quizSession, questions, quizAnswers } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";

// This endpoint gets questions for a specific quiz session
export const GET = async (
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) => {
  try {
    const paramsData = await params;
    const sessionId = parseInt(paramsData.sessionId);

    if (isNaN(sessionId)) {
      return NextResponse.json({
        success: false,
        error: "Invalid session ID",
      }, { status: 400 });
    }

    // Get the quiz session record
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

    // Check if the quiz is in progress
    if (quizRecord[0].status !== 'in_progress') {
      return NextResponse.json({
        success: false,
        error: `Quiz session is ${quizRecord[0].status}`,
        status: quizRecord[0].status
      }, { status: 400 });
    }

    // Get the question IDs from the session record
    const questionIds = quizRecord[0].questionIds;

    // Fetch the questions in the exact order they were stored
    const questionsData = await db.select()
      .from(questions)
      .where(inArray(questions.id, questionIds));

    // Fetch answered questions for this session
    const answeredData = await db.select({ questionId: quizAnswers.questionId })
      .from(quizAnswers)
      .where(eq(quizAnswers.sessionId, sessionId));
    
    const answeredQuestionIds = answeredData.map(a => a.questionId);
    
    // Reorder to match the original order from questionIds
    const orderedQuestions = questionIds.map(id => 
      questionsData.find(q => q.id === id)
    ).filter(Boolean) as (typeof questions.$inferSelect)[]; // Ensure type after filter

    // Calculate the index of the first unanswered question
    const answeredIdsSet = new Set(answeredQuestionIds);
    const firstUnansweredIndex = orderedQuestions.findIndex(q => !answeredIdsSet.has(q.id));

    return NextResponse.json({
      success: true,
      data: {
        questions: orderedQuestions,
        answeredQuestionIds,
        quizStatus: quizRecord[0].status,
        firstUnansweredIndex: firstUnansweredIndex,
      }
    });
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    }, { status: 500 });
  }
}; 