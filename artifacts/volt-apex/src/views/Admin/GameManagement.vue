<template>
  <div class="min-h-screen" style="background: var(--volt-black);">
    <div class="sticky top-0 z-50 px-4 h-14 flex items-center gap-3" style="background: rgba(10,14,26,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(0,212,255,0.1);">
      <button @click="$router.push('/admin')" style="color: var(--volt-electric);">←</button>
      <span class="font-heading text-sm font-bold" style="color: var(--volt-white);">Game Management</span>
      <button class="ml-auto px-3 h-8 rounded-xl text-xs font-medium" style="background: var(--volt-gold); color: #050811;" @click="showAdd = true">+ Add Game</button>
    </div>
    <div class="px-4 pt-4 pb-8 max-w-2xl mx-auto space-y-2">
      <div v-for="g in games" :key="g.id" class="glass-card flex items-center justify-between">
        <div>
          <div class="text-sm font-medium" style="color: var(--volt-white);">{{ g.name }}</div>
          <div class="text-xs" style="color: var(--volt-gray);">{{ g.provider }} · {{ g.category }}</div>
        </div>
        <div class="flex items-center gap-3">
          <span v-if="g.isHot" class="text-xs px-1.5 py-0.5 rounded" style="background: rgba(255,61,90,0.15); color: var(--volt-red);">HOT</span>
          <span v-if="g.isNew" class="text-xs px-1.5 py-0.5 rounded" style="background: rgba(0,255,179,0.15); color: var(--volt-emerald);">NEW</span>
          <button class="w-10 h-6 rounded-full transition-all relative" :style="g.isActive ? 'background: var(--volt-emerald);' : 'background: rgba(136,146,164,0.3);'" @click="g.isActive = !g.isActive">
            <span class="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all" :style="g.isActive ? 'left: calc(100% - 22px);' : 'left: 2px;'"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
const showAdd = ref(false);
const games = ref([
  { id: 1, name: "Fortune Tiger", provider: "JILI", category: "slot", isActive: true, isHot: true, isNew: false },
  { id: 2, name: "Baccarat Live", provider: "Evolution", category: "live", isActive: true, isHot: false, isNew: true },
  { id: 3, name: "Aviator", provider: "Spribe", category: "crash", isActive: true, isHot: true, isNew: false },
  { id: 4, name: "Fish World", provider: "PG", category: "fishing", isActive: false, isHot: false, isNew: false },
]);
</script>
