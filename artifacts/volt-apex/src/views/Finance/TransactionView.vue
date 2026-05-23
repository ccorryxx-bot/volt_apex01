<template>
  <div class="min-h-screen" style="background: var(--volt-black);">
    <TopNavBar />
    <div class="px-4 pt-4 pb-28 max-w-lg mx-auto">
      <h2 class="font-heading text-base tracking-wider mb-4" style="color: var(--volt-electric);">📋 မှတ်တမ်း</h2>

      <div class="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
        <button v-for="f in filters" :key="f.key"
          class="flex-shrink-0 px-4 h-9 rounded-full text-sm font-medium transition-all"
          :style="activeFilter === f.key ? 'background: var(--volt-gold); color: #050811;' : 'background: rgba(13,27,62,0.7); color: var(--volt-gray); border: 1px solid rgba(0,212,255,0.15);'"
          @click="setFilter(f.key)">
          {{ f.icon }} {{ f.label }}
        </button>
      </div>

      <div v-if="txStore.loading" class="space-y-2">
        <VoltSkeleton v-for="i in 5" :key="i" height="72px" radius="14px" />
      </div>

      <div v-else class="space-y-2">
        <div v-for="t in displayTxns" :key="t.id"
          class="glass-card p-3 cursor-pointer transition-all"
          :class="{ 'expanded': expanded === t.id }"
          @click="expanded = expanded === t.id ? '' : t.id">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                :style="typeStyle(t.type).bg">
                {{ typeStyle(t.type).icon }}
              </div>
              <div>
                <div class="text-sm font-medium" style="color: var(--volt-white);">{{ typeLabel(t.type) }}</div>
                <div class="text-xs mt-0.5" style="color: var(--volt-gray);">{{ formatDate(t.created_at) }} · {{ t.payment_method?.toUpperCase() || '—' }}</div>
              </div>
            </div>
            <div class="text-right">
              <div class="font-number text-sm font-bold" :style="t.amount > 0 && t.type !== 'withdraw' ? 'color: var(--volt-emerald)' : 'color: var(--volt-red)'">
                {{ t.type === 'withdraw' || t.type === 'bet' ? '-' : '+' }}{{ t.amount.toLocaleString() }}
              </div>
              <span class="text-xs px-2 py-0.5 rounded-full" :style="statusStyle(t.status)">{{ statusLabel(t.status) }}</span>
            </div>
          </div>
          <transition name="slide">
            <div v-if="expanded === t.id" class="mt-3 pt-3 border-t space-y-1.5" style="border-color: rgba(0,212,255,0.1);">
              <div v-if="t.payment_ref" class="flex justify-between text-xs">
                <span style="color: var(--volt-gray);">Ref No:</span>
                <span style="color: var(--volt-white);">{{ t.payment_ref }}</span>
              </div>
              <div v-if="t.payment_account" class="flex justify-between text-xs">
                <span style="color: var(--volt-gray);">Account:</span>
                <span style="color: var(--volt-white);">{{ t.payment_account }}</span>
              </div>
              <div v-if="t.admin_note" class="flex justify-between text-xs">
                <span style="color: var(--volt-gray);">Note:</span>
                <span style="color: var(--volt-red);">{{ t.admin_note }}</span>
              </div>
              <div v-if="t.screenshot_url" class="mt-2">
                <img :src="t.screenshot_url" class="w-full max-h-40 object-cover rounded-lg" loading="lazy" />
              </div>
            </div>
          </transition>
        </div>
        <div v-if="displayTxns.length === 0 && !txStore.loading" class="text-center py-12">
          <div class="text-4xl mb-2">📭</div>
          <p class="text-sm" style="color: var(--volt-gray);">မှတ်တမ်း မရှိသေးပါ</p>
        </div>
      </div>

      <button v-if="!txStore.loading && hasMore" class="w-full mt-3 py-3 text-sm font-medium rounded-xl" style="color: var(--volt-electric); border: 1px solid rgba(0,212,255,0.15); background: rgba(13,27,62,0.5);" @click="loadMore">
        နောက်ထပ် ကြည့်ရန် ↓
      </button>
    </div>
    <BottomNavBar />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useTransactionsStore } from "@/stores/transactions.store";
import TopNavBar from "@/components/layout/TopNavBar.vue";
import BottomNavBar from "@/components/layout/BottomNavBar.vue";
import VoltSkeleton from "@/components/ui/VoltSkeleton.vue";
import type { TxnType, TxnStatus } from "@/stores/transactions.store";

const txStore = useTransactionsStore();
const activeFilter = ref<TxnType | "all">("all");
const expanded = ref("");
const limit = ref(20);
const hasMore = ref(false);

onMounted(() => txStore.fetchTransactions(limit.value));

const displayTxns = computed(() => {
  if (activeFilter.value === "all") return txStore.transactions;
  return txStore.transactions.filter(t => t.type === activeFilter.value);
});

async function setFilter(f: TxnType | "all") {
  activeFilter.value = f;
  await txStore.fetchTransactions(limit.value, f === "all" ? undefined : f);
}
async function loadMore() {
  limit.value += 20;
  await txStore.fetchTransactions(limit.value, activeFilter.value === "all" ? undefined : activeFilter.value);
}

const filters = [
  { key: "all", label: "အားလုံး", icon: "📋" },
  { key: "deposit", label: "သွင်းငွေ", icon: "💰" },
  { key: "withdraw", label: "ထုတ်ငွေ", icon: "💸" },
  { key: "win", label: "ဆုကြေး", icon: "🏆" },
  { key: "bonus", label: "Bonus", icon: "🎁" },
];

function typeStyle(type: TxnType) {
  const m: Record<string, { icon: string; bg: string }> = {
    deposit:    { icon: "💰", bg: "background: rgba(0,255,179,0.1)" },
    withdraw:   { icon: "💸", bg: "background: rgba(255,61,90,0.1)" },
    bet:        { icon: "🎮", bg: "background: rgba(0,212,255,0.1)" },
    win:        { icon: "🏆", bg: "background: rgba(212,175,55,0.15)" },
    bonus:      { icon: "🎁", bg: "background: rgba(212,175,55,0.1)" },
    commission: { icon: "💼", bg: "background: rgba(0,212,255,0.1)" },
  };
  return m[type] || { icon: "💳", bg: "background: rgba(13,27,62,0.8)" };
}
function typeLabel(type: TxnType) {
  const m: Record<string, string> = { deposit: "ငွေသွင်းမှု", withdraw: "ငွေထုတ်မှု", bet: "ကစားမှု", win: "ဆုကြေး", bonus: "Bonus", commission: "Commission" };
  return m[type] || type;
}
function statusStyle(s: TxnStatus) {
  const m: Record<string, string> = {
    approved: "background: rgba(0,255,179,0.15); color: var(--volt-emerald); border: 1px solid rgba(0,255,179,0.25);",
    pending:  "background: rgba(212,175,55,0.15); color: var(--volt-gold); border: 1px solid rgba(212,175,55,0.25);",
    rejected: "background: rgba(255,61,90,0.15); color: var(--volt-red); border: 1px solid rgba(255,61,90,0.25);",
    processing: "background: rgba(0,212,255,0.12); color: var(--volt-electric); border: 1px solid rgba(0,212,255,0.2);",
  };
  return m[s] || m.pending;
}
function statusLabel(s: TxnStatus) {
  const m: Record<string, string> = { approved: "အတည်ပြုပြီး", pending: "စစ်ဆေးနေသည်", rejected: "ငြင်းပယ်", processing: "ဆောင်ရွက်နေသည်" };
  return m[s] || s;
}
function formatDate(d: string) {
  const dt = new Date(d);
  return dt.toLocaleDateString("my-MM", { month: "short", day: "numeric" }) + " " + dt.toLocaleTimeString("my-MM", { hour: "2-digit", minute: "2-digit" });
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.slide-enter-active, .slide-leave-active { transition: max-height 0.3s ease, opacity 0.3s; overflow: hidden; max-height: 300px; }
.slide-enter-from, .slide-leave-to { max-height: 0; opacity: 0; }
</style>
