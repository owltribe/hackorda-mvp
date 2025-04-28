import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  
  // TODO: Implement a proper dashboard or redirect to /quiz
  return (
    <div className="flex flex-col">
      <h1 className="text-2xl font-semibold mb-4">Home Page</h1>
      <p className="text-muted-foreground">
        Welcome, {user?.firstName || 'Guest'}. Content TBD.
      </p>
      {/* Maybe add a link to the quiz page? 
      <Link href="/quiz" className="mt-4 text-blue-500 underline">
        Go to Quiz Selection
      </Link> 
      */}
    </div>
  );
}