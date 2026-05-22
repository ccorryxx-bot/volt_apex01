<template>
  <div class="min-h-screen" style="background: var(--volt-black);">
    <div class="sticky top-0 z-50 px-4 h-14 flex items-center gap-3" style="background: rgba(10,14,26,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(0,212,255,0.1);">
      <button @click="$router.push('/admin')" style="color: var(--volt-electric);">←</button>
      <span class="font-heading text-sm font-bold" style="color: var(--volt-white);">Deposit Approval</span>
      <span class="ml-auto px-2 py-0.5 text-xs rounded-full font-bold" style="background: rgba(212,175,55,0.2); color: var(--volt-gold);">{{ pending.length }} Pending</span>
    </div>
    <div class="px-4 pt-4 pb-8 max-w-2xl mx-auto space-y-3">
      <div v-for="d in pending" :key="d.id" class="glass-card">
        <button class="flex items-center justify-between w-full" @click="d.open = !d.open">
          <div class="text-left">
            <div class="text-sm font-medium" style="color: var(--volt-white);">{{ d.username }}</div>
            <div class="text-xs" style="color: var(--volt-gray);">{{ d.method }} · {{ d.date }}</div>
          </div>
          <div class="text-right">
            <div class="font-number font-bold" style="color: var(--volt-gold);">{{ d.amount.toLocaleString() }} K</div>
            <span style="color: var(--volt-electric); transition: transform 0.3s;" :style="d.open ? 'transform: rotate(180deg); display: inline-block' : 'display: inline-block'">▾</span>
          </div>
        </button>
        <transition name="slide">
          <div v-if="d.open" class="mt-3 pt-3 border-t space-y-3" style="border-color: rgba(0,212,255,0.1);">
            <div class="rounded-xl overflow-hidden h-32 flex items-center justify-center" style="background: rgba(5,8,17,0.6); border: 1px solid rgba(0,212,255,0.1);">
              <span class="text-sm" style="color: var(--volt-gray);">📷 Screenshot Preview</span>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <button class="h-11 rounded-xl font-semibold text-sm" style="background: rgba(0,255,179,0.15); color: var(--volt-emerald); border: 1px solid rgba(0,255,179,0.3);" @click="approve(d.id)">✓ Approve</button>
              <button class="h-11 rounded-xl font-semibold text-sm" style="background: rgba(255,61,90,0.15); color: var(--volt-red); border: 1px solid rgba(255,61,90,0.3);" @click="reject(d.id)">✕ Reject</button>
            </div>
          </div>
        </transition>
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
  { id: 1, username: "player001", method: "KPay", date: "2025-05-22 10:30", amount: 50000, open: false },
  { id: 2, username: "player002", method: "Wave", date: "2025-05-22 09:15", amount: 100000, open: false },
]);
function approve(id: number) { pending.value = pending.value.filter(d => d.id !== id); ui.toast.success("Approve လုပ်ပြီးပါပြီ"); }
function reject(id: number) { pending.value = pending.value.filter(d => d.id !== id); ui.toast.error("Reject လုပ်ပြီးပါပြီ"); }
</script>
<style scoped>
.slide-enter-active, .slide-leave-active { transition: max-height 0.3s ease, opacity 0.3s; overflow: hidden; max-height: 200px; }
.slide-enter-from, .slide-leave-to { max-height: 0; opacity: 0; }
</style>
