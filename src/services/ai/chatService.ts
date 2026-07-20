import { aiRouter } from './aiRouter';
import { buildChatSystemPrompt } from './promptBuilder';
import { retrieverService } from './retriever/retrieverService';
import { memoryService } from './memory/memoryService';
import { citationService, Citation } from './citation/citationService';
import { AIChatMessage } from './types';

export class ChatService {
  async handleChat(
    message: string,
    history: any[] = [],
    userId: string = 'anonymous'
  ): Promise<{
    text: string;
    answer: string;
    sources: Citation[];
    confidence: number;
    contextRetrieved: boolean;
  }> {
    if (!message) {
      throw new Error('Message is required');
    }

    // 1. Update/Extract conversational memory context
    const conversationContext = memoryService.extractContextFromMessage(userId, message);

    // 2. Retrieve top matching grounded documents
    const ragResult = retrieverService.retrieve(message, 5);

    // Format conversational memory context text to guide the AI model
    let memoryStr = '';
    if (Object.keys(conversationContext).length > 1) {
      memoryStr = `- Preferensi Kabupaten: ${conversationContext.district || 'Belum dipilih'}\n` +
                  `- Estimasi Anggaran: ${conversationContext.budget || 'Belum diatur'}\n` +
                  `- Durasi Perjalanan: ${conversationContext.duration ? `${conversationContext.duration} Hari` : 'Belum diatur'}\n` +
                  `- Pilihan Kendaraan: ${conversationContext.transportation || 'Belum dipilih'}\n` +
                  `- Minat Kuliner: ${conversationContext.culinary || 'Belum dicatat'}\n` +
                  `- Minat Hotel: ${conversationContext.hotel || 'Belum dicatat'}`;
    }

    // 3. Build system prompt including internal DB context and user memory state
    const systemPrompt = buildChatSystemPrompt(ragResult.contextString, memoryStr);

    // 4. Map chat history
    const mappedHistory: AIChatMessage[] = history.slice(-8).map((h: any) => ({
      role: h.sender === 'user' ? 'user' : 'model',
      text: h.message || h.text || '',
    }));

    // 5. Query models using AIRouter
    let answerText = await aiRouter.route({
      systemPrompt,
      prompt: message,
      history: mappedHistory,
      temperature: 0.6,
    });

    // 6. Build citations & confidence score
    const responsePayload = citationService.buildResponse(
      answerText,
      ragResult.documents,
      ragResult.confidenceScore
    );

    // Append formatted citation footer directly to the returned text property
    // so that the existing Chat UI displays it gracefully out-of-the-box!
    const textWithCitations = citationService.appendCitationFooter(
      responsePayload.answer,
      responsePayload.sources,
      responsePayload.confidence
    );

    return {
      text: textWithCitations,
      answer: responsePayload.answer,
      sources: responsePayload.sources,
      confidence: responsePayload.confidence,
      contextRetrieved: ragResult.documents.length > 0,
    };
  }
}

export const chatService = new ChatService();
