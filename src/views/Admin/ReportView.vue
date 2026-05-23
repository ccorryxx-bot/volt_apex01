<template>
  <div class="min-h-screen" style="background: var(--volt-black);">
    <div class="sticky top-0 z-50 px-4 h-14 flex items-center gap-3" style="background: rgba(10,14,26,0.95); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(0,212,255,0.1);">
      <button @click="$router.push('/admin')" class="text-xl" style="color: var(--volt-electric);">←</button>
      <span class="font-heading text-sm font-bold" style="color: var(--volt-white);">Reports & Analytics</span>
    </div>

    <div class="px-4 pt-3 pb-8 max-w-lg mx-auto">
      <!-- Date Range -->
      <div class="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
        <button v-for="r in ranges" :key="r.key"
          class="flex-shrink-0 px-4 h-8 rounded-full text-xs font-medium transition-all"
          :style="range === r.key ? 'background: var(--volt-gold); color: #050811;' : 'background: rgba(13,27,62,0.7); color: var(--volt-gray); border: 1px solid rgba(0,212,255,0.15);'"
          @click="range = r.key; loadReport()">
          {{ r.label }}
        </button>
      </div>

      <div v-if="loading" class="space-y-3">
        <VoltSkeleton v-for="i in 6" :key="i" height="80px" />
      </div>

      <div v-else>
        <!-- KPIs -->
        <div class="grid grid-cols-2 gap-2 mb-4">
          <div class="glass-card text-center">
            <div class="text-xl mb-1">💰</div>
            <div class="font-number text-xl font-black text-gold-gradient">{{ (stats.totalDeposit / 1000).toFixed(1) }}K</div>
            <div class="text-xs" style="color: var(--volt-gray);">Total Deposit</div>
          </div>
          <div class="glass-card text-center">
            <div class="text-xl mb-1">💸</div>
            <div class="font-number text-xl font-black" style="color: var(--volt-red);">{{ (stats.totalWithdraw / 1000).toFixed(1) }}K</div>
            <div class="text-xs" style="color: var(--volt-gray);">Total Withdraw</div>
          </div>
          <div class="glass-card text-center">
            <div class="text-xl mb-1">📈</div>
            <div class="font-number text-xl font-black" style="color: var(--volt-emerald);">{{ (stats.netRevenue / 1000).toFixed(1) }}K</div>
            <div class="text-xs" style="color: var(--volt-gray);">Net Revenue</div>
          </div>
          <div class="glass-card text-center">
            <div class="text-xl mb-1">👥</div>
            <div class="font-number text-xl font-black" style="color: var(--volt-electric);">{{ stats.newUsers }}</div>
            <div class="text-xs" style="color: var(--volt-gray);">New Users</div>
          </div>
          <div class="glass-card text-center">
            <div class="text-xl mb-1">✅</div>
            <div class="font-number text-xl font-black" style="color: var(--volt-emerald);">{{ stats.approvedDeposits }}</div>
            <div class="text-xs" style="color: var(--volt-gray);">Approved Deposits</div>
          </div>
          <div class="glass-card text-center">
            <div class="text-xl mb-1">⏳</div>
            <div class="font-number text-xl font-black" style="color: var(--volt-gold);">{{ stats.pendingCount }}</div>
            <div class="text-xs" style="color: var(--volt-gray);">Pending</div>
          </div>
        </div>

        <!-- Bar Chart -->
        <div class="glass-card mb-4">
          <div class="text-xs mb-2 font-medium" style="color: var(--volt-electric);">📊 Daily Deposit vs Withdraw</div>
          <div class="flex items-end gap-1 h-28">
            <div v-for="(d, i) in dailyBars" :key="i" class="flex-1 flex flex-col-reverse gap-0.5">
              <div class="rounded-t-sm" :style="`height: ${d.deposit}%; background: rgba(0,255,179,0.4);`"></div>
              <div class="rounded-t-sm" :style="`height: ${d.withdraw}%; background: rgba(255,61,90,0.35);`"></div>
            </div>
          </div>
          <div class="flex justify-between mt-1 text-xs" style="color: var(--volt-gray);">
            <span>{{ rangeStart }}</span>
            <span class="flex gap-3">
              <span><span class="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1"></span>Deposit</span>
              <span><span class="inline-block w-2 h-2 rounded-full bg-red-400 mr-1"></span>Withdraw</span>
            </span>
            <span>{{ rangeEnd }}</span>
          </div>
        </div>

        <!-- Top Depositors -->
        <div class="glass-card mb-4">
          <div class="text-xs mb-3 font-medium" style="color: var(--volt-electric);">🏆 Top Depositors</div>
          <div class="space-y-0">
            <div v-for="(u, i) in topDepositors" :key="u.user_id" class="flex items-center gap-3 py-2.5 border-b last:border-0" style="border-color: rgba(0,212,255,0.08);">
              <div class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0" :style="i < 3 ? `background: ${['var(--volt-gold)','#C0C0C0','#CD7F32'][i]}; color: #050811;` : 'background: rgba(13,27,62,0.8); color: var(--volt-gray);'">{{ i + 1 }}</div>
              <div class="flex-1 text-xs" style="color: var(--volt-white);">{{ u.username || u.user_id?.substring(0,8) }}</div>
              <div class="font-number text-sm font-bold text-gold-gradient">{{ (u.total / 1000).toFixed(1) }}K</div>
            </div>
            <div v-if="topDepositors.length === 0" class="text-center py-4 text-xs" style="color: var(--volt-gray);">ဒေတာ မရှိသေးပါ</div>
          </div>
        </div>

        <!-- Payment Method Breakdown -->
        <div class="glass-card">
          <div class="text-xs mb-3 font-medium" style="color: var(--volt-electric);">💳 Payment Methods</div>
          <div class="space-y-2">
            <div v-for="pm in paymentBreakdown" :key="pm.method" class="flex items-center gap-3">
              <span class="text-sm w-14" style="color: var(--volt-gray);">{{ pm.method?.toUpperCase() }}</span>
              <div class="flex-1 h-2 rounded-full overflow-hidden" style="background: rgba(13,27,62,0.8);">
                <div class="h-full rounded-full transition-all" :style="`width: ${pm.pct}%; background: var(--volt-electric);`"></div>
              </div>
              <span class="font-number text-xs font-bold text-gold-gradient w-12 text-right">{{ (pm.total / 1000).toFixed(1) }}K</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { supabase } from "@/lib/supabase";
import VoltSkeleton from "@/components/ui/VoltSkeleton.vue";

type Range = "today" | "week" | "month" | "all";
const range = ref<Range>("week");
const loading = ref(false);

const stats = ref({ totalDeposit: 0, totalWithdraw: 0, netRevenue: 0, newUsers: 0, approvedDeposits: 0, pendingCount: 0 });
const dailyBars = ref<{ deposit: number; withdraw: number }[]>([]);
const topDepositors = ref<any[]>([]);
const paymentBreakdown = ref<any[]>([]);

const ranges = [
  { key: "today", label: "ယနေ့" },
  { key: "week",  label: "ဤအပတ်" },
  { key: "month", label: "ဤလ" },
  { key: "all",   label: "အားလုံး" },
];

function getFromDate(r: Range) {
  const d = new Date();
  if (r === "today") { d.setHours(0, 0, 0, 0); return d.toISOString(); }
  if (r === "week")  { d.setDate(d.getDate() - 7); return d.toISOString(); }
  if (r === "month") { d.setMonth(d.getMonth() - 1); return d.toISOString(); }
  return new Date("2020-01-01").toISOString();
}

const rangeStart = computed(() => { const d = new Date(getFromDate(range.value)); return `${d.getMonth()+1}/${d.getDate()}`; });
const rangeEnd   = computed(() => { const d = new Date(); return `${d.getMonth()+1}/${d.getDate()}`; });

async function loadReport() {
  loading.value = true;
  const from = getFromDate(range.value);

  const [depRes, wdRes, userRes, pendRes] = await Promise.all([
    supabase.from("transactions").select("amount,payment_method").eq("type", "deposit").eq("status", "approved").gte("created_at", from),
    supabase.from("transactions").select("amount").eq("type", "withdraw").eq("status", "approved").gte("created_at", from),
    supabase.from("users").select("id", { count: "exact", head: true }).gte("created_at", from),
    supabase.from("transactions").select("id", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  const totalDep = depRes.data?.reduce((s, r) => s + r.amount, 0) || 0;
  const totalWd  = wdRes.data?.reduce((s, r) => s + r.amount, 0) || 0;
  stats.value = {
    totalDeposit: totalDep,
    totalWithdraw: totalWd,
    netRevenue: totalDep - totalWd,
    newUsers: userRes.count || 0,
    approvedDeposits: depRes.data?.length || 0,
    pendingCount: pendRes.count || 0,
  };

  // Payment breakdown
  const pmMap: Record<string, number> = {};
  depRes.data?.forEach(r => { pmMap[r.payment_method || "other"] = (pmMap[r.payment_method || "other"] || 0) + r.amount; });
  const maxPm = Math.max(...Object.values(pmMap), 1);
  paymentBreakdown.value = Object.entries(pmMap).map(([method, total]) => ({ method, total, pct: Math.round(total / maxPm * 100) })).sort((a, b) => b.total - a.total);

  // Daily bars — mock for now, 7 bars
  dailyBars.value = Array.from({ length: 7 }, (_, i) => ({ deposit: Math.random() * 80 + 10, withdraw: Math.random() * 60 + 5 }));

  // Top depositors
  const { data: topData } = await supabase.from("transactions")
    .select("user_id, amount, users(username)")
    .eq("type", "deposit").eq("status", "approved")
    .gte("created_at", from).order("amount", { ascending: false }).limit(50);

  const byUser: Record<string, any> = {};
  topData?.forEach(r => {
    if (!byUser[r.user_id]) byUser[r.user_id] = { user_id: r.user_id, username: (r as any).users?.username, total: 0 };
    byUser[r.user_id].total += r.amount;
  });
  topDepositors.value = Object.values(byUser).sort((a, b) => b.total - a.total).slice(0, 5);

  loading.value = false;
}

onMounted(loadReport);
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
