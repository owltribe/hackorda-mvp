import { useQuery } from "@tanstack/react-query";
import { QuizResult } from "@/types";

export const useQuizResults = (sessionId?: number) => {

  const fetchQuizResults = async (): Promise<QuizResult> => {
    if (!sessionId) {
      throw new Error('session ID is required');
    }

    const response = await fetch(`/api/quiz/${sessionId}/results`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch quiz results');
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch quiz results');
    }
    
    return data.data;
  };

  return useQuery<QuizResult, Error>({
    queryKey: ['quiz-results', sessionId],
    queryFn: fetchQuizResults,
    enabled: !!sessionId,
  });
}; 