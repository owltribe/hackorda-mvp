'use client';

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuizStarter } from "@/components/quiz-starter/quiz-starter";

interface User {
  id: number;
  name: string;
}

export default function QuizPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await fetch('/api/users/current');
        if (!userResponse.ok) {
          throw new Error('Failed to fetch user');
        }
        const userData = await userResponse.json();
        setUser(userData.data);

        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load required data. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error || 'User not found. Please ensure you have created a user in the database.'}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="mx-auto max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Start a New Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <QuizStarter userId={user.id} />
        </CardContent>
      </Card>
    </div>
  );
}
