"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "motion/react";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) => {
  const [scope, animate] = useAnimate();
  const wordsArray = words.split(" ");
  useEffect(() => {
    // Check if scope.current exists before animating
    if (scope.current) {
      animate(
        "span",
        {
          opacity: 1,
          filter: filter ? "blur(0px)" : "none",
        },
        {
          duration: duration ? duration : 1,
          delay: stagger(0.2),
        }
      );
    }
  }, [animate, filter, duration, words, scope]); // Reverted to dependencies: animate, filter, duration, words

  const renderWords = () => {
    // Ensure component re-renders when words change by using wordsArray in the key or component body
    return (
      <motion.div ref={scope} key={words}> {/* Add key prop */} 
        {wordsArray.map((word, idx) => {
          return (
            <motion.span
              key={word + idx}
              // Apply base text color directly, opacity handles the reveal
              className={cn("dark:text-white text-black opacity-0", className)} 
              style={{
                filter: filter ? "blur(10px)" : "none",
              }}
            >
              {word}{" "} 
            </motion.span>
          );
        })}
      </motion.div>
    );
  };

  return (
    // Removed outer font-bold, apply styling via className prop if needed
    <div className={cn(className)}> 
      <div className="mt-4">
        {/* Removed specific text styling here, rely on className prop or parent styling */} 
        <div className="leading-snug tracking-wide">
          {renderWords()}
        </div>
      </div>
    </div>
  );
}; 