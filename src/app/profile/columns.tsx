"use client"

import { ColumnDef } from "@tanstack/react-table"
import { QuizSessionSummary } from "@/types" // Import the type for quiz data
import { Badge } from "@/components/ui/badge"

// Helper function to format the date
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString(); 
};

// Helper function to get badge class based on status
const getStatusBadgeClass = (status: QuizSessionSummary['status']) => {
  switch (status) {
    case 'completed':
      return 'bg-green-brand text-black';
    case 'in_progress':
      return 'bg-blue-500 text-black';
    case 'abandoned':
      return 'bg-red-brand text-black';
    default:
      return 'bg-gray-100 text-gray-800'; // Default or unknown status
  }
}

export const columns: ColumnDef<QuizSessionSummary>[] = [
  {
    accessorKey: "selectionCriteria", // Field to access
    header: () => <div>Quiz Type</div>,
    cell: ({ row }) => {
      const criteria = row.getValue("selectionCriteria") as string | undefined;
      
      if (criteria === 'exam') {
        return 'Exam';
      } else if (criteria === 'random') {
        return 'Random Quiz';
      } else if (criteria && criteria.toLowerCase().includes('module')) {
        // Handle potential future module quizzes
        return `Module Quiz`; // Or extract module details if available
      } else {
        // Fallback for older sessions or unexpected criteria
        return criteria || 'Unknown'; 
      }
    },
  },
  {
    accessorKey: "score",
    header: () => <div>Score</div>,
    cell: ({ row }) => {
      const score = row.getValue("score") as number | null;
      const numQuestions = row.original.numberOfQuestions;
      return <div>{score !== null ? `${score} / ${numQuestions}` : 'N/A'}</div>;
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
      const selectionCriteria = row.original.selectionCriteria; // Get selection criteria

      let displayText = status.replace('_', ' '); // Default display text

      if (selectionCriteria === 'exam') {
        if (status === 'completed') {
          displayText = 'Pass';
        } else if (status === 'abandoned') {
          displayText = 'Fail';
        }
        // For 'in_progress' exams, it will still show 'in progress'
      }

      return (
        <div className="text-right">
          {status === 'in_progress' ? (
            <Badge 
              variant="outline" // Use outline variant for better color contrast with background
              className={`capitalize ${getStatusBadgeClass(status)}`} // Add cursor-pointer for visual cue
            >
              {displayText}
            </Badge>
          ) : (
            <Badge 
              variant="outline" // Use outline variant for better color contrast with background
              className={`capitalize ${getStatusBadgeClass(status)}`}
            >
              {displayText}
            </Badge>
          )}
        </div>
      );
    },
  },
] 