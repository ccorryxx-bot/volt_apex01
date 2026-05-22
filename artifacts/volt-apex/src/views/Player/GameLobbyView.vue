<template>
  <div class="min-h-screen" style="background: var(--volt-black);">
    <TopNavBar />
    <div class="relative h-40 overflow-hidden flex items-center justify-center mb-2" style="background: linear-gradient(135deg, #050811 0%, #0D1B3E 100%);">
      <FloatingObject class="absolute inset-0" />
      <div class="relative z-10 text-center">
        <h1 class="font-heading text-xl font-black text-gold-gradient tracking-widest">GAME LOBBY</h1>
        <p class="text-xs mt-1" style="color: var(--volt-electric);">⚡ ချက်ချင်း ကစားနိုင်သည်</p>
      </div>
    </div>

    <div class="px-4 pb-24 max-w-lg mx-auto">
      <div class="flex gap-2 overflow-x-auto pb-2 mb-4 no-scrollbar">
        <button v-for="cat in categories" :key="cat.key"
          class="flex-shrink-0 px-4 h-9 rounded-full text-sm font-medium transition-all"
          :style="activeCategory === cat.key ? 'background: var(--volt-gold); color: #050811;' : 'background: rgba(13,27,62,0.7); color: var(--volt-gray); border: 1px solid rgba(0,212,255,0.15);'"
          @click="activeCategory = cat.key">
          {{ cat.icon }} {{ cat.label }}
        </button>
      </div>

      <div class="relative mb-4">
        <input v-model="search" type="search" placeholder="🔍 ဂိမ်းရှာမည်..."
          class="w-full h-11 pl-4 pr-4 rounded-xl text-sm outline-none"
          style="background: rgba(13,27,62,0.7); border: 1px solid rgba(0,212,255,0.15); color: var(--volt-white);" />
      </div>

      <div class="grid grid-cols-3 gap-2">
        <div v-for="game in filteredGames" :key="game.id"
          class="game-card relative rounded-xl overflow-hidden cursor-pointer"
          @click="$router.push('/dashboard')">
          <img :src="game.img" :alt="game.name" class="w-full aspect-[3/4] object-cover" loading="lazy" />
          <div class="absolute inset-x-0 bottom-0 p-2" style="background: linear-gradient(0deg, rgba(5,8,17,0.9) 0%, transparent 100%);">
            <div class="text-xs font-medium text-center" style="color: var(--volt-white);">{{ game.name }}</div>
          </div>
          <div v-if="game.isNew" class="badge-new">NEW</div>
          <div v-if="game.isHot" class="badge-hot">🔥</div>
        </div>
      </div>
    </div>
    <BottomNavBar />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import TopNavBar from "@/components/layout/TopNavBar.vue";
import BottomNavBar from "@/components/layout/BottomNavBar.vue";
import FloatingObject from "@/components/three/FloatingObject.vue";

const activeCategory = ref("all");
const search = ref("");

const categories = [
  { key: "all", label: "အားလုံး", icon: "🎮" },
  { key: "slot", label: "Slot", icon: "🎰" },
  { key: "live", label: "Live", icon: "🃏" },
  { key: "fishing", label: "Fishing", icon: "🐟" },
  { key: "crash", label: "Crash", icon: "🚀" },
  { key: "sport", label: "Sport", icon: "⚽" },
];

const games = ref([
  { id: 1, name: "Fortune Tiger", category: "slot", isHot: true, isNew: false, img: "https://placehold.co/120x160/0D1B3E/D4AF37?text=JILI" },
  { id: 2, name: "Baccarat Pro", category: "live", isHot: false, isNew: true, img: "https://placehold.co/120x160/0D1B3E/00D4FF?text=LIVE" },
  { id: 3, name: "Fish Prawn", category: "fishing", isHot: true, isNew: false, img: "https://placehold.co/120x160/0D1B3E/00FFB3?text=FISH" },
  { id: 4, name: "Aviator", category: "crash", isHot: false, isNew: true, img: "https://placehold.co/120x160/0D1B3E/FF3D5A?text=CRASH" },
  { id: 5, name: "Dragon Tiger", category: "live", isHot: true, isNew: false, img: "https://placehold.co/120x160/0D1B3E/D4AF37?text=PG" },
  { id: 6, name: "Sweet Bonanza", category: "slot", isHot: false, isNew: true, img: "https://placehold.co/120x160/0D1B3E/00D4FF?text=SLOT" },
]);

const filteredGames = computed(() => {
  return games.value.filter(g =>
    (activeCategory.value === "all" || g.category === activeCategory.value) &&
    (!search.value || g.name.toLowerCase().includes(search.value.toLowerCase()))
  );
});
</script>

<style scoped>
.game-card { transition: transform 0.15s ease; }
.game-card:active { transform: scale(0.95); }
.badge-new {
  position: absolute; top: 6px; left: 6px;
  background: var(--volt-emerald); color: #050811;
  font-size: 0.6rem; font-weight: 700; padding: 2px 6px; border-radius: 4px;
}
.badge-hot {
  position: absolute; top: 6px; right: 6px;
  font-size: 0.8rem;
}
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
