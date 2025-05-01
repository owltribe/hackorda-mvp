'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useStartQuiz } from '@/hooks/quiz/useStartQuiz';
import { toast } from "sonner"

interface QuizConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  quizType: 'random' | 'exam';
  title: string;
  description: string;
  userId: string | undefined; // User ID might be loading initially
}

export const QuizConfigDialog = ({ 
  isOpen, 
  onClose, 
  quizType, 
  title, 
  description,
  userId
}: QuizConfigDialogProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState<number | null>(null); // Track which button is loading
  const startQuizMutation = useStartQuiz();

  const handleStartQuiz = async (numberOfQuestions: number) => {
    if (!userId) {
      toast.error("User information not available. Please try again.");
      return;
    }
    
    setLoadingButton(numberOfQuestions); // Set loading state for the specific button
    setIsLoading(true); // Keep general loading state if needed for other elements
    
    try {
      const result = await startQuizMutation.mutateAsync({
        userId,
        numberOfQuestions: numberOfQuestions, // Use passed argument
        quizType: quizType
      });
      
      router.push(`/quiz/${result.sessionId}`);
      onClose(); // Close the dialog on success
    } catch (error) {
      console.error('Failed to start quiz:', error);
    } finally {
      setIsLoading(false);
      setLoadingButton(null); // Reset loading state for the button
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => !isLoading && onClose()}> {/* Prevent closing while loading */}
      <DialogContent className="w-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        {quizType === 'exam' && (
          <div className="py-4 text-start text-muted-foreground">
            <ul className="list-disc list-inside space-y-1">
              <li>Test your full-stack knowledge.</li>
              <li>Do not cheat.</li>
              <li>You cannot go back to previous questions.</li>
            </ul>
          </div>
        )}

        <DialogFooter className={`pt-4 ${quizType === 'random' ? 'gap-2' : ''}`}>
          {quizType === 'random' && (
            <>
              <div className="flex flex-col gap-2 w-full">
                <Button 
                  type="button" 
                  onClick={() => handleStartQuiz(10)} 
                  disabled={isLoading || !userId}
                  className="hover:cursor-pointer"
                  aria-label={loadingButton === 10 ? 'Starting 10 Question Quiz...' : 'Quick 10 Question Quiz'}
              >
                {loadingButton === 10 ? 'Starting...' : '10 Questions'}
              </Button>
              <Button 
                type="button" 
                onClick={() => handleStartQuiz(25)} 
                disabled={isLoading || !userId}
                className="hover:cursor-pointer"
                aria-label={loadingButton === 25 ? 'Starting 25 Question Quiz...' : 'Start 25 Question Quiz'}
              >
                {loadingButton === 25 ? 'Starting...' : '25 Questions'}
              </Button>
            </div>
            </>
          )}

          {quizType === 'exam' && (
            <Button 
              type="button" 
              onClick={() => handleStartQuiz(50)} // Hardcode 50 for exam
              disabled={isLoading || !userId}
              className="w-full hover:cursor-pointer" // Make button full width
              aria-label={isLoading ? 'Starting Exam...' : `Start ${title}`}
            >
              {isLoading ? 'Starting...' : 'Start Exam'}
            </Button>
          )}
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}; 