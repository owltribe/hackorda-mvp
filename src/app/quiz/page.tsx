'use client';

import React from "react";
import { QuizStarter } from "@/components/quiz-starter/quiz-starter";
import { useUserProfile } from "@/hooks/user/useUserProfile";
import { SkeletonStartQuiz } from "@/components/skeleton/skeleton-start-quiz";


export default function QuizPage() {
  const { data: user, isLoading, error: fetchError } = useUserProfile();

  if (isLoading) {
    return (
      <div>
        <SkeletonStartQuiz />
      </div>
    );
  }

  if (fetchError || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {fetchError ? `Error: ${fetchError.message}` : 'User not found. Please ensure you have created a user in the database.'}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mx-auto max-w-4xl">
        <QuizStarter userId={user.id} />
      </div>
    </div>
  );
}
