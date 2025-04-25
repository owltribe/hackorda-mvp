import { db } from "@/db";
import { quizSession, users } from "@/db/schema";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { sql, desc } from "drizzle-orm";

async function getLeaderboardData() {
  const leaderboard = await db
    .select({
      userId: quizSession.userId,
      firstName: users.firstName,
      lastName: users.lastName,
      quizCriteria: quizSession.selectionCriteria,
      completedQuizzes: sql<number>`COUNT(*)`,
      averageScore: sql<number>`ROUND(AVG(score), 2)`,
      highestScore: sql<number>`MAX(score)`
    })
    .from(quizSession)
    .leftJoin(users, sql`${users.id} = ${quizSession.userId}`)
    .where(sql`status = 'completed'`)
    .groupBy(quizSession.userId, quizSession.selectionCriteria, users.firstName, users.lastName)
    .orderBy(desc(sql`AVG(score)`))
    .limit(1000);

  return leaderboard;
}

export default async function LeaderboardPage() {
  const leaderboardData = await getLeaderboardData();

  return (
    <div className="container mx-auto space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground">
          Top performers ranked by average quiz score
        </p>
      </div>

      {leaderboardData.length > 0 ? (
        <DataTable columns={columns} data={leaderboardData} />
      ) : (
        <div className="flex flex-col items-center justify-center h-[400px] border rounded-lg bg-muted/10">
          <p className="text-muted-foreground text-center">
            No quiz data available yet. Be the first to take a quiz!
          </p>
        </div>
      )}
    </div>
  );
}