"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Row } from "@tanstack/react-table"

interface LeaderboardData {
  userId: string
  firstName: string | null
  lastName: string | null
  completedQuizzes: number
  averageScore: number
  highestScore: number
}

interface CellProps {
  row: Row<LeaderboardData>
}

interface ScoreCellProps extends CellProps {
  key: "averageScore" | "highestScore"
}

const renderName = ({ row }: CellProps): string => {
  const firstName = row.original.firstName || 'Anonymous'
  const lastName = row.original.lastName || 'User'
  return `${firstName} ${lastName}`
}

const renderScore = ({ row, key }: ScoreCellProps): string => {
  const score = row.getValue(key) as number
  return `${Math.round(score)}%`
}

export const columns: ColumnDef<LeaderboardData>[] = [
  {
    id: "position",
    header: "Place",
    cell: ({ row }) => {
      return <div className="text-center font-medium">{row.index + 1}</div>
    }
  },
  {
    accessorKey: "name",
    header: "Student Name",
    cell: renderName
  },
  {
    accessorKey: "completedQuizzes",
    header: "Completed",
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("completedQuizzes")}</div>
    }
  },
  {
    accessorKey: "averageScore",
    header: "Average Score",
    sortDescFirst: true,
    cell: (props) => renderScore({ ...props, key: "averageScore" })
  },
  {
    accessorKey: "highestScore",
    header: "Best Score",
    cell: (props) => renderScore({ ...props, key: "highestScore" })
  }
]