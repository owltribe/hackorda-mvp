import { db } from "@/db";
import { users, quizSession } from "@/db/schema";
import { faker } from "@faker-js/faker";
import { v4 as uuidv4 } from "uuid";

async function main() {
  console.log("🌱 Starting seeding...");

  // Create 200 users
  const fakeUsers = Array.from({ length: 200 }, () => ({
    id: uuidv4(),
    clerkId: faker.string.uuid(),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }));

  // Insert users in batches
  console.log("👥 Creating users...");
  await db.insert(users).values(fakeUsers);

  // Create quiz sessions for each user
  console.log("📝 Creating quiz sessions...");
  for (const user of fakeUsers) {
    // Generate 1-5 quiz sessions per user
    const numberOfSessions = faker.number.int({ min: 1, max: 5 });
    
    const quizSessions = Array.from({ length: numberOfSessions }, () => ({
      userId: user.id,
      numberOfQuestions: faker.number.int({ min: 5, max: 20 }),
      questionIds: Array.from({ length: 10 }, () => faker.number.int({ min: 1, max: 100 })),
      status: 'completed',
      score: faker.number.int({ min: 0, max: 100 }),
      selectionCriteria: faker.helpers.arrayElement(['javascript', 'python', 'java', 'random']),
      createdAt: faker.date.recent({ days: 30 }),
    }));

    await db.insert(quizSession).values(quizSessions);
  }

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$client.end();
    process.exit(0);
  });