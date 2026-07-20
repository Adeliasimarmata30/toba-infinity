/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { chatService } from './src/services/ai/chatService.js';
import { recommendationService } from './src/services/ai/recommendationService.js';
import { tripPlannerService } from './src/services/ai/tripPlannerService.js';

const app = express();
app.use(express.json());

// Enable CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  next();
});

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// 1. CHATBOT RAG INTERACTION
app.post('/api/chat', async (req: Request, res: Response) => {
  const { message, history = [] } = req.body;

  if (!message) {
    res.status(400).json({ error: 'Message is required' });
    return;
  }

  try {
    const result = await chatService.handleChat(message, history);
    res.json(result);
  } catch (error: any) {
    console.error('[API Error] Chat endpoint failed:', error);
    res.status(500).json({ error: 'Gagal menghubungi asisten AI.', details: error.message });
  }
});

// 2. TOURISM RECOMMENDATION ENGINE
app.post('/api/recommend', async (req: Request, res: Response) => {
  const { budget, interests = [], travelStyle, preferredDistrict, duration } = req.body;

  try {
    const result = await recommendationService.getRecommendations({
      budget,
      interests,
      travelStyle,
      preferredDistrict,
      duration: Number(duration || 1),
    });
    res.json(result);
  } catch (error: any) {
    console.error('[API Error] Recommend endpoint failed:', error);
    res.status(500).json({ error: 'Gagal memproses rekomendasi.', details: error.message });
  }
});

// 3. AI TRIP PLANNER (ITINERARY GENERATOR)
app.post('/api/plan-trip', async (req: Request, res: Response) => {
  const { duration, budget, transportation, interests = [], districts = [] } = req.body;

  try {
    const result = await tripPlannerService.planTrip({
      duration: Number(duration || 1),
      budget,
      transportation,
      interests,
      districts,
    });
    res.json(result);
  } catch (error: any) {
    console.error('[API Error] Plan-trip endpoint failed:', error);
    res.status(500).json({ error: 'Gagal membuat itinerary cerdas.', details: error.message });
  }
});

// -------------------------------------------------------------
// VITE DEV SERVER AND PRODUCTION SERVING MIDDLEWARE
// -------------------------------------------------------------
async function startServer() {
  const PORT = 3000;

  // Mount Vite development middleware in non-production environments
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production mode
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 TOBA INFINITY Server successfully listening at http://localhost:${PORT}`);
  });
}

startServer();
