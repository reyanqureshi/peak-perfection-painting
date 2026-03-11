import { useState, useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────────────────────────────────────
   TOKENS
───────────────────────────────────────────────────────────────────────────── */
const BG       = '#06101e';
const SURFACE  = '#0c1829';
const CARD     = '#0e1f35';
const NAVY     = '#1B2A4A';
const GOLD     = '#D4A017';
const GOLD_LT  = '#e8c040';
const GOLD_DIM = 'rgba(212,160,23,0.18)';

/* ─────────────────────────────────────────────────────────────────────────────
   HOOKS
───────────────────────────────────────────────────────────────────────────── */
function useFadeIn(threshold = 0.1) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const el = ref.current;
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
   FADE WRAPPER
───────────────────────────────────────────────────────────────────────────── */
function Fade({ children, className = '', delay = 0 }) {
  const [ref, vis] = useFadeIn();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity:    vis ? 1 : 0,
        transform:  vis ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ① SCROLL PROGRESS BAR
───────────────────────────────────────────────────────────────────────────── */
function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const fn = () => {
      const el  = document.documentElement;
      const top = el.scrollTop || document.body.scrollTop;
      const h   = el.scrollHeight - el.clientHeight;
      setPct(h > 0 ? (top / h) * 100 : 0);
    };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px]" style={{ background: `${GOLD}20` }}>
      <div
        className="h-full transition-none"
        style={{
          width:      `${pct}%`,
          background: `linear-gradient(to right, ${GOLD}, ${GOLD_LT})`,
          boxShadow:  `0 0 8px ${GOLD}80`,
        }}
      />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ② FILM GRAIN OVERLAY
───────────────────────────────────────────────────────────────────────────── */
function GrainOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9990]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        opacity:         0.032,
        mixBlendMode:    'overlay',
      }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ③ CURSOR TRAIL (desktop only)
───────────────────────────────────────────────────────────────────────────── */
function CursorTrail() {
  const canvasRef = useRef(null);
  useEffect(() => {
    if ('ontouchstart' in window) return;
    const canvas = canvasRef.current;
    const ctx    = canvas.getContext('2d');
    let pts = [];
    let raf;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = e => {
      pts.push({ x: e.clientX, y: e.clientY, life: 1 });
      if (pts.length > 32) pts.shift();
    };
    window.addEventListener('mousemove', onMove);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 1; i < pts.length; i++) {
        const p    = pts[i];
        const prev = pts[i - 1];
        const t    = i / pts.length;
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(p.x, p.y);
        ctx.strokeStyle = `rgba(212,160,23,${p.life * t * 0.55})`;
        ctx.lineWidth   = p.life * t * 5;
        ctx.lineCap     = 'round';
        ctx.stroke();
        p.life -= 0.038;
      }
      pts = pts.filter(p => p.life > 0);
      raf = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9995 }}
    />
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ④ FLOATING CTA
───────────────────────────────────────────────────────────────────────────── */
function FloatingCTA() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fn = () => setShow(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <a
      href="#contact"
      className="fixed bottom-6 right-6 z-[9980] flex items-center gap-2.5 font-body font-bold text-[0.72rem] tracking-[0.15em] uppercase px-5 py-3.5 transition-all duration-500"
      style={{
        background:  GOLD,
        color:       BG,
        clipPath:    'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
        boxShadow:   `0 0 0 0 ${GOLD}60`,
        opacity:     show ? 1 : 0,
        transform:   show ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.95)',
        pointerEvents: show ? 'auto' : 'none',
        animation:   show ? 'ctaPulse 2.5s ease-in-out infinite' : 'none',
      }}
    >
      <style>{`
        @keyframes ctaPulse {
          0%,100% { box-shadow: 0 0 0 0 rgba(212,160,23,0.5); }
          50%      { box-shadow: 0 0 0 10px rgba(212,160,23,0); }
        }
      `}</style>
      🎨 Free Estimate
    </a>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ⑤ PAINT STROKE SVG UNDERLINE
───────────────────────────────────────────────────────────────────────────── */
function PaintStroke({ visible, align = 'center' }) {
  return (
    <div className={`mt-3 w-48 ${align === 'center' ? 'mx-auto' : ''}`}>
      <svg viewBox="0 0 192 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M2,7 C20,3 45,9 70,5 C95,2 118,9 142,5.5 C160,3 175,8 190,6"
          stroke={GOLD}
          strokeWidth="2.8"
          strokeLinecap="round"
          style={{
            strokeDasharray:  192,
            strokeDashoffset: visible ? 0 : 192,
            transition:       'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1) 0.35s',
          }}
        />
        <path
          d="M8,8 C30,6 55,9 80,7 C100,5.5 125,8.5 150,6 C165,4.5 178,7 188,6.5"
          stroke={GOLD}
          strokeWidth="1"
          strokeLinecap="round"
          style={{
            opacity:          0.35,
            strokeDasharray:  180,
            strokeDashoffset: visible ? 0 : 180,
            transition:       'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1) 0.55s',
          }}
        />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ⑥ COUNT-UP NUMBER
───────────────────────────────────────────────────────────────────────────── */
function CountUp({ to, decimals = 0, suffix = '', prefix = '', duration = 1800 }) {
  const ref     = useRef(null);
  const started = useRef(false);
  const [val, setVal] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now();
        const tick = now => {
          const t    = Math.min((now - t0) / duration, 1);
          const ease = 1 - Math.pow(1 - t, 3);
          setVal(+(ease * to).toFixed(decimals));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        obs.disconnect();
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to, decimals, duration]);

  return <span ref={ref}>{prefix}{val.toFixed(decimals)}{suffix}</span>;
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

const MARQUEE_ITEMS = [
  'Interior Painting','Exterior Painting','Cabinet Painting',
  'Drywall Services','McHenry County','Lake County','Precision','Quality',
  'Reliability','Free Estimates','Eco-Friendly Paints',
];

const WHY_US = [
  { emoji: '🎨', title: 'Attention to Detail',  desc: 'Every stroke matters. We treat your home as a canvas for lasting beauty and precision craftsmanship.'  },
  { emoji: '✅', title: 'Timely Delivery',       desc: 'We finish on schedule, every time. Your time is as valuable as ours — no surprises, no delays.'        },
  { emoji: '🌿', title: 'Eco-Friendly Paints',   desc: 'Safe for your family and environment. Premium quality without compromise on what matters most.'         },
  { emoji: '💰', title: 'Affordable Pricing',    desc: 'Top-tier results at fair, transparent prices. No hidden costs. No bait-and-switch. Just honest work.'   },
];

const SERVICES = [
  { num: '01', emoji: '🏠', title: 'Interior Painting', desc: 'Flawless, lasting finishes for every room in your home.', items: ['Living Rooms & Bedrooms', 'Kitchens & Bathrooms', 'Hallways & Ceilings', 'Trim & Accent Walls'] },
  { num: '02', emoji: '🏡', title: 'Exterior Painting',  desc: 'Weather-resistant coatings that protect and beautify.', items: ['Home Exteriors & Siding', 'Trim, Decks & Patios', 'Fences & Concrete', 'Stucco & Brick'] },
  { num: '03', emoji: '🪟', title: 'Cabinet Painting',   desc: 'Stunning cabinet makeovers with a factory-smooth finish.', items: ['Kitchen Cabinets', 'Bathroom Vanities', 'Custom Finishes', 'Durable Long-Lasting Coats'] },
  { num: '04', emoji: '🔨', title: 'Drywall Services',   desc: 'Seamless drywall that is perfectly smooth and paint-ready.', items: ['Repairs & Patching', 'New Installation', 'Smooth Finish Prep', 'Ready-to-Paint Surfaces'] },
];

const PROCESS = [
  { num: '01', emoji: '📋', title: 'Free Estimate',    desc: 'We visit your property, assess the scope, and deliver a detailed quote — usually within 24 hours. Zero obligation.' },
  { num: '02', emoji: '🎨', title: 'Color Consult',    desc: 'Our team guides you through colors, finishes, and paint samples to find the perfect look for your space.' },
  { num: '03', emoji: '🖌️', title: 'Expert Painting',  desc: 'Our crew arrives on time, protects your space, and delivers flawless results with premium eco-friendly paints.' },
  { num: '04', emoji: '✅', title: 'Final Walkthrough', desc: 'We do a thorough inspection with you. We don\'t leave until every detail is perfect and you\'re 100% satisfied.' },
];

const PLACEHOLDER_REVIEWS = [
  { author_name: 'Maria T.',    rating: 5, text: 'Peak Perfection did an incredible job on our entire first floor. The crew was professional, punctual, and left the space spotless. The finish is absolutely flawless — we couldn\'t be happier!', relative_time_description: '2 months ago' },
  { author_name: 'James H.',    rating: 5, text: 'We hired them for exterior painting and drywall repairs. Their attention to detail is incredible — they caught imperfections I hadn\'t even noticed. Recommending them to every neighbor.',         relative_time_description: '3 months ago' },
  { author_name: 'Danielle R.', rating: 5, text: 'Our kitchen cabinets look like they came straight out of a magazine. Fair pricing, a friendly team, and results that speak for themselves. The transformation was remarkable. 10/10.',             relative_time_description: '1 month ago'  },
];

/* ─────────────────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────────────────── */
function Stars({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(i => (
        <svg key={i} className="w-4 h-4" fill={i <= rating ? GOLD : '#1e3a5f'} viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────────────────────────────────────── */
function Navbar() {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav
      className="fixed top-[3px] inset-x-0 z-50 transition-all duration-300"
      style={{
        background:     scrolled ? `${BG}f5` : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom:   scrolled ? `1px solid ${GOLD}15` : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-[70px] md:h-[78px]">
        <a href="#home" className="flex items-center gap-2.5 no-underline select-none">
          <span className="text-2xl leading-none">🎨</span>
          <div className="leading-none">
            <div className="font-display text-white tracking-wider" style={{ fontSize: '1.35rem', letterSpacing: '0.05em' }}>PEAK PERFECTION</div>
            <div className="font-body text-[0.58rem] font-bold tracking-[0.25em] uppercase -mt-0.5" style={{ color: GOLD }}>PAINTING LLC</div>
          </div>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label} href={href}
              className="font-body text-[0.72rem] font-semibold tracking-[0.12em] uppercase transition-all duration-200"
              style={{ color: 'rgba(255,255,255,0.55)' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'white')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
            >
              {label}
            </a>
          ))}
          <a
            href="#contact"
            className="font-body text-[0.72rem] font-bold tracking-[0.12em] uppercase px-5 py-2.5 transition-all duration-200"
            style={{ background: GOLD, color: BG, clipPath: 'polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%)' }}
            onMouseEnter={e => { e.currentTarget.style.background = GOLD_LT; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = GOLD;    e.currentTarget.style.transform = 'translateY(0)';    }}
          >
            Free Estimate
          </a>
        </div>

        <button className="md:hidden p-2 flex flex-col gap-1.5" onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
          {[0,1,2].map(i => (
            <span key={i} className="block rounded transition-all duration-300"
              style={{
                width: i === 1 ? (open ? '22px' : '16px') : '22px', height: '2px', background: GOLD,
                transformOrigin: 'center', opacity: open && i === 1 ? 0 : 1,
                transform: open ? i === 0 ? 'rotate(45deg) translate(5px,5px)' : i === 2 ? 'rotate(-45deg) translate(5px,-5px)' : 'none' : 'none',
              }}
            />
          ))}
        </button>
      </div>

      <div className="md:hidden overflow-hidden transition-all duration-300"
        style={{ maxHeight: open ? '360px' : '0', background: `${SURFACE}f0`, backdropFilter: 'blur(16px)' }}
      >
        <div className="px-6 pb-7 pt-4 flex flex-col gap-5 border-t" style={{ borderColor: `${GOLD}20` }}>
          {NAV_LINKS.map(({ label, href }) => (
            <a key={label} href={href} onClick={() => setOpen(false)}
              className="font-body text-sm font-semibold tracking-[0.12em] uppercase text-white/60">{label}</a>
          ))}
          <a href="#contact" onClick={() => setOpen(false)}
            className="font-body text-sm font-bold tracking-[0.12em] uppercase py-3.5 text-center mt-1"
            style={{ background: GOLD, color: BG }}>Get Free Estimate</a>
        </div>
      </div>
    </nav>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ⑦ HERO — staggered word reveal
───────────────────────────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: BG }}>
      <style>{`
        @keyframes heroLine {
          from { opacity: 0; transform: translateY(40px) skewY(2deg); }
          to   { opacity: 1; transform: translateY(0)    skewY(0deg); }
        }
        @keyframes heroBadge {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroCta {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Grid texture */}
      <div className="absolute inset-0 pointer-events-none opacity-30"
        style={{ backgroundImage: `linear-gradient(rgba(212,160,23,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(212,160,23,0.06) 1px,transparent 1px)`, backgroundSize: '80px 80px' }}
      />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse 75% 60% at 50% 50%, rgba(212,160,23,0.05) 0%, transparent 70%)` }}
      />
      <div className="absolute left-6 top-0 bottom-0 w-px hidden lg:block" style={{ background: `linear-gradient(to bottom,transparent,${GOLD}40,transparent)` }} />
      <div className="absolute right-6 top-0 bottom-0 w-px hidden lg:block" style={{ background: `linear-gradient(to bottom,transparent,${GOLD}40,transparent)` }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center pt-28 pb-20">

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 mb-8 px-4 py-2 font-body text-[0.65rem] font-bold tracking-[0.25em] uppercase border"
          style={{ borderColor: `${GOLD}35`, color: GOLD, background: GOLD_DIM, opacity: 0, animation: 'heroBadge 0.6s ease forwards 0.1s' }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: GOLD }} />
          McHenry &amp; Lake County Specialists
        </div>

        {/* ⑦ Staggered headline */}
        <div className="overflow-hidden mb-2">
          <h1
            className="font-display text-white leading-none"
            style={{ fontSize: 'clamp(3.5rem,12vw,10rem)', letterSpacing: '0.02em', opacity: 0, animation: 'heroLine 0.75s cubic-bezier(0.16,1,0.3,1) forwards 0.35s' }}
          >
            TRANSFORM
          </h1>
        </div>
        <div className="overflow-hidden mb-4">
          <h1
            className="font-display leading-none"
            style={{ fontSize: 'clamp(3.5rem,12vw,10rem)', letterSpacing: '0.02em', color: GOLD, opacity: 0, animation: 'heroLine 0.75s cubic-bezier(0.16,1,0.3,1) forwards 0.58s' }}
          >
            YOUR SPACE
          </h1>
        </div>
        <div className="overflow-hidden mb-8">
          <h2
            className="font-display leading-none"
            style={{ fontSize: 'clamp(1.4rem,4vw,3.5rem)', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.15em', opacity: 0, animation: 'heroLine 0.75s cubic-bezier(0.16,1,0.3,1) forwards 0.78s' }}
          >
            WITH EXPERT PAINTING
          </h2>
        </div>

        {/* Sub + CTA */}
        <div style={{ opacity: 0, animation: 'heroCta 0.7s ease forwards 1.05s' }}>
          <p className="font-body text-white/50 mx-auto mb-12 leading-relaxed"
            style={{ fontSize: 'clamp(0.88rem,2vw,1.05rem)', maxWidth: '520px' }}>
            Serving McHenry County &amp; Lake County with top-tier interior, exterior &amp; drywall services.{' '}
            <span className="text-white/80 font-semibold">Precision. Quality. Reliability.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact"
              className="font-body font-bold text-[0.78rem] tracking-[0.18em] uppercase px-10 py-4 transition-all duration-200"
              style={{ background: GOLD, color: BG, clipPath: 'polygon(12px 0%,100% 0%,calc(100% - 12px) 100%,0% 100%)' }}
              onMouseEnter={e => { e.currentTarget.style.background = GOLD_LT; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 12px 36px rgba(212,160,23,0.35)`; }}
              onMouseLeave={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              Get a Free Estimate
            </a>
            <a href="#services"
              className="font-body font-bold text-[0.78rem] tracking-[0.18em] uppercase px-10 py-4 border text-white/70 transition-all duration-200"
              style={{ borderColor: 'rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.04)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${GOLD}70`; e.currentTarget.style.color = 'white'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Our Services
            </a>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center gap-2 select-none" style={{ opacity: 0.3 }}>
          <div className="w-px h-10 bg-gradient-to-b from-white/60 to-transparent" />
          <span className="font-body text-white text-[0.58rem] tracking-[0.3em] uppercase">Scroll</span>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   MARQUEE STRIP
───────────────────────────────────────────────────────────────────────────── */
function MarqueeStrip() {
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];
  return (
    <div className="py-4 overflow-hidden border-y" style={{ background: GOLD }}>
      <div className="flex items-center animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-4 mx-4">
            <span className="font-display tracking-wider uppercase" style={{ fontSize: '1.1rem', color: BG, letterSpacing: '0.08em' }}>{item}</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: `${BG}50`, flexShrink: 0 }} />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   STATS STRIP — with ⑥ CountUp
───────────────────────────────────────────────────────────────────────────── */
function StatsStrip() {
  const stats = [
    { display: <><CountUp to={100} suffix="%" />        </>, label: 'Client Satisfaction'   },
    { display: <><CountUp to={5.0} decimals={1} suffix="★" /></>, label: 'Google Rating' },
    { display: <>Free</>,                                          label: 'Estimates & Consults' },
    { display: <>Est. <CountUp to={2024} duration={1200} /></>,   label: 'McHenry & Lake County' },
  ];
  return (
    <div className="py-10" style={{ background: GOLD }}>
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map(({ display, label }, i) => (
          <div key={i} className="text-center px-4" style={{ borderRight: i < 3 ? `1px solid ${BG}22` : 'none' }}>
            <div className="font-display font-bold leading-none" style={{ fontSize: 'clamp(1.6rem,4vw,2.4rem)', color: BG }}>{display}</div>
            <div className="font-body text-[0.6rem] font-bold uppercase tracking-[0.18em] mt-1.5 opacity-65" style={{ color: BG }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   WHY CHOOSE US — with PaintStroke on heading
───────────────────────────────────────────────────────────────────────────── */
function WhyChooseUs() {
  const [ref, vis] = useFadeIn(0.15);
  return (
    <section className="py-24" style={{ background: SURFACE }}>
      <div className="max-w-6xl mx-auto px-6">
        <div ref={ref} className="mb-16 text-center" style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(28px)', transition: 'all 0.7s ease' }}>
          <div className="flex items-center gap-4 mb-3 justify-center">
            <div className="h-px w-16" style={{ background: `${GOLD}30` }} />
            <span className="font-body text-[0.62rem] font-bold tracking-[0.25em] uppercase" style={{ color: GOLD }}>Why Us</span>
            <div className="h-px w-16" style={{ background: `${GOLD}30` }} />
          </div>
          <h2 className="font-display text-white" style={{ fontSize: 'clamp(2.4rem,6vw,4.5rem)', letterSpacing: '0.04em' }}>
            THE PEAK PERFECTION <span style={{ color: GOLD }}>DIFFERENCE</span>
          </h2>
          <PaintStroke visible={vis} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {WHY_US.map(({ emoji, title, desc }, i) => (
            <Fade key={title} delay={i * 80}><WhyCard emoji={emoji} title={title} desc={desc} /></Fade>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyCard({ emoji, title, desc }) {
  const [hov, setHov] = useState(false);
  return (
    <div className="p-7 h-full transition-all duration-300 cursor-default"
      style={{
        background: hov ? CARD : `${CARD}cc`,
        border:     `1px solid ${hov ? GOLD + '60' : 'rgba(255,255,255,0.06)'}`,
        borderTop:  `2px solid ${hov ? GOLD : 'rgba(212,160,23,0.25)'}`,
        transform:  hov ? 'translateY(-6px)' : 'translateY(0)',
        boxShadow:  hov ? `0 20px 48px rgba(0,0,0,0.4),0 0 0 1px ${GOLD}20` : '0 4px 20px rgba(0,0,0,0.2)',
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <div className="text-3xl mb-5 leading-none select-none">{emoji}</div>
      <h3 className="font-display mb-2" style={{ fontSize: '1.4rem', color: 'white', letterSpacing: '0.05em' }}>{title.toUpperCase()}</h3>
      <p className="font-body text-[0.83rem] leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{desc}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   SERVICES — interactive spotlight
───────────────────────────────────────────────────────────────────────────── */
function Services() {
  const [active, setActive] = useState(0);
  const [ref, vis] = useFadeIn(0.1);

  return (
    <section id="services" className="py-24" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-6">

        <div ref={ref} className="mb-14 text-center" style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(28px)', transition: 'all 0.7s ease' }}>
          <div className="flex items-center gap-4 mb-3 justify-center">
            <div className="h-px w-16" style={{ background: `${GOLD}30` }} />
            <span className="font-body text-[0.62rem] font-bold tracking-[0.25em] uppercase" style={{ color: GOLD }}>What We Do</span>
            <div className="h-px w-16" style={{ background: `${GOLD}30` }} />
          </div>
          <h2 className="font-display text-white" style={{ fontSize: 'clamp(2.4rem,6vw,4.5rem)', letterSpacing: '0.04em' }}>
            OUR <span style={{ color: GOLD }}>SERVICES</span>
          </h2>
          <PaintStroke visible={vis} />
        </div>

        {/* Desktop spotlight */}
        <div className="hidden lg:flex border" style={{ borderColor: `${GOLD}18`, minHeight: '520px' }}>
          <div className="flex-shrink-0 w-[38%] border-r flex flex-col" style={{ borderColor: `${GOLD}18` }}>
            {SERVICES.map((svc, i) => {
              const isActive = active === i;
              return (
                <button key={svc.num} onClick={() => setActive(i)}
                  className="w-full text-left flex items-center gap-5 px-8 py-7 transition-all duration-200 border-b"
                  style={{ borderColor: `${GOLD}12`, background: isActive ? `${GOLD}0c` : 'transparent', borderLeft: `3px solid ${isActive ? GOLD : 'transparent'}` }}
                  onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = `${GOLD}06`; }}
                  onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                >
                  <span className="font-display leading-none flex-shrink-0 transition-all duration-200"
                    style={{ fontSize: '2.8rem', color: isActive ? GOLD : 'rgba(255,255,255,0.15)', letterSpacing: '0.03em' }}>
                    {svc.num}
                  </span>
                  <div>
                    <div className="font-display transition-colors duration-200"
                      style={{ fontSize: '1.25rem', letterSpacing: '0.06em', color: isActive ? 'white' : 'rgba(255,255,255,0.4)' }}>
                      {svc.title.toUpperCase()}
                    </div>
                    <div className="font-body text-[0.72rem] mt-0.5" style={{ color: isActive ? GOLD : 'rgba(255,255,255,0.2)' }}>
                      {svc.items[0]} + more
                    </div>
                  </div>
                  <div className="ml-auto transition-all duration-200" style={{ opacity: isActive ? 1 : 0, transform: isActive ? 'translateX(0)' : 'translateX(-8px)' }}>
                    <svg className="w-4 h-4" fill="none" stroke={GOLD} strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              );
            })}
          </div>
          <ServiceSpotlight key={active} service={SERVICES[active]} />
        </div>

        {/* Mobile accordion */}
        <div className="lg:hidden space-y-0 border" style={{ borderColor: `${GOLD}18` }}>
          {SERVICES.map((svc, i) => (
            <MobileServiceAccordion key={svc.num} service={svc} isActive={active === i} onClick={() => setActive(active === i ? -1 : i)} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceSpotlight({ service }) {
  return (
    <div className="flex-1 relative overflow-hidden p-10 flex flex-col justify-center"
      style={{ background: CARD, animation: 'fadeSlideIn 0.35s ease-out forwards' }}
    >
      <style>{`@keyframes fadeSlideIn { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }`}</style>
      <div className="absolute -right-6 -bottom-8 font-display leading-none select-none pointer-events-none"
        style={{ fontSize: '22rem', color: `${GOLD}07`, letterSpacing: '0.02em', lineHeight: 0.85 }}>{service.num}</div>

      <div className="flex items-center gap-4 mb-7">
        <div className="w-16 h-16 flex items-center justify-center text-3xl select-none flex-shrink-0"
          style={{ background: GOLD_DIM, border: `1px solid ${GOLD}40` }}>{service.emoji}</div>
        <div className="font-body text-[0.65rem] font-bold tracking-[0.25em] uppercase" style={{ color: GOLD }}>Service {service.num} of 04</div>
      </div>

      <h3 className="font-display text-white leading-none mb-5"
        style={{ fontSize: 'clamp(2.6rem,4vw,3.8rem)', letterSpacing: '0.04em' }}>{service.title.toUpperCase()}</h3>
      <div className="w-12 h-0.5 mb-5" style={{ background: GOLD }} />
      <p className="font-body text-[0.9rem] leading-relaxed mb-8 max-w-lg" style={{ color: 'rgba(255,255,255,0.5)' }}>{service.desc}</p>

      <div className="grid grid-cols-2 gap-x-6 gap-y-3">
        {service.items.map((item, i) => (
          <div key={item} className="flex items-center gap-2.5">
            <span className="font-body text-[0.6rem] font-bold flex-shrink-0" style={{ color: GOLD }}>{String(i+1).padStart(2,'0')}</span>
            <span className="font-body text-[0.83rem]" style={{ color: 'rgba(255,255,255,0.65)' }}>{item}</span>
          </div>
        ))}
      </div>

      <div className="mt-9">
        <a href="#contact"
          className="inline-flex items-center gap-3 font-body text-[0.75rem] font-bold tracking-[0.18em] uppercase px-7 py-3.5 transition-all duration-200"
          style={{ background: GOLD, color: BG, clipPath: 'polygon(10px 0%,100% 0%,calc(100% - 10px) 100%,0% 100%)' }}
          onMouseEnter={e => (e.currentTarget.style.background = GOLD_LT)}
          onMouseLeave={e => (e.currentTarget.style.background = GOLD)}
        >
          Get a Free Quote
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}

function MobileServiceAccordion({ service, isActive, onClick }) {
  return (
    <div style={{ borderBottom: `1px solid ${GOLD}15` }}>
      <button onClick={onClick}
        className="w-full text-left flex items-center gap-4 px-5 py-5 transition-all duration-200"
        style={{ background: isActive ? `${GOLD}0c` : 'transparent', borderLeft: `3px solid ${isActive ? GOLD : 'transparent'}` }}
      >
        <span className="font-display flex-shrink-0" style={{ fontSize: '2rem', color: isActive ? GOLD : 'rgba(255,255,255,0.2)', letterSpacing: '0.03em' }}>{service.num}</span>
        <span className="font-display flex-1" style={{ fontSize: '1.1rem', letterSpacing: '0.06em', color: isActive ? 'white' : 'rgba(255,255,255,0.45)' }}>{service.title.toUpperCase()}</span>
        <svg className="w-4 h-4 flex-shrink-0 transition-transform duration-300"
          style={{ color: GOLD, transform: isActive ? 'rotate(90deg)' : 'rotate(0deg)' }}
          fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <div className="overflow-hidden transition-all duration-300" style={{ maxHeight: isActive ? '400px' : '0' }}>
        <div className="px-5 pb-7 pt-2">
          <p className="font-body text-[0.85rem] leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.45)' }}>{service.desc}</p>
          <ul className="space-y-2.5">
            {service.items.map((item, i) => (
              <li key={item} className="flex items-center gap-3">
                <span className="font-body text-[0.6rem] font-bold flex-shrink-0" style={{ color: GOLD }}>{String(i+1).padStart(2,'0')}</span>
                <span className="font-body text-[0.82rem]" style={{ color: 'rgba(255,255,255,0.6)' }}>{item}</span>
              </li>
            ))}
          </ul>
          <a href="#contact"
            className="inline-block mt-6 font-body text-[0.72rem] font-bold tracking-[0.18em] uppercase px-6 py-3"
            style={{ background: GOLD, color: BG, clipPath: 'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)' }}>
            Get Free Quote
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   ABOUT
───────────────────────────────────────────────────────────────────────────── */
function About() {
  return (
    <section id="about" className="py-24 overflow-hidden" style={{ background: SURFACE }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-14 lg:gap-20 items-center">
          <Fade>
            <div className="relative flex items-center justify-center min-h-[420px]"
              style={{ background: CARD, border: `1px solid ${GOLD}25`, boxShadow: `8px 8px 0 ${GOLD}35` }}>
              <div className="absolute inset-0 opacity-20"
                style={{ backgroundImage: `linear-gradient(rgba(212,160,23,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(212,160,23,0.08) 1px,transparent 1px)`, backgroundSize: '40px 40px' }} />
              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2" style={{ borderColor: GOLD }} />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2" style={{ borderColor: GOLD }} />
              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2" style={{ borderColor: `${GOLD}40` }} />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2" style={{ borderColor: `${GOLD}40` }} />
              <div className="relative z-10 text-center px-8">
                <div className="text-[6rem] leading-none select-none mb-4" style={{ filter: `drop-shadow(0 0 30px ${GOLD}50)` }}>🎨</div>
                <div className="font-display leading-none" style={{ fontSize: '4rem', color: GOLD, letterSpacing: '0.05em' }}>EST. 2024</div>
                <div className="font-body text-[0.62rem] font-bold tracking-[0.25em] uppercase mt-4" style={{ color: 'rgba(255,255,255,0.3)' }}>Peak Perfection Painting LLC</div>
                <div className="mt-5 h-px w-20 mx-auto" style={{ background: `${GOLD}40` }} />
                <div className="font-body text-[0.6rem] font-bold tracking-[0.2em] uppercase mt-4" style={{ color: 'rgba(255,255,255,0.2)' }}>McHenry County · Lake County · Illinois</div>
              </div>
            </div>
          </Fade>

          <Fade delay={200}>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-8" style={{ background: GOLD }} />
              <span className="font-body text-[0.62rem] font-bold tracking-[0.25em] uppercase" style={{ color: GOLD }}>About Us</span>
            </div>
            <h2 className="font-display text-white leading-none mb-8" style={{ fontSize: 'clamp(2.2rem,5vw,3.8rem)', letterSpacing: '0.04em' }}>
              WHO<br /><span style={{ color: GOLD }}>WE ARE</span>
            </h2>
            <div className="space-y-4 font-body text-[0.88rem] leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
              <p>At <span className="font-semibold text-white">Peak Perfection Painting LLC</span>, we believe that a fresh coat of paint can transform more than just walls — it can transform a home. We are a team of passionate, experienced painters dedicated to bringing your vision to life with precision, creativity, and care.</p>
              <p>From the first brushstroke to the final finish, we take pride in every detail, ensuring a smooth, stress-free experience for our clients. With years of expertise, we specialize in both interior and exterior painting, offering customized solutions to suit your style, needs, and budget.</p>
              <p>Whether you're looking to refresh a single room, add curb appeal to your home's exterior, or completely revamp your space, we're here to help. What sets us apart? Attention to detail, timely delivery, and a commitment to using <span className="text-white font-semibold">high-quality, eco-friendly paints</span> that are safe for your family and the environment.</p>
              <div className="mt-6 pt-5 border-t" style={{ borderColor: `rgba(212,160,23,0.2)` }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-0.5" style={{ background: GOLD }} />
                  <span className="font-body text-[0.6rem] font-bold tracking-[0.22em] uppercase" style={{ color: GOLD }}>Our Mission</span>
                </div>
                <p>To provide high-quality, professional painting services that <span className="text-white font-semibold">exceed our clients' expectations</span>. We treat every home like it's our own — with respect, honesty, and a dedication to excellence.</p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              {['Interior','Exterior','Cabinets','Drywall','McHenry County','Lake County'].map(tag => (
                <span key={tag} className="font-body text-[0.65rem] font-bold tracking-[0.18em] uppercase px-4 py-2 border"
                  style={{ borderColor: `${GOLD}30`, color: GOLD, background: GOLD_DIM }}>{tag}</span>
              ))}
            </div>
          </Fade>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   OUR PROCESS — new section
───────────────────────────────────────────────────────────────────────────── */
function Process() {
  const [ref, vis] = useFadeIn(0.1);
  return (
    <section className="py-24" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto px-6">

        <div ref={ref} className="mb-16 text-center" style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(28px)', transition: 'all 0.7s ease' }}>
          <div className="flex items-center gap-4 mb-3 justify-center">
            <div className="h-px w-16" style={{ background: `${GOLD}30` }} />
            <span className="font-body text-[0.62rem] font-bold tracking-[0.25em] uppercase" style={{ color: GOLD }}>How It Works</span>
            <div className="h-px w-16" style={{ background: `${GOLD}30` }} />
          </div>
          <h2 className="font-display text-white" style={{ fontSize: 'clamp(2.4rem,6vw,4.5rem)', letterSpacing: '0.04em' }}>
            OUR <span style={{ color: GOLD }}>PROCESS</span>
          </h2>
          <PaintStroke visible={vis} />
        </div>

        {/* Desktop: horizontal timeline */}
        <div className="hidden md:block relative">
          {/* Connecting line */}
          <div className="absolute top-[52px] left-[12.5%] right-[12.5%] h-px" style={{ background: `${GOLD}25` }}>
            <div
              className="h-full"
              style={{
                background:  `linear-gradient(to right, ${GOLD}, ${GOLD_LT})`,
                width:       vis ? '100%' : '0%',
                transition:  'width 1.4s cubic-bezier(0.4,0,0.2,1) 0.6s',
                boxShadow:   `0 0 6px ${GOLD}60`,
              }}
            />
          </div>

          <div className="grid grid-cols-4 gap-6">
            {PROCESS.map((step, i) => (
              <Fade key={step.num} delay={i * 120}>
                <ProcessStep step={step} />
              </Fade>
            ))}
          </div>
        </div>

        {/* Mobile: vertical */}
        <div className="md:hidden relative pl-12">
          <div className="absolute left-[18px] top-0 bottom-0 w-px" style={{ background: `${GOLD}30` }} />
          <div className="space-y-10">
            {PROCESS.map((step, i) => (
              <Fade key={step.num} delay={i * 100}>
                <MobileProcessStep step={step} />
              </Fade>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

function ProcessStep({ step }) {
  const [hov, setHov] = useState(false);
  return (
    <div className="text-center" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      {/* Number circle */}
      <div className="relative flex items-center justify-center mx-auto mb-6"
        style={{ width: '64px', height: '64px', zIndex: 10 }}>
        <div className="absolute inset-0 rounded-full transition-all duration-300"
          style={{ background: hov ? GOLD : CARD, border: `2px solid ${hov ? GOLD : GOLD + '60'}`, boxShadow: hov ? `0 0 20px ${GOLD}60` : 'none' }} />
        <span className="relative font-display" style={{ fontSize: '1.4rem', color: hov ? BG : GOLD, letterSpacing: '0.05em' }}>{step.num}</span>
      </div>

      <div className="text-2xl mb-3 select-none">{step.emoji}</div>
      <h3 className="font-display mb-2 transition-colors duration-200"
        style={{ fontSize: '1.2rem', letterSpacing: '0.06em', color: hov ? GOLD : 'white' }}>
        {step.title.toUpperCase()}
      </h3>
      <p className="font-body text-[0.8rem] leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{step.desc}</p>
    </div>
  );
}

function MobileProcessStep({ step }) {
  return (
    <div className="relative">
      <div className="absolute -left-[42px] w-8 h-8 rounded-full flex items-center justify-center"
        style={{ background: CARD, border: `2px solid ${GOLD}60`, top: '2px' }}>
        <span className="font-display text-sm" style={{ color: GOLD }}>{step.num}</span>
      </div>
      <div className="text-xl mb-1 select-none">{step.emoji}</div>
      <h3 className="font-display mb-1" style={{ fontSize: '1.15rem', letterSpacing: '0.06em', color: 'white' }}>{step.title.toUpperCase()}</h3>
      <p className="font-body text-[0.82rem] leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{step.desc}</p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   REVIEWS — with PaintStroke
───────────────────────────────────────────────────────────────────────────── */
function Reviews() {
  const [reviews,  setReviews]  = useState([]);
  const [rating,   setRating]   = useState(null);
  const [total,    setTotal]    = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [ref, vis] = useFadeIn(0.1);

  useEffect(() => {
    const PLACE_ID = 'ChIJP87pPodZFxIR9-UZJzVgpFU';
    const API_KEY  = 'AIzaSyCdfo6O0kqJj_KpAdq-8JJzjQH8_peIuDo';
    fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${PLACE_ID}&fields=reviews,rating,user_ratings_total&key=${API_KEY}`)
      .then(r => r.json())
      .then(d => {
        if (d.result?.reviews?.length) { setReviews(d.result.reviews.slice(0,3)); setRating(d.result.rating); setTotal(d.result.user_ratings_total); }
        else throw new Error();
      })
      .catch(() => { setReviews(PLACEHOLDER_REVIEWS); setRating(5.0); })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="reviews" className="py-24" style={{ background: SURFACE }}>
      <div className="max-w-6xl mx-auto px-6">
        <div ref={ref} className="mb-16 text-center" style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(28px)', transition: 'all 0.7s ease' }}>
          <div className="flex items-center gap-4 mb-3 justify-center">
            <div className="h-px w-16" style={{ background: `${GOLD}30` }} />
            <span className="font-body text-[0.62rem] font-bold tracking-[0.25em] uppercase" style={{ color: GOLD }}>Client Stories</span>
            <div className="h-px w-16" style={{ background: `${GOLD}30` }} />
          </div>
          <h2 className="font-display text-white" style={{ fontSize: 'clamp(2.4rem,6vw,4.5rem)', letterSpacing: '0.04em' }}>
            GOOGLE <span style={{ color: GOLD }}>REVIEWS</span>
          </h2>
          {rating != null && (
            <div className="flex items-center justify-center gap-3 mt-4">
              <Stars rating={Math.round(rating)} />
              <span className="font-display text-white" style={{ fontSize: '1.8rem' }}>{rating.toFixed(1)}</span>
              {total && <span className="font-body text-[0.8rem]" style={{ color: 'rgba(255,255,255,0.3)' }}>({total} reviews)</span>}
            </div>
          )}
          <PaintStroke visible={vis} />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-11 h-11 rounded-full border-4 animate-spin" style={{ borderColor: `${GOLD}30`, borderTopColor: GOLD }} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r, i) => <Fade key={i} delay={i * 80}><ReviewCard review={r} /></Fade>)}
          </div>
        )}
      </div>
    </section>
  );
}

function ReviewCard({ review: r }) {
  const [hov, setHov] = useState(false);
  return (
    <div className="p-7 flex flex-col transition-all duration-300"
      style={{
        background: CARD,
        border:     `1px solid ${hov ? `${GOLD}50` : 'rgba(255,255,255,0.06)'}`,
        transform:  hov ? 'translate(-3px,-3px)' : 'translate(0,0)',
        boxShadow:  hov ? `5px 5px 0 ${GOLD}60,0 16px 40px rgba(0,0,0,0.4)` : `3px 3px 0 ${GOLD}25`,
      }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <Stars rating={r.rating} />
      <p className="font-body text-[0.84rem] leading-relaxed mt-4 flex-1 italic" style={{ color: 'rgba(255,255,255,0.55)' }}>"{r.text}"</p>
      <div className="mt-5 pt-4 border-t flex items-center justify-between" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex items-center justify-center font-display text-white flex-shrink-0" style={{ background: NAVY, fontSize: '1.1rem' }}>{r.author_name?.[0] ?? '?'}</div>
          <div>
            <div className="font-body font-semibold text-[0.83rem] text-white">{r.author_name}</div>
            <div className="font-body text-[0.7rem]" style={{ color: 'rgba(255,255,255,0.3)' }}>{r.relative_time_description}</div>
          </div>
        </div>
        <svg viewBox="0 0 24 24" className="w-5 h-5 opacity-20 flex-shrink-0">
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
  const [form,   setForm]   = useState({ name:'', email:'', phone:'', message:'' });
  const [status, setStatus] = useState('idle');
  const [ref, vis] = useFadeIn(0.1);

  const set  = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const submit = e => { e.preventDefault(); setStatus('sending'); setTimeout(() => setStatus('sent'), 1300); };

  const iStyle  = { background: CARD, border: `1px solid rgba(255,255,255,0.09)`, color: 'white' };
  const focusFn = e => { e.target.style.borderColor = GOLD; e.target.style.boxShadow = `0 0 0 2px ${GOLD}28`; };
  const blurFn  = e => { e.target.style.borderColor = 'rgba(255,255,255,0.09)'; e.target.style.boxShadow = 'none'; };

  return (
    <section id="contact" className="py-24 relative overflow-hidden" style={{ background: BG }}>
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: `linear-gradient(rgba(212,160,23,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(212,160,23,0.06) 1px,transparent 1px)`, backgroundSize: '80px 80px' }}
      />
      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <div ref={ref} className="mb-14 text-center" style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(28px)', transition: 'all 0.7s ease' }}>
          <div className="flex items-center gap-4 mb-3 justify-center">
            <div className="h-px w-16" style={{ background: `${GOLD}30` }} />
            <span className="font-body text-[0.62rem] font-bold tracking-[0.25em] uppercase" style={{ color: GOLD }}>Get In Touch</span>
            <div className="h-px w-16" style={{ background: `${GOLD}30` }} />
          </div>
          <h2 className="font-display text-white" style={{ fontSize: 'clamp(2.4rem,6vw,4.5rem)', letterSpacing: '0.04em' }}>
            READY TO <span style={{ color: GOLD }}>TRANSFORM</span><br />YOUR HOME?
          </h2>
          <p className="font-body mt-4 text-[0.88rem]" style={{ color: 'rgba(255,255,255,0.35)' }}>Contact us for a free estimate. Proudly serving McHenry County &amp; Lake County.</p>
          <PaintStroke visible={vis} />
        </div>

        <Fade delay={120}>
          <div className="p-8 md:p-12" style={{ background: CARD, border: `1px solid ${GOLD}20`, boxShadow: `6px 6px 0 ${GOLD}30` }}>
            {status === 'sent' ? (
              <div className="text-center py-12">
                <div className="text-5xl mb-5">✅</div>
                <h3 className="font-display text-white mb-2" style={{ fontSize: '2.2rem', letterSpacing: '0.05em' }}>MESSAGE RECEIVED</h3>
                <p className="font-body text-[0.88rem]" style={{ color: 'rgba(255,255,255,0.4)' }}>We'll be in touch with your free estimate shortly.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  {[{k:'name',t:'text',p:'Full Name',ph:'John Doe'},{k:'email',t:'email',p:'Email Address',ph:'you@example.com'}].map(({k,t,p,ph}) => (
                    <div key={k}>
                      <label className="block font-body text-[0.6rem] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>{p}</label>
                      <input type={t} required placeholder={ph} value={form[k]} onChange={set(k)}
                        className="w-full px-4 py-3.5 font-body text-[0.88rem] placeholder-white/20 outline-none transition-all duration-200"
                        style={iStyle} onFocus={focusFn} onBlur={blurFn} />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block font-body text-[0.6rem] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Phone Number</label>
                  <input type="tel" placeholder="(000) 000-0000" value={form.phone} onChange={set('phone')}
                    className="w-full px-4 py-3.5 font-body text-[0.88rem] placeholder-white/20 outline-none transition-all duration-200"
                    style={iStyle} onFocus={focusFn} onBlur={blurFn} />
                </div>
                <div>
                  <label className="block font-body text-[0.6rem] font-bold tracking-[0.22em] uppercase mb-2" style={{ color: 'rgba(255,255,255,0.3)' }}>Message</label>
                  <textarea required rows={4} placeholder="Tell us about your project…" value={form.message} onChange={set('message')}
                    className="w-full px-4 py-3.5 font-body text-[0.88rem] placeholder-white/20 outline-none transition-all duration-200 resize-none"
                    style={iStyle} onFocus={focusFn} onBlur={blurFn} />
                </div>
                <button type="submit" disabled={status === 'sending'}
                  className="w-full py-4 font-body font-bold text-[0.78rem] tracking-[0.18em] uppercase transition-all duration-200 disabled:opacity-60"
                  style={{ background: GOLD, color: BG, clipPath: 'polygon(12px 0%,100% 0%,calc(100% - 12px) 100%,0% 100%)' }}
                  onMouseEnter={e => { if (status !== 'sending') { e.currentTarget.style.background = GOLD_LT; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
                  onMouseLeave={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {status === 'sending' ? 'Sending…' : 'Submit Request'}
                </button>
              </form>
            )}

            <div className="mt-8 pt-7 grid sm:grid-cols-2 gap-5 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              {[
                { href:'mailto:PeakPerfectionProjects@gmail.com', label:'Email', text:'PeakPerfectionProjects@gmail.com',
                  icon:<svg className="w-4 h-4" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> },
                { href:'tel:7793025075', label:'Phone', text:'(779) 302-5075',
                  icon:<svg className="w-4 h-4" fill="none" stroke={GOLD} strokeWidth={1.8} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg> },
              ].map(({ href, label, text, icon }) => (
                <a key={label} href={href} className="flex items-center gap-3 no-underline group"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                >
                  <div className="w-9 h-9 flex items-center justify-center flex-shrink-0" style={{ background: GOLD_DIM, border: `1px solid ${GOLD}30` }}>{icon}</div>
                  <div>
                    <div className="font-body text-[0.58rem] font-bold tracking-[0.22em] uppercase" style={{ color: GOLD }}>{label}</div>
                    <div className="font-body text-[0.82rem] transition-colors duration-200">{text}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </Fade>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────────────────────────────────────── */
function Footer() {
  const socials = [
    { label:'Instagram', href:'https://www.instagram.com/peakperfectionpaintingllc/',
      icon:<svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
    { label:'Facebook', href:'https://www.facebook.com/share/17EKj6CEV3/',
      icon:<svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
  ];
  return (
    <footer style={{ background: BG }}>
      <div className="border-t" style={{ borderColor: `${GOLD}18` }}>
        <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-2xl">🎨</span>
              <div>
                <div className="font-display text-white" style={{ fontSize: '1.25rem', letterSpacing: '0.05em' }}>PEAK PERFECTION</div>
                <div className="font-body text-[0.58rem] font-bold tracking-[0.25em] uppercase" style={{ color: GOLD }}>PAINTING LLC</div>
              </div>
            </div>
            <p className="font-body text-[0.78rem] leading-relaxed mb-5" style={{ color: 'rgba(255,255,255,0.3)' }}>Precision. Quality. Reliability.<br />Serving McHenry &amp; Lake County.</p>
            <div className="flex gap-3">
              {socials.map(({ label, href, icon }) => <SocialBtn key={label} href={href} label={label}>{icon}</SocialBtn>)}
            </div>
          </div>

          <div>
            <div className="font-body text-[0.6rem] font-bold tracking-[0.25em] uppercase mb-4" style={{ color: GOLD }}>Services</div>
            <ul className="space-y-2.5">
              {['Interior Painting','Exterior Painting','Cabinet Painting','Drywall Services'].map(s => (
                <li key={s}><a href="#services" className="font-body text-[0.82rem] transition-colors duration-200"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>{s}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-body text-[0.6rem] font-bold tracking-[0.25em] uppercase mb-4" style={{ color: GOLD }}>Contact</div>
            <ul className="space-y-2.5">
              {[{href:'mailto:PeakPerfectionProjects@gmail.com',text:'PeakPerfectionProjects@gmail.com'},{href:'tel:7793025075',text:'(779) 302-5075'}].map(({href,text}) => (
                <li key={text}><a href={href} className="font-body text-[0.82rem] transition-colors duration-200"
                  style={{ color: 'rgba(255,255,255,0.35)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}>{text}</a></li>
              ))}
              <li className="font-body text-[0.82rem]" style={{ color: 'rgba(255,255,255,0.2)' }}>McHenry County &amp; Lake County, IL</li>
            </ul>
          </div>
        </div>

        <div className="border-t max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <div className="font-body text-[0.7rem]" style={{ color: 'rgba(255,255,255,0.2)' }}>© 2025 Peak Perfection Painting LLC. All rights reserved.</div>
          <div className="font-body text-[0.6rem] uppercase tracking-[0.2em]" style={{ color: 'rgba(255,255,255,0.12)' }}>Interior · Exterior · Drywall</div>
        </div>
      </div>
    </footer>
  );
}

function SocialBtn({ href, label, children }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
      className="w-9 h-9 flex items-center justify-center text-white transition-all duration-200"
      style={{ background: hov ? GOLD : 'rgba(255,255,255,0.07)', color: hov ? BG : 'white', transform: hov ? 'translateY(-2px)' : 'translateY(0)', border: `1px solid ${hov ? GOLD : 'rgba(255,255,255,0.08)'}` }}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
    >{children}</a>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   APP ROOT
───────────────────────────────────────────────────────────────────────────── */
export default function App() {
  return (
    <div className="font-body" style={{ background: BG }}>
      {/* ① Scroll progress */}
      <ScrollProgress />
      {/* ② Film grain */}
      <GrainOverlay />
      {/* ③ Cursor trail */}
      <CursorTrail />
      {/* ④ Floating CTA */}
      <FloatingCTA />

      <Navbar />
      <main>
        <Hero />
        <MarqueeStrip />
        <StatsStrip />
        <WhyChooseUs />
        <Services />
        <About />
        <Process />
        <Reviews />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
