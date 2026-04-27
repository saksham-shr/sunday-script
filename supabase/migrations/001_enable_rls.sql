-- ============================================================
-- Row Level Security for The Sunday Script
-- Run this once in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/yanmfnkcjomvalkehfut/sql/new
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_posts ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- POSTS
-- ============================================================
-- Anyone can read published posts
CREATE POLICY "public_read_published_posts" ON posts
  FOR SELECT USING (status = 'published');

-- Authenticated users (admin + collaborators) have full access
CREATE POLICY "auth_full_access_posts" ON posts
  FOR ALL USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- CATEGORIES
-- ============================================================
CREATE POLICY "public_read_categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "auth_manage_categories" ON categories
  FOR ALL USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- POST_CATEGORIES (junction table)
-- ============================================================
CREATE POLICY "public_read_post_categories" ON post_categories
  FOR SELECT USING (true);

CREATE POLICY "auth_manage_post_categories" ON post_categories
  FOR ALL USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- SUBSCRIBERS
-- ============================================================
-- Anyone can subscribe (insert their email)
CREATE POLICY "anon_insert_subscribers" ON subscribers
  FOR INSERT WITH CHECK (true);

-- Only authenticated users (admin) can read / delete subscribers
CREATE POLICY "auth_read_subscribers" ON subscribers
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "auth_delete_subscribers" ON subscribers
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- ============================================================
-- COLLABORATORS
-- ============================================================
-- Anyone can apply (insert)
CREATE POLICY "anon_insert_collaborators" ON collaborators
  FOR INSERT WITH CHECK (true);

-- Anyone can read (needed for duplicate-email check before applying,
-- and for the OTP login flow which checks status by email)
CREATE POLICY "public_read_collaborators" ON collaborators
  FOR SELECT USING (true);

-- Only authenticated users (admin) can update / delete
CREATE POLICY "auth_manage_collaborators" ON collaborators
  FOR UPDATE USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "auth_delete_collaborators" ON collaborators
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- ============================================================
-- COMMENTS
-- ============================================================
-- Anyone can submit a comment (it lands with status='pending')
CREATE POLICY "anon_insert_comments" ON comments
  FOR INSERT WITH CHECK (true);

-- Public can read approved comments only
CREATE POLICY "public_read_approved_comments" ON comments
  FOR SELECT USING (status = 'approved');

-- Authenticated users (admin) can see all and manage
CREATE POLICY "auth_manage_comments" ON comments
  FOR ALL USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- GUEST POSTS
-- ============================================================
-- Anyone can submit a guest post (lands with status='pending')
CREATE POLICY "anon_insert_guest_posts" ON guest_posts
  FOR INSERT WITH CHECK (true);

-- Only authenticated users (admin) can read / manage
CREATE POLICY "auth_manage_guest_posts" ON guest_posts
  FOR ALL USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ============================================================
-- RPC: increment / decrement post likes
-- These functions use SECURITY DEFINER so they bypass RLS.
-- Grant execute to anon so public visitors can like posts.
-- ============================================================
-- The exact parameter type depends on your posts.id type (uuid or bigint).
-- If you get an error, check your posts table's id column type and adjust accordingly.
GRANT EXECUTE ON FUNCTION increment_post_likes TO anon;
GRANT EXECUTE ON FUNCTION decrement_post_likes TO anon;
