export interface Place {
  id: string;
  name: string;
  description: string;
  category: PlaceCategory;
  subcategory?: string;
  address: string;
  coordinates: [number, number];
  rating: number;
  reviewCount: number;
  priceLevel: 1 | 2 | 3 | 4;
  images: string[];
  phone?: string;
  website?: string;
  hours: OperatingHours;
  amenities: Amenity[];
  tags: string[];
  vibe: string[];
  isOpen: boolean;
  isTrending: boolean;
  isHiddenGem: boolean;
  distance?: number;
  aiSummary?: string;
  crowdLevel?: 'low' | 'medium' | 'high';
  wifiSpeed?: 'slow' | 'medium' | 'fast';
  createdAt: string;
  updatedAt: string;
}

export type PlaceCategory = 
  | 'coffee' 
  | 'barber' 
  | 'salon' 
  | 'gym' 
  | 'coworking' 
  | 'restaurant' 
  | 'hidden_gem' 
  | 'lifestyle';

export interface OperatingHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

export type Amenity = 
  | 'wifi' 
  | 'parking' 
  | 'smoking_area' 
  | 'ac' 
  | 'outdoor_seating'
  | 'pet_friendly'
  | 'live_music'
  | 'halal'
  | 'charging_outlets'
  | 'quiet'
  | 'work_friendly';

export interface Review {
  id: string;
  placeId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  text: string;
  images?: string[];
  likes: number;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: UserPreferences;
  stats: UserStats;
  createdAt: string;
}

export interface UserPreferences {
  categories: PlaceCategory[];
  vibes: string[];
  priceRange: [number, number];
  maxDistance: number;
  notifications: boolean;
}

export interface UserStats {
  swipes: number;
  saves: number;
  reviews: number;
  placesVisited: number;
  streakDays: number;
}

export interface Collection {
  id: string;
  userId: string;
  name: string;
  description?: string;
  places: string[];
  coverImage?: string;
  isPrivate: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SwipeAction {
  id: string;
  userId: string;
  placeId: string;
  action: 'pass' | 'save' | 'super_like';
  createdAt: string;
}

export interface FilterState {
  categories: PlaceCategory[];
  radius: number;
  rating: number;
  priceRange: [number, number];
  openNow: boolean;
  amenities: Amenity[];
  vibes: string[];
  timeBased: string[];
}

export interface TrendingPlace {
  placeId: string;
  score: number;
  saves: number;
  views: number;
  reviews: number;
  period: string;
}

export interface AISearchQuery {
  id: string;
  query: string;
  filters: Partial<FilterState>;
  results: string[];
  createdAt: string;
}

export interface GroupMatch {
  id: string;
  name: string;
  createdBy: string;
  members: string[];
  status: 'active' | 'completed';
  matches: string[];
  createdAt: string;
  expiresAt: string;
}

export interface BusinessProfile {
  id: string;
  placeId: string;
  ownerId: string;
  claimed: boolean;
  analytics: BusinessAnalytics;
  promotions: Promotion[];
}

export interface BusinessAnalytics {
  views: number;
  saves: number;
  visitors: number;
  trendingScore: number;
  dailyStats: DailyStat[];
}

export interface DailyStat {
  date: string;
  views: number;
  saves: number;
  visitors: number;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  discount?: string;
  validFrom: string;
  validUntil: string;
  active: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'favorite_open' | 'nearby_gem' | 'trending' | 'match' | 'review';
  title: string;
  message: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: string;
}

export type MapViewState = {
  longitude: number;
  latitude: number;
  zoom: number;
  pitch?: number;
  bearing?: number;
};

export interface SearchSuggestion {
  id: string;
  text: string;
  type: 'recent' | 'trending' | 'category';
  icon?: string;
}
