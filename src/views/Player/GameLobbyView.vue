<template>
  <div class="min-h-screen" style="background: var(--volt-black);">
    <TopNavBar />

    <!-- Hero -->
    <div class="relative h-44 flex items-center justify-center overflow-hidden"
      style="background: linear-gradient(135deg, #050811 0%, #0A1428 50%, #0D1B3E 100%);">
      <div class="absolute inset-0 hex-bg opacity-30"></div>
      <div class="relative z-10 text-center">
        <h1 class="font-heading text-2xl font-black text-gold-gradient tracking-widest anim-float-y">GAME LOBBY</h1>
        <p class="text-xs mt-1" style="color: var(--volt-electric);">⚡ ချက်ချင်း ကစားနိုင်သည် · {{ gamesStore.games.length }} ဂိမ်းများ</p>
      </div>
      <FloatingObject class="absolute inset-0 opacity-40" />
    </div>

    <div class="px-4 pb-28 max-w-lg mx-auto">
      <!-- Category tabs -->
      <div class="flex gap-2 overflow-x-auto py-3 no-scrollbar">
        <button v-for="cat in categories" :key="cat.key"
          class="flex-shrink-0 flex items-center gap-1.5 px-4 h-9 rounded-full text-sm font-semibold transition-all"
          :style="gamesStore.activeCategory === cat.key ? 'background: var(--volt-gold); color: #050811;' : 'background: rgba(13,27,62,0.7); color: var(--volt-gray); border: 1px solid rgba(0,212,255,0.15);'"
          @click="gamesStore.activeCategory = cat.key">
          {{ cat.icon }} {{ cat.label }}
        </button>
      </div>

      <!-- Search -->
      <div class="relative mb-4">
        <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-base">🔍</span>
        <input v-model="gamesStore.search" type="search" placeholder="ဂိမ်းရှာမည်..."
          class="volt-input w-full h-11 pl-10 pr-4 rounded-xl text-sm outline-none" />
      </div>

      <!-- Loading skeletons -->
      <div v-if="gamesStore.loading" class="grid grid-cols-3 gap-2">
        <VoltSkeleton v-for="i in 9" :key="i" height="160px" radius="12px" />
      </div>

      <!-- Games Grid -->
      <div v-else class="grid grid-cols-3 gap-2">
        <div v-for="g in gamesStore.filteredGames" :key="g.id"
          class="game-card relative rounded-xl overflow-hidden cursor-pointer"
          @click="launchGame(g)">
          <img
            :src="g.thumbnail_url || `https://placehold.co/120x160/0D1B3E/D4AF37?text=${encodeURIComponent(g.provider||'GAME')}`"
            :alt="g.name" class="w-full aspect-[3/4] object-cover" loading="lazy" />
          <div class="absolute inset-x-0 bottom-0 p-2" style="background: linear-gradient(0deg, rgba(5,8,17,0.95) 0%, transparent 100%);">
            <div class="text-xs font-medium text-center leading-tight" style="color: var(--volt-white);">{{ g.name_mm || g.name }}</div>
            <div class="text-center mt-0.5 text-xs" style="color: var(--volt-gray);">{{ g.provider }}</div>
          </div>
          <div v-if="g.is_new" class="absolute top-1.5 left-1.5 px-1.5 py-0.5 text-xs rounded-md font-bold" style="background: var(--volt-emerald); color: #050811;">NEW</div>
          <div v-if="g.is_hot" class="absolute top-1.5 right-1.5 text-sm">🔥</div>
          <div class="play-overlay absolute inset-0 flex items-center justify-center">
            <div class="w-12 h-12 rounded-full flex items-center justify-center" style="background: rgba(212,175,55,0.9);">
              <span class="text-xl" style="color: #050811;">▶</span>
            </div>
          </div>
        </div>
        <div v-if="gamesStore.filteredGames.length === 0" class="col-span-3 text-center py-12">
          <div class="text-4xl mb-2">🎮</div>
          <p class="text-sm" style="color: var(--volt-gray);">ဂိမ်း မတွေ့ပါ</p>
        </div>
      </div>
    </div>

    <!-- Game Launch Modal -->
    <VoltModal v-model="showLaunchModal" :title="selectedGame?.name_mm || selectedGame?.name || ''">
      <div v-if="selectedGame" class="text-center">
        <img :src="selectedGame.thumbnail_url" class="w-24 h-32 object-cover rounded-xl mx-auto mb-3" />
        <p class="text-sm mb-1" style="color: var(--volt-white);">{{ selectedGame.name }}</p>
        <p class="text-xs mb-1" style="color: var(--volt-gray);">Provider: {{ selectedGame.provider }}</p>
        <p v-if="selectedGame.rtp" class="text-xs mb-4" style="color: var(--volt-electric);">RTP: {{ selectedGame.rtp }}%</p>
        <div class="p-3 rounded-xl mb-4 text-xs" style="background: rgba(212,175,55,0.08); color: var(--volt-gold); border: 1px solid rgba(212,175,55,0.15);">
          ⚡ ကစားမှုမတိုင်မီ Balance စစ်ဆေးပါ: <strong>{{ (auth.profile?.balance || 0).toLocaleString() }} MMK</strong>
        </div>
      </div>
      <template #footer>
        <button class="btn-primary h-11 text-sm" @click="confirmLaunch">ကစားမည် ▶</button>
      </template>
    </VoltModal>

    <BottomNavBar />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useGamesStore } from "@/stores/games.store";
import { useAuthStore } from "@/stores/auth.store";
import TopNavBar from "@/components/layout/TopNavBar.vue";
import BottomNavBar from "@/components/layout/BottomNavBar.vue";
import VoltModal from "@/components/ui/VoltModal.vue";
import VoltSkeleton from "@/components/ui/VoltSkeleton.vue";
import FloatingObject from "@/components/three/FloatingObject.vue";
import type { Game } from "@/stores/games.store";

const gamesStore = useGamesStore();
const auth = useAuthStore();
const showLaunchModal = ref(false);
const selectedGame = ref<Game | null>(null);

const categories = [
  { key: "all",     label: "အားလုံး", icon: "🎮" },
  { key: "slot",    label: "Slot",    icon: "🎰" },
  { key: "live",    label: "Live",    icon: "🃏" },
  { key: "fishing", label: "Fishing", icon: "🐟" },
  { key: "crash",   label: "Crash",   icon: "🚀" },
  { key: "sport",   label: "Sport",   icon: "⚽" },
  { key: "lottery", label: "Xổ Số",  icon: "🎱" },
];

onMounted(() => gamesStore.fetchGames());

function launchGame(g: Game) {
  selectedGame.value = g;
  showLaunchModal.value = true;
}
function confirmLaunch() {
  showLaunchModal.value = false;
  if (selectedGame.value?.launch_url) {
    window.open(selectedGame.value.launch_url, "_blank");
  }
}
</script>

<style scoped>
.volt-input { background: rgba(5,8,17,0.8); border: 1px solid rgba(0,212,255,0.2); color: var(--volt-white); }
.volt-input:focus { border-color: rgba(0,212,255,0.5); outline: none; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
.game-card { transition: transform 0.15s ease; }
.game-card:active { transform: scale(0.92); }
.play-overlay {
  background: rgba(5,8,17,0.5);
  opacity: 0; transition: opacity 0.2s;
}
.game-card:hover .play-overlay { opacity: 1; }
</style>
