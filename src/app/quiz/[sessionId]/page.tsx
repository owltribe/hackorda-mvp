'use client';

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { QuestionCard } from "@/components/question-card/question-card";
import { useQuizSessionQuestions } from "@/hooks/questions/useQuestions";
import { useAnswerQuestion } from "@/hooks/quiz/useAnswerQuestion";
import Link from "next/link";

export default function QuizSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = parseInt(params.sessionId as string);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);

  const { 
    data: questionsData, 
    isLoading, 
    error 
  } = useQuizSessionQuestions(sessionId);
  
  const answerMutation = useAnswerQuestion();

  // useEffect(() => {
  //   if (error || !questionsData || questionsData.questions.length === 0) {
  //     const timer = setTimeout(() => {
  //       router.push('/');
  //       toast.error('Error loading quiz session.', {
  //         description: 'Redirecting to home page...',
  //         position: 'bottom-right',
  //       });
  //     }, 3000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [error, router]);

  // Handle page refresh/close/navigation

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      const message = "You are in the middle of a quiz. Are you sure you want to leave? Your progress will be lost.";
      e.preventDefault();
      return message;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Effect to set the initial question index from the hook data
  useEffect(() => {
    if (questionsData && questionsData.firstUnansweredIndex !== undefined) {
      const initialIndex = questionsData.firstUnansweredIndex;
      
      if (initialIndex === -1) {
        // All questions answered or quiz completed/invalid according to backend
        // toast.info("Quiz already completed or has no unanswered questions.", { description: "Redirecting to results..." });
        router.push(`/quiz/${sessionId}/results`);
      } else {
        setCurrentQuestionIndex(initialIndex);
      }
    }
    // Add a check for error state as well
    else if (error) {
      //  toast.error(`Error loading quiz state: ${error.message}`);
       // Potentially redirect to home or profile after error
       // router.push('/'); 
    }

  }, [questionsData, error, router, sessionId]); // Add error to dependencies

  const handleOptionSelect = async (optionKey: string) => {
    if (isSubmitting || feedbackVisible) return;
    
    setSelectedOption(optionKey);
    setFeedbackVisible(true);
    setIsSubmitting(true);
    
    try {
      const result = await answerMutation.mutateAsync({
        sessionId,
        questionId: questionsData!.questions[currentQuestionIndex!].id,
        selectedOptionKey: optionKey
      });
      
      // Show feedback for 2 seconds before moving to next question
      setTimeout(() => {
        setFeedbackVisible(false);
        
        if (result.quizComplete) { // Check the quizComplete flag from API response
          router.push(`/quiz/${sessionId}/results`);
        } else if (currentQuestionIndex !== null && currentQuestionIndex < questionsData!.questions.length - 1) {
          setCurrentQuestionIndex(prev => prev !== null ? prev + 1 : 0); // Increment index safely
          setSelectedOption(null);
        } else {
          // Should ideally be caught by quizComplete, but redirect as fallback
          router.push(`/quiz/${sessionId}/results`);
        }
        
        setIsSubmitting(false);
      }, 1300);
    } catch (error) {
      console.error("Error submitting answer:", error);
      setIsSubmitting(false);
      setFeedbackVisible(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full text-2xl text-green-brand">
        <p className="animate-pulse">Loading quiz questions...</p>
      </div>
    );
  }

  if (error) {
    console.log("Error loading quiz: ", error);
    return (
      <div className="flex text-2xl text-muted-foreground">
        <p>Cannot find such quiz. Redirect to <Link href="/" className="text-green-brand hover:text-green-brand underline animate-pulse">home</Link> page...</p>
      </div>
    );  
  }
  
  if (currentQuestionIndex === null || !questionsData || questionsData.questions.length === 0) {
    return (
      <div className="flex text-2xl text-muted-foreground">
        <p>Cannot find such quiz. Redirect to <Link href="/" className="text-green-brand hover:text-green-brand underline animate-pulse">home</Link> page...</p>
      </div>
    );
  }

  const { questions } = questionsData;
  const totalQuestions = questions.length;
  // Progress calculation remains the same, using the current index
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const currentQuestionData = questions[currentQuestionIndex];

  return (
    <div className="relative min-h-full flex flex-col items-center justify-center p-4 mx-auto">
      <div className="w-full max-w-4xl space-y-8">
        <h2 className="mb-8 text-center text-2xl font-semibold">
          {currentQuestionData.questionText}
        </h2>

        <Card>
          <CardContent className="py-4">
            <QuestionCard
              question={currentQuestionData}
              selectedOption={selectedOption}
              onSelect={handleOptionSelect}
              disabled={isSubmitting}
              showFeedback={feedbackVisible}
            />
          </CardContent>
        </Card>

        <div className="w-full space-y-2">
          <div className="flex justify-between text-sm">
            <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    </div>  
  );
} 