-- ============================================================
-- Migration 003: likes functions, auto-delete, subscriber update
-- Run in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/yanmfnkcjomvalkehfut/sql/new
-- ============================================================

-- ── 1. Ensure likes_count column exists on posts ──────────────
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS likes_count integer NOT NULL DEFAULT 0;

-- ── 2. Create increment / decrement like RPC functions ────────
CREATE OR REPLACE FUNCTION increment_post_likes(target_post_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count integer;
BEGIN
  UPDATE posts
    SET likes_count = COALESCE(likes_count, 0) + 1
    WHERE id = target_post_id
    RETURNING likes_count INTO new_count;
  RETURN COALESCE(new_count, 0);
END;
$$;

CREATE OR REPLACE FUNCTION decrement_post_likes(target_post_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_count integer;
BEGIN
  UPDATE posts
    SET likes_count = GREATEST(0, COALESCE(likes_count, 0) - 1)
    WHERE id = target_post_id
    RETURNING likes_count INTO new_count;
  RETURN COALESCE(new_count, 0);
END;
$$;

-- Grant anonymous users execute so public visitors can like posts
GRANT EXECUTE ON FUNCTION increment_post_likes(uuid) TO anon;
GRANT EXECUTE ON FUNCTION decrement_post_likes(uuid) TO anon;

-- ── 3. Allow authenticated users (admin) to update subscribers ─
--    (needed for the "Confirm" button in the newsletter admin)
DROP POLICY IF EXISTS "auth_update_subscribers" ON subscribers;
CREATE POLICY "auth_update_subscribers" ON subscribers
  FOR UPDATE USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- ── 4. Auto-delete stale collaborator posts (pg_cron) ─────────
-- Enable pg_cron extension (already available on Supabase Pro;
-- skip if on free tier and call the cleanup API route via Vercel Cron instead).
-- CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Function that removes:
--   • posts with status='review'    submitted > 30 days ago (never approved)
--   • posts with status='revisions' last updated > 30 days ago (never resubmitted)
CREATE OR REPLACE FUNCTION cleanup_stale_collab_posts()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM posts
  WHERE status IN ('review', 'revisions')
    AND updated_at < NOW() - INTERVAL '30 days';
END;
$$;

-- Schedule: run every day at 02:00 UTC (uncomment on Pro tier with pg_cron enabled)
-- SELECT cron.schedule(
--   'cleanup-stale-collab-posts',
--   '0 2 * * *',
--   $$ SELECT cleanup_stale_collab_posts(); $$
-- );

-- ── 5. Add created_at to posts if missing (used for 30-day calc) ─
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT NOW();
