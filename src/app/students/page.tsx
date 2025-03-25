import Link from "next/link";
import * as React from "react"
import { BookOpen,Award,Calendar } from 'lucide-react';
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  return (
    <div className=" items-center justify-items-center sm:p-20">
      <div className="w-[100%] flex justify-between mb-2.5 mx-6">
        <Link href="/">
          <Button variant="ghost" className="">← Back to Home</Button>
        </Link>
        <Link href="/">
          <Button  className="">Take New Quiz</Button>
        </Link>
      </div>
        <div className="w-[100%] flex flex-col mb-10 mx-6">
          <h1 className="text-2xl font-bold">Student Name</h1>
          <h2 className="text-l font-light">Student Email</h2>
        </div>
      <div className="min-w-[100%] mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex justify-between">Total tests <BookOpen size={24} /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold">10</h1>
            </div>
          </CardContent>  
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex justify-between">Average Score <Award size={24} /></CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <h1 className="text-2xl font-bold">80%</h1>
            </div>
          </CardContent>  
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex justify-between">Pass Rate <Award size={24} /></CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold">100%</h1>
            </div>
          </CardContent>  
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="flex justify-between">Member Since <Calendar size={24} /></CardTitle>
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
              <TableHead className="w-3/6">Test Name</TableHead>
              <TableHead className="w-1/6">Date</TableHead>
              <TableHead className="w-1/6">Score</TableHead>
              <TableHead className="w=1/6 text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.TestName}>
                <TableCell className="font-medium">{invoice.TestName}</TableCell>
                <TableCell>{invoice.Date}</TableCell>
                <TableCell>{invoice.Score}</TableCell>
                <TableCell className="text-right"><Badge className="bg-green-400">{invoice.Status}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}