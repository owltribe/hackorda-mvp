import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useStartQuiz } from '@/hooks/quiz/useQuizActions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface QuizStarterProps {
  userId: string;
}

export function QuizStarter({ userId }: QuizStarterProps) {
  const router = useRouter();
  const [questionCount, setQuestionCount] = useState(3);
  const [isLoading, setIsLoading] = useState(false);
  const startQuizMutation = useStartQuiz();
  
  const handleStartQuiz = async () => {
    setIsLoading(true);
    try {
      const result = await startQuizMutation.mutateAsync({
        userId,
        numberOfQuestions: questionCount
      });
      
      // Navigate to the quiz page with the session ID
      router.push(`/quiz/${result.sessionId}`);
    } catch (error) {
      console.error('Failed to start quiz:', error);
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Start a New Quiz</h2>
        <p className="text-muted-foreground">
          Choose how many questions you&apos;d like to answer and test your knowledge.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="questions">Number of Questions</Label>
          <Select
            value={questionCount.toString()}
            onValueChange={(value) => setQuestionCount(parseInt(value))}
          >
            <SelectTrigger id="questions">
              <SelectValue placeholder="Select number of questions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 Questions</SelectItem>
              <SelectItem value="50">50 Questions</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          className="w-full hover:cursor-pointer" 
          onClick={handleStartQuiz} 
          disabled={isLoading}
          size="lg"
        >
          {isLoading ? 'Starting Quiz...' : 'Start Quiz'}
        </Button>
      </div>
    </div>
  );
} 