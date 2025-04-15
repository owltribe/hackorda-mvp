import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import * as schema from "./schema";
import { db } from "./index";
import { eq } from 'drizzle-orm';

const CSV_FILE_PATH = process.env.CSV_FILE_PATH;

if (!CSV_FILE_PATH) {
  throw new Error("CSV_FILE_PATH is not defined in the environment variables");
}

// Path to the CSV file
const csvFilePath = path.join(__dirname, CSV_FILE_PATH);

// Structure for a CSV record
interface CsvRecord {
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswerRaw: string;
  moduleTitle: string;
}

// Helper function to extract the correct option key (e.g., "B) ==" -> "B")
function extractCorrectOptionKey(rawAnswer: string): string | null {
  // Match the pattern like "X) ..." at the start of the string
  const match = rawAnswer.trim().match(/^([A-Z])\)/);
  if (match && match[1]) {
    return match[1]; // Return the captured key (A, B, C, D, etc.)
  }
  console.warn(`Could not extract option key from raw answer: "${rawAnswer}". Skipping this format.`);
  return null; // Return null if format doesn't match
}

async function main() {
  console.log("Starting database seeding from CSV for modules and questions...");

  // Check if the CSV file exists
  if (!fs.existsSync(csvFilePath)) {
    console.error(`Error: CSV file not found at ${csvFilePath}`);
    process.exit(1);
  }

  // Read and parse the CSV file
  const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
  const records: CsvRecord[] = parse(fileContent, {
    columns: ['question', 'optionA', 'optionB', 'optionC', 'optionD', 'correctAnswerRaw', 'moduleTitle'],
    skip_empty_lines: true,
    from_line: 2, // Skip header
    relax_column_count: true, // Add this line to allow varying column counts
    trim: true // Add this to trim whitespace
  });

  // Map to store module data (avoid duplicates)
  // Key: moduleTitle, Value: { moduleId: number, questions: QuestionInsert[] }
  const modulesMap = new Map<string, { moduleId: number, questions: (typeof schema.questions.$inferInsert)[] }>();

  console.log(`Processing ${records.length} records from CSV...`);

  for (const record of records) {
    // Basic validation
    if (!record.question?.trim() || !record.moduleTitle?.trim() || !record.correctAnswerRaw?.trim()) {
      console.warn("Skipping row due to missing question, module title, or correct answer:", record);
      continue;
    }

    const moduleTitle = record.moduleTitle.trim();
    let moduleData = modulesMap.get(moduleTitle);

    // Create module if it doesn't exist in the map/DB
    if (!moduleData) {
      console.log(`Looking up or creating module: ${moduleTitle}`);
      // Check if module already exists in DB (optional, but good practice)
      const existingModule = await db.select({ id: schema.questionModules.id })
        .from(schema.questionModules)
        .where(eq(schema.questionModules.title, moduleTitle))
        .limit(1);

      let moduleId: number;
      if (existingModule.length > 0) { 
        moduleId = existingModule[0].id;
        console.log(`Module "${moduleTitle}" already exists with ID: ${moduleId}`);
      } else {
        const newModule = await db.insert(schema.questionModules)
          .values({
            title: moduleTitle,
            description: `Questions for module: ${moduleTitle}`,
          })
          .returning({ id: schema.questionModules.id });

        if (!newModule || newModule.length === 0) {
          console.error(`Failed to insert module: ${moduleTitle}`);
          continue; // Skip record if module insertion failed
        }
        moduleId = newModule[0].id;
        console.log(`Created module "${moduleTitle}" with ID: ${moduleId}`);
      }

      moduleData = { moduleId: moduleId, questions: [] };
      modulesMap.set(moduleTitle, moduleData);
    }

    // Prepare options JSON
    const optionsJson: { [key: string]: string } = {};
    if (record.optionA && record.optionA !== '-') optionsJson['A'] = record.optionA.replace(/^A\) /, '').trim();
    if (record.optionB && record.optionB !== '-') optionsJson['B'] = record.optionB.replace(/^B\) /, '').trim();
    if (record.optionC && record.optionC !== '-') optionsJson['C'] = record.optionC.replace(/^C\) /, '').trim();
    if (record.optionD && record.optionD !== '-') optionsJson['D'] = record.optionD.replace(/^D\) /, '').trim();

    // Extract the correct option key ('A', 'B', 'C', 'D')
    const correctKey = extractCorrectOptionKey(record.correctAnswerRaw);

    if (!correctKey) {
      console.warn(`Skipping question due to unparseable correct answer key: "${record.correctAnswerRaw}"`, record.question);
      continue; // Skip if we couldn't determine the correct key
    }

    // Ensure the extracted correct key actually exists in the options we parsed
    if (!(correctKey in optionsJson)) {
      console.warn(`Skipping question because correct key "${correctKey}" not found in parsed options:`, { question: record.question, options: optionsJson });
      continue;
    }

    // Prepare question data for insertion
    const questionInsert: typeof schema.questions.$inferInsert = {
      moduleId: moduleData.moduleId, // Use the correct FK name
      questionText: record.question.trim(),
      options: optionsJson,
      correctOptionKey: correctKey, // Store the extracted key
      // createdAt and updatedAt will use defaultNow()
    };

    moduleData.questions.push(questionInsert);
  }

  // Insert collected questions and update module counts
  console.log("Inserting questions and updating module counts...");
  let totalInsertedQuestions = 0;
  for (const [title, data] of modulesMap.entries()) {
    const questionCount = data.questions.length; // Get the count before potential insertion failure
    if (questionCount > 0) {
      try {
        // Insert questions first
        await db.insert(schema.questions).values(data.questions);
        console.log(`Inserted ${questionCount} questions for module "${title}".`);
        totalInsertedQuestions += questionCount;

        // Then update the module's totalQuestions count
        await db.update(schema.questionModules)
          .set({ totalQuestions: questionCount })
          .where(eq(schema.questionModules.id, data.moduleId));
        console.log(`Updated total questions count for module "${title}" to ${questionCount}.`);

      } catch (error) {
        console.error(`Error processing module "${title}":`, error);
        // Consider if you want to skip the count update if insertion fails
      }
    } else {
      console.log(`No valid questions found or processed for module "${title}".`);
      // Optionally update count to 0 even if no questions were inserted, if the module was created
      try {
        await db.update(schema.questionModules)
          .set({ totalQuestions: 0 })
          .where(eq(schema.questionModules.id, data.moduleId));
         console.log(`Set total questions count for module "${title}" to 0 as no questions were added.`);
      } catch (updateError) {
         console.error(`Error updating empty module "${title}" count:`, updateError);
      }
    }
  }

  console.log(`Database seeding from CSV completed! Inserted ${totalInsertedQuestions} questions across ${modulesMap.size} modules.`);
}

main().catch(err => {
  console.error("Database seeding error:", err);
  process.exit(1);
});