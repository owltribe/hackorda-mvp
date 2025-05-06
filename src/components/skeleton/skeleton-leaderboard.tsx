import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonLeaderboard() {
  return (  
    <section className="w-full space-y-6">
      <div className="flex flex-row items-center">
        <div className="flex flex-col gap-2">
          <p className="text-lg text-muted-foreground">Take an Exam and see how you stack up against other users!</p>
        </div>
      </div>

      <div className="border rounded-lg"></div>

      <div className="flex flex-col max-w-5xl mx-auto">
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>
      </div>

    </section>
  );
}