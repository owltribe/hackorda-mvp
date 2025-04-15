import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { quizHistory, questions } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

// This endpoint creates a new quiz session
export async function POST(request: NextRequest) {
  try {
    const { userId, moduleId, numberOfQuestions = 3 } = await request.json();

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "User ID is required",
      }, { status: 400 });
    }

    // Query to get the question IDs
    let query = db.select({ id: questions.id })
      .from(questions)
      .orderBy(sql`RANDOM()`)
      .limit(numberOfQuestions);

    const questionsList = await query;
    
    // Extract just the IDs
    const questionIds = questionsList.map(q => q.id);

    if (questionIds.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No questions available for the given criteria",
      }, { status: 404 });
    }

    // Create a new quiz history record
    const [newQuizHistory] = await db.insert(quizHistory)
      .values({
        userId,
        numberOfQuestions: questionIds.length,
        questionIds,
        status: 'in_progress',
        selectionCriteria: 'random',
        score: 0,
      })
      .returning({ id: quizHistory.id });

    return NextResponse.json({
      success: true,
      data: {
        historyId: newQuizHistory.id,
        numberOfQuestions: questionIds.length,
      },
    });
  } catch (error) {
    console.error("Error starting quiz:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    }, { status: 500 });
  }
} 