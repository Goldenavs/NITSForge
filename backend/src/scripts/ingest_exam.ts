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

const INSTRUCTION_PROMPT = `
You are an expert data extractor. I am providing you with the text extracted from two PDFs:
1) An ITPEC/PhilNITS multiple-choice examination (Questions).
2) The corresponding answer key (Answers).

Your job is to read the text, match the questions to their correct answers, and extract all the multiple-choice questions into a JSON array.

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

    console.log(`Sending to Gemini 2.5 Flash for structured extraction... this may take a minute.`);

    // Combining the prompt, questions, and answers into one payload
    // Note: If the text is extremely large, it may hit token limits, but for standard exams it should be fine.
    const promptPayload = [
      INSTRUCTION_PROMPT,
      questionsText.substring(0, 35000), // Safety substring
      `\n\n--- ANSWERS TEXT ---\n`,
      answersText.substring(0, 10000)
    ];
    let result: any;
    let retries = 3;
    while (retries > 0) {
      try {
        result = await proModel.generateContent(promptPayload);
        break;
      } catch (err: any) {
        console.error(`Gemini API error (retries left: ${retries - 1}):`, err.message);
        retries--;
        if (retries === 0) throw err;
        console.log("Waiting 5 seconds before retrying...");
        await new Promise(res => setTimeout(res, 5000)); // wait 5s before retrying
      }
    }

    let jsonString = result.response.text().trim();
    // Clean up potential markdown formatting from Gemini
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    let parsedData;
    try {
      parsedData = JSON.parse(jsonString);
    } catch (e) {
      fs.writeFileSync("failed_parse.json", jsonString);
      console.error("JSON parse failed. Raw output written to failed_parse.json", e);
      return;
    }

    const questionsArray = parsedData.map((q: any) => ({
      ...q,
      correct_answer: q.correct_answer?.toUpperCase().trim()
    }));

    console.log(`Extracted ${questionsArray.length} questions. Inserting into Supabase...`);

    const { data, error } = await supabase
      .from('questions')
      .insert(questionsArray);

    if (error) {
      console.error('Error inserting into Supabase:', error);
    } else {
      console.log('Successfully inserted questions into Supabase!');
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
