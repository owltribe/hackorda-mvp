import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonProfile() {
  return (  
    <section className="w-full space-y-4">
      <div className="flex flex-row mb-4 items-center gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <article className="flex flex-col">
          <h2 className="text-2xl font-semibold mb-4">Recent Quizzes</h2>
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </article>

        <article className="flex flex-col mb-4">
          <h2 className="text-2xl font-semibold mb-4">Quiz Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="border p-4">
                <div className="flex flex-row mb-2 justify-between">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-6 w-6" />
                </div>
                <Skeleton className="h-8 w-10" />
              </div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}