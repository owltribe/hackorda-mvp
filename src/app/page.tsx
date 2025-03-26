import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/test-results/data-table';
import { columns } from '@/components/test-results/columns';

type TestResult = {
  testName: string;
  date: string;
  score: number;
  status: 'Pass' | 'Fail';
};

async function getTestResults(): Promise<TestResult[]> {
  return [
    { testName: 'Student 1', date: '2025-03-30', score: 85, status: 'Pass' },
    { testName: 'Student 2', date: '2025-03-30', score: 92, status: 'Pass' },
    { testName: 'Student 3', date: '2025-03-30', score: 68, status: 'Fail' },
    { testName: 'Student 4', date: '2025-03-30', score: 85, status: 'Pass' },
    { testName: 'Student 5', date: '2025-03-30', score: 85, status: 'Pass' },
    { testName: 'Student 6', date: '2025-03-30', score: 85, status: 'Fail' },
    { testName: 'Student 7', date: '2025-03-30', score: 85, status: 'Pass' },
  ];
}

export default async function Home() {
  const data = await getTestResults();

  return (
    <div className="max-w-7xl mx-auto p-5 text-center">
      <h1 className="font-sans text-2xl mb-5">HackOrda MVP</h1>
      <Link href="/quiz">
        <Button className="bg-black text-white py-2 px-5 rounded-md cursor-pointer font-sans text-base mb-[30px] hover:bg-gray-800">
          Начать тест
        </Button>
      </Link>
      <DataTable columns={columns} data={data} />
      <p className="font-sans text-sm text-gray-500 text-left">Recent test results</p>
    </div>
  );
}