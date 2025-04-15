import { useMutation, useQueryClient } from "@tanstack/react-query";

// Hook for starting a new quiz
export const useStartQuiz = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      userId, 
      moduleId, 
      numberOfQuestions = 3 
    }: { 
      userId: number; 
      moduleId?: number; 
      numberOfQuestions?: number;
    }) => {
      const response = await fetch('/api/quiz/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, moduleId, numberOfQuestions }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start quiz');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to start quiz');
      }
      
      return data.data;
    },
    onSuccess: () => {
      // Invalidate any relevant queries if needed
      queryClient.invalidateQueries({ queryKey: ['user-quiz-history'] });
    },
  });
};

// Hook for answering a question
export const useAnswerQuestion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      historyId, 
      questionId, 
      selectedOptionKey 
    }: { 
      historyId: number; 
      questionId: number; 
      selectedOptionKey: string;
    }) => {
      const response = await fetch('/api/quiz/answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ historyId, questionId, selectedOptionKey }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to record answer');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to record answer');
      }
      
      return data.data;
    },
  });
};

// Hook for abandoning a quiz
export const useAbandonQuiz = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ historyId }: { historyId: number }) => {
      const response = await fetch('/api/quiz/abandon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ historyId }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to abandon quiz');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to abandon quiz');
      }
      
      return data.data;
    },
    onSuccess: () => {
      // Invalidate any relevant queries if needed
      queryClient.invalidateQueries({ queryKey: ['user-quiz-history'] });
    },
  });
}; 