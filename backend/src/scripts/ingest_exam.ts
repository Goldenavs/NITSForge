import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
// @ts-ignore
import pdfParse from 'pdf-parse';

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY || !GEMINI_API_KEY) {
  console.error("Missing required environment variables.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Use Gemini 2.5 Flash for extraction to avoid rate limits / quota exceeded
const proModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  generationConfig: { responseMimeType: "application/json" }
});

const EXAM_PERIOD = "October 2025"; // Change this before running!

const getInstructionPrompt = (start: number, end: number) => `
You are an expert data extractor. I am providing you with the text extracted from two PDFs:
1) An ITPEC/PhilNITS multiple-choice examination (Questions).
2) The corresponding answer key (Answers).

Your job is to read the text, match the questions to their correct answers, and extract multiple-choice questions into a JSON array.

CRITICAL: Extract ONLY questions in the range Question ${start} to Question ${end} (inclusive). If a question is outside this range, ignore it. Do not include it in the JSON array.

Please follow this strict JSON schema for EACH question:
{
  "id": "A unique string ID, e.g., 'FE-OCT2025-01'",
  "text": "The full text of the question. CRITICAL: Use Markdown to preserve indentation, newlines, and structure for code blocks or multi-line questions. DO NOT put the A, B, C, D choices in this field! Only the main question text.",
  "options": {
    "A": "First option text (Must NOT contain 'A) ' or 'a) ' prefix)",
    "B": "Second option text",
    "C": "Third option text",
    "D": "Fourth option text"
  },
  "correct_answer": "A, B, C, or D (MUST come from the Answers text provided)",
  "explanation": "A brief explanation of why the correct answer is correct based on your knowledge.",
  "category": "Must be one of: 'Basic Theory of Information', 'Computer Architecture', 'Operating Systems', 'Data Structures & Algorithms', 'Databases', 'Networking & Communication', 'Information Security', 'Software Engineering & Development'. Pick the most relevant one.",
  "difficulty": "Assign 'easy', 'medium', or 'hard'",
  "exam_period": "${EXAM_PERIOD}",
  "source": "ITPEC",
  "tags": ["Array of 1 to 3 relevant string tags, chosen exactly from this list: 'hardware', 'software', 'networking', 'security', 'database', 'algorithm', 'data structure', 'management', 'strategy', 'math', 'logic', 'programming'"]
}

Return ONLY the raw JSON array. Do not include markdown blocks like \`\`\`json. Just the array.
If there are images that are critical to the question and cannot be represented in text, still extract the text but note in the explanation that an image was missing.

Below is the extracted text.

--- QUESTIONS TEXT ---
`;

async function ingestPDF(questionsPdfPath: string, answersPdfPath: string) {
  try {
    console.log(`Reading Questions PDF from ${questionsPdfPath}...`);
    const qBuffer = fs.readFileSync(questionsPdfPath);
    const qData = await pdfParse(qBuffer);
    const questionsText = qData.text;
    console.log(`Successfully extracted ${questionsText.length} characters from Questions PDF.`);

    console.log(`Reading Answers PDF from ${answersPdfPath}...`);
    const aBuffer = fs.readFileSync(answersPdfPath);
    const aData = await pdfParse(aBuffer);
    const answersText = aData.text;
    console.log(`Successfully extracted ${answersText.length} characters from Answers PDF.`);

    // Format the ID prefix programmatically
    const parts = EXAM_PERIOD.trim().split(/\s+/);
    const month = parts[0]?.substring(0, 3).toUpperCase() || 'EXAM';
    const year = parts[parts.length - 1] || 'YYYY';
    const prefix = `FE-${month}${year}`;

    // Define question ranges to extract in separate calls to avoid output token limits
    const ranges = [
      [1, 20],
      [21, 40],
      [41, 60],
      [61, 80],
      [81, 100]
    ];

    let allQuestions: any[] = [];

    for (const [startQ, endQ] of ranges) {
      console.log(`\n--- Extracting Questions ${startQ} to ${endQ} ---`);

      const instructionPrompt = getInstructionPrompt(startQ, endQ);
      const promptPayload = [
        instructionPrompt,
        questionsText,
        `\n\n--- ANSWERS TEXT ---\n`,
        answersText.substring(0, 10000)
      ];

      let parsedData: any[] = [];
      let retries = 3;
      let jsonString = "";

      while (retries > 0) {
        try {
          const result = await proModel.generateContent(promptPayload);
          jsonString = result.response.text().trim();

          // Clean up potential markdown formatting from Gemini
          if (jsonString.startsWith('```json')) {
            jsonString = jsonString.replace(/^```json\n/, '').replace(/\n```$/, '');
          } else if (jsonString.startsWith('```')) {
            jsonString = jsonString.replace(/^```\n/, '').replace(/\n```$/, '');
          }

          parsedData = JSON.parse(jsonString);
          if (!Array.isArray(parsedData)) {
            throw new Error("Gemini response is not a JSON array.");
          }
          break; // Succeeded
        } catch (err: any) {
          const isRateLimit = err.message?.includes("429") || err.message?.toLowerCase().includes("quota") || err.message?.toLowerCase().includes("rate limit");
          
          if (isRateLimit) {
            console.warn(`[Rate Limit Hit] Waiting 30 seconds for quota window to reset before retrying Q${startQ}-Q${endQ}...`);
            await new Promise(res => setTimeout(res, 30000));
            // Do not decrement retries on rate limit hit so we can try again
            continue;
          }

          if (jsonString) fs.writeFileSync(`failed_parse_${startQ}_${endQ}.json`, jsonString);
          console.error(`Gemini extraction/parse error for Q${startQ}-Q${endQ} (retries left: ${retries - 1}):`, err.message);
          retries--;
          if (retries === 0) throw err;
          console.log("Waiting 5 seconds before retrying...");
          await new Promise(res => setTimeout(res, 5000));
        }
      }

      console.log(`Successfully extracted ${parsedData.length} questions in this range.`);
      allQuestions = allQuestions.concat(parsedData);

      // Introduce a 5-second pause between batches to respect rate limits naturally
      if (endQ < 100) {
        console.log("Waiting 5 seconds before fetching the next range...");
        await new Promise(res => setTimeout(res, 5000));
      }
    }

    // Assign consistent programmatically generated IDs
    const finalQuestionsArray = allQuestions.map((q: any, index: number) => {
      const qNum = String(index + 1).padStart(2, '0');
      return {
        ...q,
        id: `${prefix}-${qNum}`,
        correct_answer: q.correct_answer?.toUpperCase().trim(),
        difficulty: q.difficulty?.toLowerCase().trim()
      };
    });

    console.log(`\nTotal questions extracted across all ranges: ${finalQuestionsArray.length}`);
    if (finalQuestionsArray.length === 0) {
      console.log("No questions were extracted. Aborting insertion.");
      return;
    }

    console.log(`Inserting into Supabase...`);
    const { data, error } = await supabase
      .from('questions')
      .insert(finalQuestionsArray);

    if (error) {
      console.error('Error inserting into Supabase:', error);
    } else {
      console.log('Successfully inserted all questions into Supabase!');
    }

  } catch (error) {
    console.error("An error occurred during ingestion:", error);
  }
}

// Example usage:
// Run this script via: npx ts-node src/scripts/ingest_exam.ts
const targetQuestionsPdf = path.join(__dirname, '../../questions.pdf');
const targetAnswersPdf = path.join(__dirname, '../../answers.pdf');

if (fs.existsSync(targetQuestionsPdf) && fs.existsSync(targetAnswersPdf)) {
  ingestPDF(targetQuestionsPdf, targetAnswersPdf);
} else {
  console.log(`Please place your PDFs at ${targetQuestionsPdf} and ${targetAnswersPdf} and run this script again.`);
}
