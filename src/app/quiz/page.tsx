'use client';

import React, { useState } from "react";
import { useUserProfile } from "@/hooks/user/useUserProfile";
import Link from "next/link";
import { InProgressQuizNotifier } from "@/components/notifications/InProgressQuizNotifier";
import { CardDemo } from "@/components/card";
import { SkeletonStartQuiz } from "@/components/skeleton/skeleton-start-quiz";
import { QuizConfigDialog } from "@/components/quiz/QuizConfigDialog";

// Define the structure for the quiz options
interface QuizOption {
  id: 'random' | 'exam';
  title: string;
  moduleNumber: string;
  numberOfQuestions: number; // Can represent default/max or fixed value
  description: string;
  image?: string;
  bgColor?: string;
}

// Define the two quiz options
const quizOptions: QuizOption[] = [
  {
    id: "exam",
    title: "Exam",
    moduleNumber: "Full",
    numberOfQuestions: 50, // Fixed for exam
    description: "Take a comprehensive 50-question exam.",
    image: "/images/102.png", // Reusing image, replace if needed
    bgColor: "bg-gradient-to-r from-amber-500/50 to-amber-500",
  },
  {
    id: "random",
    title: "Random Quiz",
    moduleNumber: "Mixed",
    numberOfQuestions: 10, // Default/max for display, actual chosen in dialog
    description: "Test your knowledge with a random selection of questions.",
    image: "/images/101.png", // Reusing image, replace if needed
    bgColor: "bg-gradient-to-l from-amber-500/50 to-red-brand/50 via-blue-500/40",
  },
];

export default function QuizPage() {
  const { 
    data: user, 
    isLoading: isLoadingUser, 
    error: userError 
  } = useUserProfile();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizOption | null>(null);

  const handleCardClick = (quiz: QuizOption) => {
    setSelectedQuiz(quiz);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedQuiz(null); // Reset selected quiz on close
  };

  if (isLoadingUser) {
    return (
      <div className="container mx-auto py-10 px-4">
        <SkeletonStartQuiz />
      </div>
    );
  }

  if (userError || !user) {
    console.log("Error loading user: ", userError);

    return (
      <div className="container mx-auto flex text-2xl text-muted-foreground justify-center items-center min-h-[60vh]">
        <p>Cannot load user profile. Please <Link href="/" className="text-green-brand hover:text-green-brand underline animate-pulse">refresh</Link> or try again later.</p>
      </div>
    );
  }
  
  return (
    <div className="container flex flex-col">
      {/* <InProgressQuizNotifier /> */}

      <div className="flex flex-col items-start gap-4 mb-10">
        <h1 className="font-sans text-4xl font-bold">Select a Quiz</h1>
        <p className="text-xl text-muted-foreground">Choose your challenge below.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 justify-center">
        {quizOptions.map((quiz) => (
          <CardDemo 
            key={quiz.id}
            {...quiz}
            numberOfQuestions={quiz.id === 'random' ? 25 : 50}
            description={quiz.id === 'random' ? 'Choose 10 or 25 questions' : 'Take the 50-question exam'}
            onClick={() => handleCardClick(quiz)}
          />
        ))}
      </div>

      {selectedQuiz && (
        <QuizConfigDialog
          isOpen={dialogOpen}
          onClose={handleCloseDialog}
          quizType={selectedQuiz.id}
          title={selectedQuiz.title}
          description={selectedQuiz.description}
          userId={user.id}
        />
      )}
    </div>
  );
}
