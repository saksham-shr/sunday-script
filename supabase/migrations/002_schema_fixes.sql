-- ============================================================
-- Schema fixes — run in Supabase SQL Editor AFTER 001_enable_rls.sql
-- https://supabase.com/dashboard/project/yanmfnkcjomvalkehfut/sql/new
-- ============================================================

-- 1. Extend posts status to include 'review' and 'revisions'
--    (collaborator-submitted posts use these statuses)
ALTER TABLE posts
  DROP CONSTRAINT IF EXISTS posts_status_check;

ALTER TABLE posts
  ADD CONSTRAINT posts_status_check
  CHECK (status = ANY (ARRAY['draft', 'published', 'review', 'revisions']));

-- 2. Add word_count and read_time columns (used by collaborator post action)
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS word_count  integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS read_time   integer DEFAULT 1;

-- 3. Drop + re-create RLS policies cleanly
--    (safe to run even if 001 was already applied)

-- ── posts ──────────────────────────────────────────────────
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_published_posts" ON posts;
DROP POLICY IF EXISTS "auth_full_access_posts"       ON posts;

-- Anyone can read published posts
CREATE POLICY "public_read_published_posts" ON posts
  FOR SELECT USING (status = 'published');

-- Authenticated users (admin + approved collaborators) can do everything
CREATE POLICY "auth_full_access_posts" ON posts
  FOR ALL USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ── categories ─────────────────────────────────────────────
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_categories"  ON categories;
DROP POLICY IF EXISTS "auth_manage_categories"  ON categories;

CREATE POLICY "public_read_categories" ON categories
  FOR SELECT USING (true);

CREATE POLICY "auth_manage_categories" ON categories
  FOR ALL USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ── post_categories ────────────────────────────────────────
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_post_categories" ON post_categories;
DROP POLICY IF EXISTS "auth_manage_post_categories" ON post_categories;

CREATE POLICY "public_read_post_categories" ON post_categories
  FOR SELECT USING (true);

CREATE POLICY "auth_manage_post_categories" ON post_categories
  FOR ALL USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ── subscribers ────────────────────────────────────────────
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_subscribers"  ON subscribers;
DROP POLICY IF EXISTS "auth_read_subscribers"    ON subscribers;
DROP POLICY IF EXISTS "auth_delete_subscribers"  ON subscribers;

CREATE POLICY "anon_insert_subscribers" ON subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "auth_read_subscribers" ON subscribers
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "auth_delete_subscribers" ON subscribers
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- ── collaborators ──────────────────────────────────────────
ALTER TABLE collaborators ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_collaborators"  ON collaborators;
DROP POLICY IF EXISTS "public_read_collaborators"  ON collaborators;
DROP POLICY IF EXISTS "auth_manage_collaborators"  ON collaborators;
DROP POLICY IF EXISTS "auth_delete_collaborators"  ON collaborators;

CREATE POLICY "anon_insert_collaborators" ON collaborators
  FOR INSERT WITH CHECK (true);

-- Public read needed: duplicate-email check before applying (anon),
-- and OTP login checks status by email (authenticated)
CREATE POLICY "public_read_collaborators" ON collaborators
  FOR SELECT USING (true);

CREATE POLICY "auth_manage_collaborators" ON collaborators
  FOR UPDATE USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "auth_delete_collaborators" ON collaborators
  FOR DELETE USING (auth.uid() IS NOT NULL);

-- ── comments ───────────────────────────────────────────────
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_comments"          ON comments;
DROP POLICY IF EXISTS "public_read_approved_comments" ON comments;
DROP POLICY IF EXISTS "auth_manage_comments"          ON comments;

CREATE POLICY "anon_insert_comments" ON comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "public_read_approved_comments" ON comments
  FOR SELECT USING (status = 'approved');

CREATE POLICY "auth_manage_comments" ON comments
  FOR ALL USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ── guest_posts ────────────────────────────────────────────
ALTER TABLE guest_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_guest_posts" ON guest_posts;
DROP POLICY IF EXISTS "auth_manage_guest_posts" ON guest_posts;

CREATE POLICY "anon_insert_guest_posts" ON guest_posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "auth_manage_guest_posts" ON guest_posts
  FOR ALL USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ── likes RPCs ─────────────────────────────────────────────
-- Grant anon execute so public visitors can like posts.
-- (Functions use SECURITY DEFINER so they bypass RLS internally.)
GRANT EXECUTE ON FUNCTION increment_post_likes TO anon;
GRANT EXECUTE ON FUNCTION decrement_post_likes TO anon;
