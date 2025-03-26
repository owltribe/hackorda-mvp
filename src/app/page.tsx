'use client';

import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';
import { useQuery } from '@tanstack/react-query';

type TestResult = {
  testName: string;
  date: string;
  score: number;
  status: 'Pass' | 'Fail';
};

export default function Home() {
  const { data, isLoading } = useQuery<TestResult[]>({
    queryKey: ['testResults'],
    queryFn: () =>
      Promise.resolve([
        { testName: 'Student 1', date: '2025-03-30', score: 85, status: 'Pass' },
        { testName: 'Student 2', date: '2025-03-30', score: 92, status: 'Pass' },
        { testName: 'Student 3', date: '2025-03-30', score: 68, status: 'Fail' },
      ]),
  });

  if (isLoading) return <div className="container">Загрузка...</div>;

  return (
    <div className="container">
      <h1>HackOrda MVP</h1>
      <SignedIn>
        <button className="start-test-btn">Начать тест</button>
      </SignedIn>
      <SignedOut>
        <SignInButton>
          <button className="start-test-btn">Начать тест</button>
        </SignInButton>
      </SignedOut>
      <table className="results-table">
        <thead>
          <tr>
            <th>Test Name</th>
            <th>Date</th>
            <th>Score</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((result, index) => (
            <tr key={index}>
              <td>{result.testName}</td>
              <td>{result.date}</td>
              <td>{result.score}%</td>
              <td>
                <span className={`status ${result.status.toLowerCase()}`}>
                  {result.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="recent-results">Recent test results</p>
    </div>
  );
}
