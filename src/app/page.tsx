import { Command } from "lucide-react";
import { CardDemo } from "@/components/card";
import { InProgressQuizNotifier } from "@/components/notifications/InProgressQuizNotifier";

const cardsInfo = [
  {
    title: "Front-end",
    moduleNumber: "105",
    numberOfQuestions: 17,
    description: "Front-end module for HackOrda MVP card",
    image: "/images/101.png",
    bgColor: "bg-gradient-to-r from-green-brand/50 to-green-brand",
  },
  {
    title: "Back-end",
    moduleNumber: "101",
    numberOfQuestions: 25,
    description: "Back-end module for HackOrda MVP card",
    image: "/images/102.png",
    bgColor: "bg-gradient-to-r from-red-brand/50 to-red-brand",
  },
  {
    title: "DevOps",
    moduleNumber: "109",
    numberOfQuestions: 15,
    description: "DevOps module for HackOrda MVP card",
    image: "/images/103.png",
    bgColor: "bg-gradient-to-r from-blue-500/50 to-blue-500",
  },
  {
    title: "Dev-core",
    moduleNumber: "104",
    numberOfQuestions: 22,
    description: "Dev-core module for HackOrda MVP card",
    image: "/images/104.png",
    bgColor: "bg-gradient-to-r from-purple-500/50 to-purple-500",
  }
]

const exampleCardsInfo = [
  {
    title: "Exam",
    moduleNumber: "Full-stack",
    numberOfQuestions: 75,
    description: "Full-stack module for HackOrda MVP card",
    image: "/images/101.png",
    bgColor: "bg-gradient-to-r from-amber-500/50 to-amber-500",
  },
]

export default async function Home() {

  return (
    <div className="flex flex-col">
      <InProgressQuizNotifier />

      <div className="flex flex-row gap-4 items-center mb-6">
        <Command className="w-14 h-14" />
        <h1 className="font-sans text-6xl font-bold">HackOrda MVP - Phase 1</h1>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {exampleCardsInfo.map((card) => (
          <CardDemo key={card.title} {...card} />
        ))}
      </div>

      <hr className="my-6" />

      <div className="grid grid-cols-5 gap-4">
        {cardsInfo.map((card) => (
          <CardDemo key={card.title} {...card} />
        ))}
      </div>
      
    </div>
  );
}