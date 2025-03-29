export interface Variant {
  letter: string | null,
  answer: string | null,
  isCorrect: boolean | null
}

export interface Question {
  category: string,
  text: string,
  variants: Variant[]
}

export const questions: Question[] = [
  {
    category: "Computer Science",
    text: "What does CPU stand for?",
    variants: [
      {
        letter: "A",
        answer: "Central Processing Unit",
        isCorrect: true,
      },
      {
        letter: "B",
        answer: "Computer Personal Unit",
        isCorrect: false,
      },
      {
        letter: "C",
        answer: "Central Process Utility",
        isCorrect: false,
      },
      {
        letter: "D",
        answer: "Central Processor Underlying",
        isCorrect: false,
      },
    ]
  },
  {
    category: "Computer Science",
    text: "Which of the following is NOT a programming language?",
    variants: [
      {
        letter: "A",
        answer: "Java",
        isCorrect: false,
      },
      {
        letter: "B",
        answer: "Python",
        isCorrect: false,
      },
      {
        letter: "C",
        answer: "HTML",
        isCorrect: false,
      },
      {
        letter: "D",
        answer: "Microsoft Excel",
        isCorrect: true,
      },
    ]
  }
]