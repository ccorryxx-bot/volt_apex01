<template>
  <div class="min-h-screen hex-bg" style="background: var(--volt-black);">
    <TopNavBar />
    <div class="px-4 pt-4 pb-24 max-w-lg mx-auto">
      <div class="glass-card hud-bracket mb-4 relative">
        <div class="scanning-line"></div>
        <div class="flex items-center gap-3 mb-4">
          <NftAvatar :src="auth.profile?.nft_avatar_url" :size="52" :online="true" />
          <div>
            <div class="font-heading text-sm" style="color: var(--volt-electric);">{{ auth.profile?.username || 'Player' }}</div>
            <div class="text-xs mt-0.5" style="color: var(--volt-gray);">{{ tierLabel }}</div>
          </div>
          <div class="ml-auto text-right">
            <div class="font-number text-xl font-bold text-gold-gradient">{{ formatBalance(auth.profile?.balance || 0) }}</div>
            <div class="text-xs" style="color: var(--volt-gray);">MMK</div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <button class="btn-primary h-11 text-sm" @click="$router.push('/deposit')">💰 ငွေသွင်းမည်</button>
          <button class="btn-secondary h-11 text-sm" @click="$router.push('/withdraw')">💸 ငွေထုတ်မည်</button>
        </div>
      </div>

      <div class="glass-card mb-4">
        <div class="flex items-center justify-between mb-3">
          <span class="font-heading text-xs tracking-wider" style="color: var(--volt-electric);">⚡ မကြာမီ ဆုကြေးငွေများ</span>
          <span class="pulse-online mr-1"></span>
          <span class="font-number text-xs" style="color: var(--volt-emerald);">{{ onlineCount.toLocaleString() }} online</span>
        </div>
        <div class="space-y-2">
          <div v-for="t in recentTxns" :key="t.id" class="flex items-center justify-between py-2 border-b" style="border-color: rgba(0,212,255,0.08);">
            <div>
              <div class="text-xs font-medium" style="color: var(--volt-white);">{{ t.type }}</div>
              <div class="text-xs" style="color: var(--volt-gray);">{{ t.date }}</div>
            </div>
            <div class="font-number text-sm" :style="t.amount > 0 ? 'color: var(--volt-emerald)' : 'color: var(--volt-red)'">
              {{ t.amount > 0 ? '+' : '' }}{{ formatBalance(t.amount) }}
            </div>
          </div>
        </div>
        <button class="w-full text-xs mt-3" style="color: var(--volt-electric);" @click="$router.push('/transactions')">အားလုံးကြည့်ရန် →</button>
      </div>

      <div class="glass-card mb-4">
        <div class="font-heading text-xs mb-3 tracking-wider" style="color: var(--volt-electric);">🎮 ကစားရန် →</div>
        <button class="btn-primary" @click="$router.push('/games')">Game Lobby သို့ သွားမည်</button>
      </div>
    </div>
    <BottomNavBar />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import TopNavBar from "@/components/layout/TopNavBar.vue";
import BottomNavBar from "@/components/layout/BottomNavBar.vue";
import NftAvatar from "@/components/ui/NftAvatar.vue";

const auth = useAuthStore();
const onlineCount = ref(1243);

const tierLabel = computed(() => {
  const map: Record<string, string> = { standard: "Standard", silver: "Silver ⭐", gold: "Gold ⭐⭐", platinum: "Platinum 💎" };
  return map[auth.profile?.affiliate_tier || "standard"] || "Standard";
});

const recentTxns = ref([
  { id: 1, type: "ငွေသွင်းမှု", date: "ယနေ့", amount: 50000 },
  { id: 2, type: "ဆုကြေး", date: "မနေ့", amount: 12500 },
  { id: 3, type: "ငွေထုတ်မှု", date: "မနေ့", amount: -30000 },
]);

onMounted(() => {
  setInterval(() => { onlineCount.value = 1200 + Math.floor(Math.random() * 200); }, 5000);
});

function formatBalance(n: number) {
  return n.toLocaleString("en-US") + " K";
}
</script>
