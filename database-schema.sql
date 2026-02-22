-- ============================================================
-- BagBuilder Database Schema (Supabase Anonymous Auth)
-- Run in Supabase SQL Editor to set up or reset the database
-- ============================================================

-- Drop existing tables (run if resetting)
-- DROP TABLE IF EXISTS journal CASCADE;
-- DROP TABLE IF EXISTS contributions CASCADE;
-- DROP TABLE IF EXISTS stables CASCADE;
-- DROP TABLE IF EXISTS trades CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- Users (linked to Supabase anonymous auth sessions)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID UNIQUE NOT NULL,  -- references auth.uid()
  name TEXT,
  profile_label TEXT DEFAULT 'Moderate',
  profile_data JSONB DEFAULT '{}',    -- { spotPct, futPct, reservePct, maxPos, levOk, capital }
  emergency_fund FLOAT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trades
CREATE TABLE IF NOT EXISTS trades (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID NOT NULL,
  date DATE NOT NULL,
  coin TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('spot', 'futures')),
  entry FLOAT NOT NULL,
  exit FLOAT,
  size FLOAT NOT NULL,
  leverage INT DEFAULT 1,
  status TEXT NOT NULL CHECK (status IN ('closed', 'open')),
  pnl_pct FLOAT,
  pnl_usd FLOAT,
  notes TEXT,
  narrative TEXT,
  tp1 BOOLEAN DEFAULT false,
  tp2 BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Stablecoins
CREATE TABLE IF NOT EXISTS stables (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID NOT NULL,
  label TEXT NOT NULL,
  amount FLOAT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contributions
CREATE TABLE IF NOT EXISTS contributions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID NOT NULL,
  date DATE NOT NULL,
  amount FLOAT NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Journal entries
CREATE TABLE IF NOT EXISTS journal (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auth_user_id UUID NOT NULL,
  date DATE NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE stables ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal ENABLE ROW LEVEL SECURITY;

-- Users: each user can only see/modify their own row
CREATE POLICY "Users: own row only" ON users
  FOR ALL USING (auth.uid() = auth_user_id);

-- Trades: scoped to auth user
CREATE POLICY "Trades: own rows only" ON trades
  FOR ALL USING (auth.uid() = auth_user_id);

-- Stables: scoped to auth user
CREATE POLICY "Stables: own rows only" ON stables
  FOR ALL USING (auth.uid() = auth_user_id);

-- Contributions: scoped to auth user
CREATE POLICY "Contributions: own rows only" ON contributions
  FOR ALL USING (auth.uid() = auth_user_id);

-- Journal: scoped to auth user
CREATE POLICY "Journal: own rows only" ON journal
  FOR ALL USING (auth.uid() = auth_user_id);

-- ============================================================
-- Indexes for performance
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_trades_auth_user ON trades(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_stables_auth_user ON stables(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_contributions_auth_user ON contributions(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_journal_auth_user ON journal(auth_user_id);
