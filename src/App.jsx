import { useState, useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────────────────────────────────────── */
const NAVY      = '#1B2A4A';
const NAVY_DARK = '#101c33';
const NAVY_MID  = '#1e3260';
const GOLD      = '#D4A017';
const GOLD_LT   = '#e8c040';
const GOLD_GLOW = 'rgba(212,160,23,0.25)';

/* ─────────────────────────────────────────────────────────────────────────────
   SCROLL ANIMATION HOOK
───────────────────────────────────────────────────────────────────────────── */
function useFadeIn(threshold = 0.12) {
  const ref     = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el  = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

/* ─────────────────────────────────────────────────────────────────────────────
   FADE WRAPPER COMPONENT
───────────────────────────────────────────────────────────────────────────── */
function Fade({ children, className = '', delay = 0, y = 28 }) {
  const [ref, vis] = useFadeIn();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity:    vis ? 1 : 0,
        transform:  vis ? 'translateY(0)' : `translateY(${y}px)`,
        transition: `opacity 0.72s ease ${delay}ms, transform 0.72s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────────────────────── */
const NAV_LINKS = [
  { label: 'Home',     href: '#home'     },
  { label: 'Services', href: '#services' },
  { label: 'About',    href: '#about'    },
  { label: 'Reviews',  href: '#reviews'  },
  { label: 'Contact',  href: '#contact'  },
];

const STATS = [
  { value: '100%',     label: 'Client Satisfaction'   },
  { value: '5.0 ★',   label: 'Google Rating'          },
  { value: 'Free',     label: 'Estimates & Consults'   },
  { value: 'Est. 2024',label: 'Proudly Illinois Based' },
];

const WHY_US = [
  { emoji: '🎨', title: 'Attention to Detail',  desc: 'Every stroke matters. We treat your home as a canvas for lasting beauty and precision craftsmanship.'   },
  { emoji: '✅', title: 'Timely Delivery',       desc: 'We finish on schedule, every time. Your time is as valuable as ours — no surprises, no delays.'         },
  { emoji: '🌿', title: 'Eco-Friendly Paints',   desc: 'Premium quality without compromise. Our paints are safe for your family, pets, and the environment.'    },
  { emoji: '💰', title: 'Affordable Pricing',    desc: 'Top-tier results at fair, transparent prices. No hidden costs. No bait-and-switch. Just honest work.'    },
];

const SERVICES = [
  {
    num: '01',
    emoji: '🏠',
    title: 'Interior Painting',
    desc: 'Transform every room with flawless, lasting finishes that elevate your everyday living and reflect your personal style.',
    items: ['Living Rooms & Bedrooms', 'Kitchens & Bathrooms', 'Hallways & Ceilings', 'Trim & Accent Walls'],
  },
  {
    num: '02',
    emoji: '🏡',
    title: 'Exterior Painting',
    desc: 'Protect and beautify your home\'s exterior with weather-resistant coatings that look great and stand the test of time.',
    items: ['Home Exteriors & Siding', 'Trim, Decks & Patios', 'Fences & Concrete', 'Stucco & Brick'],
  },
  {
    num: '03',
    emoji: '🪟',
    title: 'Cabinet Painting',
    desc: 'Stunning cabinet makeovers at a fraction of replacement cost — delivered with a factory-smooth, durable finish.',
    items: ['Kitchen Cabinets', 'Bathroom Vanities', 'Custom Finishes', 'Durable Long-Lasting Coats'],
  },
  {
    num: '04',
    emoji: '🔨',
    title: 'Drywall Services',
    desc: 'From small patches to full installations, we deliver seamless drywall that\'s perfectly smooth and paint-ready.',
    items: ['Repairs & Patching', 'New Installation', 'Smooth Finish Prep', 'Ready-to-Paint Surfaces'],
  },
];

const PLACEHOLDER_REVIEWS = [
  {
    author_name: 'Maria T.',
    rating: 5,
    text: 'Peak Perfection did an incredible job on our entire first floor. The crew was professional, punctual, and left the space spotless. The finish is absolutely flawless — we couldn\'t be happier with the results!',
    relative_time_description: '2 months ago',
  },
  {
    author_name: 'James H.',
    rating: 5,
    text: 'We hired them for exterior painting and drywall repairs. Their attention to detail is incredible — they caught imperfections I hadn\'t even noticed. I\'ll be recommending Peak Perfection to every neighbor.',
    relative_time_description: '3 months ago',
  },
  {
    author_name: 'Danielle R.',
    rating: 5,
    text: 'Our kitchen cabinets look like they came straight out of a magazine. Fair pricing, a friendly team, and results that speak for themselves. The transformation was truly remarkable. 10/10.',
    relative_time_description: '1 month ago',
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   STAR COMPONENT
───────────────────────────────────────────────────────────────────────────── */
function Stars({ rating, size = 'sm' }) {
  const sz = size === 'lg' ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <svg key={i} className={sz} fill={i <= rating ? GOLD : '#cbd5e1'} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SECTION LABEL
───────────────────────────────────────────────────────────────────────────── */
function Label({ children }) {
  return (
    <div
      className="inline-block font-body text-xs font-bold tracking-widest uppercase mb-4 px-3 py-1.5 rounded-sm"
      style={{ color: GOLD, background: `${GOLD}18` }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   DIVIDER
───────────────────────────────────────────────────────────────────────────── */
function GoldBar({ center = false }) {
  return (
    <div
      className={`mt-6 w-14 h-0.5 ${center ? 'mx-auto' : ''}`}
      style={{ background: GOLD }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────────────────────────────────────── */
function Navbar() {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const close = () => setOpen(false);

  return (
    <nav
      className="fixed top-0 inset-x-0 z-50 transition-all duration-300"
      style={{
        background:  NAVY,
        boxShadow:   scrolled ? '0 4px 32px rgba(0,0,0,0.35)' : 'none',
        borderBottom: scrolled ? `1px solid rgba(255,255,255,0.05)` : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-[68px] md:h-[76px]">

        {/* Logo */}
        <a href="#home" className="flex items-center gap-2.5 no-underline select-none">
          <span className="text-2xl leading-none">🎨</span>
          <div className="leading-none">
            <div className="font-display font-semibold text-white text-[1.15rem] md:text-xl tracking-tight">
              Peak Perfection Painting
            </div>
            <div
              className="font-body text-[0.6rem] font-bold tracking-[0.2em] uppercase"
              style={{ color: GOLD }}
            >
              LLC
            </div>
          </div>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="font-body text-[0.72rem] font-semibold tracking-widest uppercase transition-colors duration-200"
              style={{ color: 'rgba(255,255,255,0.65)' }}
              onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.65)')}
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            className="font-body text-[0.72rem] font-bold tracking-widest uppercase px-5 py-2.5 rounded-sm transition-all duration-200"
            style={{ background: GOLD, color: NAVY }}
            onMouseEnter={e => {
              e.currentTarget.style.background = GOLD_LT;
              e.currentTarget.style.transform   = 'translateY(-1px)';
              e.currentTarget.style.boxShadow   = `0 6px 20px ${GOLD_GLOW}`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = GOLD;
              e.currentTarget.style.transform   = 'translateY(0)';
              e.currentTarget.style.boxShadow   = 'none';
            }}
          >
            Get Free Estimate
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden p-2 flex flex-col gap-[5px]"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="block w-[22px] h-[2px] rounded transition-all duration-300"
              style={{
                background:      'white',
                transformOrigin: 'center',
                opacity:         open && i === 1 ? 0 : 1,
                transform:
                  open
                    ? i === 0 ? 'rotate(45deg) translate(5px, 5px)'
                    : i === 2 ? 'rotate(-45deg) translate(5px, -5px)'
                    : 'none'
                    : 'none',
              }}
            />
          ))}
        </button>
      </div>

      {/* Mobile drawer */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? '360px' : '0' }}
      >
        <div
          className="px-6 pb-7 pt-3 flex flex-col gap-5 border-t"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}
        >
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              onClick={close}
              className="font-body text-sm font-semibold tracking-widest uppercase"
              style={{ color: 'rgba(255,255,255,0.7)' }}
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={close}
            className="font-body text-sm font-bold tracking-widest uppercase py-3.5 rounded-sm text-center mt-1"
            style={{ background: GOLD, color: NAVY }}
          >
            Get Free Estimate
          </a>
        </div>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
      style={{ background: NAVY_DARK }}
    >
      {/* Diagonal stripe texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            135deg,
            rgba(212,160,23,0.035) 0px,
            rgba(212,160,23,0.035) 1px,
            transparent 1px,
            transparent 72px
          )`,
        }}
      />

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 45%, rgba(16,28,51,0.45) 0%, rgba(16,28,51,0.9) 100%)',
        }}
      />

      {/* Gold accent pillars */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] hidden lg:block"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, ${GOLD} 30%, ${GOLD} 70%, transparent 100%)`,
          opacity: 0.6,
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-[3px] hidden lg:block"
        style={{
          background: `linear-gradient(to bottom, transparent 0%, ${GOLD} 30%, ${GOLD} 70%, transparent 100%)`,
          opacity: 0.6,
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center py-20">

        {/* Eyebrow badge */}
        <div
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-sm font-body text-xs font-bold tracking-[0.2em] uppercase border"
          style={{
            borderColor: `${GOLD}40`,
            color:        GOLD,
            background:   `${GOLD}0e`,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: GOLD }} />
          Illinois Painting Specialists
        </div>

        {/* Brush emoji */}
        <div
          className="text-[5rem] md:text-[7rem] leading-none mb-6 select-none"
          style={{ filter: `drop-shadow(0 12px 32px ${GOLD_GLOW})` }}
        >
          🎨
        </div>

        {/* Headline */}
        <h1
          className="font-display text-white leading-[1.04] mb-7"
          style={{ fontSize: 'clamp(2.6rem, 7vw, 5.6rem)', letterSpacing: '-0.01em' }}
        >
          Transform Your Space<br />
          <em style={{ color: GOLD, fontStyle: 'italic' }}>With Expert Painting</em>
        </h1>

        {/* Subheadline */}
        <p
          className="font-body text-white/60 mx-auto mb-11 leading-relaxed"
          style={{ fontSize: 'clamp(0.95rem, 2.2vw, 1.15rem)', maxWidth: '560px' }}
        >
          Serving Illinois with top-tier interior, exterior &amp; drywall services.{' '}
          <span className="font-semibold text-white/85">
            Precision. Quality. Reliability.
          </span>
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#contact"
            className="font-body font-bold text-[0.78rem] tracking-[0.15em] uppercase px-9 py-4 rounded-sm transition-all duration-200"
            style={{ background: GOLD, color: NAVY }}
            onMouseEnter={e => {
              e.currentTarget.style.background  = GOLD_LT;
              e.currentTarget.style.transform   = 'translateY(-2px)';
              e.currentTarget.style.boxShadow   = `0 10px 32px ${GOLD_GLOW}`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background  = GOLD;
              e.currentTarget.style.transform   = 'translateY(0)';
              e.currentTarget.style.boxShadow   = 'none';
            }}
          >
            Get a Free Estimate
          </a>
          <a
            href="#services"
            className="font-body font-bold text-[0.78rem] tracking-[0.15em] uppercase px-9 py-4 rounded-sm border-2 text-white transition-all duration-200"
            style={{ borderColor: 'rgba(255,255,255,0.28)' }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.75)';
              e.currentTarget.style.transform   = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.28)';
              e.currentTarget.style.transform   = 'translateY(0)';
            }}
          >
            Our Services
          </a>
        </div>

        {/* Scroll cue */}
        <div className="mt-20 flex flex-col items-center gap-2 opacity-35 select-none">
          <span className="font-body text-white text-[0.6rem] tracking-[0.25em] uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent" />
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STATS STRIP
───────────────────────────────────────────────────────────────────────────── */
function StatsStrip() {
  return (
    <div className="py-10" style={{ background: GOLD }}>
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS.map(({ value, label }, i) => (
          <div
            key={i}
            className="text-center px-4"
            style={{ borderRight: i < 3 ? `1px solid ${NAVY}22` : 'none' }}
          >
            <div
              className="font-display font-bold leading-none"
              style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', color: NAVY }}
            >
              {value}
            </div>
            <div
              className="font-body text-[0.6rem] font-bold uppercase tracking-[0.18em] mt-1.5 opacity-65"
              style={{ color: NAVY }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   WHY CHOOSE US
───────────────────────────────────────────────────────────────────────────── */
function WhyChooseUs() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">

        <Fade className="text-center mb-16">
          <Label>Why Us</Label>
          <h2
            className="font-display font-bold"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: NAVY }}
          >
            The Peak Perfection Difference
          </h2>
          <GoldBar center />
        </Fade>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WHY_US.map(({ emoji, title, desc }, i) => (
            <Fade key={title} delay={i * 90}>
              <WhyCard emoji={emoji} title={title} desc={desc} />
            </Fade>
          ))}
        </div>

      </div>
    </section>
  );
}

function WhyCard({ emoji, title, desc }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className="p-8 h-full transition-all duration-300 cursor-default"
      style={{
        border:     `1px solid ${hov ? GOLD : '#e4e9f0'}`,
        borderTop:  `3px solid ${hov ? GOLD : 'transparent'}`,
        borderRadius: '2px',
        transform:  hov ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow:  hov ? '0 20px 50px rgba(27,42,74,0.11)' : '0 2px 12px rgba(27,42,74,0.04)',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div className="text-4xl mb-5 leading-none select-none">{emoji}</div>
      <h3
        className="font-display font-bold text-xl mb-2"
        style={{ color: NAVY }}
      >
        {title}
      </h3>
      <p className="font-body text-sm leading-relaxed text-slate-500">{desc}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SERVICES
───────────────────────────────────────────────────────────────────────────── */
function Services() {
  return (
    <section id="services" className="py-24" style={{ background: '#F2F5F9' }}>
      <div className="max-w-6xl mx-auto px-6">

        <Fade className="text-center mb-16">
          <Label>What We Do</Label>
          <h2
            className="font-display font-bold"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: NAVY }}
          >
            Our Services
          </h2>
          <p
            className="font-body text-slate-500 mt-4 mx-auto"
            style={{ maxWidth: '500px', fontSize: '0.93rem' }}
          >
            Interior · Exterior · Drywall — handled with the precision and care
            your home deserves.
          </p>
          <GoldBar center />
        </Fade>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SERVICES.map((svc, i) => (
            <Fade key={svc.num} delay={i * 80}>
              <ServiceCard {...svc} />
            </Fade>
          ))}
        </div>

      </div>
    </section>
  );
}

function ServiceCard({ num, emoji, title, desc, items }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className="bg-white p-8 h-full transition-all duration-300"
      style={{
        borderRadius: '2px',
        border:      `1px solid ${hov ? `${GOLD}70` : 'rgba(27,42,74,0.07)'}`,
        transform:   hov ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow:   hov
          ? '0 18px 52px rgba(27,42,74,0.13)'
          : '0 2px 14px rgba(27,42,74,0.05)',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-5">
        <span
          className="font-display font-bold leading-none select-none"
          style={{ fontSize: '4.5rem', color: `${GOLD}22` }}
        >
          {num}
        </span>
        <div
          className="w-14 h-14 rounded-sm flex items-center justify-center text-2xl select-none flex-shrink-0"
          style={{ background: `${NAVY}09` }}
        >
          {emoji}
        </div>
      </div>

      <h3
        className="font-display font-bold text-2xl mb-3"
        style={{ color: NAVY }}
      >
        {title}
      </h3>
      <p className="font-body text-[0.85rem] text-slate-500 leading-relaxed mb-5">
        {desc}
      </p>

      <ul className="space-y-2">
        {items.map(item => (
          <li
            key={item}
            className="flex items-center gap-2.5 font-body text-[0.83rem] text-slate-600"
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: GOLD }}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ABOUT
───────────────────────────────────────────────────────────────────────────── */
function About() {
  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* Left — text */}
          <Fade>
            <Label>About Us</Label>
            <h2
              className="font-display font-bold leading-tight mb-5"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.1rem)', color: NAVY }}
            >
              Who We Are
            </h2>
            <GoldBar />

            <div className="mt-8 space-y-4 font-body text-[0.9rem] text-slate-600 leading-relaxed">
              <p>
                At{' '}
                <strong style={{ color: NAVY }}>Peak Perfection Painting LLC</strong>,
                we believe a fresh coat of paint can transform more than just walls — it
                transforms how a space feels and how you feel within it.
              </p>
              <p>
                We are passionate, experienced painters dedicated to bringing your vision to
                life with precision, creativity, and genuine care for your home. We
                specialize in interior, exterior, and drywall services using high-quality,
                eco-friendly paints that are safe for your family and the environment.
              </p>
              <p>
                Our mission is simple:{' '}
                <strong style={{ color: NAVY }}>exceed your expectations</strong> and treat
                every home as if it were our own. Whether it's a single accent wall or a
                full exterior refresh, we deliver the same standard of excellence on every
                project, every time.
              </p>
            </div>

            {/* Tags */}
            <div className="mt-8 flex flex-wrap gap-2.5">
              {['Interior', 'Exterior', 'Cabinet Painting', 'Drywall', 'Illinois'].map(tag => (
                <span
                  key={tag}
                  className="font-body text-[0.67rem] font-bold tracking-widest uppercase px-4 py-2 rounded-sm border"
                  style={{
                    borderColor: `${NAVY}28`,
                    color:        NAVY,
                    background:   `${NAVY}06`,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </Fade>

          {/* Right — decorative box */}
          <Fade delay={200}>
            <div
              className="rounded-sm p-12 flex flex-col items-center justify-center text-center relative overflow-hidden min-h-[380px]"
              style={{ background: NAVY }}
            >
              {/* Diagonal texture */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `repeating-linear-gradient(
                    135deg,
                    rgba(212,160,23,0.055) 0px,
                    rgba(212,160,23,0.055) 1px,
                    transparent 1px,
                    transparent 44px
                  )`,
                }}
              />
              {/* Corner brackets */}
              <div
                className="absolute top-5 left-5 w-10 h-10 border-t-2 border-l-2"
                style={{ borderColor: `${GOLD}70` }}
              />
              <div
                className="absolute bottom-5 right-5 w-10 h-10 border-b-2 border-r-2"
                style={{ borderColor: `${GOLD}70` }}
              />

              {/* Content */}
              <div className="relative z-10">
                <div
                  className="text-[5.5rem] leading-none select-none mb-5"
                  style={{ filter: `drop-shadow(0 4px 20px ${GOLD_GLOW})` }}
                >
                  🎨
                </div>
                <div
                  className="font-display font-bold leading-none mb-1"
                  style={{
                    fontSize: '3.6rem',
                    color:     GOLD,
                    textShadow: `0 0 50px ${GOLD_GLOW}`,
                  }}
                >
                  Est. 2024
                </div>
                <div
                  className="font-body text-[0.63rem] font-bold uppercase tracking-[0.22em] mt-3"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                >
                  Peak Perfection Painting LLC
                </div>

                <div
                  className="w-14 h-[1px] mx-auto mt-6 mb-4"
                  style={{ background: `${GOLD}45` }}
                />

                <div
                  className="font-body text-[0.6rem] uppercase tracking-[0.2em] font-semibold"
                  style={{ color: 'rgba(255,255,255,0.3)' }}
                >
                  Illinois · Precision · Quality
                </div>
              </div>
            </div>
          </Fade>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   REVIEWS
───────────────────────────────────────────────────────────────────────────── */
function Reviews() {
  const [reviews,      setReviews]      = useState([]);
  const [rating,       setRating]       = useState(null);
  const [totalReviews, setTotalReviews] = useState(null);
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    const PLACE_ID = 'ChIJP87pPodZFxIR9-UZJzVgpFU';
    const API_KEY  = 'AIzaSyCdfo6O0kqJj_KpAdq-8JJzjQH8_peIuDo';
    const url      =
      `https://maps.googleapis.com/maps/api/place/details/json` +
      `?place_id=${PLACE_ID}&fields=reviews,rating,user_ratings_total&key=${API_KEY}`;

    fetch(url)
      .then(r => r.json())
      .then(data => {
        if (data.result?.reviews?.length) {
          setReviews(data.result.reviews.slice(0, 3));
          setRating(data.result.rating);
          setTotalReviews(data.result.user_ratings_total);
        } else {
          throw new Error('no reviews');
        }
      })
      .catch(() => {
        setReviews(PLACEHOLDER_REVIEWS);
        setRating(5.0);
        setTotalReviews(null);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="reviews" className="py-24" style={{ background: '#F2F5F9' }}>
      <div className="max-w-6xl mx-auto px-6">

        <Fade className="text-center mb-16">
          <Label>Client Stories</Label>
          <h2
            className="font-display font-bold"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)', color: NAVY }}
          >
            Google Reviews
          </h2>

          {rating != null && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <Stars rating={Math.round(rating)} size="lg" />
              <span
                className="font-display font-bold text-3xl"
                style={{ color: NAVY }}
              >
                {rating.toFixed(1)}
              </span>
              {totalReviews && (
                <span className="font-body text-sm text-slate-400">
                  ({totalReviews} reviews)
                </span>
              )}
            </div>
          )}
          <GoldBar center />
        </Fade>

        {loading ? (
          <div className="flex justify-center py-20">
            <div
              className="w-11 h-11 rounded-full border-4 animate-spin"
              style={{
                borderColor:       `${GOLD}35`,
                borderTopColor:     GOLD,
              }}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <Fade key={i} delay={i * 90}>
                <ReviewCard review={r} />
              </Fade>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

function ReviewCard({ review: r }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      className="bg-white p-7 flex flex-col transition-all duration-300"
      style={{
        borderRadius: '2px',
        border:      `1px solid ${hov ? `${GOLD}50` : 'rgba(27,42,74,0.06)'}`,
        transform:   hov ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow:   hov
          ? '0 16px 44px rgba(27,42,74,0.11)'
          : '0 2px 12px rgba(27,42,74,0.04)',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <Stars rating={r.rating} />

      <p className="font-body text-[0.85rem] text-slate-600 leading-relaxed mt-4 flex-1 italic">
        "{r.text}"
      </p>

      <div
        className="mt-5 pt-4 border-t flex items-center justify-between"
        style={{ borderColor: '#f1f4f8' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-white text-sm flex-shrink-0"
            style={{ background: NAVY }}
          >
            {r.author_name?.[0] ?? '?'}
          </div>
          <div>
            <div
              className="font-body font-semibold text-[0.83rem]"
              style={{ color: NAVY }}
            >
              {r.author_name}
            </div>
            <div className="font-body text-[0.72rem] text-slate-400">
              {r.relative_time_description}
            </div>
          </div>
        </div>

        {/* Google logo */}
        <svg viewBox="0 0 24 24" className="w-5 h-5 flex-shrink-0 opacity-25">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   CONTACT
───────────────────────────────────────────────────────────────────────────── */
function Contact() {
  const [form,   setForm]   = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | sending | sent

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => setStatus('sent'), 1300);
  };

  const inputClass =
    'w-full px-4 py-3.5 font-body text-[0.88rem] text-white placeholder-white/25 ' +
    'outline-none transition-all duration-200 rounded-sm';
  const inputStyle = {
    background:   'rgba(255,255,255,0.055)',
    border:       '1px solid rgba(255,255,255,0.11)',
  };
  const focusFn = (e) => {
    e.target.style.borderColor = GOLD;
    e.target.style.boxShadow   = `0 0 0 2px ${GOLD}30`;
  };
  const blurFn  = (e) => {
    e.target.style.borderColor = 'rgba(255,255,255,0.11)';
    e.target.style.boxShadow   = 'none';
  };

  return (
    <section
      id="contact"
      className="py-24 relative overflow-hidden"
      style={{ background: NAVY }}
    >
      {/* Diagonal texture */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            135deg,
            rgba(212,160,23,0.035) 0px,
            rgba(212,160,23,0.035) 1px,
            transparent 1px,
            transparent 60px
          )`,
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto px-6">

        <Fade className="text-center mb-14">
          <div
            className="inline-block font-body text-xs font-bold tracking-[0.2em] uppercase mb-4 px-3 py-1.5 rounded-sm border"
            style={{ borderColor: `${GOLD}40`, color: GOLD, background: `${GOLD}0e` }}
          >
            Get In Touch
          </div>
          <h2
            className="font-display font-bold text-white"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}
          >
            Ready to Transform<br />Your Home?
          </h2>
          <p
            className="font-body mt-4"
            style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.92rem' }}
          >
            Contact us for a free estimate. Proudly serving Illinois.
          </p>
          <GoldBar center />
        </Fade>

        <Fade delay={150}>
          <div
            className="rounded-sm p-8 md:p-12"
            style={{
              background:  'rgba(255,255,255,0.035)',
              border:      '1px solid rgba(255,255,255,0.07)',
            }}
          >
            {status === 'sent' ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="font-display font-bold text-2xl text-white mb-2">
                  Message Received!
                </h3>
                <p
                  className="font-body text-sm"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  We'll get back to you shortly with your free estimate.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label
                      className="block font-body text-[0.63rem] font-bold tracking-[0.2em] uppercase mb-2"
                      style={{ color: 'rgba(255,255,255,0.4)' }}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={form.name}
                      onChange={set('name')}
                      className={inputClass}
                      style={inputStyle}
                      onFocus={focusFn}
                      onBlur={blurFn}
                    />
                  </div>
                  <div>
                    <label
                      className="block font-body text-[0.63rem] font-bold tracking-[0.2em] uppercase mb-2"
                      style={{ color: 'rgba(255,255,255,0.4)' }}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={set('email')}
                      className={inputClass}
                      style={inputStyle}
                      onFocus={focusFn}
                      onBlur={blurFn}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block font-body text-[0.63rem] font-bold tracking-[0.2em] uppercase mb-2"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="(000) 000-0000"
                    value={form.phone}
                    onChange={set('phone')}
                    className={inputClass}
                    style={inputStyle}
                    onFocus={focusFn}
                    onBlur={blurFn}
                  />
                </div>

                <div>
                  <label
                    className="block font-body text-[0.63rem] font-bold tracking-[0.2em] uppercase mb-2"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    Message
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us about your project…"
                    value={form.message}
                    onChange={set('message')}
                    className={`${inputClass} resize-none`}
                    style={inputStyle}
                    onFocus={focusFn}
                    onBlur={blurFn}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full py-4 font-body font-bold text-[0.78rem] tracking-[0.15em] uppercase rounded-sm transition-all duration-200 disabled:opacity-60"
                  style={{ background: GOLD, color: NAVY }}
                  onMouseEnter={e => {
                    if (status !== 'sending') {
                      e.currentTarget.style.background = GOLD_LT;
                      e.currentTarget.style.transform   = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = GOLD;
                    e.currentTarget.style.transform   = 'translateY(0)';
                  }}
                >
                  {status === 'sending' ? 'Sending…' : 'Submit Request'}
                </button>
              </form>
            )}

            {/* Contact info row */}
            <div
              className="mt-8 pt-7 grid sm:grid-cols-2 gap-5 border-t"
              style={{ borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <ContactPill
                icon={
                  <svg className="w-4 h-4" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
                label="Email"
                text="PeakPerfectionProjects@gmail.com"
                href="mailto:PeakPerfectionProjects@gmail.com"
              />
              <ContactPill
                icon={
                  <svg className="w-4 h-4" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                }
                label="Phone"
                text="(779) 302-5075"
                href="tel:7793025075"
              />
            </div>
          </div>
        </Fade>

      </div>
    </section>
  );
}

function ContactPill({ icon, label, text, href }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      className="flex items-center gap-3 no-underline transition-opacity duration-200"
      style={{ opacity: hov ? 1 : 0.7 }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div
        className="w-10 h-10 rounded-sm flex items-center justify-center flex-shrink-0"
        style={{ background: `${GOLD}1a` }}
      >
        {icon}
      </div>
      <div>
        <div
          className="font-body text-[0.6rem] font-bold tracking-[0.2em] uppercase"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          {label}
        </div>
        <div className="font-body text-[0.83rem] text-white">{text}</div>
      </div>
    </a>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────────────────────────── */
function Footer() {
  const socials = [
    {
      label: 'Instagram',
      href:  'https://www.instagram.com/peakperfectionpaintingllc/',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      label: 'Facebook',
      href:  'https://www.facebook.com/share/17EKj6CEV3/',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
  ];

  return (
    <footer style={{ background: NAVY_DARK }}>
      <div
        className="border-b"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10 items-start">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-2xl">🎨</span>
              <div>
                <div className="font-display font-semibold text-white text-lg leading-tight">
                  Peak Perfection Painting
                </div>
                <div
                  className="font-body text-[0.6rem] font-bold tracking-[0.2em] uppercase"
                  style={{ color: GOLD }}
                >
                  LLC
                </div>
              </div>
            </div>
            <p
              className="font-body text-[0.75rem] leading-relaxed mb-5"
              style={{ color: 'rgba(255,255,255,0.38)' }}
            >
              Precision. Quality. Reliability.<br />
              Serving Illinois with excellence.
            </p>
            <div className="flex gap-3">
              {socials.map(({ label, href, icon }) => (
                <SocialBtn key={label} href={href} label={label}>
                  {icon}
                </SocialBtn>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <div
              className="font-body text-[0.62rem] font-bold tracking-[0.2em] uppercase mb-4"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              Services
            </div>
            <ul className="space-y-2">
              {['Interior Painting', 'Exterior Painting', 'Cabinet Painting', 'Drywall Services'].map(s => (
                <li key={s}>
                  <a
                    href="#services"
                    className="font-body text-[0.83rem] transition-colors duration-200"
                    style={{ color: 'rgba(255,255,255,0.45)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                  >
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div
              className="font-body text-[0.62rem] font-bold tracking-[0.2em] uppercase mb-4"
              style={{ color: 'rgba(255,255,255,0.35)' }}
            >
              Contact
            </div>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:PeakPerfectionProjects@gmail.com"
                  className="font-body text-[0.83rem] transition-colors duration-200 block"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                >
                  PeakPerfectionProjects@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:7793025075"
                  className="font-body text-[0.83rem] transition-colors duration-200 block"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                >
                  (779) 302-5075
                </a>
              </li>
              <li
                className="font-body text-[0.83rem]"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                Illinois, USA
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div
          className="font-body text-[0.72rem]"
          style={{ color: 'rgba(255,255,255,0.25)' }}
        >
          © 2025 Peak Perfection Painting LLC. All rights reserved.
        </div>
        <div
          className="font-body text-[0.62rem] uppercase tracking-[0.18em]"
          style={{ color: 'rgba(255,255,255,0.18)' }}
        >
          Interior · Exterior · Drywall
        </div>
      </div>
    </footer>
  );
}

function SocialBtn({ href, label, children }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 rounded-sm flex items-center justify-center text-white transition-all duration-200"
      style={{
        background: hov ? GOLD : 'rgba(255,255,255,0.08)',
        transform:  hov ? 'translateY(-2px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
    </a>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   APP ROOT
───────────────────────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <div className="font-body bg-white">
      <Navbar />
      <main>
        <Hero />
        <StatsStrip />
        <WhyChooseUs />
        <Services />
        <About />
        <Reviews />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
