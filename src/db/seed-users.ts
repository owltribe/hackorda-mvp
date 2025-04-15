import * as schema from "./schema";
import { db } from "./index";
import { eq } from "drizzle-orm";

async function main() {
  console.log("Starting database seeding for test users...");

  try {
    // Check if test user already exists
    const existingUser = await db.select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.email, "test@example.com"))
      .limit(1);

    if (existingUser.length > 0) {
      console.log(`Test user already exists with ID: ${existingUser[0].id}`);
    } else {
      // Insert a test user
      const [newUser] = await db.insert(schema.users)
        .values({
          name: "Test User",
          email: "test@example.com",
          age: 30,
          city: "Test City",
          // createdAt will use defaultNow()
        })
        .returning({ id: schema.users.id });

      console.log(`Created test user with ID: ${newUser.id}`);
    }

    console.log("User seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding test user:", error);
  }
}

main().catch(err => {
  console.error("Database seeding error:", err);
  process.exit(1);
}); 