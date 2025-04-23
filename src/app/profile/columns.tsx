"use client"

import { ColumnDef } from "@tanstack/react-table"
import { QuizSessionSummary } from "@/types" // Import the type for quiz data
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown } from "lucide-react" // For sorting indicator
import { Button } from "@/components/ui/button" // For sortable header button

// Helper function to format the date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString(); 
};

// Helper function to get badge class based on status
const getStatusBadgeClass = (status: QuizSessionSummary['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-brand text-black hover:bg-green-300';
    case 'in_progress':
      return 'bg-blue-500 text-black hover:bg-blue-400';
    case 'abandoned':
      return 'bg-red-brand text-black hover:bg-red-brand-300';
    default:
      return 'bg-gray-100 text-gray-800'; // Default or unknown status
  }
}

export const columns: ColumnDef<QuizSessionSummary>[] = [
  {
    accessorKey: "selectionCriteria", // Field to access
    header: () => <div>Quiz Type</div>,
    cell: ({ row }) => {
      // Display 'Random Quiz' or Module info based on criteria/score potentially
      // This logic might need refinement based on how selectionCriteria is stored
      const criteria = row.getValue("selectionCriteria");
      // Simple example: if criteria contains 'module', show module, else random
      return criteria && typeof criteria === 'string' && criteria.toLowerCase().includes('module') 
        ? `Module Quiz` // Or extract module ID if available
        : 'Random Quiz';
    },
  },
  {
    accessorKey: "score",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="text-center w-full justify-center" // Center align header
        >
          Score
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const score = row.getValue("score") as number | null;
      const numQuestions = row.original.numberOfQuestions;
      return <div className="text-center">{score !== null ? `${score} / ${numQuestions}` : 'N/A'}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <div>Date</div>,
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return <div>{formatDate(date)}</div>;
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-right">Status</div>, // Right align header text
    cell: ({ row }) => {
      const status = row.getValue("status") as QuizSessionSummary['status'];
      return (
        <div className="text-right">
          {status === 'in_progress' ? (
            <Badge 
              variant="outline" // Use outline variant for better color contrast with background
              className={`capitalize ${getStatusBadgeClass(status)} cursor-pointer`} // Add cursor-pointer for visual cue
            >
              {status.replace('_', ' ')}
            </Badge>
          ) : (
            <Badge 
              variant="outline" // Use outline variant for better color contrast with background
              className={`capitalize ${getStatusBadgeClass(status)}`}
            >
              {status.replace('_', ' ')}
            </Badge>
          )}
        </div>
      );
    },
  },
  // If you need row actions (like view results), add an actions column:
  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const quiz = row.original
  //     // Add dropdown menu or button here
  //     return <Button variant="ghost" size="sm" onClick={() => router.push(`/quiz/results/${quiz.id}`)}>View</Button>
  //   }
  // }
] 