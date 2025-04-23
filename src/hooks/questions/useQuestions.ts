import { Question } from "@/types";
import { useQuery } from "@tanstack/react-query";

// Define the expected data structure from the API
interface QuizSessionQuestionData {
  questions: Question[];
  answeredQuestionIds: number[];
  quizStatus: string;
  firstUnansweredIndex: number;
}

// For quiz session questions
export const useQuizSessionQuestions = (sessionId?: number) => {
  const getSessionQuestions = async (): Promise<QuizSessionQuestionData> => {
    if (!sessionId) {
      throw new Error("session ID is required");
    }

    const response = await fetch(`/api/quiz/${sessionId}/questions`);
    if (!response.ok) {
      // Try to parse error response
      let errorMsg = "Failed to fetch quiz questions";
      try {
        const errorData = await response.json();
        errorMsg = errorData.error || errorMsg;
      } catch (parseError) {
        console.error("Error parsing error response: ", parseError);
      }
      throw new Error(errorMsg);
    }
    
    const data = await response.json();
    
    if (!data.success || !data.data) {
      throw new Error(data.error || "Failed to fetch quiz questions data");
    }
    
    // Validate the structure of data.data
    if (!data.data.questions || 
        !data.data.answeredQuestionIds || 
        data.data.firstUnansweredIndex === undefined) {
      throw new Error("Invalid data structure received from API");
    }
    
    return data.data; // Return the whole data object
  };
  
  return useQuery<QuizSessionQuestionData, Error>({
    queryKey: ["quiz-session", sessionId],
    queryFn: getSessionQuestions,
    enabled: !!sessionId, // Only run if sessionId is provided
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity, // Keep the data fresh for the entire session
  });
};