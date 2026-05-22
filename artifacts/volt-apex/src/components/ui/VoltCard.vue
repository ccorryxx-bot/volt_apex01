<template>
  <div class="volt-card relative" :class="{ 'hud-bracket': hud }">
    <div v-if="scan" class="scanning-line"></div>
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  hud?: boolean;
  scan?: boolean;
}>(), { hud: false, scan: false });
</script>

<style scoped>
.volt-card {
  background: rgba(13, 27, 62, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  border: 1px solid rgba(212, 175, 55, 0.12);
  box-shadow: 0 8px 32px rgba(0, 212, 255, 0.08);
  padding: 1.25rem;
  overflow: hidden;
}
</style>
