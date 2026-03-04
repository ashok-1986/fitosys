"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealProps {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    direction?: "up" | "down" | "left" | "right" | "none";
    distance?: number;
    duration?: number;
    stagger?: number;
    scale?: number;
}

export function ScrollReveal({
    children,
    className = "",
    delay = 0,
    direction = "up",
    distance = 50,
    duration = 0.8,
    scale,
}: ScrollRevealProps) {
    const ref = useRef<HTMLDivElement>(null);

    const [ready, setReady] = useState(false);

    useEffect(() => {
        setReady(true);
    }, []);

    useEffect(() => {
        if (!ready) return;
        const el = ref.current;
        if (!el) return;

        const fromVars: gsap.TweenVars = {
            opacity: 0,
            duration,
            delay,
            ease: "power3.out",
        };

        if (scale) fromVars.scale = scale;

        switch (direction) {
            case "up":
                fromVars.y = distance;
                break;
            case "down":
                fromVars.y = -distance;
                break;
            case "left":
                fromVars.x = distance;
                break;
            case "right":
                fromVars.x = -distance;
                break;
        }

        const tween = gsap.from(el, {
            ...fromVars,
            scrollTrigger: {
                trigger: el,
                start: "top 90%",
                toggleActions: "play none none none",
            },
        });

        // Refresh after a tick so elements already in viewport fire
        const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

        return () => {
            cancelAnimationFrame(raf);
            tween.scrollTrigger?.kill();
            tween.kill();
        };
    }, [ready, delay, direction, distance, duration, scale]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}

interface StaggerRevealProps {
    children: React.ReactNode;
    className?: string;
    stagger?: number;
    direction?: "up" | "left";
    distance?: number;
}

export function StaggerReveal({
    children,
    className = "",
    stagger = 0.15,
    direction = "up",
    distance = 40,
}: StaggerRevealProps) {
    const ref = useRef<HTMLDivElement>(null);

    const [ready, setReady] = useState(false);

    useEffect(() => {
        setReady(true);
    }, []);

    useEffect(() => {
        if (!ready) return;
        const el = ref.current;
        if (!el) return;

        const items = el.children;
        if (!items.length) return;

        const fromVars: gsap.TweenVars = {
            opacity: 0,
            duration: 0.7,
            stagger,
            ease: "power3.out",
        };

        if (direction === "up") fromVars.y = distance;
        if (direction === "left") fromVars.x = distance;

        const tween = gsap.from(items, {
            ...fromVars,
            scrollTrigger: {
                trigger: el,
                start: "top 90%",
                toggleActions: "play none none none",
            },
        });

        const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

        return () => {
            cancelAnimationFrame(raf);
            tween.scrollTrigger?.kill();
            tween.kill();
        };
    }, [ready, stagger, direction, distance]);

    return (
        <div ref={ref} className={className}>
            {children}
        </div>
    );
}

interface ImageRevealProps {
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
    effect?: "zoom" | "slide" | "fade" | "float";
}

export function ImageReveal({
    src,
    alt,
    className = "",
    width,
    height,
    effect = "zoom",
}: ImageRevealProps) {
    const ref = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const el = ref.current;
        const img = imgRef.current;
        if (!el || !img) return;

        switch (effect) {
            case "zoom":
                gsap.from(img, {
                    scale: 1.15,
                    opacity: 0,
                    duration: 1.2,
                    ease: "power2.out",
                    scrollTrigger: { trigger: el, start: "top 85%", once: true },
                });
                break;
            case "slide":
                gsap.from(el, {
                    x: 80,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: { trigger: el, start: "top 85%", once: true },
                });
                break;
            case "fade":
                gsap.from(el, {
                    opacity: 0,
                    duration: 1.2,
                    ease: "power2.out",
                    scrollTrigger: { trigger: el, start: "top 85%", once: true },
                });
                break;
            case "float":
                gsap.from(el, {
                    y: 40,
                    opacity: 0,
                    duration: 1,
                    ease: "power3.out",
                    scrollTrigger: { trigger: el, start: "top 85%", once: true },
                });
                // Add continuous floating animation after reveal
                gsap.to(img, {
                    y: -8,
                    duration: 2.5,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut",
                    delay: 1,
                });
                break;
        }

        return () => {
            ScrollTrigger.getAll().forEach((t) => {
                if (t.trigger === el) t.kill();
            });
        };
    }, [effect]);

    return (
        <div ref={ref} className={`overflow-hidden ${className}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="w-full h-auto"
            />
        </div>
    );
}

interface CountUpProps {
    end: number;
    suffix?: string;
    prefix?: string;
    className?: string;
    duration?: number;
}

export function CountUp({
    end,
    suffix = "",
    prefix = "",
    className = "",
    duration = 2,
}: CountUpProps) {
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const obj = { val: 0 };
        gsap.to(obj, {
            val: end,
            duration,
            ease: "power2.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
            onUpdate: () => {
                el.textContent = `${prefix}${Math.round(obj.val).toLocaleString()}${suffix}`;
            },
        });

        return () => {
            ScrollTrigger.getAll().forEach((t) => {
                if (t.trigger === el) t.kill();
            });
        };
    }, [end, suffix, prefix, duration]);

    return <span ref={ref} className={className}>0</span>;
}
