"use client";

import Image from "next/image";
import { ArrowDown, Menu, Pause, Play, X } from "lucide-react";
import { useEffect, useState } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const tools = [
  {
    name: "Prompt edit",
    description: "Describe a change in plain language and revise the image without rebuilding it from scratch.",
    kind: "layers",
  },
  {
    name: "Layerize text",
    description: "Turn typography into editable layers you can restyle, reposition, and refine afterward.",
    kind: "poster",
  },
  {
    name: "Extend",
    description: "Grow the composition beyond its original crop to find new formats and layouts.",
    kind: "maker",
  },
  {
    name: "Reframe",
    description: "Shift one composition to different aspect ratios while keeping the idea and focal point intact.",
    kind: "product",
  },
  {
    name: "Upscale",
    description: "Increase resolution and reveal detail while keeping the original character of the work.",
    kind: "eye",
  },
];

const platformData = {
  creative: {
    eyebrow: "FOR CREATIVE TEAMS",
    title: "Pre-Visualize",
    copy: "Move from the first thought to a world you can see. Explore scenes, styles, and stories before production begins.",
  },
  dev: {
    eyebrow: "FOR BUILDERS",
    title: "Prototype",
    copy: "Compose powerful media models into production-ready workflows with a flexible developer platform.",
  },
  robotics: {
    eyebrow: "FOR PHYSICAL AI",
    title: "Simulate",
    copy: "Generate rich, controllable environments that help intelligent systems understand the real world.",
  },
};

type Platform = keyof typeof platformData;

const heroScenes = [
  { name: "Visual Effects", tint: "hero-tint-vfx", labels: ["Smoldering city", "Humanoid robot", "Winter scene"] },
  { name: "Fashion", tint: "hero-tint-fashion", labels: ["Editorial look", "Material study", "Campaign frame"] },
  { name: "Architecture", tint: "hero-tint-architecture", labels: ["Interior study", "Facade option", "Night exterior"] },
];

function Logo({ variant = "dark" }: { variant?: "dark" | "light" }) {
  return (
    <a href="#top" className="brand-logo" aria-label="MOREU home">
      <Image
        src={`${basePath}${variant === "light" ? "/images/moreu-logo-white.png" : "/images/moreu-logo.png"}`}
        alt="MOREU"
        width={151}
        height={40}
        className="brand-logo-image"
      />
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[78px] border-b border-black/5 bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Logo />
        <nav className="hidden items-center gap-9 text-[17px] md:flex" aria-label="Primary navigation">
          <a className="nav-link" href={`${basePath}/work/`}>Work</a>
          <a className="nav-link" href="#platforms">Enterprise</a>
          <a className="nav-link" href="#start">Pricing</a>
          <a className="nav-link" href="#footer">Resources</a>
        </nav>
        <div className="hidden items-center gap-6 text-sm font-medium md:flex">
          <a className="nav-link" href="#footer">X</a>
          <a className="nav-link" href="#footer">IG</a>
        </div>
        <button className="rounded-full p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle navigation">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <nav className="absolute inset-x-0 top-[77px] flex flex-col gap-5 border-b border-black/10 bg-white px-6 py-7 text-2xl md:hidden">
          {[["Work", `${basePath}/work/`], ["Enterprise", "#platforms"], ["Pricing", "#start"], ["Resources", "#footer"]].map(([label, href]) => (
            <a key={label} href={href} onClick={() => setOpen(false)}>{label}</a>
          ))}
        </nav>
      )}
    </header>
  );
}

function Hero() {
  const [playing, setPlaying] = useState(true);
  const [scene, setScene] = useState(0);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setScene((current) => (current + 1) % heroScenes.length), 3200);
    return () => window.clearInterval(timer);
  }, [playing]);

  const activeScene = heroScenes[scene];
  return (
    <section id="top" className="relative min-h-[700px] overflow-hidden bg-[#555b61] pt-[78px] text-white">
      <Image src={`${basePath}/images/cinematic-valley.png`} alt="Traveler in a cinematic mountain valley" fill priority className="object-cover opacity-45" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,22,25,.72),rgba(27,31,35,.22)_55%,rgba(12,15,17,.43))]" />
      <div className="relative mx-auto grid min-h-[622px] max-w-[1440px] grid-cols-1 gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:px-12 lg:py-10">
        <div className="flex flex-col justify-between">
          <div className="max-w-[560px]">
            <p className="text-[23px] font-medium tracking-[-.02em]">Generative workflows that scale.</p>
            <p className="mt-3 max-w-[520px] text-[16px] leading-6 text-white/72">
              Teams from Pentagram to Lionsgate use MOREU to explore possibilities and amplify their creative output.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#start" className="rounded-full bg-white/14 px-5 py-2.5 text-sm backdrop-blur-md transition hover:bg-white hover:text-black">Get started for free</a>
              <a href={`${basePath}/work/`} className="rounded-full px-3 py-2.5 text-sm text-white/70 transition hover:text-white">See all workflows</a>
            </div>
          </div>
          <div className="mt-12 lg:mt-0" aria-label="Creative disciplines">
            {heroScenes.map((item, index) => (
              <button
                key={item.name}
                type="button"
                onClick={() => setScene(index)}
                className={`hero-word hero-word-button ${index ? "mt-7" : ""} ${scene === index ? "hero-word-active" : ""} ${index === 2 ? "hidden lg:block" : ""}`}
                aria-pressed={scene === index}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
        <div className="relative self-center lg:pl-8">
          <div className={`workflow-card ${activeScene.tint}`} key={activeScene.name}>
            <div className="workflow-main">
              <span>Man walking on a trail</span>
              <Image src={`${basePath}/images/cinematic-valley.png`} alt="Source frame" fill className="object-cover" sizes="320px" />
            </div>
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 720 520" fill="none" aria-hidden="true">
              <path d="M245 275 C360 275 360 95 486 95" stroke="rgba(255,255,255,.28)" />
              <path d="M245 275 C365 275 365 260 486 260" stroke="rgba(255,255,255,.28)" />
              <path d="M245 275 C360 275 360 430 486 430" stroke="rgba(255,255,255,.28)" />
              <circle cx="245" cy="275" r="5" fill="#c8b6ff" />
            </svg>
            {activeScene.labels.map((label, i) => (
              (() => {
                const pos = ["top-[7%]", "top-[38%]", "top-[69%]"][i];
                return (
              <div key={label} className={`workflow-output ${pos}`}>
                <span>{label}</span>
                <Image src={`${basePath}/images/cinematic-valley.png`} alt="" fill className={`object-cover ${i === 0 ? "sepia" : i === 2 ? "hue-rotate-[170deg] saturate-50" : ""}`} sizes="220px" />
              </div>
                );
              })()
            ))}
            <button onClick={() => setPlaying(!playing)} className="absolute bottom-4 right-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-white text-black transition hover:scale-105" aria-label={playing ? "Pause animation" : "Play animation"}>
              {playing ? <Pause size={15} fill="currentColor" /> : <Play size={15} fill="currentColor" />}
            </button>
            <span className={`absolute left-[34%] top-[51%] z-20 h-2 w-2 rounded-full bg-lilac shadow-[0_0_18px_7px_rgba(203,181,255,.5)] ${playing ? "animate-pulse" : ""}`} />
          </div>
          <p className="mt-4 text-sm text-white/70">Character &amp; Background Swaps</p>
        </div>
      </div>
    </section>
  );
}

function Partners() {
  return (
    <section className="border-b border-black/5 bg-white px-5 py-8 text-center" data-reveal>
      <p className="text-xs text-black/35">We partner with the world&apos;s leading organizations to advance their industries:</p>
      <div className="mx-auto mt-7 flex max-w-[900px] flex-wrap items-center justify-center gap-x-12 gap-y-5 text-[17px] font-medium tracking-tight text-black/75 sm:gap-x-16">
        <span className="font-display text-xl italic">amazon</span><span className="grid grid-cols-2 gap-0.5">{[0,1,2,3].map(i => <i key={i} className="block h-3.5 w-3.5 bg-black" />)}</span>
        <span>Robinhood ◒</span><span className="font-medium">shutterstock</span><span className="font-display text-2xl">D&amp;G</span><span className="text-xs leading-3">Wieden<br/>Kennedy</span>
      </div>
    </section>
  );
}

function ToolVisual({ kind }: { kind: string }) {
  if (kind === "layers") return <div className="art layers-art"><div className="glass-face"/><span className="prompt-chip">Add lighting in the background</span></div>;
  if (kind === "poster") return <div className="art poster-art"><div className="poster-face">LOST<br/>VIBES</div><i/><i/><i/></div>;
  if (kind === "maker") return <div className="art maker-art"><div className="maker-photo" style={{ backgroundImage: `linear-gradient(120deg,transparent 0 30%,rgba(17,80,100,.2) 30%), url('${basePath}/images/cinematic-valley.png')` }}/><div className="maker-grid"/></div>;
  if (kind === "product") return <div className="art product-art"><div className="bottle"><span>MŌRA</span></div><i className="lemon one"/><i className="lemon two"/></div>;
  return <div className="art eye-art"><div className="iris"/></div>;
}

function ToolCarousel() {
  return (
    <section id="work" className="overflow-hidden bg-[#fbfbfa] py-20 sm:py-28">
      <div className="mx-auto flex max-w-[1180px] flex-col justify-between gap-8 px-5 sm:flex-row sm:items-end sm:px-8" data-reveal>
        <div>
          <h2 className="font-display text-[48px] leading-[.86] tracking-[-.03em] sm:text-[66px]">Everything after the<br/>first image.</h2>
          <p className="mt-6 max-w-[610px] text-sm leading-6 text-black/55">MOREU gives you the tools to revise, sharpen, isolate, extend, and reshape your work after generation.</p>
        </div>
        <a href="#start" className="w-fit rounded-full bg-lilac px-5 py-3 text-xs font-medium transition hover:bg-black hover:text-white">Start building</a>
      </div>
      <div className="tool-marquee mt-16" data-reveal>
        <div className="motion-track">
          {[0, 1].flatMap((copy) => tools.map((tool) => (
            <article key={`${copy}-${tool.name}`} aria-hidden={copy === 1} className="w-[78vw] max-w-[330px] shrink-0 sm:w-[310px]">
              <ToolVisual kind={tool.kind} />
              <h3 className="mt-5 text-sm font-medium">{tool.name}</h3>
              <p className="mt-2 text-xs leading-5 text-black/55">{tool.description}</p>
            </article>
          )))}
        </div>
      </div>
    </section>
  );
}

function PlatformShowcase() {
  const [active, setActive] = useState<Platform>("creative");
  const content = platformData[active];

  useEffect(() => {
    const order: Platform[] = ["creative", "dev", "robotics"];
    const timer = window.setInterval(() => {
      setActive((current) => order[(order.indexOf(current) + 1) % order.length]);
    }, 4600);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section id="platforms" className="bg-white px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-[1400px]" data-reveal>
        <div className="grid grid-cols-3 gap-4 border-b border-black/10">
          {(["creative", "dev", "robotics"] as Platform[]).map((tab) => (
            <button key={tab} onClick={() => setActive(tab)} aria-pressed={active === tab} className={`platform-tab border-b-2 pb-5 text-left text-sm transition sm:text-lg ${active === tab ? "active border-black text-black" : "border-transparent text-black/35 hover:text-black/65"}`}>
              MOREU {tab === "creative" ? "Creative" : tab === "dev" ? "Dev" : "Robotics"}
            </button>
          ))}
        </div>
        <div key={active} className="platform-visual-enter mt-5 grid min-h-[570px] overflow-hidden rounded-2xl border border-black/10 bg-[#f5f3ed] lg:grid-cols-[340px_1fr]">
          <div className="flex flex-col justify-between p-7 sm:p-10">
            <div>
              <p className="text-[11px] tracking-[.14em] text-black/40">{content.eyebrow}</p>
              <h3 className="mt-4 font-display text-5xl leading-none">{content.title}</h3>
              <p className="mt-5 text-sm leading-6 text-black/55">{content.copy}</p>
            </div>
            <ul className="mt-12 space-y-4 text-base">
              {["Create with agents", "Build your own workflows", "Enterprise-grade", "The world's best models"].map((item, i) => (
                <li key={item} className={i === 0 ? "font-medium text-black" : "text-black/30"}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="relative m-3 min-h-[420px] overflow-hidden rounded-xl lg:m-6 lg:ml-0">
            <Image src={`${basePath}/images/floating-sofa.png`} alt="Floating sculptural leather sofa" fill className={`object-cover transition duration-700 ${active === "dev" ? "hue-rotate-[40deg] saturate-75" : active === "robotics" ? "grayscale" : ""}`} sizes="(max-width: 1024px) 100vw, 900px" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
            <p className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-4xl font-medium text-white sm:text-6xl">{content.title}</p>
            <span className="absolute bottom-6 left-6 rounded-full border border-white/35 bg-black/15 px-4 py-2 text-xs text-white backdrop-blur">Explore platform</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section id="start" className="bg-[#fbfbfa] px-5 py-20 sm:px-8 sm:py-28">
      <div className="mx-auto grid max-w-[1100px] items-center gap-12 lg:grid-cols-[.75fr_1.25fr]" data-reveal>
        <div>
          <p className="text-xs tracking-[.16em] text-black/40">CREATE WHAT&apos;S NEXT</p>
          <h2 className="mt-4 font-display text-5xl leading-[.9] sm:text-6xl">Start building with<br/>MOREU today</h2>
          <p className="mt-6 max-w-sm text-sm leading-6 text-black/50">One workspace for building visual ideas, intelligent workflows, and the worlds behind them.</p>
          <div className="mt-8 flex gap-3">
            <a href="#start" className="rounded-full bg-black px-5 py-3 text-xs text-white transition hover:bg-black/75">Build with API</a>
            <a href="#top" className="rounded-full bg-lilac px-5 py-3 text-xs transition hover:bg-black hover:text-white">Try in App</a>
          </div>
        </div>
        <div className="relative aspect-square overflow-hidden rounded-sm">
          <Image src={`${basePath}/images/color-bird.png`} alt="Colorful bird dissolving into particles" fill className="object-cover transition duration-700 hover:scale-[1.025]" sizes="(max-width: 1024px) 100vw, 660px" />
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="footer" className="bg-black px-5 pb-10 pt-20 text-white sm:px-8 sm:pt-28">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="font-display text-[54px] leading-none sm:text-[86px]">Think it. Make it. Own it.</h2>
        <div className="mt-12 grid gap-10 border-t border-white/15 pt-8 sm:grid-cols-3">
          <p className="max-w-sm text-sm leading-6 text-white/45">MOREU gives visual ideas somewhere to go: into products, agents, campaigns, and finished design systems.</p>
          <div className="text-sm leading-8 text-white/60"><a className="block hover:text-white" href={`${basePath}/work/`}>Work</a><a className="block hover:text-white" href="#platforms">Platforms</a><a className="block hover:text-white" href="#start">Pricing</a></div>
          <div className="sm:text-right"><Logo variant="light" /></div>
        </div>
        <p className="mt-16 text-xs text-white/25">© 2026 MOREU. All creative systems online.</p>
      </div>
    </footer>
  );
}

export default function Home() {
  return <main><Header /><Hero /><Partners /><section className="platform-intro bg-white px-5 py-24 text-center sm:py-32" data-reveal><h1 className="platform-intro-title mx-auto max-w-[950px] text-[36px] leading-[1.02] tracking-[-.04em] sm:text-[58px]">Three platforms built on top of the same Real-World Intelligence models</h1><a className="platform-intro-arrow mx-auto mt-10" href="#work" aria-label="Continue to the creative tools"><ArrowDown size={22}/></a></section><ToolCarousel /><PlatformShowcase /><CTA /><Footer /></main>;
}
