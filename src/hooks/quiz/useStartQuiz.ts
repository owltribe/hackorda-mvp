import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QuizSession, StartQuizArgs } from "@/types";

// Hook for starting a new quiz
export const useStartQuiz = () => {
  const queryClient = useQueryClient();

  // Mutation function for starting a quiz
  const startQuizMutation = async ({ 
    userId,
    numberOfQuestions = 25 
  }: StartQuizArgs): Promise<QuizSession> => {
    const response = await fetch('/api/quiz/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Pass only necessary fields to the API
      body: JSON.stringify({ userId, numberOfQuestions }), 
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to start quiz');
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to start quiz');
    }
    
    // API returns { success: bool, data: { sessionId: number, numberOfQuestions: number } }
    // We need to adapt this to the expected QuizSession type if needed, or adjust the hook's return type
    // For now, let's assume the calling component handles the specific return structure.
    // If QuizSession type is strictly required, we need modification here or in StartQuizArgs.
    return data.data; // Returning the structure { sessionId, numberOfQuestions }
  };
  
  return useMutation<QuizSession, Error, StartQuizArgs>({
    mutationFn: startQuizMutation, 
    onSuccess: () => {
      // Invalidate the query for the user's in-progress session
      queryClient.invalidateQueries({ queryKey: ['in-progress-quiz-session'] });
    },
  });
}; 