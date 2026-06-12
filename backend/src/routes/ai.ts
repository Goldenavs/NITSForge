// backend/src/routes/ai.ts
import { Router, Request, Response, NextFunction } from 'express';
import { flashModel } from '../services/gemini';
import { createClient } from '@supabase/supabase-js';

const router = Router();

const supabase = createClient(
    process.env.SUPABASE_URL || '', 
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

// Auth Middleware to verify Supabase JWT
const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: "Unauthorized. Missing or invalid token format." });
    }
    
    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
        return res.status(401).json({ error: "Unauthorized. Invalid or expired token." });
    }
    
    next();
};

// POST /api/ai/explain
router.post('/explain', requireAuth, async (req: Request, res: Response) => {
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
// POST /api/ai/chat (Streaming)
router.post('/chat', requireAuth, async (req: Request, res: Response) => {
    try {
        const { messages, context } = req.body;
        
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ error: "Missing or invalid messages array." });
        }

        let history = messages.slice(0, -1).map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
        }));

        // Gemini API strictly requires history to start with a 'user' role
        while (history.length > 0 && history[0].role !== 'user') {
            history.shift();
        }

        const lastMessage = messages[messages.length - 1]?.text;
        
        let systemContext = "";
        if (context && context.questionText) {
            systemContext = `\n\n[SYSTEM CONTEXT - The user is currently looking at this quiz question]:\nQuestion: ${context.questionText}\nOptions: ${JSON.stringify(context.options)}\nUse this context ONLY if relevant to their prompt.`;
        }

        const chatSession = flashModel.startChat({ history });

        // Set headers for streaming plain text
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.setHeader('Transfer-Encoding', 'chunked');

        const resultStream = await chatSession.sendMessageStream(lastMessage + systemContext);

        for await (const chunk of resultStream.stream) {
            const chunkText = chunk.text();
            res.write(chunkText);
        }
        res.end();

    } catch (error) {
        console.error("AI Chat Error:", error);
        if (!res.headersSent) {
            res.status(500).json({ error: "Failed to generate chat response." });
        } else {
            res.end("\n[Error: Connection dropped]");
        }
    }
});

export default router;