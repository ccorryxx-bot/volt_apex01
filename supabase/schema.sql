-- VOLT APEX Supabase Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE user_role AS ENUM ('player', 'agent', 'admin');
CREATE TYPE user_status AS ENUM ('active', 'suspended', 'banned');
CREATE TYPE affiliate_tier AS ENUM ('standard', 'silver', 'gold', 'platinum');
CREATE TYPE txn_type AS ENUM ('deposit', 'withdraw', 'bet', 'win', 'bonus', 'commission');
CREATE TYPE txn_status AS ENUM ('pending', 'approved', 'rejected', 'processing');
CREATE TYPE payment_method AS ENUM ('kpay', 'wave', 'cbpay', 'uabpay');
CREATE TYPE game_category AS ENUM ('slot', 'live', 'fishing', 'sport', 'lottery', 'crash');
CREATE TYPE bonus_type AS ENUM ('welcome', 'deposit', 'daily', 'referral', 'cashback', 'rebate');
CREATE TYPE bonus_status AS ENUM ('active', 'completed', 'expired', 'forfeited');
CREATE TYPE commission_status AS ENUM ('pending', 'paid');
CREATE TYPE announcement_type AS ENUM ('ticker', 'popup', 'banner');

-- users table
CREATE TABLE IF NOT EXISTS public.users (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username         TEXT UNIQUE NOT NULL,
  phone_number     TEXT UNIQUE NOT NULL,
  email            TEXT,
  balance          NUMERIC(15,2) DEFAULT 0,
  bonus_balance    NUMERIC(15,2) DEFAULT 0,
  role             user_role DEFAULT 'player',
  status           user_status DEFAULT 'active',
  referral_code    TEXT UNIQUE,
  referred_by      UUID REFERENCES public.users(id),
  affiliate_tier   affiliate_tier DEFAULT 'standard',
  nft_avatar_seed  TEXT,
  nft_avatar_url   TEXT,
  kyc_verified     BOOLEAN DEFAULT FALSE,
  total_deposited  NUMERIC(15,2) DEFAULT 0,
  total_withdrawn  NUMERIC(15,2) DEFAULT 0,
  last_login_at    TIMESTAMPTZ,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES public.users(id),
  type             txn_type NOT NULL,
  amount           NUMERIC(15,2) NOT NULL,
  balance_before   NUMERIC(15,2),
  balance_after    NUMERIC(15,2),
  status           txn_status DEFAULT 'pending',
  payment_method   payment_method,
  payment_account  TEXT,
  payment_ref      TEXT,
  screenshot_url   TEXT,
  admin_note       TEXT,
  processed_by     UUID REFERENCES public.users(id),
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- games table
CREATE TABLE IF NOT EXISTS public.games (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  name_mm          TEXT,
  provider         TEXT,
  category         game_category NOT NULL,
  game_code        TEXT,
  thumbnail_url    TEXT,
  launch_url       TEXT,
  is_active        BOOLEAN DEFAULT TRUE,
  is_featured      BOOLEAN DEFAULT FALSE,
  is_new           BOOLEAN DEFAULT FALSE,
  is_hot           BOOLEAN DEFAULT FALSE,
  rtp              NUMERIC(5,2),
  min_bet          NUMERIC(10,2),
  sort_order       INTEGER DEFAULT 0,
  play_count       BIGINT DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- game_sessions table
CREATE TABLE IF NOT EXISTS public.game_sessions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES public.users(id),
  game_id          UUID NOT NULL REFERENCES public.games(id),
  bet_amount       NUMERIC(15,2),
  win_amount       NUMERIC(15,2),
  net_result       NUMERIC(15,2),
  session_token    TEXT,
  started_at       TIMESTAMPTZ DEFAULT NOW(),
  ended_at         TIMESTAMPTZ
);

-- bonuses table
CREATE TABLE IF NOT EXISTS public.bonuses (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  name_mm          TEXT,
  type             bonus_type NOT NULL,
  amount           NUMERIC(15,2),
  percentage       NUMERIC(5,2),
  max_bonus_amount NUMERIC(15,2),
  min_deposit      NUMERIC(15,2) DEFAULT 0,
  wagering_req     NUMERIC(5,2) DEFAULT 1,
  is_active        BOOLEAN DEFAULT TRUE,
  start_at         TIMESTAMPTZ,
  expires_at       TIMESTAMPTZ
);

-- user_bonuses table
CREATE TABLE IF NOT EXISTS public.user_bonuses (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES public.users(id),
  bonus_id         UUID NOT NULL REFERENCES public.bonuses(id),
  status           bonus_status DEFAULT 'active',
  bonus_amount     NUMERIC(15,2),
  wagered_amount   NUMERIC(15,2) DEFAULT 0,
  required_wager   NUMERIC(15,2),
  claimed_at       TIMESTAMPTZ DEFAULT NOW()
);

-- affiliate_commissions table
CREATE TABLE IF NOT EXISTS public.affiliate_commissions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id         UUID NOT NULL REFERENCES public.users(id),
  player_id        UUID NOT NULL REFERENCES public.users(id),
  transaction_id   UUID REFERENCES public.transactions(id),
  commission_rate  NUMERIC(5,4),
  commission_amount NUMERIC(15,2),
  level            INTEGER DEFAULT 1,
  status           commission_status DEFAULT 'pending',
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- affiliate_settings table
CREATE TABLE IF NOT EXISTS public.affiliate_settings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier             affiliate_tier UNIQUE NOT NULL,
  level1_rate      NUMERIC(5,4) DEFAULT 0.0300,
  level2_rate      NUMERIC(5,4) DEFAULT 0.0150,
  level3_rate      NUMERIC(5,4) DEFAULT 0.0050,
  min_payout       NUMERIC(15,2) DEFAULT 10000
);

-- payment_accounts table
CREATE TABLE IF NOT EXISTS public.payment_accounts (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  method           payment_method NOT NULL,
  account_name     TEXT NOT NULL,
  account_number   TEXT NOT NULL,
  display_name     TEXT,
  qr_code_url      TEXT,
  is_active        BOOLEAN DEFAULT TRUE,
  daily_limit      NUMERIC(15,2),
  sort_order       INTEGER DEFAULT 0
);

-- announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT,
  title_mm         TEXT,
  content          TEXT,
  content_mm       TEXT,
  type             announcement_type DEFAULT 'ticker',
  is_active        BOOLEAN DEFAULT TRUE,
  priority         INTEGER DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- audit_logs table
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id         UUID REFERENCES public.users(id),
  action           TEXT NOT NULL,
  target_user_id   UUID,
  target_table     TEXT,
  old_value        JSONB,
  new_value        JSONB,
  ip_address       TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON public.transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON public.transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_game_sessions_user_id ON public.game_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_commissions_agent_id ON public.affiliate_commissions(agent_id);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON public.users(referral_code);

-- RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bonuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bonuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "users_own" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "users_update_own" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "transactions_own" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "transactions_insert_own" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "game_sessions_own" ON public.game_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "games_read_all" ON public.games FOR SELECT USING (is_active = true);
CREATE POLICY "payment_accounts_active" ON public.payment_accounts FOR SELECT USING (is_active = true);
CREATE POLICY "bonuses_read_all" ON public.bonuses FOR SELECT USING (is_active = true);
CREATE POLICY "user_bonuses_own" ON public.user_bonuses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "announcements_active" ON public.announcements FOR SELECT USING (is_active = true);
CREATE POLICY "commissions_own" ON public.affiliate_commissions FOR SELECT USING (auth.uid() = agent_id);

-- Seed: affiliate settings
INSERT INTO public.affiliate_settings (tier, level1_rate, level2_rate, level3_rate, min_payout) VALUES
  ('standard', 0.0300, 0.0150, 0.0050, 10000),
  ('silver',   0.0350, 0.0175, 0.0075, 10000),
  ('gold',     0.0400, 0.0200, 0.0100, 10000),
  ('platinum', 0.0500, 0.0250, 0.0125, 10000)
ON CONFLICT DO NOTHING;

-- Seed: announcements
INSERT INTO public.announcements (title_mm, content_mm, type, is_active, priority) VALUES
  ('VOLT APEX မှ ကြိုဆိုသည်!', '🎉 VOLT APEX Platform မှ ကြိုဆိုပါသည်! Welcome Bonus 100% ရယူပါ', 'ticker', true, 1),
  ('ဝန်ဆောင်မှုအချိန်', '💬 Customer Service 24/7 ဝန်ဆောင်မှု ပေးနေပါသည်', 'ticker', true, 2)
ON CONFLICT DO NOTHING;
