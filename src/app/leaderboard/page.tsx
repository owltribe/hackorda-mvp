"use client";

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useLeaderboardData } from "@/hooks/leaderboard/useLeaderboardData";
import { useUserProfile } from "@/hooks/user/useUserProfile";

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
    // return <SkeletonLeaderboardPage />;
    return <div className="text-muted-foreground">Loading...</div>;
  }

  if (error) {
    console.log("Error loading leaderboard data: ", error);
  }

  const dataToShow = leaderboardData ?? [];
  const currentUserId = user?.id;

  return (
    <section className="container max-w-5xl">
      <h1 className="text-3xl font-bold mb-6">Leaderboard</h1>
      {dataToShow.length > 0 ? (
        <DataTable columns={columns} data={dataToShow} currentUserId={currentUserId} />
      ) : (
        <div className="text-center text-muted-foreground">
          No leaderboard data available yet.
        </div>
      )}
    </section>
  );
}