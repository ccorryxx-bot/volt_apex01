<template>
  <nav class="bottom-nav fixed bottom-0 left-0 right-0 z-50">
    <div class="flex max-w-lg mx-auto">
      <button v-for="item in navItems" :key="item.path"
        class="flex-1 flex flex-col items-center py-2 pt-3 gap-0.5 transition-all"
        :style="isActive(item.path) ? 'color: var(--volt-gold);' : 'color: var(--volt-gray);'"
        @click="$router.push(item.path)">
        <span class="text-lg">{{ item.icon }}</span>
        <span class="text-xs">{{ item.label }}</span>
        <div v-if="isActive(item.path)" class="active-dot"></div>
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
const route = useRoute();

const navItems = [
  { path: "/dashboard", icon: "🏠", label: "ပင်မ" },
  { path: "/games",     icon: "🎮", label: "ဂိမ်း" },
  { path: "/deposit",   icon: "💰", label: "သွင်းမည်" },
  { path: "/bonuses",   icon: "🎁", label: "Bonus" },
  { path: "/profile",   icon: "👤", label: "ကျွန်ုပ်" },
];

function isActive(path: string) {
  return route.path.startsWith(path);
}
</script>

<style scoped>
.bottom-nav {
  background: rgba(10, 14, 26, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(0, 212, 255, 0.1);
  padding-bottom: env(safe-area-inset-bottom, 0px);
}
button { background: none; border: none; cursor: pointer; }
.active-dot {
  width: 4px; height: 4px; border-radius: 50%;
  background: var(--volt-gold);
  box-shadow: 0 0 6px var(--volt-gold);
  margin-top: 2px;
}
</style>
