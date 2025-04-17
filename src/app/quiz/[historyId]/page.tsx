'use client';

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { QuestionCard } from "@/components/question-card/question-card";
import { useQuizSessionQuestions } from "@/hooks/questions/useQuestions";
import { useAnswerQuestion} from "@/hooks/quiz/useQuizActions";

export default function QuizSessionPage() {
  const params = useParams();
  const router = useRouter();
  const historyId = parseInt(params.historyId as string);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  
  const { 
    data: questions, 
    isLoading, 
    error 
  } = useQuizSessionQuestions(historyId);
  
  const answerMutation = useAnswerQuestion();

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


  const handleOptionSelect = async (optionKey: string) => {
    if (isSubmitting || feedbackVisible) return;
    
    setSelectedOption(optionKey);
    setFeedbackVisible(true);
    setIsSubmitting(true);
    
    try {
      const result = await answerMutation.mutateAsync({
        historyId,
        questionId: questions![currentQuestion].id,
        selectedOptionKey: optionKey
      });
      
      // Show feedback for 2 seconds before moving to next question
      setTimeout(() => {
        setFeedbackVisible(false);
        
        if (result.quizComplete) {
          router.push(`/quiz/results/${historyId}`);
        } else if (currentQuestion < questions!.length - 1) {
          setCurrentQuestion(prev => prev + 1);
          setSelectedOption(null);
        } else {
          router.push(`/quiz/results/${historyId}`);
        }
        
        setIsSubmitting(false);
      }, 2000);
    } catch (error) {
      console.error("Error submitting answer:", error);
      setIsSubmitting(false);
      setFeedbackVisible(false);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading quiz questions...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen">Error loading quiz: {error.message}</div>;
  if (!questions || questions.length === 0) return <div className="flex justify-center items-center min-h-screen">No questions available</div>;

  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const currentQuestionData = questions[currentQuestion];

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
            <span>Question {currentQuestion + 1} of {totalQuestions}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    </div>  
  );
} 