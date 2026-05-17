-- SwipeMap Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  preferences JSONB DEFAULT '{
    "categories": [],
    "vibes": [],
    "priceRange": [1, 4],
    "maxDistance": 5000,
    "notifications": true
  }'::jsonb,
  stats JSONB DEFAULT '{
    "swipes": 0,
    "saves": 0,
    "reviews": 0,
    "placesVisited": 0,
    "streakDays": 0
  }'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Places table
CREATE TABLE places (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  address TEXT NOT NULL,
  coordinates GEOGRAPHY(POINT) NOT NULL,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  price_level INTEGER DEFAULT 1,
  images TEXT[] DEFAULT '{}',
  phone TEXT,
  website TEXT,
  hours JSONB DEFAULT '{}'::jsonb,
  amenities TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  vibe TEXT[] DEFAULT '{}',
  is_open BOOLEAN DEFAULT false,
  is_trending BOOLEAN DEFAULT false,
  is_hidden_gem BOOLEAN DEFAULT false,
  ai_summary TEXT,
  crowd_level TEXT,
  wifi_speed TEXT,
  claimed_by UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  place_id UUID REFERENCES places(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT,
  images TEXT[] DEFAULT '{}',
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Swipes table
CREATE TABLE swipes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  place_id UUID REFERENCES places(id) ON DELETE CASCADE NOT NULL,
  action TEXT NOT NULL CHECK (action IN ('pass', 'save', 'super_like')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, place_id)
);

-- Saved places table
CREATE TABLE saved_places (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  place_id UUID REFERENCES places(id) ON DELETE CASCADE NOT NULL,
  collection_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, place_id)
);

-- Collections table
CREATE TABLE collections (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  places UUID[] DEFAULT '{}',
  cover_image TEXT,
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trending scores table
CREATE TABLE trending_scores (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  place_id UUID REFERENCES places(id) ON DELETE CASCADE NOT NULL,
  score DECIMAL(10,2) DEFAULT 0,
  saves_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  period TEXT NOT NULL DEFAULT 'weekly',
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(place_id, period)
);

-- AI summaries table
CREATE TABLE ai_summaries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  place_id UUID REFERENCES places(id) ON DELETE CASCADE NOT NULL,
  summary TEXT NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(place_id)
);

-- Crowd predictions table
CREATE TABLE crowd_predictions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  place_id UUID REFERENCES places(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  hour INTEGER NOT NULL CHECK (hour >= 0 AND hour <= 23),
  crowd_level TEXT NOT NULL CHECK (crowd_level IN ('low', 'medium', 'high')),
  confidence DECIMAL(3,2) DEFAULT 0.5,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(place_id, day_of_week, hour)
);

-- Group matches table
CREATE TABLE group_matches (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  created_by UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  invite_code TEXT UNIQUE NOT NULL,
  members UUID[] DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  matches UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '24 hours'
);

-- Business profiles table
CREATE TABLE business_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  place_id UUID REFERENCES places(id) ON DELETE CASCADE NOT NULL,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  claimed BOOLEAN DEFAULT false,
  analytics JSONB DEFAULT '{}'::jsonb,
  promotions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(place_id)
);

-- Notifications table
CREATE TABLE notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('favorite_open', 'nearby_gem', 'trending', 'match', 'review')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI search queries table
CREATE TABLE ai_search_queries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  query TEXT NOT NULL,
  filters JSONB DEFAULT '{}'::jsonb,
  results UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_places_category ON places(category);
CREATE INDEX idx_places_coordinates ON places USING GIST(coordinates);
CREATE INDEX idx_places_trending ON places(is_trending) WHERE is_trending = true;
CREATE INDEX idx_places_hidden_gem ON places(is_hidden_gem) WHERE is_hidden_gem = true;
CREATE INDEX idx_reviews_place_id ON reviews(place_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_swipes_user_id ON swipes(user_id);
CREATE INDEX idx_swipes_place_id ON swipes(place_id);
CREATE INDEX idx_saved_places_user_id ON saved_places(user_id);
CREATE INDEX idx_collections_user_id ON collections(user_id);
CREATE INDEX idx_trending_scores_period ON trending_scores(period);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX idx_crowd_predictions_place ON crowd_predictions(place_id);

-- Row Level Security (RLS) Policies

-- Users: Users can only read/update their own profile
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Places: Public read, only admins can write
ALTER TABLE places ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Places are viewable by everyone"
  ON places FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Only admins can insert places"
  ON places FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND (stats->>'role')::text = 'admin'));

-- Reviews: Public read, authenticated users can create their own
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews are viewable by everyone"
  ON reviews FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Swipes: Users can only access their own
ALTER TABLE swipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own swipes"
  ON swipes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create swipes"
  ON swipes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Saved places: Users can only access their own
ALTER TABLE saved_places ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own saved places"
  ON saved_places FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can save places"
  ON saved_places FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave places"
  ON saved_places FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Collections: Users can only access their own
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own collections"
  ON collections FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create collections"
  ON collections FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own collections"
  ON collections FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Notifications: Users can only access their own
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Functions

-- Function to update trending scores
CREATE OR REPLACE FUNCTION calculate_trending_score(
  p_place_id UUID,
  p_period TEXT DEFAULT 'weekly'
)
RETURNS DECIMAL AS $$
DECLARE
  v_saves INTEGER;
  v_views INTEGER;
  v_reviews INTEGER;
  v_score DECIMAL;
BEGIN
  SELECT COUNT(*) INTO v_saves FROM saved_places WHERE place_id = p_place_id;
  SELECT COUNT(*) INTO v_views FROM swipes WHERE place_id = p_place_id;
  SELECT COUNT(*) INTO v_reviews FROM reviews WHERE place_id = p_place_id;

  v_score := (v_saves * 5) + (v_views * 1) + (v_reviews * 3);

  INSERT INTO trending_scores (place_id, score, saves_count, views_count, reviews_count, period)
  VALUES (p_place_id, v_score, v_saves, v_views, v_reviews, p_period)
  ON CONFLICT (place_id, period)
  DO UPDATE SET
    score = v_score,
    saves_count = v_saves,
    views_count = v_views,
    reviews_count = v_reviews,
    calculated_at = NOW();

  RETURN v_score;
END;
$$ LANGUAGE plpgsql;

-- Function to find nearby places
CREATE OR REPLACE FUNCTION nearby_places(
  lat DECIMAL,
  lng DECIMAL,
  radius_meters INTEGER DEFAULT 5000
)
RETURNS SETOF places AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM places
  WHERE ST_DWithin(
    coordinates::geography,
    ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
    radius_meters
  )
  ORDER BY ST_Distance(
    coordinates::geography,
    ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography
  );
END;
$$ LANGUAGE plpgsql;

-- Trigger to update review count on places
CREATE OR REPLACE FUNCTION update_place_review_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE places
    SET review_count = review_count + 1,
        rating = (SELECT AVG(rating)::DECIMAL(2,1) FROM reviews WHERE place_id = NEW.place_id)
    WHERE id = NEW.place_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE places
    SET review_count = review_count - 1,
        rating = COALESCE((SELECT AVG(rating)::DECIMAL(2,1) FROM reviews WHERE place_id = OLD.place_id), 0)
    WHERE id = OLD.place_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER reviews_stats_trigger
AFTER INSERT OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_place_review_stats();

-- Trigger to update user stats
CREATE OR REPLACE FUNCTION update_user_swipe_stats()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.action = 'save' OR NEW.action = 'super_like' THEN
    UPDATE users
    SET stats = jsonb_set(
      stats,
      '{saves}',
      COALESCE(stats->>'saves', '0')::int + 1
    )
    WHERE id = NEW.user_id;
  END IF;

  UPDATE users
  SET stats = jsonb_set(
    stats,
    '{swipes}',
    COALESCE(stats->>'swipes', '0')::int + 1
  )
  WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER swipes_stats_trigger
AFTER INSERT ON swipes
FOR EACH ROW
EXECUTE FUNCTION update_user_swipe_stats();

-- Insert sample data
INSERT INTO places (name, description, category, address, coordinates, rating, review_count, price_level, images, phone, website, hours, amenities, tags, vibe, is_open, is_trending, is_hidden_gem, ai_summary, crowd_level, wifi_speed)
VALUES 
  ('The Brew Lab', 'A specialty coffee roastery with industrial aesthetics and perfect pour-overs.', 'coffee', '123 Innovation Drive, Tech District', ST_SetSRID(ST_MakePoint(-74.006, 40.7128), 4326), 4.8, 234, 2, ARRAY['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800'], '+1 (555) 123-4567', 'https://brewlab.coffee', '{"monday": "07:00 - 20:00", "tuesday": "07:00 - 20:00", "wednesday": "07:00 - 20:00", "thursday": "07:00 - 20:00", "friday": "07:00 - 22:00", "saturday": "08:00 - 22:00", "sunday": "08:00 - 18:00"}', ARRAY['wifi', 'charging_outlets', 'quiet', 'work_friendly'], ARRAY['specialty coffee', 'roastery', 'pour-over', 'industrial'], ARRAY['industrial', 'quiet', 'aesthetic'], true, true, false, 'Perfect for working in the afternoon with stable WiFi and quiet atmosphere.', 'low', 'fast'),

  ('Fade Masters Barbershop', 'Premium barbershop specializing in modern fades and classic cuts.', 'barber', '456 Style Avenue, Fashion District', ST_SetSRID(ST_MakePoint(-74.01, 40.715), 4326), 4.9, 189, 3, ARRAY['https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800'], '+1 (555) 234-5678', NULL, '{"monday": "09:00 - 19:00", "tuesday": "09:00 - 19:00", "wednesday": "09:00 - 19:00", "thursday": "09:00 - 21:00", "friday": "09:00 - 21:00", "saturday": "08:00 - 18:00", "sunday": "Closed"}', ARRAY['ac', 'charging_outlets'], ARRAY['fade', 'beard trim', 'hot towel', 'premium'], ARRAY['luxury', 'minimalist'], true, true, false, NULL, 'medium', NULL),

  ('The Creative Hub', 'Modern coworking space designed for creatives and entrepreneurs.', 'coworking', '654 Startup Street, Innovation Park', ST_SetSRID(ST_MakePoint(-74.002, 40.714), 4326), 4.9, 178, 2, ARRAY['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'], '+1 (555) 567-8901', 'https://creativehub.co', '{"monday": "08:00 - 22:00", "tuesday": "08:00 - 22:00", "wednesday": "08:00 - 22:00", "thursday": "08:00 - 22:00", "friday": "08:00 - 22:00", "saturday": "10:00 - 18:00", "sunday": "10:00 - 18:00"}', ARRAY['wifi', 'charging_outlets', 'quiet', 'work_friendly', 'ac'], ARRAY['coworking', 'meeting rooms', 'events', 'networking'], ARRAY['aesthetic', 'quiet', 'minimalist'], true, false, true, 'Best coworking spot for focused work with excellent natural lighting.', 'low', 'fast'),

  ('Midnight Ramen', 'Authentic Japanese ramen shop open late with rich broths and handmade noodles.', 'restaurant', '987 Night Market, East Side', ST_SetSRID(ST_MakePoint(-74.012, 40.716), 4326), 4.8, 445, 2, ARRAY['https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800'], '+1 (555) 678-9012', NULL, '{"monday": "17:00 - 02:00", "tuesday": "17:00 - 02:00", "wednesday": "17:00 - 02:00", "thursday": "17:00 - 02:00", "friday": "17:00 - 04:00", "saturday": "17:00 - 04:00", "sunday": "17:00 - 02:00"}', ARRAY['wifi', 'ac'], ARRAY['ramen', 'japanese', 'late night', 'authentic'], ARRAY['cozy', 'lively', 'hidden gem'], true, true, true, NULL, 'high', NULL);
