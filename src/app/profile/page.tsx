"use client"

import React, { useEffect, useRef } from "react"
import { useUserProfile } from "@/hooks/user/useUserProfile"
import { useUserQuizSessions } from "@/hooks/user/useUserQuizSessions"
import { columns } from "./columns"
import { DataTable } from "@/app/profile/data-table"
import { BookOpen, Award, Calendar } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation";
import { QuizSessionSummary } from "@/types"
import { UserButton } from "@clerk/nextjs"
import { toast } from "sonner";

export default function ProfilePage() {
  const router = useRouter();
  const errorToastShown = useRef(false);
  
  const { 
    data: user, 
    isLoading: isLoadingUser, 
    error: userError 
  } = useUserProfile();
  
  // Only fetch quiz sessions if we have a user ID
  const { 
    data: recentQuizzes, 
    isLoading: isLoadingSessions, 
    error: sessionsError 
  } = useUserQuizSessions(user?.id);
  
  const isLoading = isLoadingUser || (!!user && isLoadingSessions);
  const error = userError || sessionsError;

  // Handle error toast - show only once
  useEffect(() => {
    if (error && !errorToastShown.current) {
      errorToastShown.current = true;
      toast.error(`Error: ${error.message}`, {
        position: 'bottom-right',
        duration: 5000,
        action: {
          label: 'Close',
          onClick: () => router.push('/sign-in'),
        },
      });
    }
  }, [error]);

  // // Handle auth toast - show only once
  // useEffect(() => {
  //   if (!isLoadingUser && !user && !authToastShown.current) {
  //     authToastShown.current = true;
  //     toast.error('Please sign in to continue', {
  //       id: 'auth-required',
  //       position: 'top-center',
  //       duration: 5000,
  //       action: {
  //         label: 'Sign In',
  //         onClick: () => router.push('/sign-in'),
  //       },
  //     });
  //   }
  // }, [isLoadingUser, user, router]);

  const handleRowClick = (quiz: QuizSessionSummary) => {
    router.push(`/quiz/results/${quiz.id}`);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse">Loading profile data...</div>
      </div>
    );
  }

  // Handle unauthenticated state
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <h1 className="text-2xl font-bold">Show Welcome page</h1>
        <Button onClick={() => router.push('/sign-in')}>Sign In</Button>
      </div>
    );
  }

  // Calculate stats from quiz session - Provide default empty array for recentQuizzes
  const quizzes = recentQuizzes ?? [];
  const totalQuizzes = quizzes.length;
  const completedQuizzes = quizzes.filter(q => (q.score ?? 0) > 0).length; 
  const totalScoreSum = quizzes.reduce((sum, quiz) => sum + (quiz.score ?? 0), 0);
  const averageScore = totalQuizzes > 0 
    ? Math.round(totalScoreSum / totalQuizzes) 
    : 0;
  const percentageSum = quizzes.reduce((sum, quiz) => 
      sum + ((quiz.score ?? 0) / quiz.numberOfQuestions) * 100, 0);
  const averagePercentage = totalQuizzes > 0 
    ? Math.round(percentageSum / totalQuizzes) 
    : 0;

  return (  
    <section className="w-full space-y-4">
      <div className="flex flex-row items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold">{user.firstName || 'Student'} {user.lastName || 'Student'}</h1>
          <h2 className="text-l text-muted-foreground">{user.email}</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <article className="flex flex-col">
          <h2 className="text-2xl font-semibold mb-4">Recent Quizzes</h2>
          {quizzes.length > 0 ? (
            <DataTable 
              columns={columns} 
              data={quizzes} 
              onRowClick={handleRowClick} 
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground border rounded-xl p-4">
              You haven&apos;t taken any quizzes yet.
              <div className="mt-4">
                <Button onClick={() => router.push('/')}>
                  Start a Quiz
                </Button>
              </div>
            </div>
          )}
        </article>

        <article className="flex flex-col">
          <h2 className="text-2xl font-semibold mb-4">Quiz Stats</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Total Quizzes</span>
                <BookOpen className="text-green-brand h-5 w-5" />
              </div>
              <div className="text-2xl font-bold">{totalQuizzes}</div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Completed</span>
                <Calendar className="text-green-brand h-5 w-5" />
              </div>
              <div className="text-2xl font-bold">{completedQuizzes}</div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Average Score</span>
                <BookOpen className="text-green-brand h-5 w-5" />
              </div>
              <div className="text-2xl font-bold">{averagePercentage}%</div>
            </div>
            
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-muted-foreground">Avg. Correct</span>
                <Award className="text-green-brand h-5 w-5" />
              </div>
              <div className="text-2xl font-bold">{averageScore}</div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}