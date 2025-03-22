import { seed } from "drizzle-seed";
import * as schema from "./schema";
import { db } from "./index";

async function main() {
    console.log("Начало заполнения базы данных случайными данными...");

    await seed(db, schema, {
        seed: 12345
    }).refine((funcs) => ({
        usersTable: {
            count: 20,
            columns: {
                name: funcs.fullName(),
                email: funcs.email(),
                age: funcs.int({ minValue: 18, maxValue: 70 }),
                city: funcs.city(),
                createdAt: funcs.date({ minDate: "2023-01-01", maxDate: "2025-03-22" })
            },
            with: {
                quizAttemptsTable: [
                    { weight: 1, count: [2, 3, 4, 5] }
                ]
            }
        },
        quizzesTable: {
            count: 5,
            columns: {
                title: funcs.string(),
                description: funcs.loremIpsum(),
                totalQuestions: funcs.int({ minValue: 3, maxValue: 10 }),
                createdAt: funcs.date({ minDate: "2023-01-01", maxDate: "2025-03-22" })
            },
            with: {
                questionsTable: [
                    { weight: 1, count: [3, 4, 5, 6, 7, 8, 9, 10] }
                ]
            }
        },
        questionsTable: {
            columns: {
                questionText: funcs.loremIpsum(),
                options: funcs.json(),
                correctAnswer: funcs.string()
            }
        },
        quizAttemptsTable: {
            columns: {
                score: funcs.int({ minValue: 0, maxValue: 10 }),
                takenAt: funcs.date({ minDate: "2023-01-01", maxDate: "2025-03-22" })
            },
            with: {
                quizAnswersTable: [
                    { weight: 1, count: [3, 4, 5, 6, 7, 8, 9, 10] }
                ]
            }
        },
        quizAnswersTable: {
            columns: {
                selectedAnswer: funcs.string(),
                isCorrect: funcs.boolean()
            }
        }
    }));

    console.log("Заполнение базы данных завершено!");
}

main().catch(err => {
    console.error("Ошибка заполнения базы данных:", err);
    process.exit(1);
});

