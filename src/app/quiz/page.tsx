'use client';

import React from "react";
import { QuizStarter } from "@/components/quiz-starter/quiz-starter";
import { SkeletonStartQuiz } from "@/components/skeleton/skeleton-start-quiz";
import { useUserProfile } from "@/hooks/user/useUserProfile";
import Link from "next/link";

export default function QuizPage() {
  const { 
    data: user, 
    isLoading: isLoadingUser, 
    error: userError 
  } = useUserProfile();
  
  // useEffect(() => {
  //   if (!user || userError) {
  //     const timer = setTimeout(() => {
  //       router.push('/');
  //       toast.error('Error loading quiz page.', {
  //         description: 'Redirecting to home page...',
  //         position: 'bottom-right',
  //       });
  //     }, 3000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [user, userError, router]);

  if (isLoadingUser) {
    return (
      <div>
        <SkeletonStartQuiz />
      </div>
    );
  }

  if (userError) {
    console.log("Error loading user: ", userError);
    return (
      <div className="flex text-2xl text-muted-foreground">
        <p>Cannot find such user. Redirect to <Link href="/" className="text-green-brand hover:text-green-brand underline animate-pulse">home</Link> page...</p>
      </div>
    );
  }

  if (!user) {
    console.log("No user available: ", user);
    return (
      <div className="flex text-2xl text-muted-foreground">
        <p>Cannot find such user. Redirect to <Link href="/" className="text-green-brand hover:text-green-brand underline animate-pulse">home</Link> page...</p>
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
