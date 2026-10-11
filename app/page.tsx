'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import {
  ChevronDown,
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
  Key,
  Mic,
  Compass,
  BarChart2,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { applyTheme } from '@/lib/theme';
import RazorpayCheckout from '@/components/RazorpayCheckout';

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

/** Plan details; prices are shown in INR and can be switched to annual billing. */
const PLANS = [
  {
    name: 'e-Mate AI Plus',
    tier: 'plus' as const,
    eyebrow: 'Basic tier',
    action: 'Get e-Mate AI Plus',
    href: 'https://emate-ai.vercel.app',
    icon: 'sparkles',
    tagline: 'More room to learn with powerful everyday study tools.',
    note: 'Billed monthly · Cancel anytime',
    features: ['AI Image & Visual Note Generation', 'Higher usage limits across Flash models', 'Access to Flash Thinking model', '100GB notebook storage'],
  },
  {
    name: 'e-Mate AI Pro',
    tier: 'pro' as const,
    eyebrow: 'Power learner tier',
    action: 'Get e-Mate AI Pro',
    href: 'https://emate-ai.vercel.app',
    featured: true,
    icon: 'zap',
    tagline: 'Full access to advanced models and study tools.',
    note: 'Billed monthly · Cancel anytime',
    features: [
      'Full access to Claude 3.5 Sonnet, DeepSeek R1 & GPT-4o',
      'Higher usage limits than Plus plan',
      'Access to Canvas & notebook study tools',
    ],
  },
  {
    name: 'e-Mate AI Ultra',
    tier: 'ultra' as const,
    eyebrow: 'Enterprise tier',
    action: 'Get e-Mate AI Ultra',
    href: 'https://emate-ai.vercel.app',
    icon: 'building',
    tagline: 'More capacity and dedicated resources for your team.',
    note: 'Billed monthly · Cancel anytime',
    features: [
      'Higher limits than Pro plan',
      'Priority execution & dedicated compute infrastructure',
      'Shared team workspaces',
    ],
  },
];
const MONTHLY_PRICES: Record<(typeof PLANS)[number]['tier'], number> = {
  plus: 100,
  pro: 489,
  ultra: 6500,
};

const styles = `
.site{--ink:#303030;--muted:#929292;--line:#e5e7eb;--accent:#0E71EB;--accent-bright:#0E71EB;background:#fff;color:var(--ink);font-family:Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;min-height:100vh;overflow-x:hidden;padding-bottom:env(safe-area-inset-bottom)}.site.dark{--ink:#f4f4f4;--muted:#a3a3a3;--line:#383838;--accent-bright:#8aa2ff;background:#171717;color:var(--ink)}.site *{box-sizing:border-box}.nav-shell{height:64px;margin:12px auto 0;max-width:calc(100% - 56px);border:1px solid var(--line);border-radius:999px;display:flex;align-items:center;justify-content:space-between;padding:0 20px;position:sticky;top:12px;z-index:40;background:#fff;box-shadow:0 2px 4px #0000000b;animation:navIn .5s cubic-bezier(.16,.84,.32,1) both}.site.dark .nav-shell{background:#171717}.brand{display:flex;align-items:center;gap:10px;color:inherit;text-decoration:none;font-size:20px;letter-spacing:-.5px;min-height:44px}.brand-mark{height:26px;width:26px;display:flex;align-items:center;justify-content:center;color:var(--accent-bright);flex-shrink:0}.brand-mark img{width:26px;height:26px;display:block;object-fit:contain}.nav-shell nav{display:flex;gap:30px;margin:0 auto}.nav-shell nav a{color:var(--muted);font-size:15px;text-decoration:none;min-height:44px;display:inline-flex;align-items:center}.nav-actions{display:flex;align-items:center;gap:16px;justify-content:flex-end}.icon-button{border:0;background:none;color:var(--muted);cursor:pointer;min-height:44px;min-width:44px;display:inline-flex;align-items:center;justify-content:center}.button{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;border-radius:999px;padding:10px 18px;font-size:14px;line-height:1;min-height:44px;cursor:pointer;transition:transform .2s,background .2s}.button:hover{transform:translateY(-2px)}.dark-button{background:#222;color:#fff}.site.dark .dark-button{background:#fff;color:#222}.outline-button{border:1px solid var(--line);color:inherit;background:transparent}.accent-button{background:var(--accent);color:#fff;border:0}.section-frame{border-bottom:1px solid var(--line)}.hero{position:relative;overflow:hidden;isolation:isolate;text-align:center;min-height:520px;padding:120px 24px 72px}.kicker{color:var(--accent-bright);font-size:16px;margin:0 0 16px}.kicker.shine{color:transparent;background-image:linear-gradient(110deg,var(--accent-bright) 35%,#9fb4ff 50%,var(--accent-bright) 75%);background-size:200% 100%;-webkit-background-clip:text;background-clip:text;animation:kickerShine 2s linear infinite,fadeUp .7s cubic-bezier(.16,.84,.32,1) both}
@keyframes kickerShine{0%{background-position:200% 0}100%{background-position:-200% 0}}.hero h1{font-size:52px;line-height:1.1;letter-spacing:-2px;font-weight:500;margin:0;animation:fadeUp .7s cubic-bezier(.16,.84,.32,1) .08s both}.hero h1 em{font-style:normal;color:var(--accent-bright)}.hero-copy{font-size:18px;line-height:1.6;color:var(--muted);margin:24px 0;animation:fadeUp .7s cubic-bezier(.16,.84,.32,1) .16s both}.button-row{display:flex;gap:12px;justify-content:center;animation:fadeUp .7s cubic-bezier(.16,.84,.32,1) .24s both}.hero-orbs{position:absolute;inset:0;z-index:-1;pointer-events:none}.hero-orbs i{position:absolute;border-radius:50%;filter:blur(64px);opacity:.5;will-change:transform}.hero-orbs i:nth-child(1){width:340px;height:340px;left:-90px;top:-70px;background:radial-gradient(circle,var(--accent),transparent 65%);animation:orbit1 24s ease-in-out infinite alternate}.hero-orbs i:nth-child(2){width:300px;height:300px;right:-80px;top:14%;background:radial-gradient(circle,#3782f5,transparent 65%);animation:orbit2 28s ease-in-out infinite alternate}.hero-orbs i:nth-child(3){width:200px;height:200px;left:14%;bottom:-60px;background:radial-gradient(circle,#9fb4ff,transparent 65%);animation:orbit3 22s ease-in-out infinite alternate}.site.dark .hero-orbs i{opacity:.38}@keyframes orbit1{from{transform:translate(0,0) scale(1)}to{transform:translate(60px,40px) scale(1.08)}}@keyframes orbit2{from{transform:translate(0,0) scale(1)}to{transform:translate(-50px,30px) scale(.94)}}@keyframes orbit3{from{transform:translate(0,0) scale(1)}to{transform:translate(40px,-46px) scale(1.06)}}.feature-intro{text-align:center;padding:80px 24px 80px}.feature-intro .kicker{margin-bottom:16px}.feature-intro h2,.how h2{font-size:38px;font-weight:500;letter-spacing:-1.5px;margin:0 0 18px}.feature-intro>p:last-child,.how>p:last-of-type{font-size:17px;line-height:1.6;color:var(--muted);margin:0}.feature-grid{display:grid;grid-template-columns:1fr 1fr;border-bottom:1px solid var(--line)}.feature-grid article{min-height:420px;padding:48px 40px;border-right:1px solid var(--line);overflow:hidden}.feature-grid article:last-child{border-right:0}.feature-title{display:flex;gap:12px;align-items:center}.feature-title h3{font-size:22px;font-weight:500;margin:0}.feature-grid article>p{font-size:16px;color:var(--muted);line-height:1.6;max-width:640px}.model-window,.chat-window{margin:36px 0 0;border:1px solid var(--line);border-radius:18px;width:100%;height:auto;box-shadow:0 10px 24px #0000000c;position:relative;background:#fff}.site.dark .model-window,.site.dark .chat-window{background:#202020}.window-dots{display:flex;gap:10px;padding:14px 18px}.window-dots b{width:10px;height:10px;border-radius:50%;background:#ff2f3d}.window-dots b:nth-child(2){background:#ffb800}.window-dots b:nth-child(3){background:#06c75b}.model-list{border-top:1px solid var(--line);display:flex;flex-direction:column;gap:12px;padding:16px 18px;font-size:14px}.model-list span{display:flex;align-items:center;gap:8px}.model-list small,.model-list strong{margin-left:auto;color:var(--muted);font-weight:400}.chat-window{background:radial-gradient(110% 110% at 50% 0%,#e4ebff 0%,transparent 68%);display:flex;align-items:flex-end;justify-content:flex-end;padding:20px;min-height:160px}.site.dark .chat-window{background:radial-gradient(110% 110% at 50% 0%,#1c2a5e 0%,transparent 68%)}.chat-bubble{background:#3782f5;color:#fff;border-radius:18px;padding:16px;font-size:15px;line-height:1.5}.trusted{text-align:center}.mono-label{font:600 11px/1.2 monospace;color:var(--muted);letter-spacing:1.5px;text-align:center;margin:0;padding:40px 16px 28px}.logo-grid{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--line)}.logo{height:120px;border-right:1px solid var(--line);border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:500;color:#333}.site.dark .logo{color:#ddd}.logo:nth-child(4n){border-right:0}.logo-0:before{content:'⚡';background:#444;color:#fff;border-radius:6px;padding:3px;margin-right:8px}.logo-1{font-weight:800;font-size:26px}.logo-2{font-weight:700}.logo-4{font-size:16px}.logo-5{font-weight:700}.how{text-align:center;padding:80px 24px 56px}.how .kicker{margin-bottom:16px}.how h2{margin-bottom:18px}.integration-card{max-width:640px;height:96px;border:1px solid var(--line);border-radius:18px;margin:32px auto 0;display:flex;align-items:center;justify-content:space-between;padding:24px 28px;font-size:16px;text-align:left}.faq{text-align:left;max-width:960px;margin:0 auto;padding:72px 24px 80px}.faq .kicker{font-size:14px;margin-bottom:10px;text-align:left}.faq h2{font-size:32px;font-weight:500;letter-spacing:-1px;margin:0 0 12px;text-align:left}.faq>p{color:var(--muted);line-height:1.6;font-size:15px;margin:0 0 24px;text-align:left}.faq .button-row{display:flex;gap:12px;justify-content:flex-start;margin-bottom:40px}.faq-list{margin-top:20px;text-align:left;border-top:1px solid var(--line)}.faq-row{width:100%;display:flex;flex-direction:column;border:0;border-bottom:1px solid var(--line);background:transparent;color:inherit;padding:20px 8px;font-size:15px;text-align:left;cursor:pointer;transition:background .2s}.faq-row-header{display:flex;justify-content:space-between;align-items:center;width:100%;font-weight:500;gap:16px}.faq-row .rotate{transform:rotate(180deg);transition:transform .2s}.answer{color:var(--muted);font-size:14px;line-height:1.6;margin-top:12px;padding-right:24px;text-align:left}.final-cta{text-align:center;min-height:360px;padding:72px 24px 56px;overflow:hidden}.final-cta h2{font-size:34px;line-height:1.15;letter-spacing:-1px;font-weight:500;margin:48px 0 20px}.final-cta h2 em{font-style:normal;color:var(--accent-bright)}.orbit{height:22px;position:relative;max-width:300px;margin:auto;border-radius:50%;box-shadow:0 -24px 0 -23px var(--line),0 -56px 0 -55px var(--line),0 -88px 0 -87px var(--line)}.orbit span{position:absolute;background:#fff;border:1px solid var(--line);padding:6px;border-radius:6px}.site.dark .orbit span{background:#171717}.orbit span:nth-child(1){left:24%;top:5px}.orbit span:nth-child(2){left:48%;top:-14px}.orbit span:nth-child(3){right:16%;top:6px}footer{display:flex;justify-content:space-between;padding:22px 7%;color:var(--muted);font-size:13px}@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}@keyframes navIn{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:none}}html.js [data-reveal]{opacity:0;transform:translateY(18px);transition:opacity .7s cubic-bezier(.16,.84,.32,1),transform .7s cubic-bezier(.16,.84,.32,1)}html.js [data-reveal].in{opacity:1;transform:none}.feature-grid article[data-reveal]:nth-child(2){transition-delay:.1s}.button:active{transform:translateY(0) scale(.97)}.integration-card svg{transition:transform .25s}.integration-card:hover svg{transform:translate(2px,-2px)}@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}html.js [data-reveal]{opacity:1!important;transform:none!important}.hero-orbs i{animation:none!important}}@media(max-width:800px){.hero-orbs i:nth-child(1){width:230px;height:230px;left:-70px;top:-40px}.hero-orbs i:nth-child(2){width:210px;height:210px;right:-60px;top:20%}.hero-orbs i:nth-child(3){width:150px;height:150px;left:6%;bottom:10%}.nav-shell{max-width:calc(100% - 24px);height:56px;border-radius:18px}.brand{font-size:18px;gap:8px}.brand-mark{transform:scale(.8);transform-origin:left center;width:22px}.nav-shell nav{display:none}.nav-actions{gap:10px}.nav-actions .button{padding:9px 14px;font-size:13px}.hero{padding-top:88px;min-height:440px}.hero h1{font-size:34px;letter-spacing:-1px}.hero-copy{font-size:16px}.kicker{font-size:14px}.feature-intro h2,.how h2{font-size:28px}.feature-intro>p:last-child,.how>p:last-of-type{font-size:16px}.feature-grid{grid-template-columns:1fr}.feature-grid article{border-right:0;border-bottom:1px solid var(--line);padding:32px 24px;min-height:auto}.feature-title h3{font-size:20px}.feature-grid article>p{font-size:15px}.logo-grid{grid-template-columns:repeat(2,1fr)}.logo{height:80px;font-size:16px}.logo:nth-child(4n){border-right:1px solid var(--line)}.logo:nth-child(2n){border-right:0}.final-cta h2{font-size:26px}footer{display:block;line-height:2}.desktop{display:none}}

/* Shared visual language: crisp blue, cool white surfaces, soft borders and rounded cards. */
.site{--ink:#19324b;--muted:#5f7287;--line:#dceaf4;--accent:#0E71EB;--accent-bright:#4ea9df;--brand-sky:#4ea9df;color:var(--ink)}
.site.dark{--ink:#f4f7ff;--muted:#b2bfd1;--line:#26344a;--accent-bright:#9bb4ff}
.site a:focus-visible,.site button:focus-visible{outline:3px solid rgba(31,81,255,.45);outline-offset:3px}
.site .feature-intro{padding:84px 24px 56px;background:linear-gradient(180deg,#fff 0%,#f3f9fd 100%)}
.site.dark .feature-intro{background:linear-gradient(180deg,#171717 0%,#171d2a 100%)}
.site .feature-intro h2,.site .how h2{color:var(--ink);font-weight:600;letter-spacing:-1.4px}
.site .feature-intro>p:last-child,.site .how>p:last-of-type{color:var(--muted)}
.site .feature-grid{max-width:1280px;margin:0 auto;padding:0 24px 72px;gap:18px;border:0;background:#f3f9fd}
.site.dark .feature-grid{background:#171d2a}
.site .feature-grid article{min-height:390px;padding:32px;border:1px solid #e2eaf5;border-radius:24px;background:rgba(255,255,255,.96);box-shadow:0 12px 34px rgba(27,65,116,.06);transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease}
.site .feature-grid article:hover{transform:translateY(-3px);border-color:#c6d8ff;box-shadow:0 18px 42px rgba(27,65,116,.10)}
.site.dark .feature-grid article{border-color:#2a3b55;background:#1c2432;box-shadow:0 12px 34px rgba(0,0,0,.16)}
.site .feature-title{color:#0E71EB}
.site .feature-title h3{color:var(--ink);font-weight:600;letter-spacing:-.4px}
.site .feature-grid article>p{color:var(--muted);line-height:1.7}
.site .model-window,.site .chat-window{border-color:#e2eaf5;border-radius:18px;box-shadow:0 10px 28px rgba(27,65,116,.08)}
.site.dark .model-window,.site.dark .chat-window{border-color:#2a3b55;background-color:#161d29}
.site .model-list span{color:#334155}
.site.dark .model-list span{color:#d7e0ed}
.site .trusted{padding:8px 24px 68px;background:#fff}
.site.dark .trusted{background:#171717}
.site .mono-label{color:#62738c;letter-spacing:1.8px}
.site .logo-grid{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;border:0}
.site .logo{height:auto;min-height:44px;padding:10px 18px;border:1px solid #e1eaf6;border-radius:999px;background:#f8fbff;color:#41516a;font-size:14px;font-weight:500}
.site.dark .logo{border-color:#2a3b55;background:#1c2432;color:#d5deed}
.site .logo:before{content:none}
.site .how{padding:78px 24px 84px;background:linear-gradient(180deg,#f7faff 0%,#eef5ff 100%)}
.site.dark .how{background:linear-gradient(180deg,#171d2a 0%,#19243a 100%)}
.site .kicker,.site .how .kicker,.site .faq .kicker,.site #pricing .kicker{color:#277aa5}
.site .integration-card{width:min(100%,720px);min-height:88px;height:auto;margin-top:30px;border-color:#d8e5fb;border-radius:20px;background:#fff;color:#334155;box-shadow:0 14px 36px rgba(27,65,116,.09);transition:transform .2s ease,box-shadow .2s ease}
.site .integration-card svg{color:#0E71EB}
.site .integration-card:hover{transform:translateY(-2px);box-shadow:0 18px 44px rgba(27,65,116,.13)}
.site.dark .integration-card{border-color:#2a3b55;background:#202a3a;color:#e0e8f4}
.site #pricing{scroll-margin-top:88px;border:0;background:linear-gradient(180deg,#fff 0%,#f3f9fd 100%)}
.site.dark #pricing{background:linear-gradient(180deg,#171717 0%,#171d2a 100%)}
.site #pricing article{border-radius:24px;box-shadow:0 16px 40px rgba(27,65,116,.08)}
.site #pricing article:hover{box-shadow:0 22px 48px rgba(27,65,116,.13)}
.site.dark #pricing article{background:#1c2432}
.site #pricing article a,.site #pricing article button{min-height:44px;display:flex;align-items:center;justify-content:center}
.site .faq{padding-top:80px;padding-bottom:88px}
.site .faq h2{color:var(--ink);font-weight:600;letter-spacing:-1.2px}
.site .faq>p{color:var(--muted)}
.site .faq .dark-button{background:#0E71EB;color:#fff}
.site .faq .faq-list{display:grid;gap:10px;border:0}
.site .faq .faq-row{border:1px solid #e2eaf5;border-radius:16px;background:#fff;padding:18px 20px;color:var(--ink);transition:border-color .18s ease,box-shadow .18s ease,background .18s ease}
.site .faq .faq-row:hover{border-color:#bfd2ff;box-shadow:0 8px 22px rgba(27,65,116,.06)}
.site.dark .faq .faq-row{border-color:#2a3b55;background:#1c2432}
.site.dark .faq .faq-row:hover{border-color:#45649a;background:#202b3c}
.site .final-cta{width:calc(100% - 32px);max-width:1280px;min-height:340px;margin:24px auto 0;border:0;border-radius:28px;background:radial-gradient(ellipse 70% 70% at 50% 110%,rgba(255,255,255,.34),transparent 72%),linear-gradient(180deg,#4ea9df 0%,#57b0e4 48%,#8bcdf1 100%);color:#fff;box-shadow:0 22px 60px rgba(30,84,128,.16)}
.site .final-cta h2{color:#fff;font-weight:600}
.site .final-cta h2 em{color:#dcedff}
.site .final-cta .orbit{box-shadow:0 -24px 0 -23px rgba(255,255,255,.35),0 -56px 0 -55px rgba(255,255,255,.25),0 -88px 0 -87px rgba(255,255,255,.16)}
.site .final-cta .orbit span{background:rgba(255,255,255,.94);border-color:rgba(255,255,255,.5);color:#0E71EB}
.site .final-cta .button{background:#fff;color:#0E71EB;box-shadow:0 8px 20px rgba(10,40,75,.18)}
.site footer{max-width:1280px;margin:0 auto;padding:24px 32px;color:#62738c;border-color:#e2eaf5}
.site footer a{color:inherit;text-decoration:none;transition:color .18s ease}
.site footer a:hover{color:#0E71EB}
.site.dark footer{border-color:#29364b;color:#b2bfd1}

.site #pricing .kicker{margin-bottom:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#277aa5}
.site #pricing h2{color:#19324b;letter-spacing:-1.4px}
.site.dark #pricing h2{color:#f4f8fc}
.site #pricing>div>p:not(.kicker){color:#5f7287}
.site.dark #pricing>div>p:not(.kicker){color:#c0cedb}
.site #pricing article{border-color:#dceaf4}
.site #pricing article.border-blue-500\/80{border-color:#4ea9df}
.site #pricing article .bg-blue-600{background-color:#4ea9df;color:#19324b}
.site #pricing article .text-blue-600{color:#277aa5}
.site #pricing article .bg-blue-50{background-color:#eaf6fc}
.site #pricing article a:hover,.site #pricing article button:hover{filter:brightness(.96)}
.site #pricing .bg-blue-600.hover\:bg-blue-700:hover{background-color:#3f98c9}
.site #pricing .bg-blue-600.text-slate-900{color:#19324b}
.site.dark #top{background:#111827}
.site.dark .final-cta{background:radial-gradient(ellipse 70% 70% at 50% 110%,rgba(125,170,220,.14),transparent 72%),linear-gradient(180deg,#14243a 0%,#172d47 52%,#1b3854 100%);box-shadow:0 22px 60px rgba(0,0,0,.24)}
.site.dark .final-cta h2 em{color:#b9d8ff}
.site.dark .final-cta .orbit span{background:#e6f1ff;border-color:#c8ddf7;color:#19324b}
.site.dark .final-cta .button{background:#e6f1ff;color:#19324b}

@media(max-width:800px){.site .feature-grid{grid-template-columns:1fr;padding:0 16px 52px;gap:14px}.site .feature-grid article{min-height:auto;padding:24px}.site .logo-grid{gap:8px}.site .logo{min-height:40px;padding:8px 13px;font-size:13px}.site .integration-card{gap:12px;padding:20px;font-size:14px}.site .faq{padding:56px 18px 64px}.site .faq .button-row{margin-bottom:28px}.site .faq .faq-row{padding:16px}.site .final-cta{min-height:320px;padding:64px 20px 48px}.site footer{padding:22px 20px}}
@media(prefers-reduced-motion:reduce){.site .feature-grid article,.site .integration-card,.site .faq .faq-row{transition:none}}
`;

export default function LandingPage() {
  const [dark, setDark] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navbarVisible, setNavbarVisible] = useState(false);
  const [mobileProductOpen, setMobileProductOpen] = useState(false);
  const [mobileFeaturesOpen, setMobileFeaturesOpen] = useState(false);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly');


  useEffect(() => {
    const preference = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = () => {
      const theme = preference.matches ? 'dark' : 'light';
      setDark(theme === 'dark');
      applyTheme(theme);
    };

    updateTheme();
    preference.addEventListener('change', updateTheme);
    return () => preference.removeEventListener('change', updateTheme);
  }, []);

  useEffect(() => {
    const hero = document.getElementById('top');
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => setNavbarVisible(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.documentElement.classList.add('js');
    const revealElements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    if (typeof IntersectionObserver === 'undefined' || reduceMotion) {
      revealElements.forEach((element) => element.classList.add('in'));
      return;
    }
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
    revealElements.forEach((el) => io.observe(el));
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
      a: 'Yes! e-Mate includes a free tier with daily query allowances, basic notebook uploads, and full BYOK support. You can upgrade to Plus, Pro, or Ultra for higher limits and more study tools.',
    },
  ];

  return (
    <main className={dark ? 'site dark' : 'site'}>
      <style>{styles}</style>
      {/* Compact, full-width navigation */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[opacity,transform,visibility] duration-500 ease-out ${navbarVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}
        aria-hidden={!navbarVisible}
        inert={!navbarVisible}
        style={{
          visibility: navbarVisible ? 'visible' : 'hidden',
          color: dark ? '#f4f8fc' : '#19324b',
          background: dark ? 'rgba(18,35,56,0.94)' : 'rgba(246,251,255,0.94)',
          backdropFilter: 'blur(18px) saturate(160%)',
          WebkitBackdropFilter: 'blur(18px) saturate(160%)',
          borderBottom: `1px solid ${dark ? 'rgba(255,255,255,0.12)' : 'rgba(78,169,223,0.22)'}`,
          boxShadow: '0 8px 28px rgba(24,83,130,0.08)',
        }}
      >
        <div className="mx-auto flex h-14 w-full max-w-[1280px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <a
            className="flex shrink-0 items-center gap-2.5 font-semibold tracking-tight transition-opacity hover:opacity-75"
            style={{ color: 'inherit', textDecoration: 'none', fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}
            href="/"
            aria-label="e-Mate AI home"
          >
            <Image src="/android-chrome-512x512.png" alt="" width={30} height={30} className="object-contain" />
            <span className="text-[17px]">e-Mate</span>
          </a>

          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {[
              ['Features', '#about'],
              ['Pricing', '#pricing'],
              ['Support', '#blog'],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                className="text-[14px] transition-colors hover:text-blue-600"
                style={{ color: dark ? 'rgba(255,255,255,0.72)' : '#606875', textDecoration: 'none' }}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="/sign-up-login-screen"
              className="hidden sm:inline-flex items-center px-3 py-2 text-[14px] font-medium transition-colors hover:text-blue-600"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              Sign in
            </a>
            <a
              href="https://emate-ai.vercel.app"
              className="hidden md:inline-flex h-9 items-center gap-2 rounded-full px-4 text-[13px] font-semibold transition-all hover:-translate-y-0.5"
              style={{ background: '#4ea9df', color: '#19324b', textDecoration: 'none', boxShadow: '0 4px 12px rgba(78,169,223,0.28)' }}
            >
              Start learning <ArrowUpRight size={15} />
            </a>
            <button
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'inherit' }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
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
              className="w-full py-3 rounded-full text-center text-sm font-semibold bg-[#4ea9df] text-[#19324b] shadow-lg"
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

      {/* Hero section with a full-screen MacBook workspace preview */}
      <section id="top" className="relative w-full overflow-hidden bg-white px-3 pb-8 pt-3 sm:px-5 sm:pb-10 sm:pt-5" style={{ fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif' }}>
        <div className="relative mx-auto min-h-[575px] max-w-[1480px] overflow-hidden rounded-[16px] sm:min-h-[690px] sm:rounded-[20px] md:min-h-[790px] lg:min-h-[1020px]" style={{ background: dark ? 'radial-gradient(ellipse 72% 48% at 50% 91%,rgba(148,197,250,.24) 0%,transparent 68%),linear-gradient(180deg,#3b73a0 0%,#4489b8 50%,#9bc9e5 100%)' : 'radial-gradient(ellipse 76% 48% at 50% 94%,rgba(255,255,255,.86) 0%,rgba(255,255,255,.46) 38%,transparent 78%),linear-gradient(180deg,#4ea9df 0%,#57b0e4 48%,#8bcdf1 100%)' }}>
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.10] mix-blend-soft-light" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.4'/%3E%3C/svg%3E\")" }} />
          <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-4 pt-4 sm:px-7 sm:pt-6 lg:px-10">
            <div className="flex items-center gap-2 text-xs font-semibold text-white sm:text-sm"><Image src="/android-chrome-512x512.png" alt="" width={22} height={22} className="rounded-md" /> e-Mate AI</div>
            <span className="rounded-full bg-white px-3.5 py-1.5 text-[8px] font-semibold uppercase tracking-[0.16em] text-slate-600 shadow-sm sm:text-[9px]">Made for learning</span>
          </div>
          <div className="relative z-10 mx-auto max-w-6xl px-4 pt-[74px] text-center sm:px-6 sm:pt-[92px] lg:px-8 lg:pt-[100px]">
          <div className="mb-3 inline-flex items-center rounded-[4px] bg-[#fff228] px-2.5 py-1 text-[8px] font-bold uppercase tracking-[0.12em] text-slate-900 shadow-sm">
            A smarter way to study
          </div>

          {/* Reference-inspired centered headline */}
          <h1
            className="max-w-4xl mx-auto"
            style={{
              fontSize: 'clamp(30px, 4.2vw, 48px)',
              fontWeight: 500,
              lineHeight: 1.1,
              letterSpacing: '-2px',
              color: '#ffffff',
              marginBlock: 0,
              textAlign: 'center',
            }}
          >
            Study smarter.
            <br />
            <span style={{ color: dark ? '#dbeafe' : '#eff8ff' }}>Learn with e-Mate.</span>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              marginTop: '14px',
              fontSize: '12px',
              lineHeight: 1.5,
              color: dark ? '#cbd5e1' : 'rgba(255,255,255,.92)',
              maxWidth: '320px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
Turn your notes into clear explanations and quick quizzes.
          </p>

          {/* CTA Buttons */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:mt-6 sm:gap-3">
            <a href="https://emate-ai.vercel.app" className="inline-flex min-h-9 items-center justify-center rounded-full bg-white px-5 py-2 text-[8px] font-semibold uppercase tracking-[0.12em] text-slate-700 shadow-sm transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:min-h-10 sm:px-6 sm:text-[9px]">
              Start learning
            </a>
            <a href="#about" className="inline-flex min-h-9 items-center justify-center rounded-full border border-white/20 bg-white/15 px-5 py-2 text-[8px] font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-sm transition hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:min-h-10 sm:px-6 sm:text-[9px]">
              Explore features
            </a>
          </div>

          {/* Full desktop screenshot fitted edge-to-edge inside the MacBook display */}
          <div className="absolute left-1/2 top-[326px] z-20 w-[94%] max-w-[1180px] -translate-x-1/2 sm:top-[350px] sm:w-[90%] lg:top-[370px]">
            <div className="overflow-hidden rounded-t-[18px] border-[6px] border-b-0 border-[#111923] bg-[#111923] shadow-[0_30px_76px_rgba(10,37,62,.34)] sm:rounded-t-[24px] sm:border-[9px] sm:border-b-0">
              <img
                src="/emate-app-preview.png"
                alt="e-Mate AI desktop workspace shown full-screen inside a MacBook display"
                className="block h-auto w-full rounded-t-[10px] sm:rounded-t-[14px]"
                draggable={false}
              />
            </div>
            <div aria-hidden="true" className="relative mx-auto h-[3px] w-full bg-gradient-to-b from-[#87919d] via-[#4c5662] to-[#202833] shadow-[0_2px_4px_rgba(8,18,30,.22)]" />
            <div aria-hidden="true" className="relative mx-auto h-3.5 w-[104%] -translate-x-[1.9%] overflow-hidden rounded-b-[18px] border-x border-b border-[#9ca6b0]/80 bg-gradient-to-b from-[#f8fafc] via-[#dfe4e9] to-[#bdc5ce] shadow-[0_12px_24px_rgba(15,50,80,.20)] sm:h-5 sm:rounded-b-[22px]">
              <div className="mx-auto h-1 w-[18%] rounded-b-md border-x border-b border-slate-400/50 bg-gradient-to-b from-[#c6cdd5] to-[#eef1f4] sm:h-1.5" />
              <div className="absolute inset-x-[3%] bottom-0 h-px rounded-full bg-white/80" />
            </div>
          </div>
        </div>
        </div>

      </section>
      <section id="about" className="section-frame feature-intro" data-reveal>
        <p className="kicker">Features</p>
        <h2>Features designed for your success.</h2>
        <p>
          Explore the tools built to keep your studies organized, focused, and on track.
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
                <Sparkles size={13} className="text-blue-500" /> Gemini 2.0 Flash <strong>Ultra-Fast</strong>
              </span>
              <span>
                <Brain size={13} className="text-blue-500" /> OpenAI GPT-4o <small>GPT-4o-mini</small>
              </span>
              <span>
                <Sparkles size={13} className="text-blue-500" /> Claude 3.5 Sonnet <strong>Reasoning</strong>
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
        <p className="mono-label">BUILT FOR EVERY SUBJECT</p>
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
        <div className="w-full max-w-6xl mx-auto px-4 py-14 sm:py-16 flex flex-col items-center justify-center">
          <p className="kicker">Simple, flexible plans</p>
          <h2 className="mb-2 text-center text-3xl font-semibold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Choose how you learn</h2>
          <p className="mb-2 max-w-xl text-center text-sm leading-6 text-slate-600 dark:text-slate-300">Start free, then upgrade when you need more room to study.</p>
          <div className="my-6 inline-flex items-center rounded-full bg-zinc-100 p-1 dark:bg-zinc-800" aria-label="Billing period">
            <button type="button" onClick={() => setBillingPeriod('monthly')} aria-pressed={billingPeriod === 'monthly'} className={`rounded-full px-5 py-2 text-sm font-medium transition ${billingPeriod === 'monthly' ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white' : 'text-zinc-500'}`}>Monthly</button>
            <button type="button" onClick={() => setBillingPeriod('annual')} aria-pressed={billingPeriod === 'annual'} className={`rounded-full px-5 py-2 text-sm font-medium transition ${billingPeriod === 'annual' ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-700 dark:text-white' : 'text-zinc-500'}`}>Annual <span className="ml-1 text-emerald-600">Save 17%</span></button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch w-full mt-2">
            {PLANS.map((plan) => {
              const featured = !!plan.featured;
              const monthlyPrice = MONTHLY_PRICES[plan.tier];
              const price = Math.round(monthlyPrice * (billingPeriod === 'annual' ? 0.83 : 1));
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
                <article key={plan.name} className={cardClass}>
                  {featured && (
                    <>
                      <div
                        className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none"
                        aria-hidden="true"
                      >
                        <div
                          className="absolute -top-24 -right-16 w-64 h-64 rounded-full opacity-40 blur-3xl"
                          style={{ background: 'radial-gradient(circle,#0E71EB,transparent 70%)' }}
                        />
                      </div>
                      <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-blue-600 text-slate-900 text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm z-10">
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
                            ? 'bg-blue-600 text-slate-900 shadow-md'
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
                        ₹{price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-sm text-zinc-500">/ mo</span>
                    </div>
                  </div>

                  <div className="relative mt-6">
                    <RazorpayCheckout
                      amount={price * (billingPeriod === 'annual' ? 12 : 1)}
                      planTier={plan.tier}
                      className={featured
                        ? 'w-full py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md transition-all block text-center'
                        : 'w-full py-3 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 transition-colors block text-center'}
                    >
                      {plan.action}
                    </RazorpayCheckout>
                  </div>

                  <div className="relative my-6 h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-800 to-transparent" aria-hidden="true" />

                  <ul className="space-y-3.5 text-sm text-zinc-600 dark:text-zinc-300 flex-1">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span
                          className={
                            'flex h-5 w-5 items-center justify-center rounded-full shrink-0 mt-0.5 ' +
                            (featured
                              ? 'bg-blue-600 text-slate-900'
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
                    {billingPeriod === 'annual' ? 'Billed annually · Cancel anytime' : plan.note}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <section className="mx-auto my-14 w-[calc(100%-32px)] max-w-5xl rounded-3xl border border-blue-100 bg-gradient-to-br from-white via-blue-50/70 to-sky-50 p-6 shadow-[0_16px_48px_rgba(37,99,235,.08)] dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-blue-950/40 sm:p-10" data-reveal>
        <p className="mono-label">FOR SECURITY FIRST TEAMS</p>
        <div className="flex flex-col items-start justify-between gap-8 py-4 sm:flex-row sm:items-center">
          <div className="max-w-md">
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Scale securely <em>with confidence</em>
            </h2>
            <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Our AI assistant is designed with enterprise-grade security practices and compliant
              with global data protection standards.
            </p>
            <a
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 mt-5"
              href="/sign-up-login-screen"
            >
              Start Learning for Free
            </a>
          </div>
          <div className="flex w-full items-center justify-around gap-4 text-blue-700 dark:text-blue-300 sm:w-auto sm:gap-8">
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
