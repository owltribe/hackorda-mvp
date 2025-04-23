import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnswerQuestionArgs } from "@/types";

// Define the expected data structure from the answer API response
interface AnswerResponseData {
  isCorrect: boolean;
  quizComplete: boolean;
  progress: {
    answered: number;
    total: number;
    percentage: number;
  };
}

// Hook for answering a question
export const useAnswerQuestion = () => {
  const queryClient = useQueryClient();

  // Mutation function for answering a question
  const answerQuestionMutation = async ({ 
    sessionId, 
    questionId, 
    selectedOptionKey 
  }: AnswerQuestionArgs): Promise<AnswerResponseData> => {
    const response = await fetch('/api/quiz/answer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId, questionId, selectedOptionKey }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to record answer');
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to record answer');
    }
    
    return data.data; // Assuming API returns { success: bool, data: AnswerResponseData, error?: string }
  };
  
  return useMutation<AnswerResponseData, Error, AnswerQuestionArgs>({
    mutationFn: answerQuestionMutation,
    onSuccess: (data) => {
      // If the answer completed the quiz, invalidate the in-progress session query
      if (data.quizComplete) {
        queryClient.invalidateQueries({ queryKey: ['in-progress-quiz-session'] });
      }
      // Optionally invalidate the specific quiz session questions query if needed immediately
      // queryClient.invalidateQueries({ queryKey: ['quiz-session', variables.sessionId] });
    },
  });
}; 