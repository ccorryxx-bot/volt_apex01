import gsap from "gsap";

export function usePageTransition() {
  function onEnter(el: Element, done: () => void) {
    gsap.from(el, {
      opacity: 0,
      y: 14,
      duration: 0.35,
      ease: "power2.out",
      onComplete: done,
      clearProps: "all",
    });
  }

  function onLeave(el: Element, done: () => void) {
    gsap.to(el, {
      opacity: 0,
      y: -10,
      duration: 0.2,
      ease: "power2.in",
      onComplete: done,
    });
  }

  return { onEnter, onLeave };
}
