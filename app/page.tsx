'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  ChevronDown,
  Moon,
  Sun,
  ArrowUpRight,
  Check,
  Brain,
  MousePointer2,
  Link2,
  ShieldCheck,
  Sparkles,
  Zap,
  Building2,
  Menu,
  X,
  Mail,
  Phone,
  Search,
  BookOpen,
  Wrench,
  Settings2,
  GraduationCap,
  MessageSquare,
  Key,
  Mic,
  Compass,
  BarChart2,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { applyTheme } from '@/lib/theme';
import { useGeoCurrency } from '@/hooks/useGeoCurrency';
import RazorpayCheckout from '@/components/RazorpayCheckout';
import Aurora from '@/components/Aurora';

const logos = [
  'Physics',
  'Chemistry',
  'Biology',
  'Mathematics',
  'Computer Science',
  'Medicine',
  'Law',
  'Engineering',
];

/** Plans without prices — prices are injected dynamically by useGeoCurrency */
const PLANS = [
  {
    name: 'Free',
    tier: 'free' as const,
    eyebrow: 'For students getting started',
    action: 'Start Learning for Free',
    href: 'https://emate-ai.vercel.app',
    icon: 'sparkles',
    tagline: 'Explore e-Mate and build your first flashcards.',
    note: 'Free forever · No credit card',
    features: ['5 daily queries', 'Basic notebook uploads', 'OpenRouter BYOK support'],
  },
  {
    name: 'Growth',
    tier: 'growth' as const,
    eyebrow: 'For power learners',
    action: 'Start Learning for Free',
    href: 'https://emate-ai.vercel.app',
    featured: true,
    icon: 'zap',
    tagline: 'Your full AI study copilot with unlimited momentum.',
    note: 'Bill monthly · Cancel anytime',
    features: [
      'AI Image & Visual Note Generation (e-Mate Plus)',
      '25 active agents',
      '150 simulation runs',
      'Full RAG & active recall loops',
      'Nitro routing',
    ],
  },
  {
    name: 'Scale',
    tier: 'scale' as const,
    eyebrow: 'For teams & enterprises',
    action: 'Contact sales',
    href: 'https://emate-ai.vercel.app',
    icon: 'building',
    tagline: 'Dedicated infrastructure for org-wide studying.',
    note: 'Annual billing · SSO & support',
    features: [
      'Unlimited active agents',
      'Unlimited simulations',
      'Dedicated workspaces',
      'Enterprise security',
    ],
  },
];

const styles = `
.site{--ink:#303030;--muted:#929292;--line:#e5e7eb;--accent:#1f51ff;--accent-bright:#1f51ff;background:#fff;color:var(--ink);font-family:Arial,Helvetica,sans-serif;min-height:100vh;overflow-x:hidden;padding-bottom:env(safe-area-inset-bottom)}.site.dark{--ink:#f4f4f4;--muted:#a3a3a3;--line:#383838;--accent-bright:#8aa2ff;background:#171717;color:var(--ink)}.site *{box-sizing:border-box}.nav-shell{height:64px;margin:12px auto 0;max-width:calc(100% - 56px);border:1px solid var(--line);border-radius:999px;display:flex;align-items:center;justify-content:space-between;padding:0 20px;position:sticky;top:12px;z-index:40;background:#fff;box-shadow:0 2px 4px #0000000b;animation:navIn .5s cubic-bezier(.16,.84,.32,1) both}.site.dark .nav-shell{background:#171717}.brand{display:flex;align-items:center;gap:10px;color:inherit;text-decoration:none;font-size:20px;letter-spacing:-.5px;min-height:44px}.brand-mark{height:26px;width:26px;display:flex;align-items:center;justify-content:center;color:var(--accent-bright);flex-shrink:0}.brand-mark img{width:26px;height:26px;display:block;object-fit:contain}.nav-shell nav{display:flex;gap:30px;margin:0 auto}.nav-shell nav a{color:var(--muted);font-size:15px;text-decoration:none;min-height:44px;display:inline-flex;align-items:center}.nav-actions{display:flex;align-items:center;gap:16px;justify-content:flex-end}.icon-button{border:0;background:none;color:var(--muted);cursor:pointer;min-height:44px;min-width:44px;display:inline-flex;align-items:center;justify-content:center}.button{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;border-radius:999px;padding:10px 18px;font-size:14px;line-height:1;min-height:44px;cursor:pointer;transition:transform .2s,background .2s}.button:hover{transform:translateY(-2px)}.dark-button{background:#222;color:#fff}.site.dark .dark-button{background:#fff;color:#222}.outline-button{border:1px solid var(--line);color:inherit;background:transparent}.accent-button{background:var(--accent);color:#fff;border:0}.section-frame{border-bottom:1px solid var(--line)}.hero{position:relative;overflow:hidden;isolation:isolate;text-align:center;min-height:520px;padding:120px 24px 72px}.kicker{color:var(--accent-bright);font-size:16px;margin:0 0 16px}.kicker.shine{color:transparent;background-image:linear-gradient(110deg,var(--accent-bright) 35%,#9fb4ff 50%,var(--accent-bright) 75%);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;animation:kickerShine 2s linear infinite,fadeUp .7s cubic-bezier(.16,.84,.32,1) both}
@keyframes kickerShine{0%{background-position:200% 0}100%{background-position:-200% 0}}.hero h1{font-size:52px;line-height:1.1;letter-spacing:-2px;font-weight:500;margin:0;animation:fadeUp .7s cubic-bezier(.16,.84,.32,1) .08s both}.hero h1 em{font-style:normal;color:var(--accent-bright)}.hero-copy{font-size:18px;line-height:1.6;color:var(--muted);margin:24px 0;animation:fadeUp .7s cubic-bezier(.16,.84,.32,1) .16s both}.button-row{display:flex;gap:12px;justify-content:center;animation:fadeUp .7s cubic-bezier(.16,.84,.32,1) .24s both}.hero-orbs{position:absolute;inset:0;z-index:-1;pointer-events:none}.hero-orbs i{position:absolute;border-radius:50%;filter:blur(64px);opacity:.5;will-change:transform}.hero-orbs i:nth-child(1){width:340px;height:340px;left:-90px;top:-70px;background:radial-gradient(circle,var(--accent),transparent 65%);animation:orbit1 24s ease-in-out infinite alternate}.hero-orbs i:nth-child(2){width:300px;height:300px;right:-80px;top:14%;background:radial-gradient(circle,#3782f5,transparent 65%);animation:orbit2 28s ease-in-out infinite alternate}.hero-orbs i:nth-child(3){width:200px;height:200px;left:14%;bottom:-60px;background:radial-gradient(circle,#9fb4ff,transparent 65%);animation:orbit3 22s ease-in-out infinite alternate}.site.dark .hero-orbs i{opacity:.38}@keyframes orbit1{from{transform:translate(0,0) scale(1)}to{transform:translate(60px,40px) scale(1.08)}}@keyframes orbit2{from{transform:translate(0,0) scale(1)}to{transform:translate(-50px,30px) scale(.94)}}@keyframes orbit3{from{transform:translate(0,0) scale(1)}to{transform:translate(40px,-46px) scale(1.06)}}.feature-intro{text-align:center;padding:80px 24px 80px}.feature-intro .kicker{margin-bottom:16px}.feature-intro h2,.how h2{font-size:38px;font-weight:500;letter-spacing:-1.5px;margin:0 0 18px}.feature-intro>p:last-child,.how>p:last-of-type{font-size:17px;line-height:1.6;color:var(--muted);margin:0}.feature-grid{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid var(--line)}.feature-grid article{min-height:420px;padding:48px 40px;border-right:1px solid var(--line);overflow:hidden}.feature-grid article:last-child{border-right:0}.feature-title{display:flex;gap:12px;align-items:center}.feature-title h3{font-size:22px;font-weight:500;margin:0}.feature-grid article>p{font-size:16px;color:var(--muted);line-height:1.6;max-width:640px}.model-window,.chat-window{margin:36px 0 0;border:1px solid var(--line);border-radius:18px;width:100%;height:auto;box-shadow:0 10px 24px #0000000c;position:relative;background:#fff}.site.dark .model-window,.site.dark .chat-window{background:#202020}.window-dots{display:flex;gap:10px;padding:14px 18px}.window-dots b{width:10px;height:10px;border-radius:50%;background:#ff2f3d}.window-dots b:nth-child(2){background:#ffb800}.window-dots b:nth-child(3){background:#06c75b}.model-list{border-top:1px solid var(--line);display:flex;flex-direction:column;gap:12px;padding:16px 18px;font-size:14px}.model-list span{display:flex;align-items:center;gap:8px}.model-list small,.model-list strong{margin-left:auto;color:var(--muted);font-weight:400}.chat-window{background:radial-gradient(110% 110% at 50% 0%,#e4ebff 0%,transparent 68%);display:flex;align-items:flex-end;justify-content:flex-end;padding:20px;min-height:160px}.site.dark .chat-window{background:radial-gradient(110% 110% at 50% 0%,#1c2a5e 0%,transparent 68%)}.chat-bubble{background:#3782f5;color:#fff;border-radius:18px;padding:16px;font-size:15px;line-height:1.5}.trusted{text-align:center}.mono-label{font:600 11px/1.2 monospace;color:var(--muted);letter-spacing:1.5px;text-align:center;margin:0;padding:40px 16px 28px}.logo-grid{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--line)}.logo{height:120px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:500;color:#333}.site.dark .logo{color:#ddd}.logo:nth-child(4n){border-right:0}.logo-0:before{content:'⚡';background:#444;color:#fff;border-radius:6px;padding:3px;margin-right:8px}.logo-1{font-weight:800;font-size:26px}.logo-2{font-weight:700}.logo-4{font-size:16px}.logo-5{font-weight:700}.how{text-align:center;padding:80px 24px 56px}.how .kicker{margin-bottom:16px}.how h2{margin-bottom:18px}.integration-card{max-width:640px;height:96px;border:1px solid var(--line);border-radius:18px;margin:32px auto 0;display:flex;align-items:center;justify-content:space-between;padding:24px 28px;font-size:16px;text-align:left}.faq{text-align:left;max-width:960px;margin:0 auto;padding:72px 24px 80px}.faq .kicker{font-size:14px;margin-bottom:10px;text-align:left}.faq h2{font-size:32px;font-weight:500;letter-spacing:-1px;margin:0 0 12px;text-align:left}.faq>p{color:var(--muted);line-height:1.6;font-size:15px;margin:0 0 24px;text-align:left}.faq .button-row{display:flex;gap:12px;justify-content:flex-start;margin-bottom:40px}.faq-list{margin-top:20px;text-align:left;border-top:1px solid var(--line)}.faq-row{width:100%;display:flex;flex-direction:column;border:0;border-bottom:1px solid var(--line);background:transparent;color:inherit;padding:20px 8px;font-size:15px;text-align:left;cursor:pointer;transition:background .2s}.faq-row-header{display:flex;justify-content:space-between;align-items:center;width:100%;font-weight:500;gap:16px}.faq-row .rotate{transform:rotate(180deg);transition:transform .2s}.answer{color:var(--muted);font-size:14px;line-height:1.6;margin-top:12px;padding-right:24px;text-align:left}.final-cta{text-align:center;min-height:360px;padding:72px 24px 56px;overflow:hidden}.final-cta h2{font-size:34px;line-height:1.15;letter-spacing:-1px;font-weight:500;margin:48px 0 20px}.final-cta h2 em{font-style:normal;color:var(--accent-bright)}.orbit{height:22px;position:relative;max-width:300px;margin:auto;border-radius:50%;box-shadow:0 -24px 0 -23px var(--line),0 -56px 0 -55px var(--line),0 -88px 0 -87px var(--line)}.orbit span{position:absolute;background:#fff;border:1px solid var(--line);padding:6px;border-radius:6px}.site.dark .orbit span{background:#171717}.orbit span:nth-child(1){left:24%;top:5px}.orbit span:nth-child(2){left:48%;top:-14px}.orbit span:nth-child(3){right:16%;top:6px}footer{display:flex;justify-content:space-between;padding:22px 7%;color:var(--muted);font-size:13px}@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}@keyframes navIn{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:none}}html.js [data-reveal]{opacity:0;transform:translateY(18px);transition:opacity .7s cubic-bezier(.16,.84,.32,1),transform .7s cubic-bezier(.16,.84,.32,1)}html.js [data-reveal].in{opacity:1;transform:none}.feature-grid article[data-reveal]:nth-child(2){transition-delay:.1s}.button:active{transform:translateY(0) scale(.97)}.integration-card svg{transition:transform .25s}.integration-card:hover svg{transform:translate(2px,-2px)}@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}html.js [data-reveal]{opacity:1!important;transform:none!important}.hero-orbs i{animation:none!important}}@media(max-width:800px){.hero-orbs i:nth-child(1){width:230px;height:230px;left:-70px;top:-40px}.hero-orbs i:nth-child(2){width:210px;height:210px;right:-60px;top:20%}.hero-orbs i:nth-child(3){width:150px;height:150px;left:6%;bottom:10%}.nav-shell{max-width:calc(100% - 24px);height:56px;border-radius:18px}.brand{font-size:18px;gap:8px}.brand-mark{transform:scale(.8);transform-origin:left center;width:22px}.nav-shell nav{display:none}.nav-actions{gap:10px}.nav-actions .button{padding:9px 14px;font-size:13px}.hero{padding-top:88px;min-height:440px}.hero h1{font-size:34px;letter-spacing:-1px}.hero-copy{font-size:16px}.kicker{font-size:14px}.feature-intro h2,.how h2{font-size:28px}.feature-intro>p:last-child,.how>p:last-of-type{font-size:16px}.feature-grid{grid-template-columns:1fr}.feature-grid article{border-right:0;border-bottom:1px solid var(--line);padding:32px 24px;min-height:auto}.feature-title h3{font-size:20px}.feature-grid article>p{font-size:15px}.logo-grid{grid-template-columns:repeat(2,1fr)}.logo{height:80px;font-size:16px}.logo:nth-child(4n){border-right:1px solid var(--line)}.logo:nth-child(2n){border-right:0}.final-cta h2{font-size:26px}footer{display:block;line-height:2}.desktop{display:none}}
`;

export default function LandingPage() {
  const [dark, setDark] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'product' | 'features' | null>(null);
  const [mobileProductOpen, setMobileProductOpen] = useState(false);
  const [mobileFeaturesOpen, setMobileFeaturesOpen] = useState(false);
  const { currency, toggleCurrency, formatTierPrice } = useGeoCurrency();

  // Timeout handler for smooth dropdown hover experience
  let timeoutId: NodeJS.Timeout;
  const handleMouseEnter = (type: 'product' | 'features') => {
    clearTimeout(timeoutId);
    setActiveDropdown(type);
  };

  const handleMouseLeave = () => {
    timeoutId = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  useEffect(() => {
    const updateTheme = () => {
      let savedTheme: string | null = null;
      try {
        savedTheme = localStorage.getItem('nk-theme');
      } catch (_) {}
      setDark((savedTheme || 'light') === 'dark');
    };

    updateTheme();

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'nk-theme') updateTheme();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    const t = next ? 'dark' : 'light';
    try {
      localStorage.setItem('nk-theme', t);
    } catch (_) { }
    applyTheme(t);
    window.dispatchEvent(new Event('storage'));
  };

  useEffect(() => {
    document.documentElement.classList.add('js');
    if (
      typeof window.matchMedia !== 'function' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    )
      return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const faqs = [
    {
      q: 'What exactly does e-Mate AI do?',
      a: 'e-Mate AI is an all-in-one AI study workspace that transforms your textbooks, lecture slides, and notes into interactive flashcards, practice quizzes, and automated active recall study loops.',
    },
    {
      q: 'What is wisp and how does it integrate with e-Mate?',
      a: 'wisp is an AI coding and automated execution workspace by emate. It allows you to generate code, build tools, and run interactive programming workflows alongside your study materials.',
    },
    {
      q: 'How does the BYOK (Bring Your Own Key) OpenRouter integration work?',
      a: 'You can seamlessly connect your personal OpenRouter API key via 1-click authentication. This allows you to leverage top-tier LLM models (Claude 3.5 Sonnet, GPT-4o, Llama 3) with zero platform markup.',
    },
    {
      q: 'How does Study Mode accelerate active recall?',
      a: 'Study Mode uses spaced repetition algorithms and adaptive AI quizzes that identify your knowledge gaps and test you on key concepts right before you forget them.',
    },
    {
      q: 'Can I upload my own lecture notes, PDFs, and textbooks into Notebook?',
      a: 'Yes! Notebook supports PDF uploads, lecture transcripts, research papers, and markdown notes. Our Nitro RAG engine indexes your documents so you can instantly query and summarize your material.',
    },
    {
      q: 'Is my uploaded study data private and secure?',
      a: 'Security and privacy are paramount. Your data is encrypted at rest and in transit. We strictly adhere to privacy standards and never use your personal notes or uploads to train public AI models.',
    },
    {
      q: 'Does e-Mate offer a free plan?',
      a: 'Yes! e-Mate includes a free tier with daily query allowances, basic notebook uploads, and full BYOK support. You can upgrade to Growth or Scale anytime for higher model quotas and active agents.',
    },
  ];

  return (
    <main className={dark ? 'site dark' : 'site'}>
      <style>{styles}</style>
      {/* Floating Pill Navbar */}
      <header
        className="fixed z-50 transition-all duration-500"
        style={{
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 48px)',
          maxWidth: '1080px',
          borderRadius: '999px',
          background: dark
            ? 'rgba(23, 23, 23, 0.55)'
            : 'rgba(255, 255, 255, 0.60)',
          backdropFilter: 'blur(24px) saturate(200%)',
          WebkitBackdropFilter: 'blur(24px) saturate(200%)',
          border: dark
            ? '1px solid rgba(255,255,255,0.10)'
            : '1px solid rgba(0,0,0,0.08)',
          boxShadow: dark
            ? '0 8px 32px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.06)'
            : '0 8px 32px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.90)',
          color: dark ? '#fff' : '#111',
        }}
      >
        <div className="px-4 sm:px-6 h-14 flex items-center justify-between text-sm relative">
          {/* Logo */}
          <a
            className="flex items-center gap-2 font-bold tracking-tight hover:opacity-80 transition-opacity shrink-0"
            style={{ color: dark ? '#ffffff' : '#111111', textDecoration: 'none', fontFamily: 'Arial, Helvetica, sans-serif' }}
            href="/" aria-label="e-Mate AI home"
          >
            <Image src="/android-chrome-512x512.png" alt="e-Mate AI Logo" width={30} height={30} className="object-contain" />
            <span className="font-extrabold text-base tracking-tight">emate</span>
          </a>

          {/* Center Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium absolute left-1/2 -translate-x-1/2" style={{ color: dark ? 'rgba(255,255,255,0.75)' : 'rgba(0,0,0,0.62)', fontFamily: 'Arial, Helvetica, sans-serif' }}>
            {/* Product Dropdown Trigger */}
            <div
              className="relative py-4"
              onMouseEnter={() => handleMouseEnter('product')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'product' ? null : 'product')}
                className="flex items-center gap-1 hover:opacity-100 transition-all text-xs font-semibold uppercase tracking-wider"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: '13px', textTransform: 'none', letterSpacing: 'normal', fontWeight: 500 }}
              >
                Product <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'product' ? 'rotate-180 text-blue-500' : 'opacity-60'}`} />
              </button>

              {/* Transparent Dropdown Menu - Product */}
              {activeDropdown === 'product' && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-80 rounded-2xl p-3 shadow-2xl transition-all duration-200 animate-in fade-in slide-in-from-top-2"
                  style={{
                    background: dark ? 'rgba(20, 20, 25, 0.75)' : 'rgba(255, 255, 255, 0.82)',
                    backdropFilter: 'blur(28px) saturate(210%)',
                    WebkitBackdropFilter: 'blur(28px) saturate(210%)',
                    border: dark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.08)',
                    boxShadow: dark ? '0 20px 40px -15px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)' : '0 20px 40px -15px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
                  }}
                >
                  <div className="flex flex-col gap-1">
                    {/* Item 1: emate */}
                    <a
                      href="#emate"
                      onClick={() => setActiveDropdown(null)}
                      className="group flex flex-col p-2.5 rounded-xl transition-all text-left no-underline"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = dark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(31, 81, 255, 0.06)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm" style={{ color: dark ? '#fff' : '#111' }}>emate</span>
                        <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md" style={{
                          background: dark ? 'rgba(31,81,255,0.25)' : 'rgba(31,81,255,0.1)',
                          color: dark ? '#8aa2ff' : '#1f51ff',
                        }}>Core</span>
                      </div>
                      <p className="text-xs leading-snug mt-1 m-0" style={{ color: dark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)' }}>
                        AI study workspace with active recall, RAG & smart flashcards.
                      </p>
                    </a>

                    {/* Item 2: wisp */}
                    <a
                      href="#wisp"
                      onClick={() => setActiveDropdown(null)}
                      className="group flex flex-col p-2.5 rounded-xl transition-all text-left no-underline"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = dark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(31, 81, 255, 0.06)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm" style={{ color: dark ? '#fff' : '#111' }}>wisp</span>
                        <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-md" style={{
                          background: dark ? 'rgba(168,85,247,0.25)' : 'rgba(168,85,247,0.1)',
                          color: dark ? '#c084fc' : '#9333ea',
                        }}>New</span>
                      </div>
                      <p className="text-xs leading-snug mt-1 m-0" style={{ color: dark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)' }}>
                        AI coding & automated execution workspace by emate.
                      </p>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Features Dropdown Trigger */}
            <div
              className="relative py-4"
              onMouseEnter={() => handleMouseEnter('features')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => setActiveDropdown(activeDropdown === 'features' ? null : 'features')}
                className="flex items-center gap-1 hover:opacity-100 transition-all text-xs font-semibold uppercase tracking-wider"
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontSize: '13px', textTransform: 'none', letterSpacing: 'normal', fontWeight: 500 }}
              >
                Features <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === 'features' ? 'rotate-180 text-blue-500' : 'opacity-60'}`} />
              </button>

              {/* Transparent Dropdown Menu - Features */}
              {activeDropdown === 'features' && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-88 md:w-[420px] rounded-2xl p-3 shadow-2xl transition-all duration-200 animate-in fade-in slide-in-from-top-2"
                  style={{
                    background: dark ? 'rgba(20, 20, 25, 0.75)' : 'rgba(255, 255, 255, 0.82)',
                    backdropFilter: 'blur(28px) saturate(210%)',
                    WebkitBackdropFilter: 'blur(28px) saturate(210%)',
                    border: dark ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid rgba(0, 0, 0, 0.08)',
                    boxShadow: dark ? '0 20px 40px -15px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)' : '0 20px 40px -15px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)',
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5">
                    {/* Item 1: study mode */}
                    <a
                      href="#study-mode"
                      onClick={() => setActiveDropdown(null)}
                      className="group flex flex-col p-2.5 rounded-xl transition-all text-left no-underline"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = dark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(31, 81, 255, 0.06)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <span className="font-semibold text-sm block" style={{ color: dark ? '#fff' : '#111' }}>study mode</span>
                      <p className="text-xs leading-snug mt-1 m-0" style={{ color: dark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)' }}>
                        Spaced recall, quiz creation & adaptive AI prep.
                      </p>
                    </a>

                    {/* Item 2: notebook */}
                    <a
                      href="#notebook"
                      onClick={() => setActiveDropdown(null)}
                      className="group flex flex-col p-2.5 rounded-xl transition-all text-left no-underline"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = dark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(31, 81, 255, 0.06)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <span className="font-semibold text-sm block" style={{ color: dark ? '#fff' : '#111' }}>notebook</span>
                      <p className="text-xs leading-snug mt-1 m-0" style={{ color: dark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)' }}>
                        Upload PDFs, lecture slides & multimedia notes.
                      </p>
                    </a>

                    {/* Item 3: BYOK */}
                    <a
                      href="#byok"
                      onClick={() => setActiveDropdown(null)}
                      className="group flex flex-col p-2.5 rounded-xl transition-all text-left no-underline"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = dark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(31, 81, 255, 0.06)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm" style={{ color: dark ? '#fff' : '#111' }}>BYOK</span>
                        <span className="text-[10px] font-semibold px-1 rounded" style={{ background: dark ? 'rgba(234,179,8,0.2)' : 'rgba(234,179,8,0.1)', color: dark ? '#facc15' : '#ca8a04' }}>OpenRouter</span>
                      </div>
                      <p className="text-xs leading-snug mt-1 m-0" style={{ color: dark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)' }}>
                        Connect custom OpenRouter API keys with 0 markup.
                      </p>
                    </a>

                    {/* Item 4: All Features / RAG */}
                    <a
                      href="#features"
                      onClick={() => setActiveDropdown(null)}
                      className="group flex flex-col p-2.5 rounded-xl transition-all text-left no-underline"
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = dark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(31, 81, 255, 0.06)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-sm" style={{ color: dark ? '#fff' : '#111' }}>Explore All</span>
                        <ChevronRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                      <p className="text-xs leading-snug mt-1 m-0" style={{ color: dark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.55)' }}>
                        Discover nitro RAG, simulation runs & analytics.
                      </p>
                    </a>
                  </div>
                </div>
              )}
            </div>

            <a href="#pricing" className="hover:opacity-100 transition-opacity" style={{ color: 'inherit', textDecoration: 'none', fontSize: '13px' }}>
              Pricing
            </a>
            <a href="/sign-up-login-screen" className="hover:opacity-100 transition-opacity" style={{ color: 'inherit', textDecoration: 'none', fontSize: '13px' }}>
              Sign In
            </a>
            <a href="#blog" className="hover:opacity-100 transition-opacity" style={{ color: 'inherit', textDecoration: 'none', fontSize: '13px' }}>
              Support
            </a>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <button
              className="p-1.5 rounded-full transition-opacity hover:opacity-100"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: dark ? 'rgba(255,255,255,0.65)' : 'rgba(0,0,0,0.50)' }}
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <a
              href="https://emate-ai.vercel.app"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all hover:scale-105"
              style={{
                background: dark ? '#1f51ff' : '#1f51ff',
                color: '#fff',
                textDecoration: 'none',
                fontFamily: 'Arial, Helvetica, sans-serif',
                boxShadow: '0 2px 12px rgba(31,81,255,0.35)',
              }}
            >
              Try e-mate <ArrowUpRight size={14} />
            </a>
            <button
              className="md:hidden p-1.5"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: dark ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.7)' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer menu */}
      {mobileMenuOpen && (
        <div className={`fixed inset-0 z-50 p-6 flex flex-col justify-between animate-in fade-in duration-200 lg:hidden overflow-y-auto ${dark ? 'bg-[#171717] text-white' : 'bg-white text-slate-900'
          }`}>
          <div className="flex items-center justify-between">
            <a className="brand" href="/" aria-label="e-Mate AI home">
              <span className="brand-mark" aria-hidden="true">
                <Image src="/android-chrome-512x512.png" alt="e-Mate AI Logo" width={32} height={32} className="object-contain bg-transparent" loading="lazy" />
              </span>
              <span className="font-bold text-xl">emate</span>
            </a>
            <button
              className="icon-button p-2"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close mobile menu"
            >
              <X size={24} />
            </button>
          </div>

          <div className={`flex flex-col gap-4 text-left my-6 ${dark ? 'text-slate-200' : 'text-slate-700'}`}>
            {/* Mobile Product Accordion */}
            <div>
              <button
                onClick={() => setMobileProductOpen(!mobileProductOpen)}
                className="w-full flex items-center justify-between py-2 text-lg font-semibold"
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
              >
                <span>Product</span>
                <ChevronDown size={18} className={`transition-transform ${mobileProductOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileProductOpen && (
                <div className="pl-4 flex flex-col gap-2.5 py-2 text-base border-l-2 border-blue-500 my-1">
                  <a href="#emate" onClick={() => setMobileMenuOpen(false)} className="py-1">
                    <span>emate</span>
                  </a>
                  <a href="#wisp" onClick={() => setMobileMenuOpen(false)} className="py-1">
                    <span>wisp</span>
                  </a>
                </div>
              )}
            </div>

            {/* Mobile Features Accordion */}
            <div>
              <button
                onClick={() => setMobileFeaturesOpen(!mobileFeaturesOpen)}
                className="w-full flex items-center justify-between py-2 text-lg font-semibold"
                style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
              >
                <span>Features</span>
                <ChevronDown size={18} className={`transition-transform ${mobileFeaturesOpen ? 'rotate-180' : ''}`} />
              </button>
              {mobileFeaturesOpen && (
                <div className="pl-4 flex flex-col gap-2.5 py-2 text-base border-l-2 border-green-500 my-1">
                  <a href="#study-mode" onClick={() => setMobileMenuOpen(false)} className="py-1">
                    <span>study mode</span>
                  </a>
                  <a href="#notebook" onClick={() => setMobileMenuOpen(false)} className="py-1">
                    <span>notebook</span>
                  </a>
                  <a href="#byok" onClick={() => setMobileMenuOpen(false)} className="py-1">
                    <span>BYOK</span>
                  </a>
                  <a href="#features" onClick={() => setMobileMenuOpen(false)} className="py-1 font-medium text-blue-500">
                    <span>View all features →</span>
                  </a>
                </div>
              )}
            </div>

            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="py-2 text-lg font-semibold">Pricing</a>
            <a href="/sign-up-login-screen" onClick={() => setMobileMenuOpen(false)} className="py-2 text-lg font-semibold">Sign In</a>
            <a href="#blog" onClick={() => setMobileMenuOpen(false)} className="py-2 text-lg font-semibold">Support</a>
          </div>

          <div className="flex flex-col gap-3">
            <a
              className="w-full py-3 rounded-full text-center text-sm font-semibold bg-[#0E71EB] text-white shadow-lg"
              href="/sign-up-login-screen"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sign Up Free
            </a>
            <a
              className={`w-full py-3 rounded-full text-center text-sm font-semibold border ${dark ? 'border-slate-400 text-white' : 'border-slate-300 text-slate-900'
                }`}
              href="/sign-up-login-screen"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact Sales
            </a>
          </div>
        </div>
      )}

      {/* Hero Section (Synced with Light/Dark Theme + Liquid Aurora Shader) */}
      <section id="top" className={`relative w-full pt-32 sm:pt-36 lg:pt-40 pb-24 sm:pb-32 lg:pb-40 overflow-hidden isolate transition-colors duration-300 ${dark ? 'bg-[#171717] text-white' : 'bg-white text-slate-900'
        }`} style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
        {/* Layer 1: Animated Aurora WebGL Wave Shader */}
        <div className="absolute inset-0 pointer-events-none z-0 opacity-90 h-full w-full">
          <Aurora
            colorStops={dark ? ["#1e60cd", "#fefefe", "#0055ff"] : ["#3b82f6", "#93c5fd", "#1d4ed8"]}
            blend={dark ? 0.5 : 0.65}
            amplitude={1.3}
            speed={0.6}
            lightMode={!dark}
          />
        </div>

        {/* Layer 2: Center Lighting Glow for Contrast */}
        <div
          className="absolute inset-0 pointer-events-none z-0 opacity-40 mix-blend-screen"
          style={{
            background: dark
              ? 'radial-gradient(ellipse 60% 50% at 50% 28%, rgba(255, 255, 255, 0.2) 0%, rgba(30, 96, 205, 0.4) 50%, transparent 80%)'
              : 'radial-gradient(ellipse 60% 50% at 50% 28%, rgba(255, 255, 255, 0.6) 0%, rgba(147, 197, 253, 0.3) 50%, transparent 80%)'
          }}
          aria-hidden="true"
        />

        {/* Layer 3: Edge Vignette for Text Contrast */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            background: dark
              ? 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(23, 23, 23, 0.80) 100%)'
              : 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(255, 255, 255, 0.75) 100%)'
          }}
          aria-hidden="true"
        />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Main Headline */}
          <h1
            className="max-w-4xl mx-auto"
            style={{
              fontSize: 'clamp(36px, 6vw, 68px)',
              fontWeight: 500,
              lineHeight: 1.1,
              letterSpacing: '-2px',
              color: dark ? 'var(--ink, #f4f4f4)' : 'var(--ink, #303030)',
              marginBlock: 0,
              textAlign: 'center',
            }}
          >
            Study smarter.
            <br />
            <span style={{ color: 'var(--accent-bright, #1f51ff)' }}>AI does the heavy lifting.</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              marginTop: '24px',
              fontSize: '18px',
              lineHeight: 1.6,
              color: dark ? 'var(--muted, #a3a3a3)' : 'var(--muted, #929292)',
              maxWidth: '640px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Upload your notes, textbooks, and slides — e-Mate instantly generates flashcards, quizzes, and RAG study workflows. Built-in AI handles the heavy lifting so you can focus on learning.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4">
            <a href="https://emate-ai.vercel.app" className={`px-8 py-3.5 rounded-full font-semibold text-sm sm:text-base shadow-xl transition-all duration-200 hover:scale-[1.03] ${dark
              ? 'bg-[#1f51ff] hover:bg-blue-500 text-white'
              : 'bg-[#1f51ff] hover:bg-blue-700 text-white'
              }`}>
              Start Learning for Free
            </a>
            <a href="/sign-up-login-screen" className={`px-8 py-3.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-200 hover:scale-[1.03] ${dark
              ? 'bg-transparent hover:bg-white/10 text-white border border-white/30'
              : 'bg-transparent hover:bg-slate-100 text-slate-900 border border-slate-300'
              }`}>
              Request a Demo
            </a>
          </div>

          {/* Bottom Dual Card Graphics Container */}
          <div className="mt-16 sm:mt-24 lg:mt-28 relative max-w-5xl mx-auto px-2">
            {/* Tilted Left Glass Card (Study Note / Flashcard Preview) */}
            <div className="absolute -left-4 sm:-left-12 bottom-6 sm:bottom-12 z-20 w-64 sm:w-80 bg-white/95 backdrop-blur-md dark:bg-slate-900/95 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xl p-4 text-left transform -rotate-3 hover:rotate-0 transition-transform duration-300 text-slate-800 dark:text-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping" />
                  <div>
                    <h4 className="font-bold text-xs leading-tight text-slate-900 dark:text-slate-100">Organic Chemistry Notes</h4>
                    <p className="text-[10px] text-slate-400">RAG Flashcard Generator</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                  Active Recall
                </span>
              </div>

              {/* Note Snippet */}
              <div className="space-y-2.5 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60">
                  <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 block mb-0.5">✦ AI Flashcard</span>
                  <p className="text-slate-700 dark:text-slate-200 text-[11px] font-medium leading-snug">
                    What is the difference between SN1 and SN2 nucleophilic substitution reactions?
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                  <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                    ✓ 24 flashcards generated
                  </span>
                  <span className="text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer">
                    Start Quiz →
                  </span>
                </div>
              </div>

              {/* Floating Badges */}
              <div className="absolute -left-3 -bottom-3 w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center shadow-lg text-xs font-bold border-2 border-white">
                ✨
              </div>
              <div className="absolute -right-2 -top-3 text-lg animate-bounce">
                🔥
              </div>
            </div>

            {/* Main Center e-Mate AI Screen Mockup (Exact Match to User Screenshot) */}
            <div className="w-full bg-white dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-left text-slate-900 dark:text-slate-100">
              {/* Safari / Browser Window Title Bar */}
              <div className="bg-[#f3f4f6] dark:bg-slate-900 px-3 py-2 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 mr-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                  </div>
                  <span className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  </span>
                  <span className="text-slate-400 hover:text-slate-600 cursor-pointer p-0.5">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </span>
                </div>

                {/* Address Bar — clicking or pressing Enter navigates to the real app */}
                <a
                  href="https://emate-ai.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-3 py-1 rounded-lg text-xs border border-slate-200 dark:border-slate-700 w-64 sm:w-96 shadow-sm cursor-pointer hover:border-blue-400 hover:shadow-md transition-all group"
                  title="Open e-Mate AI app"
                >
                  <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  <span className="text-[11px] font-mono truncate group-hover:text-blue-500 transition-colors">emate-ai.vercel.app</span>
                  <Zap size={9} className="ml-auto text-amber-400" />
                </a>

                <div className="flex items-center gap-2 text-slate-400">
                  <span className="hover:text-slate-600 cursor-pointer p-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                  </span>
                  <span className="hover:text-slate-600 cursor-pointer p-1">+</span>
                </div>
              </div>

              {/* Main e-Mate AI Interface Body */}
              <div className="grid grid-cols-12 min-h-[380px] sm:min-h-[440px] bg-slate-50 dark:bg-slate-950 text-xs">
                {/* Left Sidebar (Matches Screenshot) */}
                <div className="col-span-4 sm:col-span-3 border-r border-slate-200/80 dark:border-slate-800 p-3.5 flex flex-col justify-between bg-[#f8fafc] dark:bg-slate-900/60">
                  <div className="space-y-3.5">
                    {/* Brand Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Image src="/android-chrome-512x512.png" alt="e-Mate" width={22} height={22} className="rounded-md object-contain" />
                        <span className="font-bold text-sm text-slate-900 dark:text-slate-100 tracking-tight">e-Mate AI</span>
                      </div>
                      <span className="w-5 h-5 rounded-full bg-slate-200/80 dark:bg-slate-800 flex items-center justify-center text-slate-500 text-xs cursor-pointer hover:bg-slate-300">
                        &lt;
                      </span>
                    </div>

                    {/* Active Workspace Pill */}
                    <div className="bg-slate-200/70 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 font-medium px-2.5 py-1.5 rounded-lg flex items-center gap-2 text-xs">
                      <FileText size={12} className="text-blue-500 shrink-0" />
                      <span className="font-semibold truncate">General Workspace</span>
                    </div>

                    {/* Nav Items */}
                    <div className="space-y-1 text-slate-600 dark:text-slate-400 font-medium text-xs">
                      <a href="https://emate-ai.vercel.app" target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-slate-800/50 cursor-pointer no-underline text-inherit transition-colors">
                        <span className="flex items-center gap-2"><Search size={11} className="opacity-60" /> Search</span>
                        <span className="text-[10px] text-slate-400 font-mono bg-slate-200/60 dark:bg-slate-800 px-1.5 py-0.5 rounded">⌘K</span>
                      </a>
                      <a href="https://emate-ai.vercel.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-1.5 rounded-md hover:bg-blue-50 dark:hover:bg-slate-800/50 cursor-pointer no-underline text-inherit transition-colors">
                        <BookOpen size={11} className="opacity-60" /> Library
                      </a>
                      <div className="flex items-center justify-between p-1.5 rounded-md opacity-50 cursor-not-allowed">
                        <span className="flex items-center gap-2"><Wrench size={11} className="opacity-60" /> Builder X</span>
                        <span className="text-[9px] bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full font-semibold">Soon</span>
                      </div>
                    </div>

                    {/* NOTEBOOKS Section */}
                    <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">
                        <span>Notebooks</span>
                        <span className="text-slate-500 hover:underline cursor-pointer">Manage</span>
                      </div>
                      <button className="w-full py-1.5 px-2.5 border border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 text-[11px] font-medium flex items-center justify-center gap-1.5 hover:bg-white dark:hover:bg-slate-800 transition-colors">
                        + New notebook
                      </button>
                      <div className="mt-2 p-2 rounded-lg bg-slate-100/70 dark:bg-slate-800/40 text-[10px] text-slate-400 text-center">
                        No notebooks yet
                      </div>
                    </div>

                    {/* RECENT Section */}
                    <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Recent</span>
                      <p className="text-[10px] text-slate-400 leading-tight">
                        No recent chats yet. Start a conversation to see it here.
                      </p>
                    </div>
                  </div>

                  {/* Sidebar Footer */}
                  <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium p-1 cursor-pointer hover:text-slate-900">
                      <Settings2 size={12} className="opacity-70" /> Settings
                    </div>
                    <div className="bg-slate-200/60 dark:bg-slate-800/80 p-1.5 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-slate-300 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center text-xs">
                          G
                        </div>
                        <div>
                          <span className="font-semibold text-slate-900 dark:text-slate-100 block text-[11px] leading-none">Guest</span>
                          <span className="text-[9px] text-slate-500">Guest mode</span>
                        </div>
                      </div>
                      <ChevronRight size={13} className="text-slate-400 hover:text-slate-600 cursor-pointer" />
                    </div>
                  </div>
                </div>

                {/* Right Main Content Panel (Matches Screenshot Exactly) */}
                <div className="col-span-8 sm:col-span-9 p-4 sm:p-6 flex flex-col justify-between bg-white dark:bg-slate-950 relative">
                  {/* Top Bar Navigation */}
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                    {/* Left Mode Toggle Pills */}
                    <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1 rounded-xl text-xs font-semibold">
                      <a href="https://emate-ai.vercel.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 hover:bg-white/60 transition-colors no-underline">
                        <GraduationCap size={11} /> Study
                      </a>
                      <a href="https://emate-ai.vercel.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm hover:bg-blue-50 transition-colors no-underline">
                        <MessageSquare size={11} /> General
                      </a>
                    </div>

                    {/* Right Credits & Connect Buttons */}
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 px-2.5 py-1 rounded-full text-[11px] font-medium border border-slate-200/80 dark:border-slate-800">
                        <Zap size={10} className="text-amber-500" /> Free Credits: 18/20
                      </span>
                      <a href="https://emate-ai.vercel.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-sm transition-colors no-underline">
                        <Key size={10} /> Connect
                      </a>
                    </div>
                  </div>

                  {/* Central Content Greeting */}
                  <div className="my-auto py-4 text-center max-w-lg mx-auto w-full">
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                      What can I help you with?
                    </h2>
                    <p className="mt-1.5 text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                      Ask anything — code, writing, analysis, or just a question.
                    </p>

                    {/* Central Prompt Card — clicking anywhere redirects to app */}
                    <a
                      href="https://emate-ai.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-6 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-lg text-left relative block hover:border-blue-300 hover:shadow-xl transition-all group no-underline"
                    >
                      <p className="text-slate-400 text-xs sm:text-sm select-none group-hover:text-blue-400 transition-colors">
                        Ask anything or type / for commands...
                      </p>

                      <div className="mt-8 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-full text-[11px] font-semibold">
                            <Sparkles size={10} className="text-amber-500" /> Gemini 2.0 Flash
                          </span>
                          <span className="inline-flex items-center gap-1 text-slate-400 text-[10px]">
                            <BarChart2 size={10} /> Quick
                          </span>
                        </div>
                        <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                          <Mic size={14} />
                        </span>
                      </div>
                    </a>

                    {/* Quick Shortcut Buttons */}
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
                      <a href="https://emate-ai.vercel.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-900 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-800 font-medium transition-colors no-underline">
                        <FileText size={11} /> Try Demo Notebook
                      </a>
                      <a href="https://emate-ai.vercel.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-900 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-800 font-medium transition-colors no-underline">
                        <Compass size={11} /> Explain
                      </a>
                      <a href="https://emate-ai.vercel.app" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-900 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-full border border-slate-200/80 dark:border-slate-800 font-medium transition-colors no-underline">
                        <Sparkles size={11} /> Summarize
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Bottom-Right Chat Bubble */}
        <div className="fixed bottom-6 right-6 z-50">
          <a
            href="https://emate-ai.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="w-12 h-12 rounded-full bg-[#0E71EB] hover:bg-blue-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all"
            aria-label="Open e-Mate AI app"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
            </svg>
          </a>
        </div>
      </section>
      <section id="about" className="section-frame feature-intro" data-reveal>
        <p className="kicker">Features</p>
        <h2>
          Built for <em>Agentic &amp; Academic Intelligence</em>
        </h2>
        <p>
          Build, test, and run AI study agents and RAG workflows with a fast
          <br className="desktop" /> visual interface
        </p>
      </section>
      <section className="feature-grid">
        <article data-reveal>
          <div className="feature-title">
            <Brain size={26} />
            <h3>LLM Model Selector</h3>
          </div>
          <p>
            Track real-time activity of agents with detailed records of triggers, tools used,
            outcomes, and timestamps.
          </p>
          <div className="model-window">
            <div className="window-dots">
              <b />
              <b />
              <b />
            </div>
            <div className="model-list">
              <span>
                <Check size={13} /> All Models <small>Nitro + BYOK</small>
              </span>
              <span>
                ✦ Gemini 2.0 Flash <strong>Ultra-Fast</strong>
              </span>
              <span>
                ◉ OpenAI GPT-4o <small>GPT-4o-mini</small>
              </span>
              <span>
                ✦ Claude 3.5 Sonnet <strong>Reasoning</strong>
              </span>
            </div>
          </div>
        </article>
        <article>
          <div className="feature-title">
            <MousePointer2 size={26} />
            <h3>Text to workflow builder</h3>
          </div>
          <p>
            Type natural prompts like &quot;Create a flashcard &amp; summary workflow from my
            uploaded OS notes&quot; to preview logic in a safe sandbox before running.
          </p>
          <div className="chat-window">
            <div className="chat-bubble">
              Create a flashcard &amp; summary
              <br /> workflow from my uploaded notes
            </div>
          </div>
        </article>
      </section>
      <section className="trusted section-frame" data-reveal>
        <p className="mono-label">TRUSTED BY STUDENTS &amp; FAST-MOVING TEAMS</p>
        <div className="logo-grid">
          {logos.map((logo, i) => (
            <div key={logo} className={`logo logo-${i}`}>
              {logo}
            </div>
          ))}
        </div>
      </section>
      <section className="section-frame how" data-reveal>
        <p className="kicker">How it works</p>
        <h2>
          Start learning <em>easily</em>
        </h2>
        <p>
          Upload your notes and let e-Mate turn them into flashcards, quizzes, and study workflows
        </p>
        <div className="integration-card">
          <Link2 size={34} />
          <span>Turn your notes into flashcards &amp; quizzes</span>
          <ArrowUpRight size={24} />
        </div>
      </section>
      <section id="pricing" className="section-frame">
        <div className="w-full max-w-6xl mx-auto px-4 py-12 flex flex-col items-center justify-center">
          {/* Currency toggle */}
          <div className="flex items-center justify-center gap-3 my-8">
            <span className="text-sm font-medium text-zinc-500">Pricing in</span>
            <button
              type="button"
              role="switch"
              aria-checked={currency.currency === 'INR'}
              onClick={toggleCurrency}
              className="relative inline-flex h-9 w-28 shrink-0 cursor-pointer items-center rounded-full bg-zinc-200/80 p-1 transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:bg-zinc-800"
            >
              <span
                className={`absolute left-1 top-1 flex h-7 w-12 items-center justify-center rounded-full bg-blue-600 text-[11px] font-bold text-white shadow-sm transition-transform duration-200 ease-in-out ${currency.currency === 'INR' ? 'translate-x-[52px]' : 'translate-x-0'
                  }`}
              >
                {currency.currency}
              </span>
              <span className="flex w-full items-center justify-between px-3 text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                <span className={currency.currency === 'USD' ? 'opacity-0' : 'opacity-100'}>USD</span>
                <span className={currency.currency === 'INR' ? 'opacity-0' : 'opacity-100'}>INR</span>
              </span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch w-full mt-4">
            {PLANS.map((plan) => {
              const featured = !!plan.featured;
              const price = formatTierPrice(plan.tier);
              const cardClass = featured
                ? 'relative bg-white dark:bg-zinc-900 border-2 border-blue-500/80 rounded-3xl p-8 shadow-xl flex flex-col justify-between transform md:-translate-y-2'
                : 'bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between';

              const iconMap: Record<string, typeof Zap> = {
                sparkles: Sparkles,
                zap: Zap,
                building: Building2,
              };
              const PlanIcon = iconMap[plan.icon] ?? Sparkles;

              return (
                <article key={plan.name} data-reveal className={cardClass}>
                  {featured && (
                    <>
                      <div
                        className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none"
                        aria-hidden="true"
                      >
                        <div
                          className="absolute -top-24 -right-16 w-64 h-64 rounded-full opacity-40 blur-3xl"
                          style={{ background: 'radial-gradient(circle,#1f51ff,transparent 70%)' }}
                        />
                      </div>
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm z-10">
                        Most Popular
                      </span>
                    </>
                  )}

                  <div className="relative">
                    <div className="flex items-center gap-3">
                      <div
                        className={
                          'flex h-11 w-11 items-center justify-center rounded-xl shrink-0 ' +
                          (featured
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300 ring-1 ring-blue-600/10')
                        }
                      >
                        <PlanIcon size={20} strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                          {plan.name}
                        </h3>
                        <p className="text-xs text-zinc-500">{plan.eyebrow}</p>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 mt-5">
                      {plan.tagline}
                    </p>

                    <div className="mt-4 flex items-baseline gap-1">
                      <span className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        {price}
                      </span>
                      {plan.tier !== 'free' && (
                        <span className="text-sm text-zinc-500">/ seat / mo</span>
                      )}
                    </div>
                  </div>

                  <div className="relative mt-6">
                    {plan.tier === 'free' ? (
                      <a
                        href={plan.href}
                        className={
                          featured
                            ? 'w-full py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md transition-all block text-center'
                            : 'w-full py-3 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors block text-center'
                        }
                      >
                        {plan.action}
                      </a>
                    ) : plan.tier === 'growth' && currency.currency === 'INR' ? (
                      <RazorpayCheckout
                        amount={699}
                        planTier="growth"
                        className={
                          featured
                            ? 'w-full py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md transition-all block text-center'
                            : 'w-full py-3 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors block text-center'
                        }
                      >
                        {plan.action} · ₹699/mo
                      </RazorpayCheckout>
                    ) : plan.tier === 'scale' && currency.currency === 'INR' ? (
                      <RazorpayCheckout
                        amount={2099}
                        planTier="scale"
                        className="w-full py-3 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors block text-center"
                      >
                        {plan.action} · ₹2,099/mo
                      </RazorpayCheckout>
                    ) : (
                      <a
                        href="/sign-up-login-screen"
                        className={
                          featured
                            ? 'w-full py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md transition-all block text-center'
                            : 'w-full py-3 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors block text-center'
                        }
                      >
                        {plan.action}
                      </a>
                    )}
                  </div>

                  <div className="relative my-6 h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" aria-hidden="true" />

                  <ul className="space-y-3.5 text-sm text-zinc-600 dark:text-zinc-300 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span
                          className={
                            'flex h-5 w-5 items-center justify-center rounded-full shrink-0 mt-0.5 ' +
                            (featured
                              ? 'bg-blue-600 text-white'
                              : 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300')
                          }
                        >
                          <Check className="w-3 h-3" strokeWidth={3} />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <p className="text-center text-xs text-zinc-400 dark:text-zinc-500 mt-6">
                    {plan.note}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section className="mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-800 w-full max-w-4xl mx-auto" data-reveal>
        <p className="mono-label">FOR SECURITY FIRST TEAMS</p>
        <div className="flex items-center justify-between gap-8 py-4">
          <div className="max-w-md">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Scale securely <em>with confidence</em>
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Our AI assistant is designed with enterprise-grade security practices and compliant
              with global data protection standards.
            </p>
            <a
              className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:opacity-90 transition-opacity mt-5"
              href="/sign-up-login-screen"
            >
              Start Learning for Free
            </a>
          </div>
          <div className="flex items-center gap-8 text-zinc-500 dark:text-zinc-400">
            <div className="flex flex-col items-center gap-1.5 text-xs">
              <ShieldCheck size={40} className="text-blue-600 dark:text-blue-400" />
              <span>CCPA</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-xs">
              <ShieldCheck size={40} className="text-blue-600 dark:text-blue-400" />
              <span>GDPR</span>
            </div>
            <div className="flex flex-col items-center gap-1.5 text-xs">
              <ShieldCheck size={40} className="text-blue-600 dark:text-blue-400" />
              <span>ISO</span>
            </div>
          </div>
        </div>
      </section>
      <section className="faq section-frame" data-reveal>
        <p className="kicker">FAQs</p>
        <h2>Frequently Asked Questions</h2>
        <p>
          Find all your doubts and questions in one place. Still couldn&apos;t find what you&apos;re looking for?
        </p>
        <div className="button-row">
          <a className="button dark-button" href="/ai-topper-chat">
            Read Docs
          </a>
          <a className="button outline-button" href="mailto:isachinbisht@gmail.com">
            Contact Us
          </a>
        </div>
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div
              key={faq.q}
              className="faq-row"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setOpenFaq(openFaq === i ? null : i);
                }
              }}
            >
              <div className="faq-row-header">
                <span>{faq.q}</span>
                <ChevronDown size={18} className={`shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate text-blue-500' : 'opacity-60'}`} />
              </div>
              {openFaq === i && (
                <div className="answer animate-in fade-in slide-in-from-top-1 duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      <section id="careers" className="final-cta section-frame" data-reveal>
        <div className="orbit">
          <span>
            <Link2 />
          </span>
          <span>
            <Brain />
          </span>
          <span>
            <MousePointer2 />
          </span>
        </div>
        <h2>
          Upload your syllabus
          <br />
          and Start <em>Learning</em>
        </h2>
        <a className="button dark-button" href="https://emate-ai.vercel.app">
          Start Learning for Free
        </a>
      </section>
      <footer id="blog" className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6 px-8 text-xs sm:text-sm text-zinc-500 border-t border-zinc-200 dark:border-zinc-800">
        <span>© 2026 e-Mate AI. All rights reserved.</span>
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <a href="mailto:isachinbisht@gmail.com" className="hover:underline flex items-center gap-1">
            <Mail size={14} /> isachinbisht@gmail.com
          </a>
          <a href="tel:+91 8860911070" className="hover:underline flex items-center gap-1">
            <Phone size={14} /> +91 8860911070
          </a>
          <a href="#about" className="hover:underline">About</a>
          <a href="#pricing" className="hover:underline">Pricing</a>
        </div>
      </footer>
    </main>
  );
}
