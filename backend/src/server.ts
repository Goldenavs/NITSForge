// backend/src/server.ts
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import aiRoutes from './routes/ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows your React frontend to communicate with this backend
app.use(express.json()); // Parses incoming JSON payloads

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