"use client";

import { useEffect, useRef } from 'react';

export function useReveal<T extends HTMLElement>(delay = 0) {
  const ref = useRef<T>(null);

  useEffect(() => {
    // Respect prefers-reduced-motion — mandatory
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    if (prefersReduced) {
      // Make element immediately visible
      if (ref.current) {
        ref.current.style.opacity = '1';
        ref.current.style.transform = 'none';
      }
      return;
    }

    const timeouts = new Set<NodeJS.Timeout>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const timeoutId = setTimeout(() => {
              entry.target.classList.add('revealed');
              timeouts.delete(timeoutId);
            }, delay);
            timeouts.add(timeoutId);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => {
      observer.disconnect();
      timeouts.forEach((id) => clearTimeout(id));
      timeouts.clear();
    };
  }, [delay]);

  return ref;
}
