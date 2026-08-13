'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const PROBLEMS = [
  {
    number: '01',
    category: 'Revenue Leakage',
    heading: 'Renewals slip.\nSilently.',
    body: "Programs expire silently. No system catches it. At ₹3-8k per client/month, that's real money lost without a fight.",
    stat: '₹72,000+',
    statLabel: 'lost annually on average',
    badge: '₹72,000+ LOST ANNUALLY ON AVERAGE',
    cardType: 'revenue',
    cardData: {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      values: [100, 85, 70, 55, 40, 25],
      label: 'Renewal rate without a system',
      sublabel: 'Clients who don\'t renew — not because of coaching quality',
    },
  },
  {
    number: '02',
    category: 'Engagement Blindspot',
    heading: "You can't see\nwho's leaving.",
    body: "Without structured check-ins, there's no early warning. When energy drops, you only catch it after the relationship cools.",
    stat: '10–20%',
    statLabel: 'annual churn from retention blindness',
    badge: '10–20% ANNUAL CHURN FROM RETENTION BLINDNESS',
    cardType: 'engagement',
    cardData: {
      clients: [
        { name: 'Anjali K.', weeks: 3, status: 'silent', energy: 3 },
        { name: 'Rahul V.', weeks: 2, status: 'silent', energy: 4 },
        { name: 'Priya S.', weeks: 1, status: 'at-risk', energy: 5 },
        { name: 'Meera T.', weeks: 0, status: 'ok', energy: 8 },
      ],
      label: 'Clients you can\'t see slipping',
    },
  },
  {
    number: '03',
    category: 'Admin Burnout',
    heading: 'Sunday evenings\nare not yours.',
    body: 'Manual check-ins. Payment follow-ups. Messy onboarding. Coaches waste 3-5 hours every week on tasks a system should handle.',
    stat: '3–5 HRS',
    statLabel: 'of admin every week',
    badge: '3–5 HOURS OF ADMIN EVERY WEEK',
    cardType: 'time',
    cardData: {
      tasks: [
        { label: 'Manual check-ins', hours: 2.0, color: '#E8001D' },
        { label: 'Payment follow-ups', hours: 1.0, color: '#B00015' },
        { label: 'Onboarding messages', hours: 0.75, color: '#800010' },
        { label: 'Renewal reminders', hours: 0.5, color: '#500008' },
      ],
      label: 'Hours lost every Sunday',
    },
  },
];

const Reveal = ({ children, delay = 0, direction = 'up' }: { children: React.ReactNode; delay?: number; direction?: 'up' | 'down' | 'left' | 'right' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 32 : direction === 'down' ? -32 : 0,
      x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

const RevenueCard = ({ data }: { data: { months: string[]; values: number[]; label: string; sublabel: string } }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <div ref={ref} style={{
      background: '#111111',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 8,
      padding: 24,
    }}>
      <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16, fontFamily: 'var(--fb)' }}>
        {data.label}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80, marginBottom: 12 }}>
        {data.values.map((v, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <motion.div 
              initial={{ height: '100%' }}
              animate={isInView ? { height: `${v}%` } : { height: '100%' }}
              transition={{ duration: 1.2, delay: 0.2 + (i * 0.1), ease: "easeOut" }}
              style={{
                width: '100%',
                background: `rgba(232,0,29,${0.15 + (v / 100) * 0.6})`,
                borderRadius: '3px 3px 0 0',
              }} 
            />
            <span style={{ fontSize: 9, color: '#666', textTransform: 'uppercase', fontFamily: 'var(--fb)' }}>{data.months[i]}</span>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: '#666', lineHeight: 1.4, fontFamily: 'var(--fb)' }}>{data.sublabel}</div>
      <div style={{ marginTop: 12, padding: '6px 10px', background: 'rgba(232,0,29,0.08)', border: '1px solid rgba(232,0,29,0.2)', borderRadius: 4 }}>
        <span style={{ fontSize: 11, color: '#E8001D', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--fb)' }}>
          No system = no second chance
        </span>
      </div>
    </div>
  );
};

const EngagementCard = ({ data }: { data: { clients: { name: string; weeks: number; status: 'silent' | 'at-risk' | 'ok'; energy: number }[]; label: string } }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <div ref={ref} style={{
      background: '#111111',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 8,
      padding: 24,
    }}>
      <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16, fontFamily: 'var(--fb)' }}>
        {data.label}
      </div>
      {data.clients.map((client, i) => (
        <motion.div 
          key={i} 
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
          transition={{ duration: 0.5, delay: 0.3 + (i * 0.15), ease: "easeOut" }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 0',
            borderBottom: i < data.clients.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: client.status === 'silent' ? '#E8001D'
                : client.status === 'at-risk' ? '#F5A623'
                : '#25D366',
              flexShrink: 0,
            }} />
            <span style={{ fontSize: 13, color: client.status === 'ok' ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.85)', fontFamily: 'var(--fb)' }}>
              {client.name}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: client.status === 'silent' ? '#E8001D' : client.status === 'at-risk' ? '#F5A623' : '#888', fontFamily: 'var(--fb)' }}>
              {client.status === 'silent' ? `${client.weeks}w silent`
                : client.status === 'at-risk' ? 'at risk'
                : 'on track'}
            </div>
            <div style={{ fontSize: 10, color: '#555', fontFamily: 'var(--fb)' }}>energy {client.energy}/10</div>
          </div>
        </motion.div>
      ))}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.0, duration: 0.5 }}
        style={{ marginTop: 12, fontSize: 11, color: '#666', fontFamily: 'var(--fb)' }}
      >
        You have no way to know this without Fitosys.
      </motion.div>
    </div>
  );
};

const TimeCard = ({ data }: { data: { tasks: { label: string; hours: number; color: string }[]; label: string } }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  return (
    <div ref={ref} style={{
      background: '#111111',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 8,
      padding: 24,
    }}>
      <div style={{ fontSize: 11, color: '#888', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16, fontFamily: 'var(--fb)' }}>
        {data.label}
      </div>
      {data.tasks.map((task, i) => (
        <div key={i} style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--fb)' }}>{task.label}</span>
            <span style={{ fontSize: 12, color: '#E8001D', fontWeight: 600, fontFamily: 'var(--fb)' }}>{task.hours}h</span>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={isInView ? { width: `${(task.hours / 2.0) * 100}%` } : { width: 0 }}
              transition={{ duration: 1.0, delay: 0.3 + (i * 0.2), ease: "easeOut" }}
              style={{
                height: '100%',
                background: task.color,
                borderRadius: 3,
              }} 
            />
          </div>
        </div>
      ))}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        style={{
          marginTop: 16,
          paddingTop: 12,
          borderTop: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 12, color: '#888', fontFamily: 'var(--fb)' }}>Total per week</span>
        <span style={{ fontSize: 20, fontFamily: 'var(--fd)', fontWeight: 500, color: '#E8001D' }}>4.25 HRS</span>
      </motion.div>
    </div>
  );
};

export default function TheProblemSection() {
  return (
    <section
      id="problem"
      style={{
        backgroundColor: '#0A0A0A',
        position: 'relative',
      }}
    >
      <style>{`
        .tps-panel-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(32px, 5vw, 80px);
          align-items: center;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 768px) {
          .tps-panel-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
          .tps-panel-card {
            display: none;
          }
          .tps-panel-intro,
          .tps-panel-quote {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>

      {/* Section intro */}
      <div className="tps-panel-intro" style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '120px 40px 96px',
      }}>
        <Reveal>
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
              The Problem
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 style={{
            fontFamily: 'var(--fd)',
            fontSize: 'clamp(40px, 5vw, 72px)',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.01em',
            lineHeight: 1.0,
            color: '#FFFFFF',
            marginBottom: 20,
          }}>
            Your coaching is excellent.<br />
            <span style={{ color: '#FFFFFF' }}>Your system is broken.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p style={{
            fontFamily: 'var(--fb)',
            fontSize: 17,
            color: '#888888',
            lineHeight: 1.7,
            maxWidth: 480,
          }}>
            Independent coaches with 20 to 40 clients face the same three failures every month.
            None of them have anything to do with coaching quality.
          </p>
        </Reveal>
      </div>

      {/* THREE PROBLEM PANELS */}
      {PROBLEMS.map((problem, idx) => (
        <div
          key={problem.number}
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            background: idx % 2 === 0
              ? '#0A0A0A'
              : '#0D0D0D',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Large ghost number — background texture */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              right: '-2%',
              top: '50%',
              transform: 'translateY(-50%)',
              fontFamily: 'var(--fd)',
              fontSize: 'clamp(180px, 25vw, 320px)',
              fontWeight: 500,
              color: 'rgba(232,0,29,0.04)',
              lineHeight: 1,
              textTransform: 'uppercase',
              userSelect: 'none',
              pointerEvents: 'none',
              letterSpacing: '-0.02em',
            }}
          >
            {problem.number}
          </div>

          {/* Red left border accent */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: 3,
            background: 'linear-gradient(180deg, transparent, #E8001D 30%, #E8001D 70%, transparent)',
            opacity: 0.6,
          }} />

          <div className="tps-panel-grid" style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: 'clamp(80px, 8vw, 120px) 40px',
          }}>

            {/* LEFT — Problem content */}
            <div>
              <Reveal delay={0.05}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span style={{
                    fontFamily: 'var(--fd)',
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'rgba(232,0,29,0.5)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}>
                    {problem.number}
                  </span>
                  <span style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.15)' }} />
                  <span style={{
                    fontFamily: 'var(--fb)',
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#E8001D',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                  }}>
                    {problem.category}
                  </span>
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <h3 style={{
                  fontFamily: 'var(--fd)',
                  fontSize: 'clamp(36px, 4vw, 64px)',
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  letterSpacing: '0.01em',
                  lineHeight: 1.05,
                  color: '#FFFFFF',
                  marginBottom: 20,
                  whiteSpace: 'pre-line',
                  overflowWrap: 'normal',
                  wordBreak: 'keep-all',
                }}>
                  {problem.heading}
                </h3>
              </Reveal>

              <Reveal delay={0.15}>
                <p style={{
                  fontFamily: 'var(--fb)',
                  fontSize: 16,
                  color: '#888888',
                  lineHeight: 1.7,
                  marginBottom: 24,
                  maxWidth: 420,
                }}>
                  {problem.body}
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24 }}>
                  <span style={{
                    fontFamily: 'var(--fd)',
                    fontSize: 'clamp(48px, 6vw, 72px)',
                    fontWeight: 500,
                    color: '#E8001D',
                    lineHeight: 1,
                  }}>
                    {problem.stat}
                  </span>
                  <span style={{
                    fontFamily: 'var(--fb)',
                    fontSize: 13,
                    color: '#888888',
                    lineHeight: 1.4,
                    maxWidth: 120,
                  }}>
                    {problem.statLabel}
                  </span>
                </div>
              </Reveal>

              <Reveal delay={0.25}>
                <div style={{
                  display: 'inline-block',
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
                  {problem.badge}
                </div>
              </Reveal>
            </div>

            {/* RIGHT — Visual data card */}
            <div className="tps-panel-card">
              <Reveal delay={0.2} direction="left">
                {problem.cardType === 'revenue' && <RevenueCard data={problem.cardData as { months: string[]; values: number[]; label: string; sublabel: string }} />}
                {problem.cardType === 'engagement' && <EngagementCard data={problem.cardData as { clients: { name: string; weeks: number; status: 'silent' | 'at-risk' | 'ok'; energy: number }[]; label: string }} />}
                {problem.cardType === 'time' && <TimeCard data={problem.cardData as { tasks: { label: string; hours: number; color: string }[]; label: string }} />}
              </Reveal>
            </div>

          </div>
        </div>
      ))}

      {/* Bottom quote — the bridge to solution */}
      <div style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        background: '#0A0A0A',
      }}>
        <div className="tps-panel-quote" style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '96px 40px',
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: 48,
          alignItems: 'center',
        }}>
          <div style={{
            fontFamily: 'var(--fd)',
            fontSize: 'clamp(28px, 3vw, 44px)',
            fontWeight: 500,
            textTransform: 'uppercase',
            lineHeight: 1.1,
            color: '#FFFFFF',
          }}>
            You didn&apos;t become a coach to manage a spreadsheet.
          </div>
          <div>
            <blockquote style={{
              borderLeft: '2px solid #E8001D',
              paddingLeft: 20,
              margin: 0,
            }}>
              <p style={{
                fontFamily: 'var(--fb)',
                fontSize: 17,
                color: '#888',
                lineHeight: 1.7,
                fontStyle: 'italic',
                marginBottom: 12,
              }}>
                &ldquo;I was spending every Sunday sending check-in messages manually to 28 clients. By Monday morning I was already exhausted before the week had started.&rdquo;
              </p>
              <cite style={{
                fontFamily: 'var(--fb)',
                fontSize: 13,
                color: 'rgba(255,255,255,0.5)',
                fontStyle: 'normal',
              }}>
                Fitness Coach, Mumbai
              </cite>
            </blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}
