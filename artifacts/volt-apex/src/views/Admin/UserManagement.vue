<template>
  <div class="min-h-screen" style="background: var(--volt-black);">
    <div class="sticky top-0 z-50 px-4 h-14 flex items-center gap-3" style="background: rgba(10,14,26,0.9); backdrop-filter: blur(20px); border-bottom: 1px solid rgba(0,212,255,0.1);">
      <button @click="$router.push('/admin')" style="color: var(--volt-electric);">←</button>
      <span class="font-heading text-sm font-bold" style="color: var(--volt-white);">User Management</span>
    </div>
    <div class="px-4 pt-4 pb-8 max-w-2xl mx-auto">
      <input v-model="search" type="search" placeholder="🔍 Username / ဖုန်းနံပါတ် ရှာမည်..."
        class="volt-input w-full h-11 px-4 rounded-xl text-sm outline-none mb-4" />
      <div class="space-y-2">
        <div v-for="u in filteredUsers" :key="u.id" class="glass-card">
          <button class="flex items-center justify-between w-full" @click="u.open = !u.open">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full flex items-center justify-center text-sm" style="background: rgba(0,212,255,0.1);">{{ u.username[0].toUpperCase() }}</div>
              <div class="text-left">
                <div class="text-sm font-medium" style="color: var(--volt-white);">{{ u.username }}</div>
                <div class="text-xs" style="color: var(--volt-gray);">{{ u.phone }}</div>
              </div>
            </div>
            <div class="text-right flex items-center gap-2">
              <span class="px-2 py-0.5 text-xs rounded-full" :style="u.status === 'active' ? 'background: rgba(0,255,179,0.15); color: var(--volt-emerald);' : 'background: rgba(255,61,90,0.15); color: var(--volt-red);'">{{ u.status }}</span>
              <span style="color: var(--volt-electric);">▾</span>
            </div>
          </button>
          <transition name="slide">
            <div v-if="u.open" class="mt-3 pt-3 border-t" style="border-color: rgba(0,212,255,0.1);">
              <div class="grid grid-cols-2 gap-2 text-xs mb-3">
                <div><span style="color: var(--volt-gray);">Balance: </span><span style="color: var(--volt-gold);">{{ u.balance.toLocaleString() }} K</span></div>
                <div><span style="color: var(--volt-gray);">Role: </span><span style="color: var(--volt-white);">{{ u.role }}</span></div>
              </div>
              <div class="flex gap-2 flex-wrap">
                <button class="px-3 h-8 rounded-lg text-xs" style="background: rgba(255,61,90,0.15); color: var(--volt-red); border: 1px solid rgba(255,61,90,0.3);">Suspend</button>
                <button class="px-3 h-8 rounded-lg text-xs" style="background: rgba(0,212,255,0.1); color: var(--volt-electric); border: 1px solid rgba(0,212,255,0.2);">Balance Adjust</button>
                <button class="px-3 h-8 rounded-lg text-xs" style="background: rgba(212,175,55,0.1); color: var(--volt-gold); border: 1px solid rgba(212,175,55,0.2);">View Txns</button>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
const search = ref("");
const users = ref([
  { id: 1, username: "player001", phone: "09-xxx-0001", status: "active", role: "player", balance: 50000, open: false },
  { id: 2, username: "agent001", phone: "09-xxx-0002", status: "active", role: "agent", balance: 150000, open: false },
  { id: 3, username: "player002", phone: "09-xxx-0003", status: "suspended", role: "player", balance: 0, open: false },
]);
const filteredUsers = computed(() => !search.value ? users.value : users.value.filter(u => u.username.includes(search.value) || u.phone.includes(search.value)));
</script>
<style scoped>
.volt-input { background: rgba(5,8,17,0.8); border: 1px solid rgba(0,212,255,0.2); color: var(--volt-white); }
.slide-enter-active, .slide-leave-active { transition: max-height 0.3s ease, opacity 0.3s; overflow: hidden; max-height: 200px; }
.slide-enter-from, .slide-leave-to { max-height: 0; opacity: 0; }
</style>
