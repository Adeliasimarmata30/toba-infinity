import { getAllKnowledgeDocuments, KnowledgeDocument } from '../utils/fileHelper';

export interface RetrievedDocument {
  id: string;
  category: string;
  filename: string;
  title: string;
  content: string;
  score: number;
}

export interface RAGResult {
  documents: RetrievedDocument[];
  contextString: string;
  confidenceScore: number;
}

export class RetrieverService {
  /**
   * Cleans text to facilitate comparison
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?"']/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 2);
  }

  /**
   * Simple TF-IDF or keyword overlap with position/weight scoring
   */
  public retrieve(query: string, limit = 5): RAGResult {
    const documents = getAllKnowledgeDocuments();
    const queryLower = query.toLowerCase();
    const queryTokens = this.tokenize(query);

    if (queryTokens.length === 0 || documents.length === 0) {
      return {
        documents: [],
        contextString: 'Tidak ditemukan dokumen internal yang relevan.',
        confidenceScore: 0
      };
    }

    const results: RetrievedDocument[] = [];

    for (const doc of documents) {
      let score = 0;
      const titleLower = doc.title.toLowerCase();
      const contentLower = doc.content.toLowerCase();

      // Rule 1: Exact title match or direct inclusion (High reward)
      if (queryLower.includes(titleLower) || titleLower.includes(queryLower)) {
        score += 50;
      }

      // Rule 2: Token-based overlaps
      const titleTokens = this.tokenize(doc.title);
      const contentTokens = this.tokenize(doc.content);

      // Count title token overlaps
      for (const token of queryTokens) {
        if (titleTokens.includes(token)) {
          score += 15;
        }
        if (contentTokens.includes(token)) {
          // simple term frequency weight
          const count = contentLower.split(token).length - 1;
          score += Math.min(count, 5) * 3; // cap at 5 occurrences
        }
      }

      // Rule 3: Category-based query intent matching (Semantic Boost)
      const categoryKeywords: Record<string, string[]> = {
        history: ['sejarah', 'history', 'letusan', 'pahlawan', 'legenda', 'asal-usul', 'purba', 'era', 'dulu', 'masa lalu'],
        hotels: ['hotel', 'penginapan', 'resort', 'homestay', 'villa', 'menginap', 'stay', 'accommodation'],
        culinary: ['makan', 'kuliner', 'resep', 'masak', 'sajian', 'hidangan', 'khas', 'culinary', 'food', 'warung', 'restoran'],
        culture: ['budaya', 'adat', 'suku', 'marga', 'tradisi', 'upacara', 'bahasa', 'aksara', 'ulos'],
        festival: ['festival', 'acara', 'pesta', 'musik', 'konser', 'lomba', 'event'],
        emergency: ['darurat', 'kontak', 'telepon', 'polisi', 'medis', 'rumah sakit', 'bantuan', 'keamanan', 'nomor', 'rsud', 'ambulans']
      };

      for (const [cat, keywords] of Object.entries(categoryKeywords)) {
        if (doc.category === cat) {
          const hasKeyword = keywords.some(keyword => queryLower.includes(keyword));
          if (hasKeyword) {
            score += 35; // Semantic category boost
          }
        }
      }

      // Filter documents with at least one overlap
      if (score > 0) {
        results.push({
          id: doc.id,
          category: doc.category,
          filename: doc.filename,
          title: doc.title,
          content: doc.content,
          score
        });
      }
    }

    // Sort descending by match score
    const sorted = results.sort((a, b) => b.score - a.score).slice(0, limit);

    // Calculate dynamic confidence score (bounded between 35% and 99%)
    let confidenceScore = 0;
    if (sorted.length > 0) {
      const topScore = sorted[0].score;
      // Map score to a percentage
      confidenceScore = Math.min(Math.round(45 + (topScore / 100) * 55), 98);
    } else {
      confidenceScore = 0;
    }

    // Handle case where confidence is 0
    if (sorted.length === 0) {
      return {
        documents: [],
        contextString: 'Tidak ada informasi spesifik dari basis data internal Toba Caldera untuk pencarian ini.',
        confidenceScore: 15 // Default model confidence without grounding docs
      };
    }

    const contextString = sorted
      .map((d) => `[Situs/Informasi: ${d.title} (${d.category})]\n${d.content}`)
      .join('\n\n---\n\n');

    return {
      documents: sorted,
      contextString,
      confidenceScore
    };
  }
}

export const retrieverService = new RetrieverService();
