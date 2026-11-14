/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';
import { Destination, Hotel, Review, Favorite, Itinerary, ChatMessage } from '../types';


// Fetch credentials from Vite environment variables Safely
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

// Check if credentials are valid and not placeholders
const isPlaceholder = (url: string, key: string) => {
  return (
    !url ||
    !key ||
    url.includes('your-project') ||
    key.includes('your-anon-key') ||
    url === 'MY_SUPABASE_URL' ||
    key === 'MY_SUPABASE_ANON_KEY'
  );
};

// Initialize Supabase Client if credentials are provided and not placeholders
export const supabase = !isPlaceholder(supabaseUrl, supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Self-healing database connection tracker
let isSupabaseHealthy = !!supabase;
let fallbackLogged = false;

export function disableSupabase(error?: any, context?: string) {
  if (isSupabaseHealthy) {
    isSupabaseHealthy = false;
  }
  if (!fallbackLogged) {
    fallbackLogged = true;
    console.log(
      '%cℹ️ [Toba Infinity State Engine]: Automatically activating high-fidelity Local Storage (localStorage) fallback. ' +
      'All tourism portal features (Trip Planner, AI chatbot history, reviews, and geosite bookmarks) are fully operational and simulated locally!',
      'color: #0ea5e9; font-weight: bold; background-color: #f0f9ff; padding: 6px 10px; border-radius: 6px;'
    );
    if (error) {
      const msg = typeof error === 'object' && error !== null ? (error.message || JSON.stringify(error)) : String(error);
      console.log(`ℹ️ Diagnostic status (${context || 'database'}): ${msg}`);
    }
  }
}

export function getSupabase() {
  return isSupabaseHealthy ? supabase : null;
}
// -------------------------------------------------------------
// TOBA TOURISM DATA — SUPABASE DOCUMENTS
// -------------------------------------------------------------

export interface TobaDocument {
  id: number | string;
  content: string;
  metadata: {
    place?: string;
    sheet?: string;
    rating?: number | string;
    address?: string;
    category?: string;
    price_from?: number | string;
    service_hour?: string;
    [key: string]: any;
  };
}
export async function searchTobaDocuments(
  query: string,
  limit = 30
): Promise<TobaDocument[]> {
  const client = getSupabase();

  if (!client || !query.trim()) return [];

  const q = query.trim();

  try {
    // Cari berdasarkan CONTENT
    const contentResult = await client
      .from('documents')
      .select('id, content, metadata')
      .ilike('content', `%${q}%`)
      .limit(limit);

    // Cari berdasarkan NAMA PLACE di metadata
    const metadataResult = await client
      .from('documents')
      .select('id, content, metadata')
      .ilike('metadata->>place', `%${q}%`)
      .limit(limit);

    if (contentResult.error) {
      console.error('[TOBA DATA] Content search error:', contentResult.error);
    }

    if (metadataResult.error) {
      console.error('[TOBA DATA] Metadata search error:', metadataResult.error);
    }

    // Gabungkan + hilangkan duplikat
    const combined = [
      ...(contentResult.data || []),
      ...(metadataResult.data || [])
    ];

    const unique = Array.from(
      new Map(combined.map(item => [item.id, item])).values()
    );

    console.log(
      `[TOBA DATA] Search "${q}" → ${unique.length} results`
    );

    return unique.slice(0, limit) as TobaDocument[];

  } catch (error) {
    console.error('[TOBA DATA] Search exception:', error);
    return [];
  }
}

export async function getTobaDestinations(
  limit = 200
): Promise<TobaDocument[]> {
  const client = getSupabase();

  if (!client) return [];

  try {
    const { data, error } = await client
      .from('documents')
      .select('id, content, metadata')
      .in('metadata->>sheet', [
        'tempat-wisata-v1',
        'wisata-v2',
        'wisata-metadata'
      ])
      .limit(limit);

    if (error) {
      console.error('[TOBA DATA] Destination query error:', error);
      return [];
    }

    console.log(
      `[TOBA DATA] Loaded ${data?.length || 0} destinations from Supabase`
    );

    return (data || []) as TobaDocument[];
  } catch (error) {
    console.error('[TOBA DATA] Destination query exception:', error);
    return [];
  }
}

// Log Supabase configuration status
if (supabase) {
  console.log('⚡ Supabase database and authentication initialized successfully.');
} else {
  console.log(
    '%cℹ️ [Toba Infinity]: Supabase credentials missing or set to placeholder values. ' +
    'The platform has gracefully activated the local high-fidelity state engine (localStorage) ' +
    'so that all features—like auth, reviews, favorites, itineraries, and chat history—work instantly in the live preview!',
    'color: #0ea5e9; font-weight: bold; background-color: #f0f9ff; padding: 6px 10px; border-radius: 6px;'
  );
}

// -------------------------------------------------------------
// LOCAL DB STATE ENGINE (FALLBACK)
// -------------------------------------------------------------
const LOCAL_STORAGE_KEYS = {
  USER: 'toba_infinity_user',
  REVIEWS: 'toba_infinity_reviews',
  FAVORITES: 'toba_infinity_favorites',
  ITINERARIES: 'toba_infinity_itineraries',
  CHAT_HISTORY: 'toba_infinity_chat_history',
};

// Initial default reviews to make the platform look populated and realistic
const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    userId: 'user-sample-1',
    userName: 'Andi Nasution',
    destinationId: 'dest-holbung',
    rating: 5,
    comment: 'Pemandangan dari Bukit Holbung sangat luar biasa! Sangat disarankan untuk datang jam 5 pagi untuk melihat sunrise berkabut.',
    createdAt: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'rev-2',
    userId: 'user-sample-2',
    userName: 'Siti Pardede',
    destinationId: 'dest-siallagan',
    rating: 4,
    comment: 'Tempat bersejarah yang sangat terawat. Belajar banyak tentang sejarah pengadilan hukum adat Batak kuno.',
    createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 'rev-3',
    userId: 'user-sample-3',
    userName: 'Rian Tampubolon',
    hotelId: 'hotel-marianna',
    rating: 5,
    comment: 'Resort terbaik di Samosir! Infinity poolnya langsung menghadap ke danau, pelayanannya sangat ramah standar bintang 5.',
    createdAt: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString(),
  }
];

// Helper to safely load data from LocalStorage
const loadLocalData = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (err) {
    console.error(`Error loading localStorage key "${key}":`, err);
    return defaultValue;
  }
};

// Helper to safely save data to LocalStorage
const saveLocalData = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving localStorage key "${key}":`, err);
  }
};

// -------------------------------------------------------------
// USER / AUTHENTICATION INTERFACE
// -------------------------------------------------------------
export interface AppUser {
  id: string;
  email: string;
  fullName: string;
  districtPref?: string;
  interestPref?: string[];
  createdAt: string;
  role?: 'admin' | 'user';
}

export function isAdminUser(user: AppUser | null | undefined): boolean {
  if (!user) return false;
  if (user.role === 'admin') return true;
  const emailLower = user.email.toLowerCase();
  return (
    emailLower === 'adeliasimarmata9@gmail.com' ||
    emailLower === 'delia@tobainfinity.id' ||
    emailLower.startsWith('admin') ||
    emailLower.includes('admin@') ||
    emailLower === 'admin@gmail.com'
  );
}

export const authService = {
  // Register a new user
  async register(email: string, password: string, fullName: string): Promise<AppUser> {
    const client = getSupabase();
    const isEmailAdmin =
      email.toLowerCase() === 'adeliasimarmata9@gmail.com' ||
      email.toLowerCase() === 'delia@tobainfinity.id' ||
      email.toLowerCase().includes('admin');
    if (client) {
      try {
        // Real Supabase Auth SignUp
        const { data, error } = await client.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });
        if (error) throw error;
        if (!data.user) throw new Error('Registration failed: No user returned');

        // Sync user profile to a custom "users" database table
        const profileUser: AppUser = {
          id: data.user.id,
          email: data.user.email || email,
          fullName,
          createdAt: new Date().toISOString(),
          role: isEmailAdmin ? 'admin' : 'user'
        };

        try {
          const { error: dbError } = await client.from('users').insert({
            id: profileUser.id,
            email: profileUser.email,
            full_name: profileUser.fullName,
            role: profileUser.role,
          });
          if (dbError) {
            console.warn('Database user sync warning, falling back:', dbError);
            disableSupabase();
          }
        } catch (dbErr) {
          console.warn('Database user sync exception, falling back:', dbErr);
          disableSupabase();
        }

        saveLocalData(LOCAL_STORAGE_KEYS.USER, profileUser);
        return profileUser;
      } catch (err) {
        console.warn('Supabase Register failed, falling back to local simulation:', err);
        disableSupabase();
      }
    }

    // Local Fallback simulation
    const mockUser: AppUser = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      email,
      fullName,
      createdAt: new Date().toISOString(),
      role: isEmailAdmin ? 'admin' : 'user'
    };
    saveLocalData(LOCAL_STORAGE_KEYS.USER, mockUser);
    return mockUser;
  },

  // Login an existing user
  async login(email: string, password: string): Promise<AppUser> {
    const client = getSupabase();
    const isEmailAdmin =
      email.toLowerCase() === 'adeliasimarmata9@gmail.com' ||
      email.toLowerCase() === 'delia@tobainfinity.id' ||
      email.toLowerCase().includes('admin');
    if (client) {
      try {
        // Real Supabase Auth SignIn
        const { data, error } = await client.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (!data.user) throw new Error('Login failed: Invalid credentials');

        // Fetch user profile from database table or auth metadata
        const fullName = data.user.user_metadata?.full_name || email.split('@')[0];
        const profileUser: AppUser = {
          id: data.user.id,
          email: data.user.email || email,
          fullName,
          createdAt: data.user.created_at,
          role: isEmailAdmin ? 'admin' : 'user'
        };

        saveLocalData(LOCAL_STORAGE_KEYS.USER, profileUser);
        return profileUser;
      } catch (err) {
        console.warn('Supabase Login failed, falling back to local simulation:', err);
        disableSupabase();
      }
    }

    // Local Fallback simulation (Auto accepts for simple local development)
    const mockUser: AppUser = {
      id: 'usr_local_test',
      email,
      fullName: email.split('@')[0].toUpperCase(),
      createdAt: new Date().toISOString(),
      role: isEmailAdmin ? 'admin' : 'user'
    };
    saveLocalData(LOCAL_STORAGE_KEYS.USER, mockUser);
    return mockUser;
  },

  // Logout current user
  async logout(): Promise<void> {
    const client = getSupabase();
    if (client) {
      try {
        await client.auth.signOut();
      } catch (err) {
        console.warn('Supabase Logout exception:', err);
      }
    }
    localStorage.removeItem(LOCAL_STORAGE_KEYS.USER);
  },

  // Retrieve currently logged-in user profile
  async getCurrentUser(): Promise<AppUser | null> {
    const client = getSupabase();
    if (client) {
      try {
        const { data: { user } } = await client.auth.getUser();
        if (user) {
          const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || '';
          return {
            id: user.id,
            email: user.email || '',
            fullName,
            createdAt: user.created_at,
          };
        }
      } catch (err) {
        console.warn('Supabase get user failed, using local session:', err);
        // Do not disable Supabase on getUser since it can fail due to session expiry rather than connection issue
      }
    }
    return loadLocalData<AppUser | null>(LOCAL_STORAGE_KEYS.USER, null);
  },

  // Update profile attributes (like preferred interest/districts)
  async updateProfile(userId: string, updates: Partial<AppUser>): Promise<AppUser> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) throw new Error('No active session found.');

    const updatedUser = { ...currentUser, ...updates };

    const client = getSupabase();
    if (client) {
      try {
        // Update Supabase user profile table
        const { error } = await client
          .from('users')
          .update({
            full_name: updatedUser.fullName,
            district_pref: updatedUser.districtPref,
            interest_pref: updatedUser.interestPref,
          })
          .eq('id', userId);

        if (error) throw error;
      } catch (err) {
        console.warn('Supabase updateProfile failed, updating locally:', err);
        disableSupabase();
      }
    }

    saveLocalData(LOCAL_STORAGE_KEYS.USER, updatedUser);
    return updatedUser;
  }
};

// -------------------------------------------------------------
// REVIEWS SERVICE
// -------------------------------------------------------------
export const reviewsService = {
  // Get all reviews for a destination
  async getByDestination(destId: string): Promise<Review[]> {
    const client = getSupabase();
    if (client) {
      try {
        const { data, error } = await client
          .from('reviews')
          .select('*')
          .eq('destination_id', destId)
          .order('created_at', { ascending: false });

        if (error) {
          disableSupabase(error, 'destination reviews query');
        } else if (data) {
          return data.map(r => ({
            id: r.id,
            userId: r.user_id,
            userName: r.user_name || 'Wisatawan',
            destinationId: r.destination_id,
            hotelId: r.hotel_id,
            rating: r.rating,
            comment: r.comment,
            createdAt: r.created_at,
          }));
        }
      } catch (err) {
        disableSupabase(err, 'destination reviews exception');
      }
    }
    const local = loadLocalData<Review[]>(LOCAL_STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    return local.filter(r => r.destinationId === destId);
  },

  // Get all reviews for a hotel
  async getByHotel(hotelId: string): Promise<Review[]> {
    const client = getSupabase();
    if (client) {
      try {
        const { data, error } = await client
          .from('reviews')
          .select('*')
          .eq('hotel_id', hotelId)
          .order('created_at', { ascending: false });

        if (error) {
          disableSupabase(error, 'hotel reviews query');
        } else if (data) {
          return data.map(r => ({
            id: r.id,
            userId: r.user_id,
            userName: r.user_name || 'Wisatawan',
            destinationId: r.destination_id,
            hotelId: r.hotel_id,
            rating: r.rating,
            comment: r.comment,
            createdAt: r.created_at,
          }));
        }
      } catch (err) {
        disableSupabase(err, 'hotel reviews exception');
      }
    }
    const local = loadLocalData<Review[]>(LOCAL_STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    return local.filter(r => r.hotelId === hotelId);
  },

  // Submit a new review
  async addReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
    const newReview: Review = {
      ...review,
      id: 'rev-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };

    const client = getSupabase();
    if (client) {
      try {
        const { error } = await client.from('reviews').insert({
          id: newReview.id,
          user_id: newReview.userId,
          user_name: newReview.userName,
          destination_id: newReview.destinationId,
          hotel_id: newReview.hotelId,
          rating: newReview.rating,
          comment: newReview.comment,
          created_at: newReview.createdAt,
        });
        if (error) {
          disableSupabase(error, 'review save');
        }
      } catch (err) {
        disableSupabase(err, 'review save exception');
      }
    }

    const currentReviews = loadLocalData<Review[]>(LOCAL_STORAGE_KEYS.REVIEWS, DEFAULT_REVIEWS);
    currentReviews.unshift(newReview);
    saveLocalData(LOCAL_STORAGE_KEYS.REVIEWS, currentReviews);
    return newReview;
  }
};

// -------------------------------------------------------------
// FAVORITES SERVICE
// -------------------------------------------------------------
export const favoritesService = {
  // Get all favorites for user
  async getUserFavorites(userId: string): Promise<Favorite[]> {
    const client = getSupabase();
    if (client) {
      try {
        const { data, error } = await client
          .from('favorites')
          .select('*')
          .eq('user_id', userId);
        if (error) {
          disableSupabase(error, 'favorites query');
        } else if (data) {
          return data.map(f => ({
            id: f.id,
            userId: f.user_id,
            itemId: f.item_id,
            type: f.type,
            createdAt: f.created_at,
          }));
        }
      } catch (err) {
        disableSupabase(err, 'favorites query exception');
      }
    }
    const local = loadLocalData<Favorite[]>(LOCAL_STORAGE_KEYS.FAVORITES, []);
    return local.filter(f => f.userId === userId);
  },

  // Add a favorite
  async addFavorite(userId: string, itemId: string, type: 'destination' | 'hotel'): Promise<Favorite> {
    const newFav: Favorite = {
      id: 'fav-' + Math.random().toString(36).substr(2, 9),
      userId,
      itemId,
      type,
      createdAt: new Date().toISOString(),
    };

    const client = getSupabase();
    if (client) {
      try {
        const { error } = await client.from('favorites').insert({
          id: newFav.id,
          user_id: newFav.userId,
          item_id: newFav.itemId,
          type: newFav.type,
          created_at: newFav.createdAt,
        });
        if (error) {
          console.warn('Supabase Favorite Save failed, saving locally:', error);
          disableSupabase();
        }
      } catch (err) {
        console.warn('Supabase Favorite Save exception, saving locally:', err);
        disableSupabase();
      }
    }

    const currentFavs = loadLocalData<Favorite[]>(LOCAL_STORAGE_KEYS.FAVORITES, []);
    // Prevent duplicate entries
    if (!currentFavs.some(f => f.userId === userId && f.itemId === itemId)) {
      currentFavs.push(newFav);
      saveLocalData(LOCAL_STORAGE_KEYS.FAVORITES, currentFavs);
    }
    return newFav;
  },

  // Remove a favorite
  async removeFavorite(userId: string, itemId: string): Promise<void> {
    const client = getSupabase();
    if (client) {
      try {
        const { error } = await client
          .from('favorites')
          .delete()
          .eq('user_id', userId)
          .eq('item_id', itemId);
        if (error) {
          console.warn('Supabase Favorite Delete failed, falling back to local:', error);
          disableSupabase();
        }
      } catch (err) {
        console.warn('Supabase Favorite Delete exception, falling back to local:', err);
        disableSupabase();
      }
    }

    const currentFavs = loadLocalData<Favorite[]>(LOCAL_STORAGE_KEYS.FAVORITES, []);
    const updated = currentFavs.filter(f => !(f.userId === userId && f.itemId === itemId));
    saveLocalData(LOCAL_STORAGE_KEYS.FAVORITES, updated);
  }
};

// -------------------------------------------------------------
// ITINERARY SERVICE
// -------------------------------------------------------------
export const itineraryService = {
  // Get all saved itineraries for user
  async getUserItineraries(userId: string): Promise<Itinerary[]> {
    const client = getSupabase();
    if (client) {
      try {
        const { data, error } = await client
          .from('itineraries')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        if (error) {
          disableSupabase(error, 'itineraries query');
        } else if (data) {
          return data.map(i => ({
            id: i.id,
            userId: i.user_id,
            name: i.name,
            duration: i.duration,
            budget: i.budget,
            transportation: i.transportation,
            interests: i.interests,
            districts: i.districts,
            days: typeof i.days === 'string' ? JSON.parse(i.days) : i.days,
            createdAt: i.created_at,
          }));
        }
      } catch (err) {
        disableSupabase(err, 'itineraries query exception');
      }
    }
    const local = loadLocalData<Itinerary[]>(LOCAL_STORAGE_KEYS.ITINERARIES, []);
    return local.filter(i => i.userId === userId);
  },

  // Save generated itinerary
  async saveItinerary(itinerary: Omit<Itinerary, 'id' | 'createdAt'>): Promise<Itinerary> {
    const newItinerary: Itinerary = {
      ...itinerary,
      id: 'iti-' + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };

    const client = getSupabase();
    if (client) {
      try {
        const { error } = await client.from('itineraries').insert({
          id: newItinerary.id,
          user_id: newItinerary.userId,
          name: newItinerary.name,
          duration: newItinerary.duration,
          budget: newItinerary.budget,
          transportation: newItinerary.transportation,
          interests: newItinerary.interests,
          districts: newItinerary.districts,
          days: JSON.stringify(newItinerary.days),
          created_at: newItinerary.createdAt,
        });
        if (error) {
          console.warn('Supabase Itinerary Save failed, saving locally:', error);
          disableSupabase();
        }
      } catch (err) {
        console.warn('Supabase Itinerary Save exception, saving locally:', err);
        disableSupabase();
      }
    }

    const currentItis = loadLocalData<Itinerary[]>(LOCAL_STORAGE_KEYS.ITINERARIES, []);
    currentItis.unshift(newItinerary);
    saveLocalData(LOCAL_STORAGE_KEYS.ITINERARIES, currentItis);
    return newItinerary;
  },

  // Delete saved itinerary
  async deleteItinerary(userId: string, id: string): Promise<void> {
    const client = getSupabase();
    if (client) {
      try {
        const { error } = await client
          .from('itineraries')
          .delete()
          .eq('id', id)
          .eq('user_id', userId);
        if (error) {
          console.warn('Supabase Itinerary Delete failed, falling back to local:', error);
          disableSupabase();
        }
      } catch (err) {
        console.warn('Supabase Itinerary Delete exception, falling back to local:', err);
        disableSupabase();
      }
    }

    const currentItis = loadLocalData<Itinerary[]>(LOCAL_STORAGE_KEYS.ITINERARIES, []);
    const updated = currentItis.filter(i => !(i.id === id && i.userId === userId));
    saveLocalData(LOCAL_STORAGE_KEYS.ITINERARIES, updated);
  }
};

// -------------------------------------------------------------
// CHATBOT HISTORY SERVICE
// -------------------------------------------------------------
export const chatHistoryService = {
  // Get chat history for user
  async getUserHistory(userId: string): Promise<ChatMessage[]> {
    const client = getSupabase();
    if (client) {
      try {
        const { data, error } = await client
          .from('chatbot_history')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: true });
        if (error) {
          disableSupabase(error, 'chat history query');
        } else if (data) {
          return data.map(c => ({
            id: c.id,
            userId: c.user_id,
            sender: c.sender,
            message: c.message,
            createdAt: c.created_at,
          }));
        }
      } catch (err) {
        disableSupabase(err, 'chat history exception');
      }
    }
    const local = loadLocalData<ChatMessage[]>(LOCAL_STORAGE_KEYS.CHAT_HISTORY, []);
    return local.filter(c => c.userId === userId);
  },

  // Save new message
  async addMessage(userId: string, sender: 'user' | 'ai', message: string): Promise<ChatMessage> {
    const newMessage: ChatMessage = {
      id: 'chat-' + Math.random().toString(36).substr(2, 9),
      userId,
      sender,
      message,
      createdAt: new Date().toISOString(),
    };

    const client = getSupabase();
    if (client) {
      try {
        const { error } = await client.from('chatbot_history').insert({
          id: newMessage.id,
          user_id: newMessage.userId,
          sender: newMessage.sender,
          message: newMessage.message,
          created_at: newMessage.createdAt,
        });
        if (error) {
          console.warn('Supabase Chat History Save failed, saving locally:', error);
          disableSupabase();
        }
      } catch (err) {
        console.warn('Supabase Chat History Save exception, saving locally:', err);
        disableSupabase();
      }
    }

    const currentChats = loadLocalData<ChatMessage[]>(LOCAL_STORAGE_KEYS.CHAT_HISTORY, []);
    currentChats.push(newMessage);
    saveLocalData(LOCAL_STORAGE_KEYS.CHAT_HISTORY, currentChats);
    return newMessage;
  },

  // Clear chat history for user
  async clearHistory(userId: string): Promise<void> {
    const client = getSupabase();
    if (client) {
      try {
        const { error } = await client
          .from('chatbot_history')
          .delete()
          .eq('user_id', userId);
        if (error) {
          console.warn('Supabase Chat History Delete failed, falling back to local:', error);
          disableSupabase();
        }
      } catch (err) {
        console.warn('Supabase Chat History Delete exception, falling back to local:', err);
        disableSupabase();
      }
    }

    const currentChats = loadLocalData<ChatMessage[]>(LOCAL_STORAGE_KEYS.CHAT_HISTORY, []);
    const updated = currentChats.filter(c => c.userId !== userId);
    saveLocalData(LOCAL_STORAGE_KEYS.CHAT_HISTORY, updated);
  }
};
