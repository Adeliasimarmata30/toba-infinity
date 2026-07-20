import { AIProvider, AIRequest } from '../types';

export class GroqProvider implements AIProvider {
  name = 'Groq';

  async generate(request: AIRequest): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error('GROQ_API_KEY is not defined');
    }

    const messages: { role: string; content: string }[] = [];

    if (request.systemPrompt) {
      messages.push({ role: 'system', content: request.systemPrompt });
    }

    if (request.history) {
      request.history.forEach((h) => {
        messages.push({
          role: h.role === 'model' || h.role === 'assistant' ? 'assistant' : 'user',
          content: h.text,
        });
      });
    }

    messages.push({ role: 'user', content: request.prompt });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages,
          temperature: request.temperature ?? 0.7,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Groq returned status ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) {
        throw new Error('Groq response contains no choice content');
      }

      return text;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Groq request timed out');
      }
      throw error;
    }
  }
}
