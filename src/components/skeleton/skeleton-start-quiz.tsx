import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonStartQuiz() {
    return (
    <div className="container flex flex-col space-y-6">

      <div className="flex flex-col items-start gap-2">
        <h1 className="text-2xl text-foreground">Select a Quiz</h1>
        <p className="text-lg text-muted-foreground">Choose your challenge below.</p>
      </div>

      <div className="border rounded-lg"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 justify-center">
        <Skeleton className="w-full h-48" />
        <Skeleton className="w-full h-48" />
      </div>

    </div>
    )
}
