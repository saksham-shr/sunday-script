-- ============================================================
-- Migration 004: Admin replies to comments
-- Run in Supabase SQL Editor after 003
-- ============================================================

-- Add parent_id (null = top-level comment, set = admin reply)
ALTER TABLE comments
  ADD COLUMN IF NOT EXISTS parent_id uuid REFERENCES comments(id) ON DELETE CASCADE;

-- Flag so the UI can style admin replies differently
ALTER TABLE comments
  ADD COLUMN IF NOT EXISTS is_admin_reply boolean NOT NULL DEFAULT false;

-- Index for fast lookup of replies by parent
CREATE INDEX IF NOT EXISTS comments_parent_id_idx ON comments(parent_id);
