<template>
  <div class="min-h-screen" style="background: var(--volt-black);">
    <div class="sticky top-0 z-50 px-4 h-14 flex items-center gap-3" style="background: rgba(10,14,26,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(0,212,255,0.1);">
      <button @click="$router.push('/admin')" style="color: var(--volt-electric);">←</button>
      <span class="font-heading text-sm font-bold" style="color: var(--volt-white);">Reports</span>
    </div>
    <div class="px-4 pt-4 pb-8 max-w-2xl mx-auto">
      <div class="flex gap-2 mb-4">
        <button v-for="p in periods" :key="p" class="px-4 h-8 rounded-full text-xs font-medium transition-all"
          :style="period === p ? 'background: var(--volt-gold); color: #050811;' : 'background: rgba(13,27,62,0.7); color: var(--volt-gray); border: 1px solid rgba(0,212,255,0.15);'"
          @click="period = p">{{ p }}</button>
      </div>
      <div class="grid grid-cols-2 gap-2 mb-4">
        <div v-for="r in reportStats" :key="r.label" class="glass-card p-3">
          <div class="text-xs mb-1" style="color: var(--volt-gray);">{{ r.label }}</div>
          <div class="font-number text-lg font-bold" :style="`color: ${r.color}`">{{ r.value }}</div>
        </div>
      </div>
      <div class="glass-card">
        <div class="font-heading text-xs tracking-wider mb-3" style="color: var(--volt-electric);">Top Players</div>
        <div class="space-y-2">
          <div v-for="p in topPlayers" :key="p.name" class="flex items-center justify-between py-2 border-b" style="border-color: rgba(0,212,255,0.08);">
            <span class="text-sm" style="color: var(--volt-white);">{{ p.name }}</span>
            <span class="font-number font-bold" style="color: var(--volt-gold);">{{ p.volume }} K</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const period = ref("Today");
const periods = ["Today", "Week", "Month"];
const reportStats = [
  { label: "Total Deposits", value: "2.4M K", color: "var(--volt-emerald)" },
  { label: "Total Withdrawals", value: "1.1M K", color: "var(--volt-red)" },
  { label: "Net Revenue", value: "1.3M K", color: "var(--volt-gold)" },
  { label: "New Users", value: "47", color: "var(--volt-electric)" },
];
const topPlayers = [
  { name: "player001", volume: "450" },
  { name: "player088", volume: "380" },
  { name: "agent001", volume: "290" },
];
</script>
