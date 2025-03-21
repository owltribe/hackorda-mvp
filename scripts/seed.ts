import fs from "fs";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import { seed } from "drizzle-seed";
import * as schema from "../src/db/schema";
import { config } from "dotenv";

config(); // Загружаем переменные из .env

async function main() {
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    await client.connect();
    const db = drizzle(client);

    const userNames = ["Алиса", "Боб", "Чарли", "Давид", "Ева"];
    const cities = ["Астана", "Рим", "Нью-Йорк", "Москва", "Париж"];
    const quizTitles = ["Математика", "История", "Наука", "География"];
    const questionTexts = [
        "Чему равно 2 + 2?",
        "Кто открыл Америку?",
        "Столица Франции?",
        "Что такое H2O?"
    ];
    const answerOptions = [
        ["1", "2", "3", "4"],
        ["Колумб", "Магеллан", "Веспуччи", "Кук"],
        ["Берлин", "Мадрид", "Париж", "Рим"],
        ["Кислород", "Водород", "Вода", "Гелий"]
    ];
    const correctAnswers = ["4", "Колумб", "Париж", "Вода"];

    await seed(db, schema).refine((funcs) => ({
        usersTable: {
            count: 100,
            columns: {
                name: funcs.valuesFromArray({ values: userNames }),
                email: funcs.email(),
                age: funcs.int({ minValue: 18, maxValue: 60 }),
                city: funcs.valuesFromArray({ values: cities }),
                createdAt: funcs.date({ minDate: "2020-01-01", maxDate: "2025-03-22" })
            }
        },
        quizzesTable: {
            count: 10,
            columns: {
                title: funcs.valuesFromArray({ values: quizTitles }),
                description: funcs.loremIpsum({ sentencesCount: 1 }),
                totalQuestions: funcs.int({ minValue: 5, maxValue: 20 }),
                createdAt: funcs.date({ minDate: "2020-01-01", maxDate: "2025-03-22" })
            }
        },
        questionsTable: {
            count: 50,
            columns: {
                quizId: funcs.int({ minValue: 1, maxValue: 10 }),
                questionText: funcs.valuesFromArray({ values: questionTexts }),
                options: funcs.valuesFromArray({ values: answerOptions.flat() }),
                correctAnswer: funcs.valuesFromArray({ values: correctAnswers })
            }
        },
        quizAttemptsTable: {
            count: 200,
            columns: {
                userId: funcs.int({ minValue: 1, maxValue: 100 }),
                quizId: funcs.int({ minValue: 1, maxValue: 10 }),
                score: funcs.int({ minValue: 0, maxValue: 100 }),
                takenAt: funcs.date({ minDate: "2020-01-01", maxDate: "2025-03-22" })
            }
        },
        quizAnswersTable: {
            count: 500,
            columns: {
                attemptId: funcs.int({ minValue: 1, maxValue: 200 }),
                questionId: funcs.int({ minValue: 1, maxValue: 50 }),
                selectedAnswer: funcs.valuesFromArray({ values: correctAnswers }),
                isCorrect: funcs.boolean()
            }
        }
    }));

    await client.end(); // Закрываем соединение с БД
}

main().catch(console.error);
