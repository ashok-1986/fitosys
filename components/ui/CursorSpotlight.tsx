"use client";

import { useEffect, useState, RefObject } from "react";

interface Props {
  containerRef: RefObject<HTMLElement | null>;
}

export function CursorSpotlight({ containerRef }: Props) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    if (isTouch || !containerRef.current) return;
    const container = containerRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setOpacity(1);
    };

    const handleMouseLeave = () => {
      setOpacity(0);
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isTouch, containerRef]);

  if (isTouch) return null;

  return (
    <div
      className="pointer-events-none absolute w-[300px] h-[300px] rounded-full z-[1]"
      style={{
        background: "radial-gradient(circle, rgba(232,0,29,0.12) 0%, rgba(232,0,29,0) 70%)",
        transform: `translate(${position.x - 150}px, ${position.y - 150}px)`,
        opacity,
        transition: "opacity 0.3s ease",
      }}
    />
  );
}
