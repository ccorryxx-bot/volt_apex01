<template>
  <div class="min-h-screen" style="background: var(--volt-black);">
    <div class="sticky top-0 z-50 px-4 h-14 flex items-center gap-3" style="background: rgba(10,14,26,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(0,212,255,0.1);">
      <button @click="$router.push('/admin')" style="color: var(--volt-electric);">←</button>
      <span class="font-heading text-sm font-bold" style="color: var(--volt-white);">Withdraw Approval</span>
      <span class="ml-auto px-2 py-0.5 text-xs rounded-full font-bold" style="background: rgba(255,61,90,0.2); color: var(--volt-red);">{{ pending.length }} Pending</span>
    </div>
    <div class="px-4 pt-4 pb-8 max-w-2xl mx-auto space-y-3">
      <div v-for="d in pending" :key="d.id" class="glass-card">
        <div class="flex items-center justify-between mb-2">
          <div>
            <div class="text-sm font-medium" style="color: var(--volt-white);">{{ d.username }}</div>
            <div class="text-xs" style="color: var(--volt-gray);">{{ d.method }}: {{ d.account }} · {{ d.date }}</div>
          </div>
          <div class="font-number font-bold text-right" style="color: var(--volt-red);">{{ d.amount.toLocaleString() }} K</div>
        </div>
        <div class="grid grid-cols-2 gap-2">
          <button class="h-10 rounded-xl font-semibold text-sm" style="background: rgba(0,255,179,0.15); color: var(--volt-emerald); border: 1px solid rgba(0,255,179,0.3);" @click="approve(d.id)">✓ Approve</button>
          <button class="h-10 rounded-xl font-semibold text-sm" style="background: rgba(255,61,90,0.15); color: var(--volt-red); border: 1px solid rgba(255,61,90,0.3);" @click="reject(d.id)">✕ Reject</button>
        </div>
      </div>
      <div v-if="pending.length === 0" class="text-center py-10 text-sm" style="color: var(--volt-gray);">Pending requests မရှိပါ ✓</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useUiStore } from "@/stores/ui.store";
const ui = useUiStore();
const pending = ref([
  { id: 1, username: "player003", method: "KPay", account: "09-xxx", date: "2025-05-22", amount: 30000 },
  { id: 2, username: "player004", method: "Wave", account: "09-yyy", date: "2025-05-22", amount: 75000 },
]);
function approve(id: number) { pending.value = pending.value.filter(d => d.id !== id); ui.toast.success("Approve လုပ်ပြီးပါပြီ"); }
function reject(id: number) { pending.value = pending.value.filter(d => d.id !== id); ui.toast.error("Reject လုပ်ပြီးပါပြီ"); }
</script>
