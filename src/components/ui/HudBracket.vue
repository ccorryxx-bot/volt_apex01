<template>
  <div class="hud-frame hud-bracket relative" :class="{ 'scan': scan }">
    <div v-if="scan" class="scanning-line"></div>
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ scan?: boolean }>(), { scan: false });
</script>

<style scoped>
.hud-frame {
  background: rgba(13, 27, 62, 0.6);
  border: 1px solid rgba(0, 212, 255, 0.15);
  border-radius: 12px;
  padding: 1rem;
  overflow: hidden;
}
</style>
