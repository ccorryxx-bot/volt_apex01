<template>
  <teleport to="body">
    <transition name="modal-fade">
      <div v-if="modelValue" class="modal-backdrop" @click.self="$emit('update:modelValue', false)">
        <div class="modal-content glass-card" role="dialog">
          <div class="modal-header" v-if="$slots.header || title">
            <slot name="header">
              <h3 class="font-heading text-base tracking-wide" style="color: var(--volt-electric);">{{ title }}</h3>
            </slot>
            <button class="modal-close" @click="$emit('update:modelValue', false)">✕</button>
          </div>
          <div class="modal-body">
            <slot />
          </div>
          <div class="modal-footer" v-if="$slots.footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
defineProps<{ modelValue: boolean; title?: string }>();
defineEmits(["update:modelValue"]);
</script>

<style scoped>
.modal-backdrop {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(5, 8, 17, 0.8);
  backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
}
.modal-content { width: 100%; max-width: 420px; }
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 1rem; padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(0,212,255,0.1);
}
.modal-close {
  color: var(--volt-gray); background: none; border: none;
  cursor: pointer; font-size: 1rem; line-height: 1;
  padding: 0.25rem; border-radius: 4px;
  transition: color 0.2s ease;
}
.modal-close:hover { color: var(--volt-white); }
.modal-footer { margin-top: 1rem; padding-top: 0.75rem; border-top: 1px solid rgba(0,212,255,0.1); }
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.2s ease; }
.modal-fade-enter-active .modal-content, .modal-fade-leave-active .modal-content { transition: transform 0.2s ease; }
.modal-fade-enter-from { opacity: 0; }
.modal-fade-enter-from .modal-content { transform: scale(0.95) translateY(8px); }
.modal-fade-leave-to { opacity: 0; }
</style>
