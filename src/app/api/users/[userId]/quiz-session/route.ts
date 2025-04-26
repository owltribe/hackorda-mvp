import { db } from "@/db";
import { quizSession } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const paramsData = await params;
    const userId = paramsData.userId;

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: "Invalid user ID",
      }, { status: 400 });
    }

    // Get user's quiz sessions sorted by most recent first
    // Select only the necessary fields for each session summary
    const sessions = await db.select({
      id: quizSession.id,
      status: quizSession.status,
      score: quizSession.score,
      numberOfQuestions: quizSession.numberOfQuestions,
      selectionCriteria: quizSession.selectionCriteria,
      createdAt: quizSession.createdAt,
      updatedAt: quizSession.updatedAt,
    })
    .from(quizSession)
    .where(eq(quizSession.userId, userId))
    .orderBy(desc(quizSession.createdAt));

    return NextResponse.json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    console.error("Error fetching user quiz session:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    }, { status: 500 });
  }
} 