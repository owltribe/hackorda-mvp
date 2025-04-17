"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { BookOpen, Award, Calendar } from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

interface QuizHistoryItem {
  id: number;
  status: string;
  score: number;
  totalQuestions: number;
  selectionCriteria: string;
  takenAt: string;
  completedAt: string | null;
}

export default function ProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: number; name: string; email: string } | null>(null);
  const [recentQuizzes, setRecentQuizzes] = useState<QuizHistoryItem[]>([]);
  
  // Fetch user and quiz history
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch current user
        const userResponse = await fetch('/api/users/current');
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await userResponse.json();
        
        if (!userData.success) {
          throw new Error(userData.error || 'Failed to fetch user data');
        }
        
        setUser(userData.data);
        
        // Fetch user's quiz history
        const historyResponse = await fetch(`/api/users/${userData.data.id}/quiz-history`);
        if (!historyResponse.ok) {
          throw new Error('Failed to fetch quiz history');
        }
        
        const historyData = await historyResponse.json();
        if (!historyData.success) {
          throw new Error(historyData.error || 'Failed to fetch quiz history');
        }
        
        setRecentQuizzes(historyData.data || []);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load profile data');
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Calculate stats from quiz history
  const totalQuizzes = recentQuizzes.length;
  const completedQuizzes = recentQuizzes.filter(q => q.status === 'completed').length;
  const averageScore = recentQuizzes.length > 0 
    ? Math.round(recentQuizzes.reduce((sum, quiz) => sum + quiz.score, 0) / totalQuizzes) 
    : 0;
  const averagePercentage = recentQuizzes.length > 0 
    ? Math.round(recentQuizzes.reduce((sum, quiz) => 
        sum + (quiz.score / quiz.totalQuestions) * 100, 0) / totalQuizzes) 
    : 0;
  
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading your profile...</div>;
  }
  
  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-500">{error}</div>;
  }
  
  return (  
    <div className="flex flex-col items-center justify-center">
      <div className="w-full">
        <div className="flex flex-col mb-6">
          <h1 className="text-2xl font-bold">{user?.name || 'Student Name'}</h1>
          <h2 className="text-l text-muted-foreground">{user?.email || 'Student Email'}</h2>
        </div>

        <div className="grid grid-cols-1 mb-6 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
          <Card className="w-full py-4">
            <CardHeader className="py-2">
              <CardTitle className="flex justify-between text-base">Total Quizzes<BookOpen className="text-green-brand" size={20} /></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <h1 className="text-2xl font-bold">{totalQuizzes}</h1>
              </div>
            </CardContent>  
          </Card>
          
          <Card className="w-full py-4">
            <CardHeader className="py-2">
              <CardTitle className="flex justify-between text-base">Completed<Calendar className="text-green-brand" size={20} /></CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <h1 className="text-2xl font-bold">{completedQuizzes}</h1>
              </div>
            </CardContent>  
          </Card>
          
          <Card className="w-full py-4">
            <CardHeader className="py-2">
              <CardTitle className="flex justify-between text-base">Average Score<BookOpen className="text-green-brand" size={20} /></CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <h1 className="text-2xl font-bold">{averageScore}</h1>
              </div>
            </CardContent>  
          </Card>
          
          <Card className="w-full py-4">
            <CardHeader className="py-2">
              <CardTitle className="flex justify-between text-base">Average Percentage<Award className="text-green-brand" size={20} /></CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <h1 className="text-2xl font-bold">{averagePercentage}%</h1>
              </div>
            </CardContent>  
          </Card>
        </div>

        <div className="border rounded-xl p-4">
          {recentQuizzes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-2/6">Quiz</TableHead>
                  <TableHead className="w-1/6">Score</TableHead>
                  <TableHead className="w-2/6">Date</TableHead>
                  <TableHead className="w-1/6 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentQuizzes.map((quiz) => (
                  <TableRow key={quiz.id}
                    className="hover:bg-muted cursor-pointer" 
                    onClick={() => router.push(`/quiz/results/${quiz.id}`)}
                  > 
                    <TableCell className="font-medium">
                      {quiz.selectionCriteria.startsWith('module_') 
                        ? `Module ${quiz.selectionCriteria.replace('module_', '')}`
                        : 'Random Quiz'}
                    </TableCell>
                    <TableCell>{quiz.score} / {quiz.totalQuestions}</TableCell>
                    <TableCell>{dayjs(quiz.takenAt).utc().format('MMM D, YYYY, h:mm A')}</TableCell>

                    <TableCell className="text-right">
                      <Badge 
                        className={quiz.status === 'completed' ? 'bg-green-500' : 
                          quiz.status === 'in_progress' ? 'bg-blue-500' : 'bg-red-500'}
                          >
                        {quiz.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              You haven&apos;t taken any quizzes yet.
              <div className="mt-4">
                <Button onClick={() => router.push('/')}>
                  Start a Quiz
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}