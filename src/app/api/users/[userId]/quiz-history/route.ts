import { db } from "@/db";
import { quizHistory } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const paramsData = await params;
    const userId = parseInt(paramsData.userId);

    if (isNaN(userId)) {
      return NextResponse.json({
        success: false,
        error: "Invalid user ID",
      }, { status: 400 });
    }

    // Get user's quiz history sorted by most recent first
    const history = await db.select({
      id: quizHistory.id,
      status: quizHistory.status,
      score: quizHistory.score,
      totalQuestions: quizHistory.numberOfQuestions,
      questionIds: quizHistory.questionIds,
      selectionCriteria: quizHistory.selectionCriteria,
      takenAt: quizHistory.takenAt,
      completedAt: quizHistory.completedAt,
    })
    .from(quizHistory)
    .where(eq(quizHistory.userId, userId))
    .orderBy(desc(quizHistory.takenAt));

    return NextResponse.json({
      success: true,
      data: history,
    });
  } catch (error) {
    console.error("Error fetching user quiz history:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    }, { status: 500 });
  }
} 