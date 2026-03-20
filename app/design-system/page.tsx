export default function DesignSystem() {
  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh', padding: '48px 40px', fontFamily: 'var(--font-urbanist, sans-serif)' }}>

      {/* HEADER */}
      <div style={{ marginBottom: '64px' }}>
        <p style={{ fontFamily: 'var(--font-barlow, sans-serif)', fontSize: '11px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#E8001D', marginBottom: '8px' }}>
          Fitosys — Internal Reference
        </p>
        <h1 style={{ fontFamily: 'var(--font-barlow, sans-serif)', fontSize: '48px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.02em', color: '#FFFFFF', lineHeight: 1, marginBottom: '12px' }}>
          Design System
        </h1>
        <p style={{ fontSize: '15px', color: '#888888', maxWidth: '520px', lineHeight: 1.7 }}>
          The authoritative reference for all Fitosys UI. Every colour, font, and component shown here is the approved standard. When in doubt, match this page.
        </p>
      </div>

      {/* COLOURS */}
      <section style={{ marginBottom: '64px' }}>
        <SectionLabel number="01" title="Colour Palette" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '2px', marginTop: '24px' }}>
          <Swatch hex="#E8001D" name="Fitosys Red" usage="CTAs, accents, active states" dark={false} />
          <Swatch hex="#0A0A0A" name="Black Core" usage="Page background" dark={true} />
          <Swatch hex="#111111" name="Surface" usage="Cards, panels" dark={true} />
          <Swatch hex="#161616" name="Surface 2" usage="Featured cards, hovers" dark={true} />
          <Swatch hex="#FFFFFF" name="Pure White" usage="Primary text" dark={false} />
          <Swatch hex="#888888" name="Steel Grey" usage="Secondary text, labels" dark={false} />
          <Swatch hex="#444444" name="Dark Grey" usage="Tertiary text, disabled" dark={false} />
        </div>
        <div style={{ marginTop: '16px', padding: '12px 16px', background: '#111111', borderLeft: '3px solid #E8001D', fontSize: '12px', color: '#888888', lineHeight: 1.7 }}>
          <strong style={{ color: '#E8001D' }}>Border rule:</strong> Use <code style={{ color: '#FFFFFF' }}>rgba(255,255,255,0.06)</code> for structural borders. Use <code style={{ color: '#FFFFFF' }}>rgba(232,0,29,0.2)</code> for red-accented borders. Never swap these.
        </div>
      </section>

      {/* TYPOGRAPHY */}
      <section style={{ marginBottom: '64px' }}>
        <SectionLabel number="02" title="Typography" />

        <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
          <div style={{ background: '#111111', padding: '32px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#E8001D', marginBottom: '16px' }}>Display — Barlow Condensed</p>
            <p style={{ fontFamily: 'var(--font-barlow, sans-serif)', fontSize: '56px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1, color: '#FFFFFF', marginBottom: '8px' }}>The System</p>
            <p style={{ fontFamily: 'var(--font-barlow, sans-serif)', fontSize: '32px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.02em', lineHeight: 1, color: '#FFFFFF', marginBottom: '8px' }}>Section Title</p>
            <p style={{ fontFamily: 'var(--font-barlow, sans-serif)', fontSize: '48px', fontWeight: 500, textTransform: 'uppercase', color: '#E8001D', lineHeight: 1, marginBottom: '16px' }}>₹72,000</p>
            <p style={{ fontSize: '12px', color: '#888888', lineHeight: 1.6 }}>
              Weights: <strong style={{ color: '#FFFFFF' }}>400 and 500 only.</strong> Hard cap at 500.<br />
              Never use 600, 700, 800, or 900.<br />
              Always uppercase. Letter spacing 0.02em.
            </p>
          </div>

          <div style={{ background: '#111111', padding: '32px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#E8001D', marginBottom: '16px' }}>Body — Urbanist</p>
            <p style={{ fontSize: '20px', fontWeight: 400, color: '#FFFFFF', lineHeight: 1.7, marginBottom: '8px' }}>Lead paragraph — 20px weight 400</p>
            <p style={{ fontSize: '17px', fontWeight: 400, color: '#FFFFFF', lineHeight: 1.7, marginBottom: '8px' }}>Standard body copy — 17px weight 400</p>
            <p style={{ fontSize: '15px', fontWeight: 400, color: '#888888', lineHeight: 1.7, marginBottom: '8px' }}>Card description — 15px weight 400</p>
            <p style={{ fontSize: '13px', fontWeight: 500, color: '#888888', lineHeight: 1.4, marginBottom: '16px' }}>Label / nav / tag — 13px weight 500</p>
            <p style={{ fontSize: '12px', color: '#888888', lineHeight: 1.6 }}>
              Body weights: <strong style={{ color: '#FFFFFF' }}>300, 400, 500.</strong><br />
              CTA buttons only: <strong style={{ color: '#FFFFFF' }}>700.</strong><br />
              Never use 800 or 900.
            </p>
          </div>
        </div>

        {/* The one rule */}
        <div style={{ marginTop: '2px', background: '#111111', padding: '24px 32px', borderTop: '3px solid #E8001D' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#E8001D', marginBottom: '12px' }}>The One Rule — Stat Numbers</p>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '48px' }}>
            <div>
              <p style={{ fontFamily: 'var(--font-barlow, sans-serif)', fontSize: '48px', fontWeight: 500, color: '#E8001D', lineHeight: 1 }}>2–3hrs</p>
              <p style={{ fontSize: '13px', fontWeight: 400, color: '#888888', marginTop: '4px' }}>saved per week per coach</p>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-barlow, sans-serif)', fontSize: '48px', fontWeight: 500, color: '#E8001D', lineHeight: 1 }}>₹72K+</p>
              <p style={{ fontSize: '13px', fontWeight: 400, color: '#888888', marginTop: '4px' }}>annual revenue recovered</p>
            </div>
            <div>
              <p style={{ fontFamily: 'var(--font-barlow, sans-serif)', fontSize: '48px', fontWeight: 500, color: '#E8001D', lineHeight: 1 }}>30min</p>
              <p style={{ fontSize: '13px', fontWeight: 400, color: '#888888', marginTop: '4px' }}>setup time</p>
            </div>
          </div>
          <p style={{ fontSize: '12px', color: '#888888', marginTop: '16px' }}>
            Number = Barlow Condensed 500 red. Label = Urbanist 400 13px #888888. Always stacked. Never beside each other. Never same font or same colour.
          </p>
        </div>
      </section>

      {/* BUTTONS */}
      <section style={{ marginBottom: '64px' }}>
        <SectionLabel number="03" title="Buttons" />
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', marginTop: '24px' }}>
          <button style={{ background: '#E8001D', color: '#FFFFFF', border: '2px solid #E8001D', borderRadius: '2px', padding: '14px 32px', fontFamily: 'var(--font-urbanist, sans-serif)', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', cursor: 'pointer' }}>
            Start Free
          </button>
          <button style={{ background: 'transparent', color: '#FFFFFF', border: '2px solid rgba(255,255,255,0.12)', borderRadius: '2px', padding: '14px 32px', fontFamily: 'var(--font-urbanist, sans-serif)', fontSize: '13px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.04em', cursor: 'pointer' }}>
            View Demo
          </button>
          <button style={{ background: 'transparent', color: '#E8001D', border: 'none', padding: '14px 0', fontFamily: 'var(--font-urbanist, sans-serif)', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', cursor: 'pointer' }}>
            Learn More →
          </button>
        </div>
        <div style={{ marginTop: '16px', fontSize: '12px', color: '#888888', lineHeight: 1.7 }}>
          Primary: red bg, white text, weight 700. Secondary: transparent bg, white border, weight 500. Text link: no border, red text, weight 700.
        </div>
      </section>

      {/* CARDS */}
      <section style={{ marginBottom: '64px' }}>
        <SectionLabel number="04" title="Cards" />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2px', marginTop: '24px' }}>

          {/* Feature card */}
          <div style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.06)', padding: '40px 32px' }}>
            <p style={{ fontFamily: 'var(--font-barlow, sans-serif)', fontSize: '64px', fontWeight: 500, color: 'rgba(232,0,29,0.07)', lineHeight: 1, marginBottom: '16px' }}>01</p>
            <h3 style={{ fontFamily: 'var(--font-barlow, sans-serif)', fontSize: '32px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.02em', color: '#FFFFFF', marginBottom: '12px', lineHeight: 1.1 }}>Feature Title</h3>
            <p style={{ fontSize: '15px', color: '#888888', lineHeight: 1.7 }}>Feature description text sits here at 15px Urbanist 400 in grey #888888.</p>
          </div>

          {/* Dashboard card */}
          <div style={{ background: '#141414', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 15px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#FFFFFF' }}>Card Header</span>
              <button style={{ fontSize: '11px', fontWeight: 600, color: '#E8001D', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Action</button>
            </div>
            <div style={{ padding: '16px 15px', fontSize: '13px', color: '#888888' }}>
              Dashboard card body content at 13px Urbanist.
            </div>
          </div>

          {/* Red program card */}
          <div style={{ background: '#E8001D', borderRadius: '10px', padding: '20px', position: 'relative', overflow: 'hidden' }}>
            <p style={{ fontFamily: 'var(--font-barlow, sans-serif)', fontSize: '20px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.02em', color: '#fff', lineHeight: 1, marginBottom: '4px' }}>Program Card</p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', marginBottom: '16px' }}>Red background variant — used for active program</p>
            <div style={{ height: '5px', background: 'rgba(0,0,0,0.22)', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ width: '73%', height: '100%', background: '#fff', borderRadius: '99px' }} />
            </div>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginTop: '6px' }}>73% complete</p>
          </div>
        </div>
      </section>

      {/* BORDERS */}
      <section style={{ marginBottom: '64px' }}>
        <SectionLabel number="05" title="Borders & Dividers" />
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '8px' }} />
            <p style={{ fontSize: '12px', color: '#888888' }}>Structural border — <code style={{ color: '#FFFFFF' }}>rgba(255,255,255,0.06)</code> — use for card borders, dividers, layout separators</p>
          </div>
          <div>
            <div style={{ height: '1px', background: 'rgba(232,0,29,0.2)', marginBottom: '8px' }} />
            <p style={{ fontSize: '12px', color: '#888888' }}>Red accent border — <code style={{ color: '#FFFFFF' }}>rgba(232,0,29,0.2)</code> — use for highlighted sections, active states</p>
          </div>
          <div>
            <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, #E8001D, transparent)', marginBottom: '8px' }} />
            <p style={{ fontSize: '12px', color: '#888888' }}>Red gradient divider — section separators on marketing pages</p>
          </div>
          <div style={{ borderLeft: '3px solid #E8001D', padding: '12px 16px', background: 'rgba(232,0,29,0.08)' }}>
            <p style={{ fontSize: '12px', color: '#888888' }}>Rule box — <code style={{ color: '#FFFFFF' }}>border-left: 3px solid #E8001D</code> — use for important callouts and warnings</p>
          </div>
        </div>
      </section>

      {/* EYEBROW */}
      <section style={{ marginBottom: '64px' }}>
        <SectionLabel number="06" title="Eyebrow Labels" />
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '1px', background: '#E8001D', flexShrink: 0 }} />
            <span style={{ fontSize: '13px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#E8001D' }}>Section Label</span>
          </div>
          <p style={{ fontSize: '12px', color: '#888888' }}>
            Every section on marketing pages starts with this eyebrow pattern. Red line left, red uppercase label. Always 13px Urbanist 500.
          </p>
        </div>
      </section>

      {/* VOICE */}
      <section style={{ marginBottom: '64px' }}>
        <SectionLabel number="07" title="Voice & Copy Rules" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', marginTop: '24px' }}>
          <div style={{ background: '#111111', padding: '24px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#10B981', marginBottom: '16px' }}>Use these words</p>
            <p style={{ fontSize: '13px', color: '#888888', lineHeight: 2 }}>
              coaches · clients · system · automated · weekly · renewal · check-in · onboarding · WhatsApp · revenue · time · consistent · reliable · built for · works on · handles · catches · surfaces · sends · tracks
            </p>
          </div>
          <div style={{ background: '#111111', padding: '24px' }}>
            <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#E8001D', marginBottom: '16px' }}>Never use these words</p>
            <p style={{ fontSize: '13px', color: '#888888', lineHeight: 2 }}>
              transform · journey · ecosystem · supercharge · powerful · seamless · revolutionary · game-changing · crush · hustle · grind · tribe · community
            </p>
          </div>
        </div>
      </section>

      {/* TAGLINE */}
      <section style={{ textAlign: 'center', padding: '80px 0', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <p style={{ fontFamily: 'var(--font-barlow, sans-serif)', fontSize: '64px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.02em', color: '#FFFFFF', lineHeight: 1, marginBottom: '16px' }}>
          The system behind
        </p>
        <p style={{ fontFamily: 'var(--font-barlow, sans-serif)', fontSize: '64px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.02em', color: '#E8001D', lineHeight: 1 }}>
          the result.
        </p>
      </section>

    </div>
  )
}

function SectionLabel({ number, title }: { number: string; title: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '4px' }}>
      <span style={{ fontFamily: 'var(--font-urbanist, sans-serif)', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#E8001D' }}>
        {number} — {title}
      </span>
      <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, rgba(232,0,29,0.3), transparent)' }} />
    </div>
  )
}

function Swatch({ hex, name, usage, dark }: { hex: string; name: string; usage: string; dark: boolean }) {
  return (
    <div style={{ background: hex, padding: '32px 20px 20px', border: hex === '#FFFFFF' ? '1px solid rgba(0,0,0,0.1)' : 'none' }}>
      <p style={{ fontFamily: 'var(--font-barlow, sans-serif)', fontSize: '14px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.02em', color: dark ? '#FFFFFF' : '#111111', marginBottom: '4px' }}>{name}</p>
      <p style={{ fontSize: '11px', color: dark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)', marginBottom: '4px' }}>{hex}</p>
      <p style={{ fontSize: '11px', color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>{usage}</p>
    </div>
  )
}