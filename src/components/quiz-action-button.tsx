"use client";

import { X, List } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useAbandonQuiz } from "@/hooks/quiz/useAbandonQuiz";
import { Button } from "@/components/ui/button";
import { HoverBorderGradient } from "./ui/hover-border-gradient";

export function QuizActionButton() {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const sessionId = parseInt(params.sessionId as string);
  const abandonMutation = useAbandonQuiz();
  const isInQuiz = pathname.startsWith(`/quiz/${sessionId}`) && !pathname.includes('/results');
  
  const handleAbandonQuiz = async () => {
    try {
      await abandonMutation.mutateAsync({ sessionId });
      router.push("/profile");
    } catch (error) {
      console.error("Failed to abandon quiz:", error);
    }
  };

  if (isInQuiz) {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            size="sm" 
            variant="destructive" 
            className="w-full cursor-pointer"
          >
            <X className="size-4" />
            <span className="group-data-[collapsible=icon]:hidden">Stop Quiz</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader className="flex flex-col justify-center items-center mb-4">
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Your progress will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            className="w-full bg-red-brand hover:bg-red-brand/80 hover:cursor-pointer dark:text-white"
            onClick={handleAbandonQuiz}
          >
            Stop Quiz
          </AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <HoverBorderGradient
      as="a"
      href="/quiz"
      containerClassName="w-auto py-1"
      className="flex items-center justify-center"
    >
      <List className="size-4" />
      <span className="group-data-[collapsible=icon]:hidden ml-2">Select Quiz</span>
    </HoverBorderGradient>
  );
} 