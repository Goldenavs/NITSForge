// backend/src/routes/ai.ts
import { Router, Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
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

// Rate limiter for quiz generation (1 request per 2 hours) - TEMPORARILY DISABLED FOR TESTING
const quizGenerationLimiter = rateLimit({
    windowMs: 2 * 60 * 60 * 1000, // 2 hours
    max: 1000, // limit each IP to 1 request per windowMs (Set to 1000 for testing)
    message: { error: "You have reached the maximum AI Quiz generations. Please try again in a few hours." },
    standardHeaders: true,
    legacyHeaders: false,
});

// POST /api/ai/generate-quiz
router.post('/generate-quiz', requireAuth, quizGenerationLimiter, async (req: Request, res: Response) => {
    try {
        const { topics, difficulty, count } = req.body;
        const numQuestions = count || 10;
        const diff = difficulty || 'medium';
        const topicString = topics && topics.length > 0 ? topics.join(', ') : 'general IT concepts';

        const prompt = `
          You are an expert IT certification examiner (e.g., CompTIA, Cisco).
          Generate exactly ${numQuestions} multiple-choice questions about the following topics: ${topicString}.
          The difficulty level should be strictly: ${diff}.
          
          Respond ONLY with a raw JSON array of objects. Do not include markdown formatting like \`\`\`json.
          Each object must follow this exact schema:
          {
            "id": "<generate a random uuid>",
            "text": "<the question text>",
            "options": {
              "A": "<option A>",
              "B": "<option B>",
              "C": "<option C>",
              "D": "<option D>"
            },
            "correct_answer": "<either 'A', 'B', 'C', or 'D'>",
            "explanation": "<brief explanation of why the answer is correct>",
            "category": "<the specific sub-topic this question belongs to>",
            "difficulty": "${diff}",
            "source": "Gemini 2.5 Flash"
          }
        `;

        const result = await flashModel.generateContent(prompt);
        const responseText = result.response.text();
        
        let questions = [];
        try {
            // Remove markdown formatting if Gemini includes it despite instructions
            const cleanedText = responseText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();
            questions = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error("Failed to parse Gemini JSON output:", responseText);
            return res.status(500).json({ error: "AI produced invalid format. Please try again." });
        }

        res.json({ questions });
    } catch (error) {
        console.error("AI Generate Quiz Error:", error);
        res.status(500).json({ error: "Failed to synthesize questions." });
    }
});

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
// POST /api/ai/debrief
router.post('/debrief', requireAuth, async (req: Request, res: Response) => {
    try {
        const { score, total, questions, selectedAnswers } = req.body;

        if (!questions || !selectedAnswers) {
            return res.status(400).json({ error: "Missing required quiz data." });
        }

        // Create a summary of performance
        const correctAnswers = questions.filter((q: any) => selectedAnswers[q.id] === q.correct_answer);
        const incorrectAnswers = questions.filter((q: any) => selectedAnswers[q.id] !== q.correct_answer);

        const prompt = `
          The user just completed a quiz.
          Score: ${score} out of ${total}.
          
          Here are some of the questions they got WRONG:
          ${incorrectAnswers.slice(0, 3).map((q: any) => `- Topic: ${q.category}. Question: ${q.text.substring(0, 50)}...`).join('\n')}
          
          Please provide a brief, encouraging 2-3 sentence debrief. Highlight what they did well and point out one specific area (topic) they should review based on their mistakes. Do not be overly verbose.
        `;

        const result = await flashModel.generateContent(prompt);
        const responseText = result.response.text();

        res.json({ debrief: responseText });
    } catch (error) {
        console.error("AI Debrief Error:", error);
        res.status(500).json({ error: "Failed to generate debrief from Forge." });
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