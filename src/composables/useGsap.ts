import { onMounted, onUnmounted, type Ref } from "vue";
import gsap from "gsap";

/** Fade-in + slide up on mount */
export function useFadeIn(el: Ref<HTMLElement | null>, options?: { y?: number; duration?: number; delay?: number }) {
  onMounted(() => {
    if (!el.value) return;
    gsap.from(el.value, {
      opacity: 0,
      y: options?.y ?? 20,
      duration: options?.duration ?? 0.5,
      delay: options?.delay ?? 0,
      ease: "power2.out",
    });
  });
}

/** Stagger children on mount */
export function useStaggerIn(container: Ref<HTMLElement | null>, selector = ":scope > *", stagger = 0.07) {
  onMounted(() => {
    if (!container.value) return;
    const children = container.value.querySelectorAll(selector);
    if (!children.length) return;
    gsap.from(children, {
      opacity: 0,
      y: 16,
      stagger,
      duration: 0.4,
      ease: "power2.out",
    });
  });
}

/** Counter animation for numbers */
export function useCounter(el: Ref<HTMLElement | null>, target: number, duration = 1.2, prefix = "", suffix = "") {
  onMounted(() => {
    if (!el.value) return;
    const obj = { value: 0 };
    gsap.to(obj, {
      value: target,
      duration,
      ease: "power2.out",
      onUpdate() {
        if (el.value) el.value.textContent = prefix + Math.floor(obj.value).toLocaleString() + suffix;
      },
    });
  });
}

/** Number tween for reactive ref */
export function tweenNumber(from: number, to: number, duration: number, onUpdate: (v: number) => void) {
  const obj = { value: from };
  return gsap.to(obj, { value: to, duration, ease: "power2.out", onUpdate: () => onUpdate(obj.value) });
}

/** Page transition — call from router hook */
export function pageEnter(el: Element) {
  return gsap.from(el, { opacity: 0, y: 12, duration: 0.3, ease: "power2.out", clearProps: "all" });
}
export function pageLeave(el: Element, done: () => void) {
  gsap.to(el, { opacity: 0, y: -8, duration: 0.2, ease: "power2.in", onComplete: done });
}

/** Pulse glow on balance change */
export function pulseGlow(el: HTMLElement | null, color = "rgba(212,175,55,0.6)") {
  if (!el) return;
  gsap.to(el, {
    boxShadow: `0 0 24px ${color}`,
    duration: 0.3,
    yoyo: true,
    repeat: 1,
    onComplete: () => gsap.set(el, { boxShadow: "none" }),
  });
}
