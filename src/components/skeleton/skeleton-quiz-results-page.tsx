import { Skeleton } from "../ui/skeleton";

export default function SkeletonQuizResultsPage() {
  return (
    <div className="w-full p-4 space-y-6">
        <div className="flex flex-row justify-between">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-40"/>
        </div>

        <div className="text-center space-y-4">
            <Skeleton className="h-10 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
            
            <div className="space-y-6 mt-6"> 
                <Skeleton className="absolute top-0 w-48 h-4" />
                <div className="text-centr mt-8 space-y-2">
                    <Skeleton className="h-10 w-24 mx-auto" />
                    <Skeleton className="h-4 w-40 mx-auto" />
                </div>
            </div>
            
            <Skeleton className="h-6 w-64 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3 p-4 border rounded">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="h-6 w-40 mt-6" />
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex items-start gap-3 p-4 border rounded">
            <Skeleton className="h-6 w-6 rounded-full mt-1" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}