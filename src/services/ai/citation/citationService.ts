import { RetrievedDocument } from '../retriever/retrieverService';

export interface Citation {
  title: string;
  category: string;
  filename: string;
}

export interface ChatBotRAGResponse {
  answer: string;
  sources: Citation[];
  confidence: number;
}

export class CitationService {
  /**
   * Generates a structural object that separates answer, sources, and confidence score.
   */
  public buildResponse(rawAnswer: string, retrievedDocs: RetrievedDocument[], confidenceScore: number): ChatBotRAGResponse {
    const sources: Citation[] = retrievedDocs.map((doc) => ({
      title: doc.title,
      category: doc.category,
      filename: doc.filename
    }));

    return {
      answer: rawAnswer,
      sources,
      confidence: confidenceScore
    };
  }

  /**
   * Formats the citation information nicely to be appended to a markdown text string.
   */
  public appendCitationFooter(answer: string, sources: Citation[], confidence: number): string {
    if (sources.length === 0) {
      return `${answer}\n\n---\n*💡 **Confidence**: ${confidence}% (Informasi berbasis pengetahuan umum model AI)*`;
    }

    const citationLines = sources.map(s => `✔ \`${s.filename}\` (${s.category} - ${s.title})`).join('\n');
    return `${answer}\n\n---\n\n### 📚 Sumber Referensi & Akurasi\n**Akurasi Pencocokan (Confidence)**: \`${confidence}%\`\n${citationLines}`;
  }
}

export const citationService = new CitationService();
