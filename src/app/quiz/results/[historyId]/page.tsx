'use client';

import { useParams, useRouter } from "next/navigation";
import { useQuizResults } from "@/hooks/quiz/useQuizResults";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Award, Clock, ChevronLeft, RotateCw } from "lucide-react";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export default function QuizResultsPage() {
  const params = useParams();
  const router = useRouter();
  const historyId = parseInt(params.historyId as string);
  
  const { data: results, isLoading, error } = useQuizResults(historyId);
  
  const handleStartNewQuiz = () => {
    router.push('/'); // Navigate to homepage or wherever your quiz starter is
  };
  
  if (isLoading) return <div className="flex justify-center items-center min-h-screen">Loading quiz results...</div>;
  if (error) return <div className="flex justify-center items-center min-h-screen">Error loading results: {error.message}</div>;
  if (!results) return <div className="flex justify-center items-center min-h-screen">No results available</div>;
  
  const { quiz, summary } = results;
  const scorePercentage = Math.round((summary.correct / summary.totalQuestions) * 100);
  const completionTime = quiz.completedAt 
    ? dayjs(quiz.completedAt).utc().format('MMM D, YYYY h:mm A')
    : 'N/A';
  
  // Get feedback based on score
  const getFeedback = () => {
    if (scorePercentage >= 90) return "Excellent! You've mastered this material.";
    if (scorePercentage >= 70) return "Great job! You have a good understanding of the material.";
    if (scorePercentage >= 50) return "Good effort! With a bit more practice, you'll improve.";
    return "Keep practicing! You'll get better with time.";
  };
  
  return (
    <div className="w-full">
      <div className="rounded-lg shadow">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Quiz Results</h1>
          <p className="text-muted-foreground">
            {quiz.selectionCriteria.startsWith('module') 
              ? `Module: ${quiz.selectionCriteria.replace('module_', '')}` 
              : 'Random Questions'}
          </p>
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <Progress 
                value={scorePercentage} 
                className="h-4 w-48 absolute top-0" 
              />
              <div className="text-center mt-8">
                <div className="text-5xl font-bold">{scorePercentage}%</div>
                <div className="text-sm text-muted-foreground mt-2">
                  {summary.correct} of {summary.totalQuestions} correct
                </div>
              </div>
            </div>
            
            <p className="text-lg font-medium text-center">{getFeedback()}</p>
          </div>
        </div>
        
        <div className="space-y-6 mt-6"> 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="flex items-center gap-3 p-4 border rounded">
              <Award className="h-8 w-8 text-yellow-500" />
              <div>
                <div className="text-sm text-muted-foreground">Score</div>
                <div className="font-medium">{summary.score} points</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 border rounded">
              <Clock className="h-8 w-8 text-blue-500" />
              <div>
                <div className="text-sm text-muted-foreground">Completion Time</div>
                <div className="font-medium">{completionTime}</div>
              </div>
            </div>
          </div>
          
          <h3 className="text-lg font-medium">Question Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            {results.answers.map((answer, index) => (
              <div key={index} className="flex items-start gap-3 p-4 border rounded">
                <div className="flex-shrink-0 mt-1">
                  {answer.isCorrect ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{answer.question?.questionText}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    Your answer: {answer.selectedOptionKey} - {answer.question?.options[answer.selectedOptionKey] || 'N/A'}
                  </div>
                  {!answer.isCorrect && (
                    <div className="text-sm text-green-600 mt-1">
                      Correct answer: {answer.question?.correctOptionKey} - {answer.question?.options[answer.question.correctOptionKey] || 'N/A'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-row justify-around mt-6">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => router.push('/profile')}
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Profile
          </Button>
          <Button 
            className="w-full sm:w-auto flex items-center gap-2"
            onClick={handleStartNewQuiz}
          >
            <RotateCw className="h-4 w-4" />
            Take Another Quiz
          </Button>
        </div>
      </div>
    </div>
  );
} 