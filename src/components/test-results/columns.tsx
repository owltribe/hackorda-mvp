'use client';

import { ColumnDef } from '@tanstack/react-table';

type TestResult = {
  testName: string;
  date: string;
  score: number;
  status: 'Pass' | 'Fail';
};

export const columns: ColumnDef<TestResult>[] = [
  {
    accessorKey: 'testName',
    header: 'Test Name',
    cell: ({ row }) => <div className="text-left">{row.getValue('testName')}</div>,
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => <div className="text-left">{row.getValue('date')}</div>,
  },
  {
    accessorKey: 'score',
    header: 'Score',
    cell: ({ row }) => <div className="text-left">{row.getValue('score')}%</div>,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status') as 'Pass' | 'Fail';
      return (
        <div className="text-left">
          <span
            className={`inline-block px-2.5 py-1 rounded-full text-sm font-medium ${
              status === 'Pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {status}
          </span>
        </div>
      );
    },
  },
];