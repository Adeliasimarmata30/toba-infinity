export interface AIChatMessage {
  role: 'user' | 'model' | 'assistant';
  text: string;
}

export interface AIRequest {
  systemPrompt?: string;
  prompt: string;
  temperature?: number;
  responseMimeType?: string; // e.g. "application/json"
  history?: AIChatMessage[];
}

export interface AIProvider {
  name: string;
  generate(request: AIRequest): Promise<string>;
}
