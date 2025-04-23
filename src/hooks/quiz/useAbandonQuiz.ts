import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AbandonQuizArgs } from "@/types";

// Hook for abandoning a quiz
export const useAbandonQuiz = () => {
  const queryClient = useQueryClient();

  // Mutation function for abandoning a quiz
  const abandonQuizMutation = async ({ sessionId }: AbandonQuizArgs): Promise<void> => { 
    const response = await fetch('/api/quiz/abandon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to abandon quiz');
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to abandon quiz');
    }
    
    // API returns { success: bool, message: string }
    // No specific data to return, hence Promise<void>
  };
  
  return useMutation<void, Error, AbandonQuizArgs>({
    mutationFn: abandonQuizMutation, 
    onSuccess: () => {
      // Invalidate the in-progress session query as it's now abandoned
      queryClient.invalidateQueries({ queryKey: ['in-progress-quiz-session'] });
      
      // Invalidate the user's overall list of sessions to reflect the new 'abandoned' status
      queryClient.invalidateQueries({ queryKey: ['user-quiz-sessions'] }); 
    },
  });
}; 