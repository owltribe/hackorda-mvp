"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DataTableProps<TData extends { userId: string }, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  currentUserId?: string | null
}

export function DataTable<TData extends { userId: string }, TValue>({
  columns,
  data,
  currentUserId
}: DataTableProps<TData, TValue>) {

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { // Set initial page size
      pagination: {
        pageSize: 15, // Show 15 rows per page initially
      },
    },  
  })

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead 
                    key={header.id} 
                    className={cn(
                      header.column.id === "name" ? "text-left" : "text-center", 
                      getColumnWidth(header.column.id)
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                const isCurrentUser = row.original.userId === currentUserId;
                // const isRankOne = row.index === 0;
                return (
                  <TableRow
                    key={row.id}
                    className={cn(
                      "text-center transition-colors",
                      isCurrentUser && "bg-green-brand/10 font-semibold",
                      // isRankOne && "h-12 bg-amber-300 text-black font-semibold text-xl"
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell 
                        key={cell.id}
                        className={cn(
                          cell.column.id === "name" ? "text-left" : "text-center", 
                          getColumnWidth(cell.column.id)
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-start space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  )
}

function getColumnWidth(columnId: string): string {
  switch (columnId) {
    case "position":
      return "w-[10%]"
    case "name":
      return "w-[35%]"
    case "completedQuizzes":
      return "w-[15%]"
    case "averagePercentageScore":
      return "w-[17.5%]"
    case "averageCorrect":
      return "w-[17.5%]"
    default:
      return "w-auto"
  }
}