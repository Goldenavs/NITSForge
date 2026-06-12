// backend/src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import aiRoutes from './routes/ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Restrict CORS to only allow the frontend URL (local and production)
const allowedOrigins = ['http://localhost:5173', process.env.FRONTEND_URL || ''];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use(express.json()); // Parses incoming JSON payloads

// Global Rate Limiting: max 30 requests per IP per minute
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

// NEW: Friendly Root Route Handler
app.get('/', (req, res) => {
    res.send(`
    <div style="font-family: sans-serif; text-align: center; padding: 40px;">
      <h1 style="color: #F97316;">🔥 NITSForge API Proxy</h1>
      <p style="color: #64748B;">The server is alive, but the endpoints are protected. Head over to the frontend app to start forging.</p>
    </div>
  `);
});

// Existing Health Check Route
app.get('/health', (req, res) => {
    res.json({ status: 'Forge API is online and firing on all cylinders.' });
});

// API Routes
app.use('/api/ai', aiRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`🔥 NITSForge Backend running on http://localhost:${PORT}`);
});