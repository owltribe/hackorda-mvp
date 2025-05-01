import { InProgressQuizNotifier } from "@/components/notifications/InProgressQuizNotifier";
import { currentUser } from "@clerk/nextjs/server";
import ShootingStarsAndStarsBackgroundDemo from "@/components/ui/shooting-stars-and-stars-background-demo";

export default async function Home() {
  const user = await currentUser();
  
  return (
    <div className="flex flex-col overflow-hidden">
      <InProgressQuizNotifier />

      <h1 className="text-md text-muted-foreground">Welcome, {user?.firstName|| 'Guest'}!</h1>

      <ShootingStarsAndStarsBackgroundDemo />
    </div>
  );
}