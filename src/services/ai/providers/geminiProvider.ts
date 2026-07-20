import { GoogleGenAI } from '@google/genai';
import { AIProvider, AIRequest } from '../types';

export class GeminiProvider implements AIProvider {
  name = 'Gemini';

  async generate(request: AIRequest): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not defined');
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Map history to Gemini format: 'user' or 'model'
    const contents: any[] = [];

    if (request.history) {
      request.history.forEach((h) => {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        });
      });
    }

    contents.push({
      role: 'user',
      parts: [{ text: request.prompt }],
    });

    const config: any = {
      temperature: request.temperature ?? 0.7,
    };

    if (request.systemPrompt) {
      config.systemInstruction = request.systemPrompt;
    }

    if (request.responseMimeType) {
      config.responseMimeType = request.responseMimeType;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config,
      });

      clearTimeout(timeoutId);

      const text = response.text;
      if (!text) {
        throw new Error('Gemini response contains no text');
      }

      return text;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError' || error.message?.includes('aborted')) {
        throw new Error('Gemini request timed out');
      }
      throw error;
    }
  }
}
