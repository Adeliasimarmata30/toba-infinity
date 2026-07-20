import fs from 'fs';
import path from 'path';
import { aiRouter } from './aiRouter';
import { buildRecommendationPrompt } from './promptBuilder';

export class RecommendationService {
  private dataDir = path.join(process.cwd(), 'src', 'data');

  private readJson(filename: string): any[] {
    try {
      const filePath = path.join(this.dataDir, filename);
      const raw = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(raw);
    } catch (error) {
      console.error(`[RecommendationService] Error reading ${filename}:`, error);
      return [];
    }
  }

  async getRecommendations(params: {
    budget: string;
    interests?: string[];
    travelStyle: string;
    preferredDistrict: string;
    duration: number;
  }) {
    const { budget, interests = [], travelStyle, preferredDistrict, duration } = params;

    const destinations = this.readJson('destinations.json');
    const hotels = this.readJson('hotels.json');
    const culinary = this.readJson('culinary.json');

    // Filter destinations
    let filteredDestinations = destinations.filter((d: any) => {
      const matchDistrict = preferredDistrict === 'Semua Kabupaten' || d.district === preferredDistrict;
      const matchInterest = interests.length === 0 || interests.some((interest: string) => d.category.toLowerCase() === interest.toLowerCase());
      return matchDistrict && matchInterest;
    }).slice(0, 4);

    if (filteredDestinations.length === 0) {
      filteredDestinations = destinations.slice(0, 3);
    }

    // Filter hotels
    let filteredHotels = hotels.filter((h: any) => {
      return preferredDistrict === 'Semua Kabupaten' || h.district === preferredDistrict;
    }).slice(0, 2);

    if (filteredHotels.length === 0) {
      filteredHotels = hotels.slice(0, 2);
    }

    const recommendedCulinary = culinary.slice(0, 2);

    // Compute cost estimates
    const accommodationCostMultiplier = budget === 'Low' ? 500000 : budget === 'Medium' ? 1000000 : 2500000;
    const accommodationTotal = filteredHotels.length > 0 ? accommodationCostMultiplier * duration : 0;
    const transportationCost = budget === 'Low' ? 150000 : budget === 'Medium' ? 400000 : 800000;
    const mealsCost = budget === 'Low' ? 100000 * duration : budget === 'Medium' ? 250000 * duration : 600000 * duration;
    const ticketsCost = filteredDestinations.reduce((acc: number, d: any) => acc + (d.ticketPrice || 0), 0);

    const totalCost = accommodationTotal + transportationCost + mealsCost + ticketsCost;

    const destinationsStr = filteredDestinations.map((d: any) => d.name).join(', ');
    const hotelsStr = filteredHotels.map((h: any) => h.name).join(', ');

    const prompt = buildRecommendationPrompt({
      budget,
      interests,
      travelStyle,
      preferredDistrict,
      duration,
      destinations: destinationsStr,
      hotels: hotelsStr,
      totalCost,
    });

    const aiSummary = await aiRouter.route({
      prompt,
      temperature: 0.6,
    });

    return {
      destinations: filteredDestinations,
      hotels: filteredHotels,
      culinary: recommendedCulinary,
      estimatedCosts: {
        accommodation: accommodationTotal,
        transportation: transportationCost,
        meals: mealsCost,
        tickets: ticketsCost,
        total: totalCost,
      },
      aiSummary,
    };
  }
}

export const recommendationService = new RecommendationService();
