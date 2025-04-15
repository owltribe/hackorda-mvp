import { useQuery } from "@tanstack/react-query";

interface QuizResult {
  quiz: {
    id: number;
    userId: number;
    numberOfQuestions: number;
    questionIds: number[];
    status: string;
    score: number;
    selectionCriteria: string;
    takenAt: string;
    completedAt: string | null;
  };
  answers: {
    id: number;
    questionId: number;
    selectedOptionKey: string;
    isCorrect: boolean;
    answeredAt: string;
    question: {
      id: number;
      moduleId: number | null;
      questionText: string;
      options: { [key: string]: string };
      correctOptionKey: string;
    } | null;
  }[];
  summary: {
    totalQuestions: number;
    answered: number;
    correct: number;
    score: number;
    status: string;
  };
}

export const useQuizResults = (historyId?: number) => {
  return useQuery<QuizResult, Error>({
    queryKey: ['quiz-results', historyId],
    queryFn: async () => {
      if (!historyId) {
        throw new Error('History ID is required');
      }

      const response = await fetch(`/api/quiz/${historyId}/results`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch quiz results');
      }
      
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch quiz results');
      }
      
      return data.data;
    },
    enabled: !!historyId,
  });
}; 