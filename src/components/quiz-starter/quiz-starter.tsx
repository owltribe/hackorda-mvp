import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useStartQuiz } from '@/hooks/quiz/useQuizActions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface QuizStarterProps {
  userId: number;
}

export function QuizStarter({ userId }: QuizStarterProps) {
  const router = useRouter();
  const [questionCount, setQuestionCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const startQuizMutation = useStartQuiz();
  
  const handleStartQuiz = async () => {
    setIsLoading(true);
    try {
      const result = await startQuizMutation.mutateAsync({
        userId,
        numberOfQuestions: questionCount
      });
      
      // Navigate to the quiz page with the history ID
      router.push(`/quiz/${result.historyId}`);
    } catch (error) {
      console.error('Failed to start quiz:', error);
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="py-10 px-4">
      <CardHeader>
        <CardTitle>Start a New Quiz</CardTitle>
        <CardDescription>
          Customize your quiz and test your knowledge
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">

        <Label htmlFor="questions">Number of Questions</Label>
        <Select
          value={questionCount.toString()}
          onValueChange={(value) => setQuestionCount(parseInt(value))}
        >
          <SelectTrigger id="questions">
            <SelectValue placeholder="Select number of questions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 Questions</SelectItem>
            <SelectItem value="10">10 Questions</SelectItem>
            <SelectItem value="20">20 Questions</SelectItem>
          </SelectContent>
        </Select>

      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleStartQuiz} 
          disabled={isLoading}
        >
          {isLoading ? 'Starting Quiz...' : 'Start Quiz'}
        </Button>
      </CardFooter>
    </Card>
  );
} 