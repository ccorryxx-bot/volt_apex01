import { defineStore } from "pinia";
import { ref } from "vue";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

export const useUiStore = defineStore("ui", () => {
  const toasts = ref<Toast[]>([]);
  const globalLoading = ref(false);

  function addToast(type: ToastType, message: string, duration = 3000) {
    const id = Math.random().toString(36).slice(2);
    toasts.value.push({ id, type, message, duration });
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
    return id;
  }

  function removeToast(id: string) {
    const idx = toasts.value.findIndex((t) => t.id === id);
    if (idx !== -1) toasts.value.splice(idx, 1);
  }

  const toast = {
    success: (msg: string, dur?: number) => addToast("success", msg, dur),
    error:   (msg: string, dur?: number) => addToast("error",   msg, dur),
    info:    (msg: string, dur?: number) => addToast("info",    msg, dur),
    warning: (msg: string, dur?: number) => addToast("warning", msg, dur),
  };

  function setGlobalLoading(val: boolean) {
    globalLoading.value = val;
  }

  return { toasts, globalLoading, addToast, removeToast, toast, setGlobalLoading };
});
