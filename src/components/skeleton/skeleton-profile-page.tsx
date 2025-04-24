import { Skeleton } from "@/components/ui/skeleton"


export function SkeletonProfilePage() {
    return (  
        <section className="w-full space-y-4">
    
            <div className="flex flex-row mb-4 items-center gap-4">
                <div className="flex flex-col gap-2">
                    <Skeleton className="ml-0 h-6 w-48" />
                    <Skeleton className="ml-0 h-4 w-48" />
                </div>
            </div>
        
            <div className="grid grid-cols-2 gap-4 mb-4">
                <article className="flex flex-col">
                    <Skeleton className="h-6 mb-4 w-40" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                </article>
                

                <article className="flex flex-col mb-4">
                    <Skeleton className="h-6 mb-4 w-40" />
                    <div className="grid grid-cols-2 gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="border rounded-lg p-4">
                                <Skeleton className="h-4 w-full mb-2" />
                                <Skeleton className="h-8 w-full" />
                            </div>
                        ))}
                    </div>
                </article>
            </div>    
        </section>
    );
}