import { AIProvider, AIRequest } from '../types';

export class DeepSeekProvider implements AIProvider {
  name = 'DeepSeek';

  async generate(request: AIRequest): Promise<string> {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      throw new Error('DEEPSEEK_API_KEY is not defined');
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
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages,
          temperature: request.temperature ?? 0.7,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`DeepSeek returned status ${response.status}`);
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;
      if (!text) {
        throw new Error('DeepSeek response contains no choice content');
      }

      return text;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('DeepSeek request timed out');
      }
      throw error;
    }
  }
}
