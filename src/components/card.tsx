"use client";
import { cn } from "@/lib/utils";

interface CardDemoProps {
  title: string;
  moduleNumber: string;
  numberOfQuestions: number;
  description: string;
  image?: string;
  bgColor?: string;
}

export function CardDemo({ title, moduleNumber, numberOfQuestions, description, bgColor }: CardDemoProps) {
  return (
    <div className="max-w-xs w-full group/card">
      <div
        className={cn(
          " cursor-pointer overflow-hidden relative card h-48 rounded-md max-w-sm mx-auto backgroundImage flex flex-col justify-between p-4",
          "bg-cover",
          bgColor
        )}
      >
        <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:bg-black opacity-60"></div>
        <div className="flex flex-row items-center space-x-4 z-10">
          <span className="hover:text-white text-2xl font-bold">{moduleNumber}</span>
          <div className="flex flex-col">
            <p className="text-sm">{numberOfQuestions} questions</p>
          </div>
        </div>
        <div className="text content">
          <h1 className="font-bold text-4xl dark:text-gray-50 relative z-10">
            {title}
          </h1>
          <p className="font-normal text-sm dark:text-gray-50 relative z-10 my-4">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
