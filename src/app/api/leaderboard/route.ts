import { db } from "@/db";
import { quizSession, users } from "@/db/schema";
import { NextResponse } from "next/server";
import { sql, desc, eq, and, gt, isNotNull } from "drizzle-orm";

export async function GET() {
  try {
    // Get leaderboard data for all users based on completed quizzes
    const leaderboardData = await db.select({
      userId: quizSession.userId,
      firstName: users.firstName,
      lastName: users.lastName,
      quizCriteria: quizSession.selectionCriteria,
      // Count only completed quizzes
      completedQuizzes: sql<number>`COUNT(*)`.mapWith(Number), 
      // Calculate average percentage score for completed quizzes
      averagePercentageScore: sql<number>`ROUND(AVG(${quizSession.score} * 100.0 / ${quizSession.numberOfQuestions}), 2)`.mapWith(Number),
      // Calculate average correct answers for completed quizzes
      averageCorrect: sql<number>`ROUND(AVG(${quizSession.score}), 2)`.mapWith(Number) 
    })
    .from(quizSession)
    .leftJoin(users, eq(users.id, quizSession.userId)) // Use eq helper
    // Filter for completed quizzes with valid data
    .where(and(
      eq(quizSession.status, 'completed'), 
      isNotNull(quizSession.score), // Ensure score is not null
      gt(quizSession.numberOfQuestions, 0) // Ensure numberOfQuestions > 0
    ))
    .groupBy(quizSession.userId, quizSession.selectionCriteria, users.firstName, users.lastName)
    // Order by average percentage score descending
    .orderBy(desc(sql<number>`AVG(${quizSession.score})`))
    .limit(200);

    return NextResponse.json({
      success: true,
      data: leaderboardData,
    });
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    }, { status: 500 });
  }
} 