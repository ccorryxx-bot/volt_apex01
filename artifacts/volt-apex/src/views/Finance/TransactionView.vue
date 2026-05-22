<template>
  <div class="min-h-screen" style="background: var(--volt-black);">
    <TopNavBar />
    <div class="px-4 pt-4 pb-24 max-w-lg mx-auto">
      <h2 class="font-heading text-base tracking-wider mb-4" style="color: var(--volt-electric);">📋 ငွေသွင်းထုတ် မှတ်တမ်း</h2>
      <div class="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
        <button v-for="f in filters" :key="f.key"
          class="flex-shrink-0 px-4 h-8 rounded-full text-xs font-medium transition-all"
          :style="activeFilter === f.key ? 'background: var(--volt-gold); color: #050811;' : 'background: rgba(13,27,62,0.7); color: var(--volt-gray); border: 1px solid rgba(0,212,255,0.15);'"
          @click="activeFilter = f.key">{{ f.label }}</button>
      </div>
      <div class="space-y-2">
        <div v-for="t in filteredTxns" :key="t.id" class="glass-card p-3">
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm font-medium" style="color: var(--volt-white);">{{ t.type }}</div>
              <div class="text-xs mt-0.5" style="color: var(--volt-gray);">{{ t.method }} · {{ t.date }}</div>
            </div>
            <div class="text-right">
              <div class="font-number text-sm font-bold" :style="t.amount > 0 ? 'color: var(--volt-emerald)' : 'color: var(--volt-red)'">
                {{ t.amount > 0 ? '+' : '' }}{{ t.amount.toLocaleString() }} K
              </div>
              <span class="text-xs px-2 py-0.5 rounded-full" :style="statusStyle(t.status)">{{ t.status }}</span>
            </div>
          </div>
        </div>
        <div v-if="filteredTxns.length === 0" class="text-center py-10 text-sm" style="color: var(--volt-gray);">မှတ်တမ်း မရှိသေးပါ</div>
      </div>
    </div>
    <BottomNavBar />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import TopNavBar from "@/components/layout/TopNavBar.vue";
import BottomNavBar from "@/components/layout/BottomNavBar.vue";

const activeFilter = ref("all");
const filters = [
  { key: "all", label: "အားလုံး" }, { key: "deposit", label: "သွင်းငွေ" },
  { key: "withdraw", label: "ထုတ်ငွေ" }, { key: "bonus", label: "Bonus" },
];
const txns = ref([
  { id: 1, type: "ငွေသွင်းမှု", method: "KPay", date: "2025-05-22", amount: 50000, status: "approved", category: "deposit" },
  { id: 2, type: "ဆုကြေး", method: "Game", date: "2025-05-22", amount: 12500, status: "approved", category: "bonus" },
  { id: 3, type: "ငွေထုတ်မှု", method: "Wave", date: "2025-05-21", amount: -30000, status: "pending", category: "withdraw" },
  { id: 4, type: "Bonus", method: "Welcome", date: "2025-05-20", amount: 10000, status: "approved", category: "bonus" },
]);
const filteredTxns = computed(() => activeFilter.value === "all" ? txns.value : txns.value.filter(t => t.category === activeFilter.value));
function statusStyle(s: string) {
  const m: Record<string, string> = {
    approved: "background: rgba(0,255,179,0.15); color: var(--volt-emerald); border: 1px solid rgba(0,255,179,0.3);",
    pending:  "background: rgba(212,175,55,0.15); color: var(--volt-gold); border: 1px solid rgba(212,175,55,0.3);",
    rejected: "background: rgba(255,61,90,0.15); color: var(--volt-red); border: 1px solid rgba(255,61,90,0.3);",
  };
  return m[s] || m.pending;
}
</script>
<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
