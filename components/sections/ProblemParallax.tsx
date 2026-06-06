'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useReveal } from '@/hooks/useReveal';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const IMG_PADDING = 12;

interface ProblemPanelProps {
  number: string;
  category: string;
  heading: string;
  body: string;
  statBadge: string;
}

const ProblemPanel = ({ number, category, heading, body, statBadge }: ProblemPanelProps) => {
  return (
    <div
      style={{
        paddingLeft: IMG_PADDING,
        paddingRight: IMG_PADDING,
        position: 'relative',
      }}
    >
      {/* 150vh gives the scroll distance for the sticky effect */}
      <div style={{ position: 'relative', height: '150vh' }}>

        {/* 1. STICKY BACKGROUND PANEL */}
        <StickyPanel number={number} />

        {/* 2. STICKY ANCHOR — creates a viewport-sized canvas */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            height: '100svh',
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          {/* 3. OVERLAY CONTENT — transforms within viewport */}
          <OverlayContent
            number={number}
            category={category}
            heading={heading}
            body={body}
            statBadge={statBadge}
          />
        </div>

      </div>
    </div>
  );
};

const StickyPanel = ({ number }: { number: string }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['end end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.1]);

  return (
    <motion.div
      ref={targetRef}
      style={{
        position: 'sticky',
        top: 0,
        height: '100svh',
        scale,
        opacity,
        backgroundColor: '#0A0A0A',
        borderRadius: 12,
        overflow: 'hidden',
        zIndex: 0,
      }}
    >
      {/* Ghost number — bottom right, large */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          bottom: '-2%',
          right: '3%',
          fontFamily: 'var(--fd)',
          fontSize: 'clamp(200px, 28vw, 400px)',
          fontWeight: 500,
          color: 'rgba(232, 0, 29, 0.05)',
          lineHeight: 1,
          textTransform: 'uppercase',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        {number}
      </div>
      {/* Grid texture */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),' +
            'linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />
    </motion.div>
  );
};

const OverlayContent = ({
  number, category, heading, body, statBadge,
}: ProblemPanelProps) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const opacity = useTransform(
    scrollYProgress,
    [0.1, 0.3, 0.7, 0.9],
    [0, 1, 1, 0]
  );

  return (
    <motion.div
      ref={targetRef}
      className="absolute inset-0 flex flex-col justify-center"
      style={{
        y,
        opacity,
        paddingLeft: 'clamp(24px, 5vw, 80px)',
        paddingRight: 'clamp(24px, 5vw, 80px)',
      }}
    >
      {/* Category eyebrow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ width: 28, height: 2, background: '#E8001D' }} />
        <span style={{
          fontFamily: 'var(--fb)',
          fontSize: 11,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          color: '#E8001D',
        }}>
          {category}
        </span>
      </div>

      {/* Panel number */}
      <div style={{
        fontFamily: 'var(--fd)',
        fontSize: 13,
        fontWeight: 500,
        color: 'rgba(232,0,29,0.35)',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        marginBottom: 14,
      }}>
        {number}
      </div>

      {/* Main heading */}
      <h2 style={{
        fontFamily: 'var(--fd)',
        fontSize: 'clamp(40px, 5.5vw, 80px)',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.01em',
        lineHeight: 1.0,
        color: '#FFFFFF',
        maxWidth: 600,
        marginBottom: 20,
        overflowWrap: 'normal',
        wordBreak: 'keep-all',
      }}>
        {heading}
      </h2>

      {/* Body */}
      <p style={{
        fontFamily: 'var(--fb)',
        fontSize: 'clamp(14px, 1.3vw, 17px)',
        color: '#888888',
        lineHeight: 1.7,
        maxWidth: 460,
        marginBottom: 24,
      }}>
        {body}
      </p>

      {/* Stat badge */}
      <div style={{
        display: 'inline-block',
        alignSelf: 'flex-start',
        fontFamily: 'var(--fb)',
        fontSize: 11,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: '#E8001D',
        background: 'rgba(232,0,29,0.08)',
        border: '1px solid rgba(232,0,29,0.2)',
        padding: '5px 14px',
        borderRadius: 2,
      }}>
        {statBadge}
      </div>
    </motion.div>
  );
};

const PROBLEMS: ProblemPanelProps[] = [
  {
    number: '01',
    category: 'Revenue Leakage',
    heading: 'Renewals slip. Silently.',
    body: 'Programs expire and you find out when the client stops responding. No reminder fired. No system caught it. At ₹3,000 to ₹8,000 per client per month, that is real money gone quietly.',
    statBadge: '₹72,000+ lost annually on average',
  },
  {
    number: '02',
    category: 'Engagement Blindspot',
    heading: "You can't see who's about to leave.",
    body: "Without structured check-ins, there is no early warning. By the time a client's energy drops or sessions start slipping, the relationship has already cooled. You catch it after the fact — not before.",
    statBadge: '10–20% annual churn from retention blindness',
  },
  {
    number: '03',
    category: 'Admin Burnout',
    heading: 'Sunday evenings are not yours.',
    body: 'Manual check-ins. Payment follow-ups. Onboarding over 4 WhatsApp exchanges. Coaches with 25 clients spend 3 to 5 hours a week on tasks a system should handle.',
    statBadge: '3–5 hours of admin every week',
  },
];

const ProblemMobileCards = ({ problems }: { problems: ProblemPanelProps[] }) => {
  return (
    <div className="flex flex-col gap-6 px-4 pb-12">
      {problems.map((problem) => (
        <div key={problem.number} className="bg-[#111111] border border-white/5 rounded-2xl p-8 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-8 opacity-10 font-display font-medium text-[120px] text-[var(--red)] leading-none select-none">
            {problem.number}
          </div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-6 h-[2px] bg-red-600" />
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-red-500">
              {problem.category}
            </span>
          </div>
          <h3 className="font-display font-medium text-[32px] uppercase leading-[1.1] text-white mb-4 relative z-10">
            {problem.heading}
          </h3>
          <p className="font-sans text-[15px] text-[#888888] leading-[1.7] mb-6 relative z-10">
            {problem.body}
          </p>
          <div className="inline-block font-sans text-[10px] font-bold uppercase tracking-[0.1em] text-[#E8001D] bg-[rgba(232,0,29,0.08)] border border-[rgba(232,0,29,0.2)] px-3 py-1.5 rounded-[2px] relative z-10">
            {problem.statBadge}
          </div>
        </div>
      ))}
    </div>
  );
};

const ProblemParallaxDesktop = ({ problems }: { problems: ProblemPanelProps[] }) => {
  return (
    <>
      {problems.map((problem) => (
        <ProblemPanel key={problem.number} {...problem} />
      ))}
    </>
  );
};

export default function ProblemParallax() {
  const headingRef = useReveal<HTMLHeadingElement>(0);
  const textRef = useReveal<HTMLParagraphElement>(100);
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="problem" className="bg-[#0A0A0A]" style={{ overflow: 'visible', position: 'relative' }}>
      {/* Section intro */}
      <div className="mx-auto max-w-[1200px] px-8 lg:px-16 pt-24 pb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-[2px] bg-red-600" />
          <span
            style={{ fontFamily: 'var(--fb)' }}
            className="text-xs font-semibold uppercase tracking-[0.12em] text-red-500"
          >
            The Problem
          </span>
        </div>
        <h2
          ref={headingRef}
          style={{ fontFamily: 'var(--fd)', overflowWrap: 'normal', wordBreak: 'keep-all', whiteSpace: 'normal' }}
          className="reveal-on-scroll text-[48px] lg:text-[64px] xl:text-[80px] font-medium uppercase leading-none text-white mb-6"
        >
          Your coaching is excellent.
          <br />
          <span className="text-white">Your system is broken.</span>
        </h2>
        <p
          ref={textRef}
          style={{ fontFamily: 'var(--fb)' }}
          className="reveal-on-scroll text-[17px] text-[#888888] leading-relaxed max-w-[480px]"
        >
          Independent coaches with 20 to 40 clients face the same three failures every month.
          None of them have anything to do with coaching quality.
        </p>
      </div>

      {!mounted ? null : isMobile ? (
        <ProblemMobileCards problems={PROBLEMS} />
      ) : (
        <ProblemParallaxDesktop problems={PROBLEMS} />
      )}

      {/* Bottom spacer — prevents next section from overlapping */}
      <div style={{ height: 80 }} />
    </section>
  );
}
