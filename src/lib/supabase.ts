import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://kygawsofkdbyoywgydqn.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseAnonKey) {
  console.warn("VITE_SUPABASE_ANON_KEY is not set. Supabase features will not work.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey || "placeholder", {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type UserRole = "player" | "agent" | "admin";
export type UserStatus = "active" | "suspended" | "banned";
export type AffiliateTier = "standard" | "silver" | "gold" | "platinum";

export interface UserProfile {
  id: string;
  username: string;
  phone_number: string;
  email?: string;
  balance: number;
  bonus_balance: number;
  role: UserRole;
  status: UserStatus;
  referral_code?: string;
  referred_by?: string;
  affiliate_tier: AffiliateTier;
  nft_avatar_seed?: string;
  nft_avatar_url?: string;
  kyc_verified: boolean;
  total_deposited: number;
  total_withdrawn: number;
  last_login_at?: string;
  created_at: string;
}
