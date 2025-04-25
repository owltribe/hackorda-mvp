"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Row } from "@tanstack/react-table"

interface LeaderboardData {
  userId: string
  firstName: string | null
  lastName: string | null
  completedQuizzes: number
  averagePercentageScore: number | null
  averageCorrect: number | null
}

interface CellProps {
  row: Row<LeaderboardData>
}

interface ScoreCellProps extends CellProps {
  key: "averagePercentageScore" | "averageCorrect"
}

const renderName = ({ row }: CellProps): string => {
  const firstName = row.original.firstName || 'Anonymous'
  const lastName = row.original.lastName || ''
  return `${firstName} ${lastName}`
}

const renderScore = ({ row, key }: ScoreCellProps): string => {
  const value = row.getValue(key) as number | null
  if (value === null) {
    return 'N/A'
  }
  return key === "averagePercentageScore" ? `${Math.round(value)}%` : `${Math.round(value)}`;
}

export const columns: ColumnDef<LeaderboardData>[] = [
  {
    id: "position",
    header: () => <div className="text-center font-medium">Rank</div>,
    cell: ({ row }) => {
      return <div className="text-center text-md font-bold">{row.index + 1}</div>
    }
  },
  {
    accessorKey: "name",
    header: () => <div className="text-left font-medium">Full Name</div>,
    cell: renderName
  },
  {
    accessorKey: "averageCorrect",
    header: () => <div className="text-center">Avg. Correct</div>,
    cell: (props) => renderScore({ ...props, key: "averageCorrect" })
  },
  {
    accessorKey: "averagePercentageScore",
    header: () => <div className="text-center">Average Score</div>,
    sortDescFirst: true,
    cell: (props) => renderScore({ ...props, key: "averagePercentageScore" })
  },
  {
    accessorKey: "completedQuizzes",
    header: () => <div className="text-center">Completed</div>,
    cell: ({ row }) => {
      const count = row.getValue("completedQuizzes") as number | null;
      return <div className="text-center">{count ?? 'N/A'}</div>
    }
  },
]