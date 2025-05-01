"use client";
import React, { useState, useEffect } from "react";
import { ShootingStars } from "@/components/ui/shooting-stars";
import { StarsBackground } from "@/components/ui/stars-background";
import Image from "next/image";
import { TextGenerateEffect } from "./text-generate-effect";
import { motion } from "framer-motion";

// Define programming quotes
const programmingQuotes = [
  "Measuring programming progress by lines of code is like measuring aircraft building progress by weight. - Bill Gates",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand. - Martin Fowler",
  "First, solve the problem. Then, write the code. - John Johnson",
  "Experience is the name everyone gives to their mistakes. - Oscar Wilde",
  "Java is to JavaScript what car is to Carpet. - Chris Heilmann",
  "Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday's code. - Dan Salomon",
  "Perfection is achieved not when there is nothing more to add, but rather when there is nothing more to take away. - Antoine de Saint-Exupery",
  "Code is like humor. When you have to explain it, it's bad. - Cory House",
  "Fix the cause, not the symptom. - Steve Maguire",
  "Simplicity is the soul of efficiency. - Austin Freeman"
];

export default function ShootingStarsAndStarsBackgroundDemo() {
  const [currentQuote, setCurrentQuote] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * programmingQuotes.length);
      setCurrentQuote(programmingQuotes[randomIndex]);
    }, 10000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.article 
      className="flex flex-col w-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.0, ease: "easeInOut" }}
    >
      {/* Background Effects */} 
      <StarsBackground className="absolute inset-0 z-0" />
      <ShootingStars className="absolute inset-0 z-0" />
      
      {/* Content Area - Centered */} 
      <div className="flex flex-row gap-4 my-4">
        <Image src="/icon.svg" alt="HackOrda Logo" width={30} height={30} />

        {/* Display Random Quote with TextGenerateEffect */} 
        {currentQuote && (
          <TextGenerateEffect 
            words={currentQuote} 
            className="text-xl"
          />
        )}
      </div>
    </motion.article>
  );
} 