<template>
  <div class="min-h-screen hex-bg" style="background: var(--volt-black);">
    <div class="sticky top-0 z-50 px-4 h-14 flex items-center" style="background: rgba(10,14,26,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(0,212,255,0.1);">
      <span class="font-heading text-base font-black text-gold-gradient">VOLT APEX</span>
      <span class="ml-2 px-2 py-0.5 text-xs rounded-full font-medium" style="background: rgba(255,61,90,0.15); color: var(--volt-red); border: 1px solid rgba(255,61,90,0.3);">ADMIN</span>
      <button class="ml-auto text-xs" style="color: var(--volt-gray);" @click="auth.logout(); $router.push('/login')">ထွက်မည်</button>
    </div>
    <div class="px-4 pt-4 pb-8 max-w-2xl mx-auto">
      <div class="grid grid-cols-2 gap-2 mb-4">
        <div v-for="kpi in kpis" :key="kpi.label" class="glass-card hud-bracket relative p-3">
          <div class="text-xs mb-1" style="color: var(--volt-gray);">{{ kpi.label }}</div>
          <div class="font-number text-xl font-bold" :style="`color: ${kpi.color}`">{{ kpi.value }}</div>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-2 mb-4">
        <button class="btn-primary h-12 text-sm" @click="$router.push('/admin/deposits')">💰 Deposit Approval</button>
        <button class="btn-secondary h-12 text-sm" @click="$router.push('/admin/withdrawals')">💸 Withdraw Approval</button>
        <button class="btn-secondary h-12 text-sm" @click="$router.push('/admin/users')">👥 User Management</button>
        <button class="btn-secondary h-12 text-sm" @click="$router.push('/admin/games')">🎮 Games</button>
        <button class="btn-secondary h-12 text-sm" @click="$router.push('/admin/reports')">📊 Reports</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.store";
const auth = useAuthStore();
const kpis = [
  { label: "Total Users", value: "1,243", color: "var(--volt-electric)" },
  { label: "Today Active", value: "347", color: "var(--volt-emerald)" },
  { label: "Pending Deposits", value: "12", color: "var(--volt-gold)" },
  { label: "Pending Withdrawals", value: "5", color: "var(--volt-red)" },
  { label: "Today Deposits", value: "2.4M K", color: "var(--volt-emerald)" },
  { label: "Today Withdrawals", value: "1.1M K", color: "var(--volt-red)" },
];
</script>
