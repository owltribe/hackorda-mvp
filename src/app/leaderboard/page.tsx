"use client";

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useLeaderboardData } from "@/hooks/leaderboard/useLeaderboardData";
import { useUserProfile } from "@/hooks/user/useUserProfile";
import { SkeletonLeaderboard } from "@/components/skeleton/skeleton-leaderboard";

export default function LeaderboardPage() {
  const { data: user, isLoading: isLoadingUser } = useUserProfile();
  const { 
    data: leaderboardData, 
    isLoading: isLoadingLeaderboard,
    error 
  } = useLeaderboardData();

  const isLoading = isLoadingUser || isLoadingLeaderboard;

  // TODO: Add skeleton for leaderboard table loading
  if (isLoading) {
    return <SkeletonLeaderboard />;
  }

  if (error) {
    console.log("Error loading leaderboard data: ", error);
  }

  const dataToShow = leaderboardData ?? [];
  const currentUserId = user?.id;

  return (
    <section className="w-full space-y-6">
      <div className="flex flex-row items-center">
        <div className="flex flex-col gap-2">
          <p className="text-lg text-muted-foreground">Take an Exam and see how you stack up against other users!</p>
        </div>
      </div>

      <div className="border rounded-lg"></div>

      <div className="flex flex-col max-w-5xl mx-auto">
        {dataToShow.length > 0 ? (
          <DataTable columns={columns} data={dataToShow} currentUserId={currentUserId} />
        ) : (
          <div className="text-center text-muted-foreground">
            No leaderboard data available yet.
          </div>
        )}
      </div>

    </section>
  );
}