// backend/src/routes/ai.ts
import { Router, Request, Response } from 'express';
import { flashModel } from '../services/gemini';

const router = Router();

// POST /api/ai/explain
router.post('/explain', async (req: Request, res: Response) => {
    try {
        const { questionText, options, correctAnswer, userAnswer } = req.body;

        if (!questionText || !options || !correctAnswer) {
            return res.status(400).json({ error: "Missing required question context." });
        }

        const prompt = `
      Question: ${questionText}
      Options: ${JSON.stringify(options)}
      Correct Answer: Option ${correctAnswer}
      User Selected: Option ${userAnswer || 'None (Unanswered)'}

      Please provide a brief, highly structured explanation of WHY Option ${correctAnswer} is the correct answer. 
      If the user selected a wrong answer, briefly point out the misconception.
      Use markdown formatting. Limit to 3 short paragraphs.
    `;

        const result = await flashModel.generateContent(prompt);
        const responseText = result.response.text();

        res.json({ explanation: responseText });
    } catch (error) {
        console.error("AI Explain Error:", error);
        res.status(500).json({ error: "Failed to generate explanation from Forge." });
    }
});

export default router;