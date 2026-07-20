/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Destination {
  id: string;
  name: string;
  description: string;
  district: string; // Samosir, Toba, Karo, Simalungun, Humbang Hasundutan, Dairi, Pakpak Bharat, North Tapanuli
  category: 'Nature' | 'Culture' | 'Culinary' | 'Adventure' | 'Family';
  latitude: number;
  longitude: number;
  openingHours: string;
  ticketPrice: number; // in IDR
  image: string;
  rating: number;
  facilities: string[];
}

export interface Hotel {
  id: string;
  name: string;
  description: string;
  rating: number;
  facilities: string[];
  priceRange: string; // e.g. "Rp 400.000 - Rp 800.000"
  district: string;
  latitude: number;
  longitude: number;
  image: string;
}

export interface Culinary {
  id: string;
  name: string;
  description: string;
  history: string;
  ingredients: string[];
  preparation: string[];
  recommendedLocations: { name: string; address: string; mapsUrl?: string }[];
  image: string;
  youtubeUrl?: string; // YouTube video link or embed for recipe/cooking guide
}

export interface Culture {
  id: string;
  title: string;
  description: string;
  detailedContent: string;
  image: string;
  category: 'philosophy' | 'script' | 'craft' | 'art' | 'social';
  youtubeUrl?: string; // Explanatory YouTube video link/embed
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  destinationId?: string;
  hotelId?: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  itemId: string; // destinationId or hotelId
  type: 'destination' | 'hotel';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  sender: 'user' | 'ai';
  message: string;
  createdAt: string;
}

export interface Itinerary {
  id: string;
  userId: string;
  name: string;
  duration: number; // in days
  budget: string; // Low, Medium, High
  transportation: string;
  interests: string[];
  districts: string[];
  days: {
    day: number;
    activities: {
      time: string;
      title: string;
      description: string;
      location?: string;
      cost?: number;
    }[];
  }[];
  createdAt: string;
}

export interface RecommendationRequest {
  budget: 'Low' | 'Medium' | 'High';
  interests: string[];
  travelStyle: 'Relaxed' | 'Balanced' | 'Active';
  preferredDistrict: string;
  duration: number;
}

export interface RecommendationResponse {
  destinations: Destination[];
  hotels: Hotel[];
  culinary: Culinary[];
  estimatedCosts: {
    accommodation: number;
    transportation: number;
    meals: number;
    tickets: number;
    total: number;
  };
  aiSummary?: string;
}

