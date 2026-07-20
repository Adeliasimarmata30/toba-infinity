export interface ConversationContext {
  userId: string;
  budget?: string;
  duration?: number;
  district?: string;
  hotel?: string;
  culinary?: string;
  destinations?: string[];
  transportation?: string;
}

export class MemoryService {
  private memoryStore = new Map<string, ConversationContext>();

  public getContext(userId: string): ConversationContext {
    if (!this.memoryStore.has(userId)) {
      this.memoryStore.set(userId, {
        userId,
        destinations: []
      });
    }
    return this.memoryStore.get(userId)!;
  }

  public updateContext(userId: string, updates: Partial<ConversationContext>): ConversationContext {
    const current = this.getContext(userId);
    const updated = {
      ...current,
      ...updates,
      destinations: updates.destinations 
        ? Array.from(new Set([...(current.destinations || []), ...updates.destinations]))
        : current.destinations
    };
    this.memoryStore.set(userId, updated);
    return updated;
  }

  /**
   * Scans user text for contextual markers (Samosir, Rp 2 Juta, 3 Hari)
   * and saves them to user memory.
   */
  public extractContextFromMessage(userId: string, text: string): ConversationContext {
    const textLower = text.toLowerCase();
    const updates: Partial<ConversationContext> = {};

    // Extract district preferences
    if (textLower.includes('samosir')) updates.district = 'Samosir';
    else if (textLower.includes('toba') && !textLower.includes('danau toba')) updates.district = 'Toba';
    else if (textLower.includes('simalungun')) updates.district = 'Simalungun';
    else if (textLower.includes('humbahas') || textLower.includes('humbang')) updates.district = 'Humbang Hasundutan';
    else if (textLower.includes('tapanuli')) updates.district = 'Tapanuli Utara';

    // Extract duration (e.g., "3 hari", "5 days")
    const durationMatch = textLower.match(/(\d+)\s*hari/);
    if (durationMatch) {
      updates.duration = parseInt(durationMatch[1], 10);
    }

    // Extract budget (e.g., "2 juta", "Rp 2.000.000", "500 ribu")
    const budgetMatch = textLower.match(/(?:rp\s*)?(\d+(?:\.\d+)?)\s*(juta|ribu|ratus)/i);
    if (budgetMatch) {
      const num = parseFloat(budgetMatch[1]);
      const unit = budgetMatch[2].toLowerCase();
      let value = num;
      if (unit === 'juta') value *= 1000000;
      if (unit === 'ribu') value *= 1000;
      updates.budget = `Rp ${value.toLocaleString('id-ID')}`;
    } else if (textLower.includes('murah') || textLower.includes('low budget') || textLower.includes('backpacker')) {
      updates.budget = 'Ekonomis / Low Budget';
    } else if (textLower.includes('mewah') || textLower.includes('bintang 5') || textLower.includes('luxury')) {
      updates.budget = 'Premium / Luxury';
    }

    // Extract transportation modes
    if (textLower.includes('mobil') || textLower.includes('car')) updates.transportation = 'Mobil';
    else if (textLower.includes('motor') || textLower.includes('sepeda motor')) updates.transportation = 'Motor';
    else if (textLower.includes('kapal') || textLower.includes('boat')) updates.transportation = 'Kapal/Feri';

    // Extract culinary
    if (textLower.includes('mie gomak')) updates.culinary = 'Mie Gomak';
    else if (textLower.includes('arsik')) updates.culinary = 'Arsik Ikan Mas';
    else if (textLower.includes('naniura') || textLower.includes('na niura')) updates.culinary = 'Dengke Mas Na Niura';

    // Extract Hotels
    if (textLower.includes('marianna')) updates.hotel = 'Marianna Resort';
    else if (textLower.includes('labersa')) updates.hotel = 'Labersa Hotel';
    else if (textLower.includes('zoe')) updates.hotel = 'Zoe\'s Paradise';

    return this.updateContext(userId, updates);
  }

  public clearMemory(userId: string): void {
    this.memoryStore.delete(userId);
  }
}

export const memoryService = new MemoryService();
