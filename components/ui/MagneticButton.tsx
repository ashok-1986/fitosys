"use client";

import { useEffect, useRef, useState, MouseEvent } from "react";

interface MagneticButtonProps {
  children: React.ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
  onClick?: () => void;
}

export function MagneticButton({ children, strength = 0.4, radius = 60, className = "", onClick }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (isTouch || !ref.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const distance = Math.sqrt(Math.pow(clientX - centerX, 2) + Math.pow(clientY - centerY, 2));
    
    if (distance < radius) {
      setIsHovering(true);
      setPosition({
        x: (clientX - centerX) * strength,
        y: (clientY - centerY) * strength
      });
      setMousePos({ x: clientX - left, y: clientY - top });
    } else {
      setIsHovering(false);
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setPosition({ x: 0, y: 0 });
  };

  if (isTouch) {
    return <div className={`relative inline-block ${className}`} onClick={onClick}>{children}</div>;
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative inline-block ${className}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: isHovering ? "none" : "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
      }}
      onClick={onClick}
    >
      {isHovering && (
        <div 
          className="absolute pointer-events-none rounded-full"
          style={{
            width: '80px',
            height: '80px',
            background: 'radial-gradient(circle, rgba(232,0,29,0.3) 0%, rgba(232,0,29,0) 70%)',
            left: `${mousePos.x - 40}px`,
            top: `${mousePos.y - 40}px`,
            zIndex: 0
          }}
        />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
