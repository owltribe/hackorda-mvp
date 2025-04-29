import { InProgressQuizNotifier } from "@/components/notifications/InProgressQuizNotifier";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  
  return (
    <div className="flex flex-col">
      <InProgressQuizNotifier />

      <h1 className="text-4xl font-semibold mb-4">Welcome, {user?.firstName || 'Guest'}!</h1>
    </div>
  );
}