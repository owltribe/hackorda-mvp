// Represents a single quiz question.
// Used in: src/hooks/questions/useQuestions.ts, src/hooks/quiz/useQuizResults.ts
export interface Question {
  id: number;
  moduleId: number | null;
  questionText: string;
  options: { [key: string]: string };
  correctOptionKey: string;
  createdAt: string;
  updatedAt: string;
}

// Standard API response structure for fetching multiple questions.
// Used in: src/hooks/questions/useQuestions.ts
export interface QuestionsResponse {
  success: boolean;
  data: Question[];
  error?: string;
}

// Represents the user profile data fetched from the API.
// Used in: src/hooks/user/useUserProfile.ts, src/app/profile/page.tsx, src/app/quiz/page.tsx
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age?: number;
  city?: string;
  createdAt: string; 
  updatedAt: string | null;
}

// Represents a summary of a user's quiz session.
// Used in: src/hooks/user/useUserQuizSessions.ts, src/app/profile/page.tsx
export interface QuizSessionSummary {
  id: number;
  userId: string;
  numberOfQuestions: number;
  score: number | null;
  status: 'in-progress' | 'completed' | 'abandoned';
  selectionCriteria: string;
  createdAt: string;
  updatedAt: string | null;
}

// Represents the detailed results of a completed or in-progress quiz.
// Used in: src/hooks/quiz/useQuizResults.ts
export interface QuizResult {
  quiz: {
    id: number;
    userId: string;
    numberOfQuestions: number;
    questionIds: number[]; // Assuming question IDs are part of the quiz details
    status: string; // Consider using the specific statuses like QuizSessionSummary
    score: number; // Score might be calculated differently here than summary
    selectionCriteria: string;
    createdAt: string;
    updatedAt: string | null;
  };
  answers: {
    id: number;
    questionId: number;
    selectedOptionKey: string;
    isCorrect: boolean;
    createdAt: string;
    // Including the full question details with the answer might be useful
    question: Question | null; 
  }[];
  summary: {
    numberOfQuestions: number;
    answered: number;
    correct: number;
    score: number; // This might be a percentage or raw score
    status: string; // Consider using the specific statuses like QuizSessionSummary
  };
}

// Represents the data structure of an active quiz session, potentially returned by the start endpoint.
// Used in: src/hooks/quiz/useQuizActions.ts (implicitly)
export interface QuizSession {
  id: number; // Session ID
  userId: string;
  questionIds: number[]; // IDs of the questions selected for this session
  status: 'in-progress'; // Should be in-progress when started
  createdAt: string;
  // Other relevant fields like moduleId, numberOfQuestions etc. might be here
}

// Arguments for the useStartQuiz mutation.
// Used in: src/hooks/quiz/useQuizActions.ts
export interface StartQuizArgs {
  userId: string;
  moduleId?: number;
  numberOfQuestions?: number;
}

// Arguments for the useAnswerQuestion mutation.
// Used in: src/hooks/quiz/useQuizActions.ts
export interface AnswerQuestionArgs {
  sessionId: number;
  questionId: number;
  selectedOptionKey: string;
}

// Arguments for the useAbandonQuiz mutation.
// Used in: src/hooks/quiz/useQuizActions.ts
export interface AbandonQuizArgs {
  sessionId: number;
}

// Represents the user profile data structure derived from Clerk.
// Used in: src/hooks/useProfile.ts
export interface ClerkUserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

// Represents the overall data structure returned by the useProfile hook.
// Used in: src/hooks/useProfile.ts
export interface ClerkProfileData {
  user: ClerkUserProfile;
}