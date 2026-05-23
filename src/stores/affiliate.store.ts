import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "./auth.store";

export interface AffiliateStats {
  total_downline_l1: number;
  total_downline_l2: number;
  total_downline_l3: number;
  total_commission: number;
  pending_commission: number;
  paid_commission: number;
}

export interface DownlineMember {
  id: string;
  username: string;
  phone_number: string;
  level: number;
  total_deposited: number;
  commission_earned: number;
  created_at: string;
}

export interface CommissionRecord {
  id: string;
  player_id: string;
  commission_amount: number;
  commission_rate: number;
  level: number;
  status: string;
  created_at: string;
  transactions?: { amount: number; type: string };
  users?: { username: string };
}

export const useAffiliateStore = defineStore("affiliate", () => {
  const stats = ref<AffiliateStats>({
    total_downline_l1: 0, total_downline_l2: 0, total_downline_l3: 0,
    total_commission: 0, pending_commission: 0, paid_commission: 0,
  });
  const downline = ref<DownlineMember[]>([]);
  const commissions = ref<CommissionRecord[]>([]);
  const loading = ref(false);
  const auth = useAuthStore();

  const affiliateTierRates: Record<string, { l1: number; l2: number; l3: number }> = {
    standard: { l1: 0.03, l2: 0.015, l3: 0.005 },
    silver:   { l1: 0.035, l2: 0.0175, l3: 0.0075 },
    gold:     { l1: 0.04, l2: 0.02, l3: 0.01 },
    platinum: { l1: 0.05, l2: 0.025, l3: 0.0125 },
  };

  const myRates = computed(() => {
    const tier = auth.profile?.affiliate_tier || "standard";
    return affiliateTierRates[tier] || affiliateTierRates.standard;
  });

  const referralLink = computed(() => {
    const code = auth.profile?.referral_code || "";
    return `https://voltapex.mm/register?ref=${code}`;
  });

  async function fetchStats() {
    if (!auth.user) return;
    loading.value = true;
    try {
      // Fetch L1 downline
      const { data: l1 } = await supabase
        .from("users")
        .select("id, username, phone_number, total_deposited, created_at")
        .eq("referred_by", auth.user.id);

      if (l1) {
        stats.value.total_downline_l1 = l1.length;
        downline.value = l1.map(u => ({
          id: u.id, username: u.username, phone_number: u.phone_number,
          level: 1, total_deposited: u.total_deposited || 0,
          commission_earned: (u.total_deposited || 0) * myRates.value.l1,
          created_at: u.created_at,
        }));
      }

      // Fetch commissions
      const { data: comms } = await supabase
        .from("affiliate_commissions")
        .select("*, users!player_id(username)")
        .eq("agent_id", auth.user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (comms) {
        commissions.value = comms as any;
        stats.value.total_commission = comms.reduce((s, c) => s + (c.commission_amount || 0), 0);
        stats.value.pending_commission = comms.filter(c => c.status === "pending").reduce((s, c) => s + (c.commission_amount || 0), 0);
        stats.value.paid_commission = comms.filter(c => c.status === "paid").reduce((s, c) => s + (c.commission_amount || 0), 0);
      }
    } finally {
      loading.value = false;
    }
  }

  return { stats, downline, commissions, loading, myRates, referralLink, fetchStats };
});
