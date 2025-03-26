'use client';

import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';

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

  if (isLoading) return <div className="max-w-[600px] mx-auto p-5 text-center">Загрузка...</div>;

  return (
    <div className="max-w-[600px] mx-auto p-5 text-center">
      <h1 className="font-sans text-2xl mb-5">HackOrda MVP</h1>
      <Link href="/quiz">
        <Button className="bg-black text-white py-2 px-5 rounded-md cursor-pointer font-sans text-base mb-[30px] hover:bg-gray-800">
          Начать тест
        </Button>
      </Link>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-left font-normal text-gray-500">Test Name</TableHead>
            <TableHead className="text-left font-normal text-gray-500">Date</TableHead>
            <TableHead className="text-left font-normal text-gray-500">Score</TableHead>
            <TableHead className="text-left font-normal text-gray-500">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((result, index) => (
            <TableRow key={index}>
              <TableCell className="text-left">{result.testName}</TableCell>
              <TableCell className="text-left">{result.date}</TableCell>
              <TableCell className="text-left">{result.score}%</TableCell>
              <TableCell className="text-left">
                <span
                  className={`inline-block px-2.5 py-1 rounded-full text-sm font-medium ${
                    result.status === 'Pass'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {result.status}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="font-sans text-sm text-gray-500 text-left">Recent test results</p>
    </div>
  );
}