import { useQuery } from "@tanstack/react-query";
import { LeaderboardEntry } from "@/types";

export const useLeaderboardData = () => {
  const fetchLeaderboardData = async (): Promise<LeaderboardEntry[]> => {
    const response = await fetch('/api/leaderboard');
    if (!response.ok) {
      let errorMsg = `Failed to fetch leaderboard data (Status: ${response.status})`;
      try {
        const errorData = await response.json();
        errorMsg = errorData.error || errorMsg;
      } catch (error) {
        console.error('Error parsing leaderboard data response:', error);
      }
      throw new Error(errorMsg);
    }
  
    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch leaderboard data');
    }
  
    return result.data || [];
  };

  return useQuery<LeaderboardEntry[], Error>({
    queryKey: ['leaderboard-data'],
    queryFn: fetchLeaderboardData,
    select: (data) => data.filter(entry => entry.userId !== null),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}; 