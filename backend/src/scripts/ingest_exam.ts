import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
const pdfParse = require('pdf-parse');

dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY!;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !GEMINI_API_KEY) {
  console.error("Missing required environment variables.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Use Gemini 2.5 Pro for complex extraction
const proModel = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

const EXAM_PERIOD = "October 2025"; // Change this before running!

const INSTRUCTION_PROMPT = `
You are an expert data extractor. I am providing you with the text extracted from two PDFs:
1) An ITPEC/PhilNITS multiple-choice examination (Questions).
2) The corresponding answer key (Answers).

Your job is to read the text, match the questions to their correct answers, and extract all the multiple-choice questions into a JSON array.

Please follow this strict JSON schema for EACH question:
{
  "id": "A unique string ID, e.g., 'FE-OCT2025-01'",
  "text": "The full text of the question. Include any code snippets or text tables here as well.",
  "options": {
    "A": "First option text",
    "B": "Second option text",
    "C": "Third option text",
    "D": "Fourth option text"
  },
  "correct_answer": "A, B, C, or D (MUST come from the Answers text provided)",
  "explanation": "A brief explanation of why the correct answer is correct based on your knowledge.",
  "category": "Must be one of: 'Basic Theory of Information', 'Computer Architecture', 'Operating Systems', 'Data Structures & Algorithms', 'Databases', 'Networking & Communication', 'Information Security', 'Software Engineering & Development'. Pick the most relevant one.",
  "difficulty": "Assign 'easy', 'medium', or 'hard'",
  "exam_period": "${EXAM_PERIOD}"
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

    console.log(`Sending to Gemini 2.5 Pro for structured extraction... this may take a minute.`);
    
    // Combining the prompt, questions, and answers into one payload
    // Note: If the text is extremely large, it may hit token limits, but for standard exams it should be fine.
    const promptPayload = [
      INSTRUCTION_PROMPT,
      questionsText.substring(0, 35000), // Safety substring
      `\n\n--- ANSWERS TEXT ---\n`,
      answersText.substring(0, 10000)
    ];

    const result = await proModel.generateContent(promptPayload);
    
    let jsonString = result.response.text().trim();
    // Clean up potential markdown formatting from Gemini
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.replace(/^```json\n/, '').replace(/\n```$/, '');
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    const questionsArray = JSON.parse(jsonString);

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
