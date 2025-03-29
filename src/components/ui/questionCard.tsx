import * as React from "react"
import {
  Card,
  CardContent,
  CardTitle,
} from "@/components/ui/card"
import { Variant, Question} from "@/app/data/quizData";

interface QuestionCardProps {
  question: Question,
  selectedVariant: Variant | null,
  onSelect: (variant: Variant) => void;
}

export default function QuestionCard({question, selectedVariant, onSelect} : QuestionCardProps) {
  return (
    <>
      <CardTitle className="text-2xl text-center mb-10 py-4">{question.text}</CardTitle>
      {question.variants.map((variant) => {
        let cardStyle = "mb-2 cursor-pointer font-medium"
        if (selectedVariant) {
          if (selectedVariant.letter === variant.letter) {
            cardStyle += variant.isCorrect ? " bg-green-300 text-white pointer-events-none" : " bg-red-300 text-white pointer-events-none"
          } else {
            cardStyle += " text-gray-300 pointer-events-none"
          }
        }
      return (
        <div key={variant.letter}>
          <Card className={cardStyle} key={variant.letter}>
            <CardContent className="flex gap-8 items-center" onClick={() => onSelect(variant)}>
              <p className="border-2 rounded-full w-10 h-10 flex justify-center items-center">{variant.letter}</p>
              <p>{variant.answer}</p>
            </CardContent>
          </Card>
        </div>
      );
      })}
    </>
  );
}