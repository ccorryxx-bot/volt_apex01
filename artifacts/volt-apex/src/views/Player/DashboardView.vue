<template>
  <div class="min-h-screen hex-bg" style="background: var(--volt-black);">
    <TopNavBar />

    <!-- Announcement Ticker -->
    <div v-if="announcements.tickers.length" class="ticker-bar overflow-hidden">
      <div class="ticker-inner flex" :style="`animation-duration: ${tickerDuration}s`">
        <span v-for="a in tickerItems" :key="a.id" class="ticker-item">
          📢 {{ a.content_mm || a.content }}
        </span>
      </div>
    </div>

    <div class="px-4 pt-3 pb-28 max-w-lg mx-auto">

      <!-- Balance Card -->
      <div class="glass-card hud-bracket mb-3 relative overflow-hidden">
        <div class="scanning-line"></div>
        <div class="absolute right-4 top-4 opacity-10">
          <svg width="80" height="80" viewBox="0 0 80 80"><circle cx="40" cy="40" r="38" fill="none" stroke="var(--volt-gold)" stroke-width="1"/><path d="M40 10 L70 40 L40 70 L10 40 Z" fill="none" stroke="var(--volt-electric)" stroke-width="0.5"/></svg>
        </div>
        <div class="flex items-start gap-3">
          <NftAvatar :src="auth.profile?.nft_avatar_url" :size="52" :online="true" />
          <div class="flex-1 min-w-0">
            <div class="font-heading text-sm truncate" style="color: var(--volt-electric);">{{ auth.profile?.username || 'Player' }}</div>
            <div class="text-xs" style="color: var(--volt-gray);">{{ tierLabel }} <span class="pulse-online ml-1.5 inline-block"></span></div>
          </div>
        </div>

        <div class="mt-4 mb-4">
          <div class="text-xs mb-1" style="color: var(--volt-gray);">ငွေကျန်</div>
          <div class="font-number text-3xl font-black text-gold-gradient">
            {{ (auth.profile?.balance || 0).toLocaleString() }}
            <span class="text-sm font-medium" style="color: var(--volt-gray);">MMK</span>
          </div>
          <div v-if="(auth.profile?.bonus_balance || 0) > 0" class="text-xs mt-1" style="color: var(--volt-electric);">
            + {{ (auth.profile?.bonus_balance || 0).toLocaleString() }} Bonus MMK
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2">
          <button class="btn-primary h-11 text-sm" @click="$router.push('/deposit')">💰 ငွေသွင်းမည်</button>
          <button class="btn-secondary h-11 text-sm" @click="$router.push('/withdraw')">💸 ငွေထုတ်မည်</button>
        </div>
      </div>

      <!-- Quick Nav -->
      <div class="grid grid-cols-4 gap-2 mb-4">
        <button v-for="q in quickNav" :key="q.path" class="quick-nav-btn flex flex-col items-center gap-1 p-3 rounded-xl" @click="$router.push(q.path)">
          <span class="text-2xl">{{ q.icon }}</span>
          <span class="text-xs" style="color: var(--volt-gray);">{{ q.label }}</span>
        </button>
      </div>

      <!-- Featured Games Banner -->
      <div class="glass-card mb-4 p-0 overflow-hidden">
        <div class="p-3 flex items-center justify-between">
          <span class="font-heading text-xs tracking-wider" style="color: var(--volt-electric);">🎮 ထိပ်တန်း ဂိမ်းများ</span>
          <button class="text-xs" style="color: var(--volt-gold);" @click="$router.push('/games')">အားလုံးကြည့် →</button>
        </div>
        <div class="flex gap-2 overflow-x-auto px-3 pb-3 no-scrollbar">
          <div v-for="g in gamesStore.featuredGames" :key="g.id"
            class="game-card relative flex-shrink-0 w-24 rounded-xl overflow-hidden cursor-pointer"
            @click="launchGame(g)">
            <img :src="g.thumbnail_url || `https://placehold.co/96x128/0D1B3E/D4AF37?text=${encodeURIComponent(g.provider||'GAME')}`" class="w-24 h-32 object-cover" loading="lazy" />
            <div class="absolute inset-x-0 bottom-0 p-1.5" style="background: linear-gradient(0deg, rgba(5,8,17,0.95) 0%, transparent 100%);">
              <div class="text-xs text-center leading-tight" style="color: var(--volt-white);">{{ g.name }}</div>
            </div>
            <div v-if="g.is_hot" class="absolute top-1 right-1 text-xs">🔥</div>
            <div v-if="g.is_new" class="absolute top-1 left-1 px-1 text-xs rounded font-bold" style="background: var(--volt-emerald); color: #050811;">NEW</div>
          </div>
        </div>
      </div>

      <!-- Recent Transactions -->
      <div class="glass-card">
        <div class="flex items-center justify-between mb-3">
          <span class="font-heading text-xs tracking-wider" style="color: var(--volt-electric);">⚡ မကြာမီ မှတ်တမ်း</span>
          <button class="text-xs" style="color: var(--volt-gold);" @click="$router.push('/transactions')">အားလုံးကြည့် →</button>
        </div>
        <div v-if="txStore.loading" class="space-y-2">
          <VoltSkeleton v-for="i in 3" :key="i" height="48px" />
        </div>
        <div v-else class="space-y-0">
          <div v-for="t in txStore.transactions.slice(0, 4)" :key="t.id" class="flex items-center justify-between py-2.5 border-b last:border-0" style="border-color: rgba(0,212,255,0.08);">
            <div class="flex items-center gap-2.5">
              <span class="text-base">{{ txIcons[t.type] || '💳' }}</span>
              <div>
                <div class="text-xs font-medium" style="color: var(--volt-white);">{{ txLabels[t.type] || t.type }}</div>
                <div class="text-xs" style="color: var(--volt-gray);">{{ new Date(t.created_at).toLocaleDateString() }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="font-number text-sm font-bold" :style="['deposit','win','bonus','commission'].includes(t.type) ? 'color: var(--volt-emerald)' : 'color: var(--volt-red)'">
                {{ ['deposit','win','bonus','commission'].includes(t.type) ? '+' : '-' }}{{ t.amount.toLocaleString() }}
              </div>
              <div class="text-xs" :style="t.status === 'approved' ? 'color: var(--volt-emerald)' : t.status === 'rejected' ? 'color: var(--volt-red)' : 'color: var(--volt-gold)'">
                {{ { approved: '✓', pending: '⏳', rejected: '✕', processing: '⚙' }[t.status] || '⏳' }}
              </div>
            </div>
          </div>
          <div v-if="txStore.transactions.length === 0" class="text-center py-6 text-sm" style="color: var(--volt-gray);">မှတ်တမ်း မရှိသေးပါ</div>
        </div>
      </div>

      <!-- Online Counter -->
      <div class="mt-3 text-center">
        <span class="pulse-online mr-1.5"></span>
        <span class="font-number text-sm" style="color: var(--volt-gray);">ကစားသူ <span style="color: var(--volt-emerald);">{{ onlineCount.toLocaleString() }}</span> ဦး online</span>
      </div>
    </div>
    <BottomNavBar />
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { useTransactionsStore } from "@/stores/transactions.store";
import { useGamesStore } from "@/stores/games.store";
import { useAnnouncementsStore } from "@/stores/announcements.store";
import TopNavBar from "@/components/layout/TopNavBar.vue";
import BottomNavBar from "@/components/layout/BottomNavBar.vue";
import NftAvatar from "@/components/ui/NftAvatar.vue";
import VoltSkeleton from "@/components/ui/VoltSkeleton.vue";
import type { Game } from "@/stores/games.store";

const router = useRouter();
const auth = useAuthStore();
const txStore = useTransactionsStore();
const gamesStore = useGamesStore();
const announcements = useAnnouncementsStore();

const onlineCount = ref(1243);

const tierLabel = computed(() => ({
  standard: "Standard ✦", silver: "Silver ⭐", gold: "Gold ⭐⭐", platinum: "Platinum 💎"
}[auth.profile?.affiliate_tier || "standard"] || "Standard"));

const tickerItems = computed(() => [...announcements.tickers, ...announcements.tickers]);
const tickerDuration = computed(() => Math.max(20, announcements.tickers.length * 8));

const quickNav = [
  { path: "/transactions", icon: "📋", label: "မှတ်တမ်း" },
  { path: "/bonuses", icon: "🎁", label: "Bonus" },
  { path: "/affiliate", icon: "🔗", label: "Affiliate" },
  { path: "/profile", icon: "👤", label: "ကျွန်ုပ်" },
];

const txIcons: Record<string, string> = { deposit: "💰", withdraw: "💸", bet: "🎮", win: "🏆", bonus: "🎁", commission: "💼" };
const txLabels: Record<string, string> = { deposit: "ငွေသွင်းမှု", withdraw: "ငွေထုတ်မှု", bet: "ကစားမှု", win: "ဆုကြေး", bonus: "Bonus", commission: "Commission" };

function launchGame(g: Game) { router.push(`/games`); }

onMounted(async () => {
  await Promise.all([
    txStore.fetchTransactions(4),
    gamesStore.fetchGames(),
    announcements.fetchAnnouncements(),
    auth.refreshProfile(),
  ]);
  setInterval(() => { onlineCount.value = 1200 + Math.floor(Math.random() * 200); }, 6000);
});
</script>

<style scoped>
.ticker-bar { background: rgba(0,212,255,0.06); border-bottom: 1px solid rgba(0,212,255,0.1); padding: 6px 0; }
.ticker-inner { white-space: nowrap; animation: ticker-scroll linear infinite; }
.ticker-item { display: inline-block; padding: 0 3rem; font-size: 0.75rem; color: var(--volt-electric); }
@keyframes ticker-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.game-card { transition: transform 0.15s ease; }
.game-card:active { transform: scale(0.93); }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.quick-nav-btn { background: rgba(13,27,62,0.7); border: 1px solid rgba(0,212,255,0.12); transition: all 0.15s; }
.quick-nav-btn:active { transform: scale(0.93); border-color: rgba(0,212,255,0.3); }
</style>
