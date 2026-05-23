<template>
  <header class="top-nav sticky top-0 z-50">
    <div class="flex items-center px-4 h-14 max-w-lg mx-auto">
      <span class="font-heading text-base font-black text-gold-gradient tracking-wider">VOLT APEX</span>
      <div class="ml-auto flex items-center gap-3">
        <button class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg" style="background: rgba(0,212,255,0.08); border: 1px solid rgba(0,212,255,0.15);" @click="$router.push('/deposit')">
          <span class="font-number text-sm font-semibold" style="color: var(--volt-gold);">{{ formatBalance(auth.profile?.balance || 0) }}</span>
          <span class="text-xs" style="color: var(--volt-gray);">K</span>
        </button>
        <button @click="$router.push('/profile')">
          <NftAvatar :src="auth.profile?.nft_avatar_url" :size="32" :showRing="false" :online="true" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth.store";
import NftAvatar from "@/components/ui/NftAvatar.vue";

const auth = useAuthStore();

function formatBalance(n: number) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(0) + "K";
  return n.toString();
}
</script>

<style scoped>
.top-nav {
  background: rgba(10, 14, 26, 0.9);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 212, 255, 0.1);
}
</style>
