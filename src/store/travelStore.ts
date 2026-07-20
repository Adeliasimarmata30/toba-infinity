/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';
import { Destination, Hotel, Culinary, Culture, Itinerary, Review, Favorite, ChatMessage } from '../types';
import { authService, favoritesService, itineraryService, chatHistoryService, AppUser } from '../services/database';

interface TravelState {
  // Authentication State
  user: AppUser | null;
  authLoading: boolean;
  authError: string | null;
  
  // App Data & Interactions
  favorites: Favorite[];
  itineraries: Itinerary[];
  chatHistory: ChatMessage[];
  chatLoading: boolean;
  
  // Navigation
  activeTab: 'dashboard' | 'map' | 'recommendation' | 'planner' | 'chat' | 'culture' | 'culinary' | 'profile';
  
  // Actions
  initAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserPreferences: (district: string, interests: string[]) => Promise<void>;
  
  // Favorites Actions
  toggleFavorite: (itemId: string, type: 'destination' | 'hotel') => Promise<void>;
  isFavorite: (itemId: string) => boolean;
  
  // Itinerary Actions
  saveItinerary: (itinerary: Omit<Itinerary, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  deleteItinerary: (id: string) => Promise<void>;
  
  // Chat Actions
  sendMessage: (message: string) => Promise<void>;
  clearChat: () => Promise<void>;
  
  // Setter
  setActiveTab: (tab: TravelState['activeTab']) => void;
}

export const DEFAULT_USER: AppUser = {
  id: 'guest-traveler',
  fullName: 'Adelia Simarmata',
  email: 'adelia@tobainfinity.id',
  districtPref: 'Samosir',
  interestPref: ['Nature', 'Culture', 'Adventure'],
  createdAt: '2026-07-20T00:00:00.000Z'
};

export const useTravelStore = create<TravelState>((set, get) => ({
  user: DEFAULT_USER,
  authLoading: false,
  authError: null,
  favorites: [],
  itineraries: [],
  chatHistory: [],
  chatLoading: false,
  activeTab: 'dashboard',

  setActiveTab: (tab) => set({ activeTab: tab }),

  // Initialize session with default user
  initAuth: async () => {
    set({ authLoading: true, authError: null });
    try {
      const user = DEFAULT_USER;
      const [favs, itis, chats] = await Promise.all([
        favoritesService.getUserFavorites(user.id).catch(() => []),
        itineraryService.getUserItineraries(user.id).catch(() => []),
        chatHistoryService.getUserHistory(user.id).catch(() => []),
      ]);
      set({ user, favorites: favs, itineraries: itis, chatHistory: chats });
    } catch (err: any) {
      console.error('Session initialization error:', err);
    } finally {
      set({ authLoading: false });
    }
  },

  // Perform login (noop / simulated success for backward compatibility)
  login: async (email, password) => {
    set({ authLoading: true, authError: null });
    try {
      set({ user: DEFAULT_USER, activeTab: 'dashboard' });
    } finally {
      set({ authLoading: false });
    }
  },

  // Perform registration (noop / simulated success for backward compatibility)
  register: async (email, password, fullName) => {
    set({ authLoading: true, authError: null });
    try {
      set({ user: DEFAULT_USER, activeTab: 'dashboard' });
    } finally {
      set({ authLoading: false });
    }
  },

  // Perform logout (noop / simulated for backward compatibility)
  logout: async () => {
    set({ user: DEFAULT_USER, activeTab: 'dashboard' });
  },

  // Update user preference metadata
  updateUserPreferences: async (district, interests) => {
    const { user } = get();
    if (!user) return;
    try {
      const updatedUser = await authService.updateProfile(user.id, {
        districtPref: district,
        interestPref: interests
      });
      set({ user: updatedUser });
    } catch (err) {
      console.error('Error updating profile preferences:', err);
    }
  },

  // Favorites logic
  toggleFavorite: async (itemId, type) => {
    const { user, favorites } = get();
    if (!user) {
      alert('Silakan masuk terlebih dahulu untuk menyimpan destinasi favorit.');
      return;
    }

    try {
      const exists = favorites.find(f => f.itemId === itemId);
      if (exists) {
        await favoritesService.removeFavorite(user.id, itemId);
        set({ favorites: favorites.filter(f => f.itemId !== itemId) });
      } else {
        const newFav = await favoritesService.addFavorite(user.id, itemId, type);
        set({ favorites: [...favorites, newFav] });
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  },

  isFavorite: (itemId) => {
    return get().favorites.some(f => f.itemId === itemId);
  },

  // Itinerary persistence
  saveItinerary: async (itineraryData) => {
    const { user, itineraries } = get();
    if (!user) {
      alert('Silakan masuk terlebih dahulu untuk menyimpan itinerary.');
      return;
    }

    try {
      const newIti = await itineraryService.saveItinerary({
        ...itineraryData,
        userId: user.id,
      });
      set({ itineraries: [newIti, ...itineraries] });
    } catch (err) {
      console.error('Error saving itinerary:', err);
    }
  },

  deleteItinerary: async (id) => {
    const { user, itineraries } = get();
    if (!user) return;

    try {
      await itineraryService.deleteItinerary(user.id, id);
      set({ itineraries: itineraries.filter(i => i.id !== id) });
    } catch (err) {
      console.error('Error deleting itinerary:', err);
    }
  },

  // Chat message submission
  sendMessage: async (messageText) => {
    const { user, chatHistory } = get();
    const userId = user?.id || 'anonymous';

    // Append user message immediately
    const userMsg = await chatHistoryService.addMessage(userId, 'user', messageText);
    set({ chatHistory: [...get().chatHistory, userMsg], chatLoading: true });

    try {
      // API call to the server Express endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText,
          history: get().chatHistory.slice(0, -1), // send prior history
        })
      });

      if (!response.ok) throw new Error('Koneksi asisten AI terputus.');
      const data = await response.json();

      // Append AI response
      const aiMsg = await chatHistoryService.addMessage(userId, 'ai', data.text);
      set({ chatHistory: [...get().chatHistory, aiMsg] });

    } catch (err: any) {
      console.error('Chat error:', err);
      const errMsg = await chatHistoryService.addMessage(
        userId,
        'ai',
        'Maaf, koneksi server terganggu. Silakan hubungi admin atau nyalakan API Key di Secrets panel.'
      );
      set({ chatHistory: [...get().chatHistory, errMsg] });
    } finally {
      set({ chatLoading: false });
    }
  },

  clearChat: async () => {
    const { user } = get();
    const userId = user?.id || 'anonymous';
    try {
      await chatHistoryService.clearHistory(userId);
      set({ chatHistory: [] });
    } catch (err) {
      console.error('Error clearing chat history:', err);
    }
  }
}));
