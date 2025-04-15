import { QuestionsResponse, Question } from "@/types";
import { useQuery } from "@tanstack/react-query";

// For random questions (old method)
export const useQuestions = (moduleId?: number) => {
  const getQuestions = async (): Promise<Question[]> => {
    const url = '/api/questions';
      
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch questions");
    }
    const data: QuestionsResponse = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Failed to fetch questions");
    }
    
    return data.data;
  };
  
  return useQuery<Question[], Error>({
    queryKey: ["questions", moduleId],
    queryFn: getQuestions,
  });
};

// For quiz session questions
export const useQuizSessionQuestions = (historyId?: number) => {
  const getSessionQuestions = async (): Promise<Question[]> => {
    if (!historyId) {
      throw new Error("History ID is required");
    }

    const response = await fetch(`/api/quiz/${historyId}/questions`);
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
    queryKey: ["quiz-session", historyId],
    queryFn: getSessionQuestions,
    enabled: !!historyId, // Only run if historyId is provided
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity, // Keep the data fresh for the entire session
  });
};