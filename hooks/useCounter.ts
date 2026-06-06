"use client";

import { useState, useEffect, RefObject } from "react";

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function useCounter(target: number, duration: number = 1200, ref?: RefObject<HTMLElement | null>) {
  const [count, setCount] = useState(0);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setCount(target);
      return;
    }

    if (ref && ref.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !hasTriggered) {
            setHasTriggered(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(ref.current);
      return () => observer.disconnect();
    } else {
      setHasTriggered(true);
    }
  }, [ref, hasTriggered, target]);

  useEffect(() => {
    if (!hasTriggered) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = easeOutCubic(progress);
      setCount(Math.floor(easedProgress * target));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [hasTriggered, target, duration]);

  return count;
}
