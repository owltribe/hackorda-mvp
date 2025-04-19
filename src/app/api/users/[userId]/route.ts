import { db } from "@/db";
import { users } from "@/db/schema";
import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  try {
    // Await the params to get the userId
    const { userId } = await context.params;
    const { userId: clerkUserId } = await auth();

    if (!clerkUserId) {
      return NextResponse.json({
        success: false,
        error: "User not authenticated"
      }, { status: 401 });
    }

    // For security, only allow users to fetch their own data
    // 'me' is a special case for getting current user
    if (userId !== 'me' && userId !== clerkUserId) {
      return NextResponse.json({
        success: false,
        error: "Unauthorized access"
      }, { status: 403 });
    }

    // Fetch the user from your database using the clerkId
    const userList = await db.select({
      id: users.id,
      clerkId: users.clerkId,
      firstName: users.firstName,
      lastName: users.lastName,
      email: users.email,
      age: users.age,
      city: users.city,
    })
    .from(users)
    .where(eq(users.clerkId, clerkUserId))
    .limit(1);

    if (userList.length === 0) {
      return NextResponse.json({
        success: false,
        error: "User profile not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: userList[0],
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    }, { status: 500 });
  }
}