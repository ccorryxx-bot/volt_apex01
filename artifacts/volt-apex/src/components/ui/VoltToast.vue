<template>
  <teleport to="body">
    <div class="toast-container">
      <transition-group name="toast" tag="div">
        <div
          v-for="toast in ui.toasts"
          :key="toast.id"
          class="toast-item"
          :class="`toast-${toast.type}`"
          @click="ui.removeToast(toast.id)"
        >
          <span class="toast-icon">{{ icons[toast.type] }}</span>
          <span class="toast-msg">{{ toast.message }}</span>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { useUiStore } from "@/stores/ui.store";

const ui = useUiStore();
const icons: Record<string, string> = {
  success: "✓",
  error: "✕",
  info: "ℹ",
  warning: "⚠",
};
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 320px;
  width: calc(100vw - 2rem);
}
.toast-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  border-radius: 12px;
  backdrop-filter: blur(20px);
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--volt-white);
  border: 1px solid transparent;
}
.toast-success { background: rgba(0,255,179,0.15); border-color: rgba(0,255,179,0.3); }
.toast-success .toast-icon { color: var(--volt-emerald); }
.toast-error   { background: rgba(255,61,90,0.15); border-color: rgba(255,61,90,0.3); }
.toast-error   .toast-icon { color: var(--volt-red); }
.toast-info    { background: rgba(0,212,255,0.12); border-color: rgba(0,212,255,0.25); }
.toast-info    .toast-icon { color: var(--volt-electric); }
.toast-warning { background: rgba(212,175,55,0.15); border-color: rgba(212,175,55,0.3); }
.toast-warning .toast-icon { color: var(--volt-gold); }
.toast-icon    { font-weight: 700; font-size: 1rem; flex-shrink: 0; }
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from { opacity: 0; transform: translateX(24px); }
.toast-leave-to   { opacity: 0; transform: translateX(24px); }
</style>
