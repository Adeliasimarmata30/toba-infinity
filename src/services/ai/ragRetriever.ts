import fs from 'fs';
import path from 'path';

export interface RAGDocument {
  id: string;
  source: string;
  title: string;
  content: string;
}

export class RAGRetriever {
  private dataDir = path.join(process.cwd(), 'src', 'data');

  private readJson(filename: string): any[] {
    try {
      const filePath = path.join(this.dataDir, filename);
      if (!fs.existsSync(filePath)) {
        console.warn(`[RAG] File not found: ${filePath}`);
        return [];
      }
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw);
    } catch (error) {
      console.error(`[RAG] Error reading dataset ${filename}:`, error);
      return [];
    }
  }

  /**
   * Retrieves all knowledge from JSON files and compiles it into searchable RAG documents.
   */
  private getAllDocuments(): RAGDocument[] {
    const documents: RAGDocument[] = [];

    // 1. Destinations
    const destinations = this.readJson('destinations.json');
    destinations.forEach((d: any) => {
      documents.push({
        id: d.id,
        source: 'destinations.json',
        title: d.name,
        content: `[DESTINASI: ${d.name}]\nKabupaten: ${d.district}\nKategori: ${d.category}\nDeskripsi: ${d.description}\nJam Buka: ${d.openingHours}\nHarga Tiket: Rp ${d.ticketPrice}\nFasilitas: ${(d.facilities || []).join(', ')}`,
      });
    });

    // 2. Hotels
    const hotels = this.readJson('hotels.json');
    hotels.forEach((h: any) => {
      documents.push({
        id: h.id,
        source: 'hotels.json',
        title: h.name,
        content: `[AKOMODASI: ${h.name}]\nKabupaten: ${h.district}\nKisaran Harga: ${h.priceRange}\nDeskripsi: ${h.description}\nFasilitas: ${(h.facilities || []).join(', ')}`,
      });
    });

    // 3. Culinary
    const culinary = this.readJson('culinary.json');
    culinary.forEach((c: any) => {
      documents.push({
        id: c.id,
        source: 'culinary.json',
        title: c.name,
        content: `[KULINER TOBA: ${c.name}]\nDeskripsi: ${c.description}\nSejarah: ${c.history}\nBahan: ${(c.ingredients || []).join(', ')}\nCara Membuat: ${(c.preparation || []).join('. ')}`,
      });
    });

    // 4. Cultures
    const cultures = this.readJson('cultures.json');
    cultures.forEach((c: any) => {
      documents.push({
        id: c.id,
        source: 'cultures.json',
        title: c.title,
        content: `[BUDAYA BATAK: ${c.title}]\nDeskripsi: ${c.description}\nKonten Detail: ${c.detailedContent}`,
      });
    });

    // 5. History
    const history = this.readJson('history.json');
    history.forEach((h: any) => {
      documents.push({
        id: h.id,
        source: 'history.json',
        title: h.title,
        content: `[SEJARAH TOBA: ${h.title}]\nDeskripsi: ${h.description}`,
      });
    });

    // 6. Festival
    const festival = this.readJson('festival.json');
    festival.forEach((f: any) => {
      documents.push({
        id: f.id,
        source: 'festival.json',
        title: f.name,
        content: `[FESTIVAL & ACARA: ${f.name}]\nDeskripsi: ${f.description}\nWaktu Pelaksanaan: ${f.date}`,
      });
    });

    return documents;
  }

  /**
   * Performs a simple keyword matching query over the document database.
   * Ready for replacement with embedding-based Vector Search in the future.
   */
  public retrieveContext(query: string, limit = 3): { context: string; found: boolean } {
    const queryLower = query.toLowerCase();
    const documents = this.getAllDocuments();
    const matches: { doc: RAGDocument; score: number }[] = [];

    for (const doc of documents) {
      let score = 0;
      const titleLower = doc.title.toLowerCase();
      const contentLower = doc.content.toLowerCase();

      // Check title match (high weight)
      if (queryLower.includes(titleLower)) {
        score += 10;
      }

      // Check word-by-word overlap
      const queryWords = queryLower.split(/\s+/).filter(w => w.length > 3);
      for (const word of queryWords) {
        if (titleLower.includes(word)) {
          score += 3;
        }
        if (contentLower.includes(word)) {
          score += 1;
        }
      }

      if (score > 0) {
        matches.push({ doc, score });
      }
    }

    if (matches.length === 0) {
      return {
        context: 'Tidak ada informasi spesifik dari basis data internal Toba Caldera untuk pencarian ini. Gunakan pengetahuan umum geopark.',
        found: false,
      };
    }

    // Sort by score descending and select top documents
    const topMatches = matches
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(m => m.doc.content);

    return {
      context: topMatches.join('\n\n---\n\n'),
      found: true,
    };
  }
}

export const ragRetriever = new RAGRetriever();
