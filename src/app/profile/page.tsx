"use client"

import * as React from "react"
import { BookOpen,Award, Calendar } from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const invoices = [
  {
    TestName: "Test 1",
    Date: "25.03.2025",
    Score: "80%",
    Status: "Pass",
  },
  {
    TestName: "Test 2",
    Date: "25.03.2025",
    Score: "80%",
    Status: "Pass",
  },
  {
    TestName: "Test 3",
    Date: "25.03.2025",
    Score: "80%",
    Status: "Pass",
  },
  {
    TestName: "Test 4",
    Date: "25.03.2025",
    Score: "80%",
    Status: "Pass",
  },
  {
    TestName: "Test 5",
    Date: "25.03.2025",
    Score: "80%",
    Status: "Pass",
  },
  {
    TestName: "Test 6",
    Date: "25.03.2025",
    Score: "80%",
    Status: "Pass",
  },
  {
    TestName: "Test 7",
    Date: "25.03.2025",
    Score: "80%",
    Status: "Pass",
  },
]


export default function StudentsPage() {
  const [selectedTest, setSelectedTest] = React.useState<any | null>(null)
  return (
    <div className="flex flex-col items-center justify-center p-2">

      <div className="w-[100%] flex flex-col mb-4">
        <h1 className="text-2xl font-bold">Student Name</h1>
        <h2 className="text-l font-light">Student Email</h2>
      </div>

      <div className="grid grid-cols-1 mb-4 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <Card className="w-full py-6">
          <CardHeader>
            <CardTitle className="flex justify-between">Total tests <BookOpen className="text-muted-foreground" size={24} /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold">10</h1>
            </div>
          </CardContent>  
        </Card>
        <Card className="w-full py-6">
          <CardHeader>
            <CardTitle className="flex justify-between">Average Score <Award className="text-muted-foreground" size={24} /></CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <h1 className="text-2xl font-bold">80%</h1>
            </div>
          </CardContent>  
        </Card>
        <Card className="w-full py-6">
          <CardHeader>
            <CardTitle className="flex justify-between">Pass Rate <Award className="text-muted-foreground" size={24} /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold">100%</h1>
            </div>
          </CardContent>  
        </Card>
        <Card className="w-full py-6">
          <CardHeader>
            <CardTitle className="flex justify-between">Member Since <Calendar className="text-muted-foreground" size={24} /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold">2025-03-25</h1>
            </div>
          </CardContent>  
        </Card>
      </div>

      <div className="border rounded-xl p-8 w-[100%]">
        <h1 className="text-2xl font-bold mb-4">Tests History</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-3/6 text-muted-foreground">Test Name</TableHead>
              <TableHead className="w-1/6 text-muted-foreground">Date</TableHead>
              <TableHead className="w-1/6 text-muted-foreground">Score</TableHead>
              <TableHead className="w=1/6 text-right text-muted-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.TestName}
                className="hover:bg-muted cursor-pointer" 
                onClick={() => setSelectedTest(invoice)} > 
                <TableCell className="font-medium">{invoice.TestName}</TableCell>
                <TableCell>{invoice.Date}</TableCell>
                <TableCell>{invoice.Score}</TableCell>
                <TableCell className="text-right"><Badge className="bg-green-400">{invoice.Status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Dialog open={!!selectedTest} onOpenChange={() => setSelectedTest(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <p>
            Вы хотите просмотреть подробные ответы по тесту:{" "}
            <strong>{selectedTest?.TestName}</strong>?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTest(null)}>Отмена</Button>
            <Button
              onClick={() => {
                // Перенаправление на страницу с ответами (Пока что всплывающий алерт)
                alert(`Переход к ответам по ${selectedTest?.TestName}`);
                setSelectedTest(null);
              }}
            >
              Да, просмотреть
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}