'use client';

import React from "react";
import { QuizStarter } from "@/components/quiz-starter/quiz-starter";
import { SkeletonStartQuiz } from "@/components/skeleton/skeleton-start-quiz";
import { useUser } from "@clerk/nextjs";


export default function QuizPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div>
        <SkeletonStartQuiz />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {'User not authenticated. Please sign in.'}
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
