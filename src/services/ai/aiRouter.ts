import { AIRequest } from './types';
import { QwenProvider } from './providers/qwenProvider';
import { GeminiProvider } from './providers/geminiProvider';
import { GroqProvider } from './providers/groqProvider';
import { DeepSeekProvider } from './providers/deepseekProvider';

export class AIRouter {
  private providers = [
    new GeminiProvider(),
    new QwenProvider(),
    new GroqProvider(),
    new DeepSeekProvider(),
  ];

  async route(request: AIRequest): Promise<string> {
    console.log(`[AI Router] Initiating request routing for prompt: "${request.prompt.substring(0, 50)}..."`);
    
    for (const provider of this.providers) {
      try {
        console.log(`[AI Router] Trying provider: ${provider.name}...`);
        const response = await provider.generate(request);
        console.log(`[AI Router] ✅ Success with provider: ${provider.name}`);
        return response;
      } catch (error: any) {
        console.warn(`[AI Router] ❌ Failure with provider ${provider.name}: ${error.message}`);
        // Log the error and continue to the next provider (fallback)
      }
    }

    console.error('[AI Router] 🚨 All AI providers have failed to respond.');
    return 'Maaf, seluruh layanan AI sedang sibuk.\nSilakan coba beberapa saat lagi.';
  }
}

export const aiRouter = new AIRouter();
