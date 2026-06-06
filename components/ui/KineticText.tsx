"use client";

import { useEffect, useRef, useState, ElementType } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

interface KineticTextProps {
  text: string;
  delay?: number;
  charDelay?: number;
  className?: string;
  as?: ElementType;
}

export function KineticText({ text, delay = 0, charDelay = 40, className = "", as: Component = "span" }: KineticTextProps) {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  const words = text.split(" ");
  const chars = text.split("");

  return (
    <Component ref={ref} className={`inline-block ${className}`}>
      {isMobile ? (
        words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden mr-[0.25em] pb-1">
            <span
              className="kinetic-char inline-block"
              style={{ transitionDelay: `${delay + i * charDelay * 3}ms` }}
            >
              {word}
            </span>
          </span>
        ))
      ) : (
        chars.map((char, i) => (
          <span key={i} className="inline-block overflow-hidden pb-1">
            <span
              className="kinetic-char inline-block"
              style={{ transitionDelay: `${delay + i * charDelay}ms` }}
            >
              {char === " " ? "\u00A0" : char}
            </span>
          </span>
        ))
      )}
    </Component>
  );
}
