<template>
  <div class="avatar-wrapper" :style="{ width: `${size}px`, height: `${size}px` }">
    <img
      v-if="src"
      :src="src"
      :alt="alt"
      class="avatar-img"
      :style="{ width: `${size}px`, height: `${size}px` }"
    />
    <div v-else class="avatar-placeholder" :style="{ width: `${size}px`, height: `${size}px` }">
      <span style="font-size: 1.5rem;">🎮</span>
    </div>
    <div v-if="showRing" class="ring-1" :style="ringStyle1"></div>
    <div v-if="showRing" class="ring-2" :style="ringStyle2"></div>
    <div v-if="online" class="online-dot"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(defineProps<{
  src?: string;
  alt?: string;
  size?: number;
  showRing?: boolean;
  online?: boolean;
}>(), { size: 56, showRing: true, online: false, alt: "Avatar" });

const ringStyle1 = computed(() => ({
  width: `${props.size + 8}px`,
  height: `${props.size + 8}px`,
  top: `-4px`,
  left: `-4px`,
}));

const ringStyle2 = computed(() => ({
  width: `${props.size + 16}px`,
  height: `${props.size + 16}px`,
  top: `-8px`,
  left: `-8px`,
}));
</script>

<style scoped>
.avatar-wrapper { position: relative; flex-shrink: 0; }
.avatar-img {
  border-radius: 50%;
  border: 2px solid rgba(212, 175, 55, 0.4);
  display: block;
  object-fit: cover;
}
.avatar-placeholder {
  border-radius: 50%;
  background: rgba(13, 27, 62, 0.8);
  border: 2px solid rgba(0, 212, 255, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}
.ring-1 {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid transparent;
  border-top-color: var(--volt-electric);
  border-right-color: rgba(0, 212, 255, 0.3);
  animation: rotate-ring 3s linear infinite;
}
.ring-2 {
  position: absolute;
  border-radius: 50%;
  border: 1px solid transparent;
  border-bottom-color: var(--volt-gold);
  border-left-color: rgba(212, 175, 55, 0.2);
  animation: rotate-ring 5s linear infinite reverse;
}
.online-dot {
  position: absolute;
  bottom: 2px; right: 2px;
  width: 10px; height: 10px;
  background: var(--volt-emerald);
  border-radius: 50%;
  border: 2px solid var(--volt-navy);
  box-shadow: 0 0 6px var(--volt-emerald);
}
</style>
