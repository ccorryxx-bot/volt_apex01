<template>
  <div class="skeleton-shimmer" :style="{ width, height, borderRadius: radius }"></div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  width?: string;
  height?: string;
  radius?: string;
}>(), { width: "100%", height: "16px", radius: "8px" });
</script>

<style scoped>
.skeleton-shimmer {
  background: linear-gradient(90deg, rgba(13,27,62,0.8) 0%, rgba(0,212,255,0.06) 50%, rgba(13,27,62,0.8) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
</style>
