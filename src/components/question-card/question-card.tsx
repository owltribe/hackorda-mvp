import * as React from "react"
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Question } from "@/types";
import { CheckCircle2, XCircle } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  selectedOption: string | null;
  onSelect: (optionKey: string) => void;
  disabled?: boolean;
  showFeedback?: boolean;
}

export function QuestionCard({
  question,
  selectedOption,
  onSelect,
  disabled = false,
  showFeedback = false
}: QuestionCardProps) {
  const isCorrect = selectedOption === question.correctOptionKey;
  
  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {Object.entries(question.options).map(([key, text]) => {
          const isSelected = selectedOption === key;
          
          let buttonStyle = "";
          if (showFeedback && isSelected) {
            buttonStyle = isCorrect ? "bg-green-500 hover:bg-green-600 text-white" : "bg-red-500 hover:bg-red-600 text-white";
          } else if (isSelected) {
            buttonStyle = "border-2 border-primary";
          }
          
          return (
            <Button
              key={key}
              variant={isSelected && !showFeedback ? "default" : "outline"}
              className={cn(
                "flex justify-between px-4 py-6 text-left w-full",
                buttonStyle,
                disabled && "opacity-80 cursor-not-allowed"
              )}
              onClick={() => !disabled && onSelect(key)}
              disabled={disabled || (selectedOption !== null && !showFeedback)}
            >
              <div className="flex items-center">
                <span className="mr-4 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-current">
                  {key}
                </span>
                <span className="flex-1">{text}</span>
              </div>
              
              {showFeedback && isSelected && (
                <span className="ml-2">
                  {isCorrect ? (
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  ) : (
                    <XCircle className="h-6 w-6 text-white" />
                  )}
                </span>
              )}
            </Button>
          );
        })}
      </div>
      
    </div>
  );
}