import { integer, pgTable, varchar, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";


export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  age: integer("age").notNull(),
  city: varchar("city", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow(),  
});

export const quizzesTable = pgTable("quizzes", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  description: varchar("description", { length: 500 }),
  totalQuestions: integer("total_questions").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const questionsTable = pgTable("questions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  quizId: integer("quiz_id").notNull().references(() => quizzesTable.id, { onDelete: "cascade" }),
  questionText: varchar("question_text", { length: 1000 }).notNull(),
  options: jsonb("options").notNull(),
  correctAnswer: varchar("correct_answer", { length: 255 }).notNull(),
});

export const quizAttemptsTable = pgTable("quiz_attempts", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id").notNull().references(() => usersTable.id, { onDelete: "cascade" }),
  quizId: integer("quiz_id").notNull().references(() => quizzesTable.id, { onDelete: "cascade" }),
  score: integer("score"),
  takenAt: timestamp("taken_at").defaultNow(),
});

export const quizAnswersTable = pgTable("quiz_answers", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  attemptId: integer("attempt_id").notNull().references(() => quizAttemptsTable.id, { onDelete: "cascade" }),
  questionId: integer("question_id").notNull().references(() => questionsTable.id, { onDelete: "cascade" }),
  selectedAnswer: varchar("selected_answer", { length: 255 }).notNull(),
  isCorrect: boolean("is_correct").notNull(),
});