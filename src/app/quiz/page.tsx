'use client';
import React, { useState } from "react";
import { Progress } from "@/components/ui/progress";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const questions = [
  {
    category: "Computer Science",
    text: "What does CPU stand for?",
    variants: [
      {
        letter: "A",
        answer: "Central Processing Unit",
        isCorrect: true,
      },
      {
        letter: "B",
        answer: "Computer Personal Unit",
        isCorrect: false,
      },
      {
        letter: "C",
        answer: "Central Process Utility",
        isCorrect: false,
      },
      {
        letter: "D",
        answer: "Central Processor Underlying",
        isCorrect: false,
      },
    ]
  },
  {
    category: "Computer Science",
    text: "Which of the following is NOT a programming language?",
    variants: [
      {
        letter: "A",
        answer: "Java",
        isCorrect: false,
      },
      {
        letter: "B",
        answer: "Python",
        isCorrect: false,
      },
      {
        letter: "C",
        answer: "HTML",
        isCorrect: false,
      },
      {
        letter: "D",
        answer: "Microsoft Excel",
        isCorrect: true,
      },
    ]
  }
]

export default function QuizPage() {
  interface Variant {
    letter: string
    answer: string
    isCorrect: boolean
  }
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const question = questions[currentIndex]
  const progress = Math.round(((currentIndex + (selectedVariant ? 1 : 0)) / questions.length) * 100)

  function handleClick(variant:any) {
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
      <h1 className="text-3xl font-bold m-8">{question.category}</h1>
      <Card className="w-[60%] mb-12">
        <CardHeader>
            <>
              <CardTitle className="text-2xl text-center mb-8 py-4">{question.text}</CardTitle>
              {question.variants.map((variant) => {
                let cardStyle = "mb-4 cursor-pointer font-medium"
                if (selectedVariant) {
                  if (selectedVariant.letter === variant.letter) {
                    cardStyle += variant.isCorrect ? " bg-green-300 text-white pointer-events-none" : " bg-red-300 text-white pointer-events-none"
                  } else {
                    cardStyle += " text-gray-300 pointer-events-none"
                  }
                }
              return (
                <Card className={cardStyle} key={variant.letter}>
                  <CardContent className="flex gap-8 items-center" onClick={() => handleClick(variant)}>
                    <p className="border-2 rounded-full w-10 h-10 flex justify-center items-center">{variant.letter}</p>
                    <p>{variant.answer}</p>
                  </CardContent>
                </Card>
              );
              })}
            </>
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
