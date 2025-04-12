import { integer, pgTable, varchar, boolean, timestamp, jsonb, serial, text } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  age: integer("age").notNull(),
  city: varchar("city", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const questionModules = pgTable("question_modules", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull().unique(),
  description: varchar("description", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  moduleId: integer("module_id").references(() => questionModules.id, { onDelete: 'set null' }),
  questionText: text("question_text").notNull(),
  options: jsonb("options").$type<{ [key: string]: string }>().notNull(),
  correctOptionKey: varchar("correct_option_key", { length: 10 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const quizHistory = pgTable("quiz_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  numberOfQuestions: integer("number_of_questions").notNull(),
  score: integer("score").notNull().default(0),
  selectionCriteria: text("selection_criteria").default('random'),
  takenAt: timestamp("taken_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const quizAnswers = pgTable("quiz_answers", {
  id: serial("id").primaryKey(),
  historyId: integer("history_id").notNull().references(() => quizHistory.id, { onDelete: "cascade" }),
  questionId: integer("question_id").notNull().references(() => questions.id, { onDelete: "cascade" }),
  selectedOptionKey: varchar("selected_option_key", { length: 10 }),
  isCorrect: boolean("is_correct"),
  answeredAt: timestamp("answered_at").defaultNow(),
});