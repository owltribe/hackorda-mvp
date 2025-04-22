import { Question } from "@/types";
import { useQuery } from "@tanstack/react-query";

// For quiz session questions
export const useQuizSessionQuestions = (sessionId?: number) => {
  const getSessionQuestions = async (): Promise<Question[]> => {
    if (!sessionId) {
      throw new Error("session ID is required");
    }

    const response = await fetch(`/api/quiz/${sessionId}/questions`);
    if (!response.ok) {
      throw new Error("Failed to fetch quiz questions");
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Failed to fetch quiz questions");
    }
    
    return data.data;
  };
  
  return useQuery<Question[], Error>({
    queryKey: ["quiz-session", sessionId],
    queryFn: getSessionQuestions,
    enabled: !!sessionId, // Only run if sessionId is provided
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity, // Keep the data fresh for the entire session
  });
};