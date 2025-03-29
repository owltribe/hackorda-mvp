'use client';
import React, { useState } from "react";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardHeader,
} from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Variant, questions } from "../data/quizData"
import QuestionCard from "@/components/ui/questionCard";
import { Button } from "@/components/ui/button";

export default function QuizPage() {
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const question = questions[currentIndex]
  const progress = Math.round(((currentIndex + (selectedVariant ? 1 : 0)) / questions.length) * 100)

  function handleClick(variant:Variant) {
    setSelectedVariant(variant)

    if (currentIndex < questions.length - 1){
      setTimeout(() => {
        setSelectedVariant(null)
        setCurrentIndex(index => index + 1)
      }, 2000)
    }
  }
  return (
    <div className="flex flex-col items-center h-screen">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="flex w-full justify-start px-16">
            <Button variant="secondary">← Exit the quiz</Button>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. Your progress will be lost.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>
                <Link href="/students">
                  Continue
                </Link>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <h1 className="text-3xl font-bold m-8">{question.category}</h1>
      <Card className="w-[60%] mb-12">
        <CardHeader>
          <QuestionCard question={question} selectedVariant={selectedVariant} onSelect={handleClick}/>
        </CardHeader>
      </Card>
      <div className="w-[60%]">
        <div className="flex justify-between mb-2">
          <h1>Question {currentIndex + 1} of {questions.length}</h1>
          <h1>{progress}% complete</h1>
        </div>
        <Progress value={progress} />
      </div>
    </div>
  );
}
