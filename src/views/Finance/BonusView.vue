<template>
  <div class="min-h-screen" style="background: var(--volt-black);">
    <TopNavBar />
    <div class="px-4 pt-4 pb-28 max-w-lg mx-auto">
      <h2 class="font-heading text-base tracking-wider mb-4" style="color: var(--volt-electric);">🎁 Bonus & Promotions</h2>

      <!-- Active Bonus Balance -->
      <div class="glass-card hud-bracket relative overflow-hidden mb-4">
        <div class="scanning-line"></div>
        <div class="flex items-center justify-between">
          <div>
            <div class="text-xs mb-1" style="color: var(--volt-gray);">Bonus ငွေကျန်</div>
            <div class="font-number text-2xl font-black text-gold-gradient">{{ (auth.profile?.bonus_balance || 0).toLocaleString() }}</div>
            <div class="text-xs" style="color: var(--volt-gray);">MMK</div>
          </div>
          <div class="text-5xl">💎</div>
        </div>
      </div>

      <!-- Promo Cards -->
      <div class="space-y-3 mb-4">
        <div v-for="promo in promos" :key="promo.id" class="promo-card relative overflow-hidden rounded-2xl p-4" :style="`background: ${promo.bg}; border: 1px solid rgba(255,255,255,0.07);`">
          <div class="relative z-10">
            <div class="flex items-start justify-between mb-2">
              <div>
                <div class="text-2xl mb-1">{{ promo.icon }}</div>
                <div class="font-heading text-sm font-bold" style="color: var(--volt-white);">{{ promo.title }}</div>
                <div class="text-xs mt-0.5" style="color: rgba(255,255,255,0.6);">{{ promo.subtitle }}</div>
              </div>
              <div class="font-heading text-2xl font-black text-gold-gradient">{{ promo.badge }}</div>
            </div>
            <p class="text-xs mb-3" style="color: rgba(255,255,255,0.55);">{{ promo.desc }}</p>
            <button
              class="px-5 h-9 rounded-xl text-xs font-bold transition-all"
              :style="promo.claimed ? 'background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.3);' : 'background: var(--volt-gold); color: #050811;'"
              :disabled="promo.claimed"
              @click="claimBonus(promo)">
              {{ promo.claimed ? '✓ ရယူပြီး' : 'ရယူမည် →' }}
            </button>
          </div>
          <div v-if="promo.expires" class="absolute top-3 right-3 text-xs px-2 py-0.5 rounded-full" style="background: rgba(255,61,90,0.2); color: var(--volt-red);">{{ promo.expires }}</div>
        </div>
      </div>

      <!-- How it works -->
      <div class="glass-card mb-4">
        <div class="text-xs mb-3 font-medium" style="color: var(--volt-electric);">ℹ️ Bonus သုံးနည်း</div>
        <div class="space-y-2">
          <div v-for="step in howTo" :key="step.n" class="flex items-center gap-3 text-xs">
            <div class="w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-xs" style="background: rgba(0,212,255,0.15); color: var(--volt-electric);">{{ step.n }}</div>
            <span style="color: var(--volt-gray);">{{ step.text }}</span>
          </div>
        </div>
      </div>

      <!-- Bonus History -->
      <div class="glass-card">
        <div class="text-xs mb-3 font-medium" style="color: var(--volt-electric);">📋 Bonus မှတ်တမ်း</div>
        <div v-if="bonusHistory.length === 0" class="text-center py-6">
          <p class="text-sm" style="color: var(--volt-gray);">Bonus မှတ်တမ်း မရှိသေးပါ</p>
        </div>
        <div v-else class="space-y-0">
          <div v-for="b in bonusHistory" :key="b.id" class="flex items-center justify-between py-2.5 border-b last:border-0" style="border-color: rgba(0,212,255,0.08);">
            <div>
              <div class="text-xs font-medium" style="color: var(--volt-white);">{{ (b.bonus_type || b.bonus_id || 'Bonus').replace(/_/g,' ').toUpperCase() }}</div>
              <div class="text-xs" style="color: var(--volt-gray);">{{ new Date(b.created_at).toLocaleDateString() }}</div>
            </div>
            <div class="font-number text-sm font-bold" style="color: var(--volt-emerald);">+{{ (b.amount || 0).toLocaleString() }}</div>
          </div>
        </div>
      </div>
    </div>
    <BottomNavBar />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import { useUiStore } from "@/stores/ui.store";
import { supabase } from "@/lib/supabase";
import TopNavBar from "@/components/layout/TopNavBar.vue";
import BottomNavBar from "@/components/layout/BottomNavBar.vue";

const auth = useAuthStore();
const ui = useUiStore();
const bonusHistory = ref<any[]>([]);
const claimedIds = ref<Set<string>>(new Set());

interface Promo { id: string; icon: string; title: string; subtitle: string; badge: string; desc: string; bg: string; claimed: boolean; expires?: string; }

const promos = ref<Promo[]>([
  { id: "welcome",  icon: "🎉", title: "Welcome Bonus",   subtitle: "အသစ် Member",         badge: "100%", desc: "ပထမဆုံး ငွေသွင်းမှုတွင် 100% Bonus — Max 100,000 MMK",    bg: "linear-gradient(135deg,#0D1B3E,#1a2d5a)", claimed: false, expires: "24 နာရီ" },
  { id: "reload",   icon: "🔄", title: "Daily Reload",    subtitle: "နေ့တိုင်း",             badge: "10%",  desc: "ငွေသွင်းတိုင်း 10% Reload Bonus — Max 50,000 MMK",          bg: "linear-gradient(135deg,#0A1428,#162640)", claimed: false },
  { id: "referral", icon: "🔗", title: "Referral Bonus",  subtitle: "သူငယ်ချင်းဖိတ်ကြားပါ", badge: "5K",   desc: "ကောင်မ်တစ်ခုဖိတ်ပါ — 5,000 MMK ရမည် · ကန့်သတ်မရှိ",       bg: "linear-gradient(135deg,#091220,#0D1B3E)", claimed: false },
  { id: "cashback", icon: "💸", title: "Weekly Cashback", subtitle: "အပတ်တိုင်း Monday",   badge: "5%",   desc: "ရှုံးငွေ 5% ကို Monday တိုင်း ပြန်ပေးသည်",                   bg: "linear-gradient(135deg,#0D1B3E,#1A3060)", claimed: false },
]);

const howTo = [
  { n: 1, text: "Bonus ကို ရယူမည် ခလုတ်ကို နှိပ်ပါ" },
  { n: 2, text: "Bonus ငွေသည် Bonus Balance တွင် ရောက်မည်" },
  { n: 3, text: "Bonus Balance ဖြင့် ဂိမ်းကစားနိုင်သည်" },
  { n: 4, text: "Rollover ပြည့်မှ Main Balance သို့ ပြောင်းနိုင်" },
];

async function claimBonus(promo: Promo) {
  if (!auth.user || promo.claimed) return;
  const { error } = await supabase.from("user_bonuses").insert({ user_id: auth.user.id, bonus_id: promo.id, bonus_type: promo.id, status: "claimed", amount: 0 });
  if (error && !error.message.includes("duplicate")) { ui.toast.error("ရယူမှု မအောင်မြင်ပါ"); return; }
  promo.claimed = true;
  claimedIds.value.add(promo.id);
  ui.toast.success(`${promo.title} ရယူပြီးပါပြီ! 🎉 Admin မှ စစ်ဆေးပြီး ထည့်ပေးမည်`);
  fetchBonusHistory();
}

async function fetchBonusHistory() {
  if (!auth.user) return;
  const { data } = await supabase.from("user_bonuses").select("*").eq("user_id", auth.user.id).order("created_at", { ascending: false }).limit(15);
  if (data) {
    bonusHistory.value = data;
    promos.value.forEach(p => { if (data.some(b => b.bonus_id === p.id || b.bonus_type === p.id)) p.claimed = true; });
  }
}

onMounted(fetchBonusHistory);
</script>

<style scoped>
.promo-card { transition: transform 0.15s ease; }
.promo-card:active { transform: scale(0.98); }
</style>
