import { db } from "@/db";
import { users } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // TODO: get the current authenticated user
    const userList = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
    })
    .from(users)
    .limit(1);

    if (userList.length === 0) {
      return NextResponse.json({
        success: false,
        error: "No users found. Please run the user seed script first."
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: userList[0],
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error",
    }, { status: 500 });
  }
} 