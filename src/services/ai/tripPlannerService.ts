import fs from 'fs';
import path from 'path';
import { aiRouter } from './aiRouter';
import { buildTripPlannerPrompt } from './promptBuilder';

export class TripPlannerService {
  private dataDir = path.join(process.cwd(), 'src', 'data');

  private readJson(filename: string): any[] {
    try {
      const filePath = path.join(this.dataDir, filename);
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw);
    } catch (error) {
      console.error(`[TripPlannerService] Error reading ${filename}:`, error);
      return [];
    }
  }

  /**
   * Cleans potential markdown blocks and parses JSON safely.
   */
  private cleanAndParseJSON(rawText: string): any {
    let cleaned = rawText.trim();

    // Strip markdown code block wrappers
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.substring(7);
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.substring(3);
    }

    if (cleaned.endsWith('```')) {
      cleaned = cleaned.substring(0, cleaned.length - 3);
    }

    cleaned = cleaned.trim();
    return JSON.parse(cleaned);
  }

  /**
   * Generates a programmatic robust fallback itinerary if JSON parsing fails.
   */
  private generateBackupItinerary(duration: number, districts: string[], transportation: string, destinations: any[]) {
    console.log('[TripPlannerService] Generating structural backup itinerary...');
    const simulatedItinerary = Array.from({ length: duration }, (_, i) => {
      const dayNum = i + 1;
      const matchingDests = destinations.filter((d: any) => districts.length === 0 || districts.includes(d.district));
      const d1 = matchingDests[i % matchingDests.length] || destinations[0];
      const d2 = matchingDests[(i + 1) % matchingDests.length] || destinations[1];

      return {
        day: dayNum,
        activities: [
          {
            time: '08:00 - 10:00',
            title: `Keberangkatan menuju ${d1.name}`,
            description: `Menikmati perjalanan pagi yang sejuk menggunakan ${transportation} melewati panorama perbukitan Danau Toba.`,
            location: d1.name,
            cost: 0,
          },
          {
            time: '10:00 - 13:00',
            title: `Eksplorasi di ${d1.name}`,
            description: d1.description,
            location: d1.name,
            cost: d1.ticketPrice || 0,
          },
          {
            time: '13:00 - 14:30',
            title: `Makan Siang & Kuliner Lokal`,
            description: `Menikmati kuliner lezat khas ${d1.district} seperti Mie Gomak yang hangat di warung terdekat.`,
            location: `Restoran di ${d1.district}`,
            cost: 45000,
          },
          {
            time: '15:00 - 18:00',
            title: `Kunjungan Sore ke ${d2.name}`,
            description: d2.description,
            location: d2.name,
            cost: d2.ticketPrice || 0,
          },
        ],
      };
    });

    return {
      days: simulatedItinerary,
      tips: [
        'Pastikan kendaraan Anda dalam kondisi prima karena rute caldera Toba memiliki banyak tanjakan terjal.',
        'Bawalah jaket hangat, suhu di daerah perbukitan seperti Sipinsur atau Tele bisa turun drastis di malam hari.',
        'Selalu sedia uang tunai pecahan kecil karena beberapa lokasi tiket wisata pedesaan belum mendukung pembayaran digital.',
      ],
    };
  }

  async planTrip(params: {
    duration: number;
    budget: string;
    transportation: string;
    interests?: string[];
    districts?: string[];
  }) {
    const { duration, budget, transportation, interests = [], districts = [] } = params;
    const destinations = this.readJson('destinations.json');

    const availableDestsText = destinations
      .map((d: any) => `- ${d.name} (${d.district}, Tiket: Rp ${d.ticketPrice}, Kategori: ${d.category})`)
      .join('\n');

    const prompt = buildTripPlannerPrompt({
      duration,
      budget,
      transportation,
      interests,
      districts,
      availableDestinations: availableDestsText,
    });

    const maxAttempts = 3; // 1 initial + 2 retries
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`[TripPlannerService] Planning trip... Attempt ${attempt} of ${maxAttempts}`);
        const rawResponse = await aiRouter.route({
          prompt,
          temperature: 0.5,
          responseMimeType: 'application/json',
        });

        // Try cleaning and parsing the response
        const parsed = this.cleanAndParseJSON(rawResponse);
        
        // Basic schema validation
        if (parsed && Array.isArray(parsed.days) && Array.isArray(parsed.tips)) {
          console.log(`[TripPlannerService] Successfully generated and parsed trip itinerary on attempt ${attempt}.`);
          return parsed;
        }

        throw new Error('Parsed object missing required "days" or "tips" array fields');
      } catch (error: any) {
        console.warn(`[TripPlannerService] Attempt ${attempt} failed: ${error.message}`);
        if (attempt === maxAttempts) {
          console.error('[TripPlannerService] 🚨 Max trip planner attempts reached. Falling back to structured programmatic backup.');
          return this.generateBackupItinerary(duration, districts, transportation, destinations);
        }
      }
    }

    return this.generateBackupItinerary(duration, districts, transportation, destinations);
  }
}

export const tripPlannerService = new TripPlannerService();
