import { useQuery } from "@tanstack/react-query";
import { QuizSessionSummary } from "@/types"; // Assuming this type exists

export const useUserQuizSessions = (userId?: string) => {

  // Function to fetch user quiz sessions
  const fetchUserQuizSessions = async (): Promise<QuizSessionSummary[]> => {
    if (!userId) {
      return []; // Return empty array when no userId is available
    }
    
    const response = await fetch(`/api/users/${userId}/quiz-session`);
    if (!response.ok) {
      let errorMsg = `Failed to fetch quiz session (Status: ${response.status})`;
      try {
        const errorData = await response.json();
        errorMsg = errorData.error || errorMsg;
      } catch (error) {
        console.error('Error parsing quiz session data:', error);
      }
      throw new Error(errorMsg);
    }
    
    const sessionData = await response.json();
    if (!sessionData.success) {
      throw new Error(sessionData.error || 'Failed to fetch quiz session');
    }
    
    return sessionData.data || []; // Ensure returning an array even if data is null/undefined
  };

  return useQuery<QuizSessionSummary[], Error>({
    queryKey: ['user-quiz-sessions', userId],
    queryFn: fetchUserQuizSessions, // Call the named function
    enabled: !!userId, // Only fetch if userId is available
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
  });
}; 