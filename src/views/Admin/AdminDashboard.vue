<template>
  <div class="min-h-screen hex-bg" style="background: var(--volt-black);">
    <!-- Admin Header -->
    <div class="sticky top-0 z-50 px-4 h-14 flex items-center justify-between" style="background: rgba(10,14,26,0.95); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(255,61,90,0.2);">
      <div class="flex items-center gap-2">
        <span class="font-heading text-base font-black text-gold-gradient">VOLT APEX</span>
        <span class="px-2 py-0.5 text-xs rounded-full font-medium" style="background: rgba(255,61,90,0.15); color: var(--volt-red); border: 1px solid rgba(255,61,90,0.3);">ADMIN</span>
      </div>
      <button class="text-xs px-3 h-8 rounded-lg" style="color: var(--volt-gray); border: 1px solid rgba(255,255,255,0.1);" @click="authStore.logout()">ထွက်မည်</button>
    </div>

    <div class="px-4 pt-4 pb-8 max-w-lg mx-auto">
      <!-- KPI Grid -->
      <div class="grid grid-cols-2 gap-2 mb-4">
        <div v-for="kpi in kpis" :key="kpi.label" class="glass-card text-center">
          <div class="text-2xl mb-1">{{ kpi.icon }}</div>
          <div class="font-number text-xl font-black" :style="`color: ${kpi.color}`">{{ kpi.value }}</div>
          <div class="text-xs" style="color: var(--volt-gray);">{{ kpi.label }}</div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="grid grid-cols-2 gap-2 mb-4">
        <button v-for="a in adminActions" :key="a.path" class="admin-btn flex items-center gap-3 p-4 rounded-xl relative" @click="$router.push(a.path)">
          <span class="text-2xl">{{ a.icon }}</span>
          <div class="text-left">
            <div class="text-sm font-medium" style="color: var(--volt-white);">{{ a.label }}</div>
            <div v-if="a.badge > 0" class="text-xs" style="color: var(--volt-gold);">{{ a.badge }} ဆောင်ရွက်ရန်</div>
          </div>
          <div v-if="a.badge > 0" class="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style="background: var(--volt-red); color: white;">{{ a.badge }}</div>
        </button>
      </div>

      <!-- Recent Activity -->
      <div class="glass-card mb-4">
        <div class="text-xs mb-3 font-medium" style="color: var(--volt-electric);">⚡ Recent Deposits (Pending)</div>
        <div v-if="loadingStats" class="space-y-2"><VoltSkeleton v-for="i in 3" :key="i" height="52px" /></div>
        <div v-else class="space-y-1">
          <div v-for="t in pendingDepositsPreview" :key="t.id" class="flex items-center justify-between p-3 rounded-xl" style="background: rgba(5,8,17,0.5); border: 1px solid rgba(212,175,55,0.12);">
            <div>
              <div class="text-xs font-medium" style="color: var(--volt-white);">{{ (t as any).users?.username || 'User' }}</div>
              <div class="text-xs" style="color: var(--volt-gray);">{{ (t as any).payment_method?.toUpperCase() }} · {{ new Date(t.created_at).toLocaleTimeString('my-MM', { hour: '2-digit', minute: '2-digit' }) }}</div>
            </div>
            <div class="text-right">
              <div class="font-number text-sm font-bold" style="color: var(--volt-gold);">{{ t.amount.toLocaleString() }} K</div>
              <button class="text-xs px-2 py-0.5 rounded-md mt-0.5" style="background: rgba(0,255,179,0.1); color: var(--volt-emerald);" @click="$router.push('/admin/deposits')">အတည်ပြု</button>
            </div>
          </div>
          <div v-if="pendingDepositsPreview.length === 0" class="text-center py-3 text-xs" style="color: var(--volt-gray);">ဆောင်ရွက်ရမည့် Deposit မရှိပါ ✓</div>
        </div>
      </div>

      <!-- Charts Placeholder -->
      <div class="glass-card mb-4">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs font-medium" style="color: var(--volt-electric);">📊 Today's Revenue</span>
          <span class="font-number text-sm font-bold text-gold-gradient">{{ todayRevenue.toLocaleString() }} K</span>
        </div>
        <div class="h-24 flex items-end gap-1 px-1">
          <div v-for="(h, i) in hourlyBars" :key="i" class="flex-1 rounded-t-sm transition-all" :style="`height: ${h}%; background: ${i === currentHour ? 'var(--volt-gold)' : 'rgba(0,212,255,0.25)'};`"></div>
        </div>
        <div class="flex justify-between mt-1 px-1">
          <span class="text-xs" style="color: var(--volt-gray);">00:00</span>
          <span class="text-xs" style="color: var(--volt-gray);">지금</span>
          <span class="text-xs" style="color: var(--volt-gray);">23:59</span>
        </div>
      </div>

      <!-- User stats -->
      <div class="grid grid-cols-3 gap-2">
        <div class="glass-card text-center p-2">
          <div class="font-number text-lg font-black" style="color: var(--volt-emerald);">{{ totalUsers.toLocaleString() }}</div>
          <div class="text-xs" style="color: var(--volt-gray);">စုစုပေါင်း User</div>
        </div>
        <div class="glass-card text-center p-2">
          <div class="font-number text-lg font-black" style="color: var(--volt-electric);">{{ todayNewUsers }}</div>
          <div class="text-xs" style="color: var(--volt-gray);">ယနေ့ အသစ်</div>
        </div>
        <div class="glass-card text-center p-2">
          <div class="font-number text-lg font-black" style="color: var(--volt-gold);">{{ onlineNow }}</div>
          <div class="text-xs" style="color: var(--volt-gray);">Online ရှိ</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import { useTransactionsStore } from "@/stores/transactions.store";
import { supabase } from "@/lib/supabase";
import VoltSkeleton from "@/components/ui/VoltSkeleton.vue";

const router = useRouter();
const authStore = useAuthStore();
const txStore = useTransactionsStore();
const loadingStats = ref(false);

const totalUsers = ref(0);
const todayNewUsers = ref(0);
const onlineNow = ref(Math.floor(Math.random() * 300 + 800));
const todayRevenue = ref(0);
const pendingDepositsPreview = ref<any[]>([]);

const currentHour = new Date().getHours();
const hourlyBars = ref<number[]>(Array.from({ length: 24 }, (_, i) => i <= currentHour ? Math.random() * 80 + 10 : 0));

const kpis = computed(() => [
  { icon: "⏳", label: "Pending Deposits", value: txStore.pendingDeposits.length, color: "var(--volt-gold)" },
  { icon: "💸", label: "Pending Withdraw", value: txStore.pendingWithdrawals.length, color: "var(--volt-red)" },
  { icon: "👥", label: "User",             value: totalUsers.value.toLocaleString(), color: "var(--volt-electric)" },
  { icon: "💰", label: "Today Revenue",    value: (todayRevenue.value / 1000).toFixed(1) + "K", color: "var(--volt-emerald)" },
]);

const adminActions = computed(() => [
  { path: "/admin/deposits",    icon: "💰", label: "Deposit Approval",  badge: txStore.pendingDeposits.length },
  { path: "/admin/withdrawals", icon: "💸", label: "Withdraw Approval", badge: txStore.pendingWithdrawals.length },
  { path: "/admin/users",       icon: "👥", label: "User Management",   badge: 0 },
  { path: "/admin/games",       icon: "🎮", label: "Game Management",   badge: 0 },
  { path: "/admin/reports",     icon: "📊", label: "Reports",           badge: 0 },
  { path: "/admin/announcements", icon: "📢", label: "Announcements",  badge: 0 },
]);

onMounted(async () => {
  loadingStats.value = true;
  await Promise.all([
    txStore.fetchPendingDeposits(),
    txStore.fetchPendingWithdrawals(),
  ]);
  pendingDepositsPreview.value = txStore.pendingDeposits.slice(0, 3);

  const { count } = await supabase.from("users").select("id", { count: "exact", head: true });
  totalUsers.value = count || 0;

  const today = new Date(); today.setHours(0, 0, 0, 0);
  const { count: newCount } = await supabase.from("users").select("id", { count: "exact", head: true }).gte("created_at", today.toISOString());
  todayNewUsers.value = newCount || 0;

  const { data: rev } = await supabase.from("transactions").select("amount").eq("type", "deposit").eq("status", "approved").gte("created_at", today.toISOString());
  todayRevenue.value = rev?.reduce((s, r) => s + r.amount, 0) || 0;

  loadingStats.value = false;
});
</script>

<style scoped>
.admin-btn { background: rgba(13,27,62,0.7); border: 1px solid rgba(0,212,255,0.15); transition: all 0.15s; }
.admin-btn:active { transform: scale(0.95); border-color: rgba(0,212,255,0.35); }
</style>
