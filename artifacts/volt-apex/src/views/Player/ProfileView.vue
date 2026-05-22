<template>
  <div class="min-h-screen" style="background: var(--volt-black);">
    <TopNavBar />
    <div class="px-4 pt-6 pb-24 max-w-lg mx-auto">
      <div class="flex flex-col items-center mb-6">
        <NftAvatar :src="auth.profile?.nft_avatar_url" :size="96" :online="true" />
        <h2 class="font-heading text-lg mt-3 text-gold-gradient">{{ auth.profile?.username }}</h2>
        <div class="text-xs mt-1" style="color: var(--volt-gray);">{{ auth.profile?.phone_number }}</div>
        <span class="mt-2 px-3 py-1 rounded-full text-xs font-medium" style="background: rgba(212,175,55,0.15); color: var(--volt-gold); border: 1px solid rgba(212,175,55,0.3);">
          {{ auth.profile?.role?.toUpperCase() }}
        </span>
      </div>

      <div class="grid grid-cols-3 gap-2 mb-6">
        <div v-for="stat in stats" :key="stat.label" class="glass-card text-center p-3">
          <div class="font-number text-lg font-bold" style="color: var(--volt-electric);">{{ stat.value }}</div>
          <div class="text-xs mt-0.5" style="color: var(--volt-gray);">{{ stat.label }}</div>
        </div>
      </div>

      <div class="glass-card mb-4">
        <button class="flex items-center justify-between w-full" @click="showChangePwd = !showChangePwd">
          <span class="text-sm font-medium" style="color: var(--volt-white);">🔐 စကားဝှက် ပြောင်းမည်</span>
          <span style="color: var(--volt-electric); transition: transform 0.3s;" :style="showChangePwd ? 'transform: rotate(180deg)' : ''">▾</span>
        </button>
        <transition name="slide">
          <div v-if="showChangePwd" class="mt-4 space-y-3">
            <input type="password" placeholder="လက်ရှိ စကားဝှက်" class="volt-input w-full h-11 px-4 rounded-xl text-sm outline-none" />
            <input type="password" placeholder="စကားဝှက် အသစ်" class="volt-input w-full h-11 px-4 rounded-xl text-sm outline-none" />
            <input type="password" placeholder="အတည်ပြုပါ" class="volt-input w-full h-11 px-4 rounded-xl text-sm outline-none" />
            <button class="btn-primary h-11">ပြောင်းလဲမည်</button>
          </div>
        </transition>
      </div>

      <button class="btn-secondary h-12 flex items-center justify-center gap-2" @click="handleLogout">
        <span>🚪</span> ထွက်မည်
      </button>
    </div>
    <BottomNavBar />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth.store";
import TopNavBar from "@/components/layout/TopNavBar.vue";
import BottomNavBar from "@/components/layout/BottomNavBar.vue";
import NftAvatar from "@/components/ui/NftAvatar.vue";

const auth = useAuthStore();
const router = useRouter();
const showChangePwd = ref(false);

const stats = computed(() => [
  { label: "သွင်းငွေ", value: `${((auth.profile?.total_deposited || 0) / 1000).toFixed(0)}K` },
  { label: "ထုတ်ငွေ", value: `${((auth.profile?.total_withdrawn || 0) / 1000).toFixed(0)}K` },
  { label: "KYC", value: auth.profile?.kyc_verified ? "✓" : "✗" },
]);

async function handleLogout() {
  await auth.logout();
  router.push("/login");
}
</script>

<style scoped>
.volt-input { background: rgba(5,8,17,0.8); border: 1px solid rgba(0,212,255,0.2); color: var(--volt-white); }
.volt-input:focus { border-color: rgba(0,212,255,0.5); }
.slide-enter-active, .slide-leave-active { transition: max-height 0.3s ease, opacity 0.3s ease; overflow: hidden; max-height: 300px; }
.slide-enter-from, .slide-leave-to { max-height: 0; opacity: 0; }
</style>
