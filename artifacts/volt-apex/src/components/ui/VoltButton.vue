<template>
  <button
    :class="classes"
    :disabled="disabled || loading"
    v-bind="$attrs"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="spinner"></span>
    <slot v-else />
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(defineProps<{
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}>(), {
  variant: "primary",
  size: "md",
  loading: false,
  disabled: false,
  fullWidth: false,
});

defineEmits(["click"]);

const classes = computed(() => {
  const base = "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-150 cursor-pointer border-0";
  const width = props.fullWidth ? "w-full" : "";
  const disabled = (props.disabled || props.loading) ? "opacity-70 cursor-not-allowed" : "active:scale-95";

  const sizes: Record<string, string> = {
    sm: "h-9 px-4 text-sm",
    md: "h-12 px-6 text-base",
    lg: "h-14 px-8 text-lg",
  };

  const variants: Record<string, string> = {
    primary: "btn-primary anim-glow-pulse text-volt-black font-bold",
    secondary: "btn-secondary",
    ghost: "bg-transparent text-volt-gray text-sm hover:text-volt-white",
    danger: "bg-transparent border border-volt-red text-volt-red hover:bg-volt-red/10",
  };

  return [base, width, disabled, sizes[props.size], variants[props.variant]].filter(Boolean).join(" ");
});
</script>

<style scoped>
.spinner {
  width: 18px; height: 18px;
  border: 2px solid rgba(5,8,17,0.3);
  border-top-color: #050811;
  border-radius: 50%;
  animation: rotate-ring 0.7s linear infinite;
}
</style>
