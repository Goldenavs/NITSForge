// backend/src/services/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Ensure the API key exists
if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing from environment variables.");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Flash is fast and cheap: Best for Post-Session summaries, Explain This, Concept Cards
export const flashModel = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    systemInstruction: "You are Forge, an expert AI tutor for the PhilNITS FE exam. Keep explanations concise, accurate, and structured."
});

// Pro is smarter: Best for open-ended conversational chat and study plans
export const proModel = genAI.getGenerativeModel({
    model: "gemini-2.5-pro",
    systemInstruction: "You are Forge, a supportive and brilliant AI study companion for Filipino IT students taking the PhilNITS FE exam."
});