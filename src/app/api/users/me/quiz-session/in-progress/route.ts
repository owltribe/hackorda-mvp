import { db } from "@/db";
import { quizSession, users } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json(
        { success: false, error: "User not authenticated" },
        { status: 401 } 
      );
    }

    // 1. Find the internal user ID using the clerkUserId
    const [internalUser] = await db
      .select({ id: users.id }) // Select the internal user ID (assuming it's UUID)
      .from(users)
      .where(eq(users.clerkId, clerkUserId))
      .limit(1);

    if (!internalUser) {
      // This case might happen if user exists in Clerk but not your DB yet
      return NextResponse.json(
        { success: false, error: "User profile not found in database" },
        { status: 404 } 
      );
    }

    const internalUserId = internalUser.id;

    // 2. Fetch the single in-progress session using the internal user ID
    const [inProgressSession] = await db
      .select({
        id: quizSession.id,
        selectionCriteria: quizSession.selectionCriteria,
      })
      .from(quizSession)
      .where(
        and(
          eq(quizSession.userId, internalUserId),
          eq(quizSession.status, 'in_progress')
        )
      )
      .limit(1); // Expecting only one active session at most

    return NextResponse.json({
      success: true,
      data: inProgressSession || null, // Return the session or null
    });

  } catch (error) {
    console.error("Error fetching in-progress quiz session:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
} 