export interface Question {
  id: number;
  moduleId: number | null;
  questionText: string;
  options: { [key: string]: string };
  correctOptionKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface QuestionsResponse {
  success: boolean;
  data: Question[];
  error?: string;
}