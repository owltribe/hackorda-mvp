import { useMutation, useQueryClient } from "@tanstack/react-query";
import { QuizSession, StartQuizArgs, AnswerQuestionArgs, AbandonQuizArgs } from "@/types";

// TODO: separate hooks (keeping as is for now based on user request)

// Hook for starting a new quiz
export const useStartQuiz = () => {
  const queryClient = useQueryClient();

  // Mutation function for starting a quiz
  const startQuizMutation = async ({ 
    userId, 
    moduleId, 
    numberOfQuestions = 25 
  }: StartQuizArgs): Promise<QuizSession> => { // Return type assumed as QuizSession
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
    
    return data.data; // Assumes API returns { success: bool, data: QuizSession, error?: string }
  };
  
  return useMutation({
    mutationFn: startQuizMutation, // Call the named function
    onSuccess: () => {
      // Invalidate any relevant queries if needed
      queryClient.invalidateQueries({ queryKey: ['user-quiz-session'] }); // Should maybe be user-quiz-sessions?
    },
  });
};

// Hook for answering a question
export const useAnswerQuestion = () => {

  // Mutation function for answering a question
  const answerQuestionMutation = async ({ 
    sessionId, 
    questionId, 
    selectedOptionKey 
  }: AnswerQuestionArgs): Promise<QuizSession> => { // Define a more specific return type if known
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
    
    return data.data; // Assuming API returns { success: bool, data: any, error?: string }
  };
  
  return useMutation({
    mutationFn: answerQuestionMutation, // Call the named function
  });
};

// Hook for abandoning a quiz
export const useAbandonQuiz = () => {
  const queryClient = useQueryClient();

  // Mutation function for abandoning a quiz
  const abandonQuizMutation = async ({ sessionId }: AbandonQuizArgs): Promise<void> => { // Define a more specific return type if known
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
    
    return data.data; // Assuming API returns { success: bool, data: any, error?: string }
  };
  
  return useMutation({
    mutationFn: abandonQuizMutation, // Call the named function
    onSuccess: () => {
      // Invalidate any relevant queries if needed
      queryClient.invalidateQueries({ queryKey: ['user-quiz-session'] }); // Should maybe be user-quiz-sessions?
    },
  });
}; 