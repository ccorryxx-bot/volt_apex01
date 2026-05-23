<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="route.meta.transition as string || 'page'" mode="out-in">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
  <VoltToast />
</template>

<script setup lang="ts">
import VoltToast from "@/components/ui/VoltToast.vue";
</script>

<style>
.page-enter-active {
  animation: page-slide-in 0.28s ease forwards;
}
.page-leave-active {
  animation: page-slide-out 0.2s ease forwards;
}
@keyframes page-slide-in {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes page-slide-out {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(-8px); }
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
