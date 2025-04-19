import { integer, pgTable, varchar, boolean, timestamp, jsonb, serial, text, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  age: integer("age"),
  city: varchar("city", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const questionModules = pgTable("question_modules", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull().unique(),
  description: varchar("description", { length: 500 }),
  totalQuestions: integer("total_questions").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
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

export const quizSession = pgTable("quiz_session", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  numberOfQuestions: integer("number_of_questions").notNull(),
  questionIds: jsonb("question_ids").$type<number[]>().notNull(),
  status: varchar("status", { length: 50 }).default('in_progress').notNull(),
  score: integer("score").notNull().default(0),
  selectionCriteria: text("selection_criteria").default('random'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
});

export const quizAnswers = pgTable("quiz_answers", {
  id: serial("id").primaryKey(),
  sessionId: integer("session_id").notNull().references(() => quizSession.id, { onDelete: "cascade" }),
  questionId: integer("question_id").notNull().references(() => questions.id, { onDelete: "cascade" }),
  selectedOptionKey: varchar("selected_option_key", { length: 10 }),
  isCorrect: boolean("is_correct"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at")
});