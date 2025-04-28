import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QuizSession, StartQuizArgs as OriginalStartQuizArgs } from "@/types";

// Extend the original args type to include quizType
interface StartQuizArgs extends OriginalStartQuizArgs {
  quizType: 'random' | 'exam'; // Add the quiz type
}

// Hook for starting a new quiz
export const useStartQuiz = () => {
  const queryClient = useQueryClient();

  // Mutation function for starting a quiz
  const startQuizMutation = async ({ 
    userId,
    numberOfQuestions = 10, 
    quizType // Destructure quizType
  }: StartQuizArgs): Promise<QuizSession> => {
    const response = await fetch('/api/quiz/start', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Pass quizType along with other args
      body: JSON.stringify({ userId, numberOfQuestions, quizType }), 
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
    // No changes needed here for return type
    return data.data; // Returning the structure { sessionId, numberOfQuestions }
  };
  
  return useMutation<QuizSession, Error, StartQuizArgs>({ // Use the extended StartQuizArgs type
    mutationFn: startQuizMutation, 
    onSuccess: () => {
      // Invalidate the query for the user's in-progress session
      queryClient.invalidateQueries({ queryKey: ['in-progress-quiz-session'] });
      // Also invalidate user sessions list to reflect the new session type immediately
      queryClient.invalidateQueries({ queryKey: ['user-quiz-sessions'] });
    },
  });
}; 