import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { quizSession } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  try {
    const { sessionId } = await request.json();

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: "session ID is required",
      }, { status: 400 });
    }

    // Check if the quiz exists
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

    // Only allow abandoning in-progress quizzes
    if (quizRecord[0].status !== 'in_progress') {
      return NextResponse.json({
        success: false,
        error: `Quiz session is already ${quizRecord[0].status}`,
        status: quizRecord[0].status
      }, { status: 400 });
    }

    // Update the quiz status to 'abandoned'
    await db.update(quizSession)
      .set({ 
        status: 'abandoned',
        updatedAt: new Date() 
      })
      .where(eq(quizSession.id, sessionId));

    return NextResponse.json({
      success: true,
      message: "Quiz abandoned successfully"
    });
  } catch (error) {
    console.error("Error abandoning quiz:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    }, { status: 500 });
  }
} 