'use client';

import React, { useEffect } from "react";
import { QuizStarter } from "@/components/quiz-starter/quiz-starter";
import { SkeletonStartQuiz } from "@/components/skeleton/skeleton-start-quiz";
import { useUserProfile } from "@/hooks/user/useUserProfile";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function QuizPage() {
  const router = useRouter();
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
    return null
  }

  if (!user) {
    console.log("No user available: ", user);
    return null
  }
  
  return (
    <div className="container mx-auto py-10 px-4">
      <div className="mx-auto max-w-4xl">
        <QuizStarter userId={user.id} />
      </div>
    </div>
  );
}
