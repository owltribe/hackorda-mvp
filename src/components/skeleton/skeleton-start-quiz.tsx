import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonStartQuiz() {
    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mx-auto max-w-4xl">
                <div className="w-full space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-[185px]" />
                        <Skeleton className="h-4 w-135 " />
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[140px]" />
                            <Skeleton className="h-10 w-30" />
                        </div>

                        <Skeleton className="h-12 w-full" />
                    </div>
                </div>
            </div>
        </div>
    )
}
