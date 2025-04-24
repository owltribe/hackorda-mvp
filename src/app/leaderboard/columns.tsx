"use client"

import { ColumnDef } from "@tanstack/react-table"

type LeaderboardData = {
  userId: string
  firstName: string | null
  lastName: string | null
  quizCriteria: string | null
  completedQuizzes: number
  averageScore: number
  highestScore: number
}

const renderName = ({ row }: { row: any }) => {
  const firstName = row.original.firstName || 'Anonymous'
  const lastName = row.original.lastName || 'User'
  return `${firstName} ${lastName}`
}

const renderQuizType = ({ row }: { row: any }) => {
  const criteria = row.getValue("quizCriteria") as string | null
  return criteria ? criteria.charAt(0).toUpperCase() + criteria.slice(1) : 'Random'
}

const renderScore = ({ row }: { row: any }, key: string) => {
  const score = row.getValue(key) as number
  return `${Math.round(score)}%`
}

export const columns: ColumnDef<LeaderboardData>[] = [
  {
    accessorKey: "name",
    header: "Student Name",
    cell: renderName
  },
  {
    accessorKey: "quizCriteria",
    header: "Quiz Type",
    cell: renderQuizType
  },
  {
    accessorKey: "completedQuizzes",
    header: "Completed"
  },
  {
    accessorKey: "averageScore",
    header: "Average Score",
    sortDescFirst: true,
    cell: (props) => renderScore(props, "averageScore")
  },
  {
    accessorKey: "highestScore",
    header: "Best Score",
    cell: (props) => renderScore(props, "highestScore")
  }
]