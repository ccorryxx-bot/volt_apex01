<template>
  <div class="min-h-screen" style="background: var(--volt-black);">
    <TopNavBar />
    <div class="px-4 pt-4 pb-24 max-w-lg mx-auto">
      <h2 class="font-heading text-base tracking-wider mb-4" style="color: var(--volt-electric);">🔗 Affiliate Hub</h2>

      <div class="glass-card hud-bracket mb-4 text-center">
        <div class="text-xs mb-2" style="color: var(--volt-gray);">သင်၏ Referral Code</div>
        <div class="font-heading text-3xl font-black text-gold-gradient mb-2">{{ auth.profile?.referral_code || 'VOLT001' }}</div>
        <button class="btn-secondary h-10 text-sm mx-auto" style="max-width: 200px;" @click="copyCode">
          {{ copied ? '✓ ကူးယူပြီး' : '📋 ကူးယူမည်' }}
        </button>
      </div>

      <div class="grid grid-cols-3 gap-2 mb-4">
        <div v-for="stat in stats" :key="stat.label" class="glass-card text-center p-3">
          <div class="font-number text-lg font-bold" :style="`color: ${stat.color}`">{{ stat.value }}</div>
          <div class="text-xs mt-0.5" style="color: var(--volt-gray);">{{ stat.label }}</div>
        </div>
      </div>

      <div class="glass-card mb-4">
        <div class="font-heading text-xs tracking-wider mb-3" style="color: var(--volt-electric);">Commission Rates</div>
        <div class="space-y-2">
          <div v-for="lvl in levels" :key="lvl.level" class="flex items-center justify-between">
            <span class="text-sm" style="color: var(--volt-gray);">Level {{ lvl.level }} ({{ lvl.desc }})</span>
            <span class="font-number font-bold" style="color: var(--volt-gold);">{{ lvl.rate }}</span>
          </div>
        </div>
      </div>

      <div class="glass-card">
        <div class="font-heading text-xs tracking-wider mb-3" style="color: var(--volt-electric);">Downline (Level 1)</div>
        <div v-if="downline.length === 0" class="text-sm text-center py-4" style="color: var(--volt-gray);">မည်သူမျှ မမှတ်ပုံတင်သေးပါ</div>
        <div v-else class="space-y-2">
          <div v-for="d in downline" :key="d.id" class="flex items-center justify-between py-2">
            <span class="text-sm" style="color: var(--volt-white);">{{ d.username }}</span>
            <span class="font-number text-sm" style="color: var(--volt-emerald);">+{{ d.commission }}K</span>
          </div>
        </div>
      </div>
    </div>
    <BottomNavBar />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth.store";
import TopNavBar from "@/components/layout/TopNavBar.vue";
import BottomNavBar from "@/components/layout/BottomNavBar.vue";

const auth = useAuthStore();
const copied = ref(false);

const stats = [
  { label: "L1 Members", value: "3", color: "var(--volt-electric)" },
  { label: "ကြိုဆိုငွေ", value: "4.5K", color: "var(--volt-gold)" },
  { label: "Tier", value: "STD", color: "var(--volt-gray)" },
];
const levels = [
  { level: 1, desc: "တိုက်ရိုက်", rate: "3%" },
  { level: 2, desc: "2nd Level", rate: "1.5%" },
  { level: 3, desc: "3rd Level", rate: "0.5%" },
];
const downline = ref<{id:number;username:string;commission:number}[]>([]);

function copyCode() {
  const code = auth.profile?.referral_code || "VOLT001";
  navigator.clipboard.writeText(`https://voltapex.mm/register?ref=${code}`).catch(() => {});
  copied.value = true;
  setTimeout(() => (copied.value = false), 2000);
}
</script>
