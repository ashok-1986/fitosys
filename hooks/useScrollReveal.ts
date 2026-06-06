import { useEffect } from "react";

export function useScrollReveal(ref: React.RefObject<HTMLElement | null>, options = {}) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('revealed');
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, ...options }
    );

    if (ref.current) {
      observer.observe(ref.current);
      const elements = ref.current.querySelectorAll(
        '.reveal-fade-up, .reveal-scale-in, .reveal-slide-left, .reveal-slide-right'
      );
      elements.forEach(el => observer.observe(el));
    }
    return () => observer.disconnect();
  }, [ref]);
}
