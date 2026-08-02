"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";

const filters = ["All", "Exhibitions", "Collectibles", "Collaborations"];

function MoreuMark() {
  return (
    <Link href="/" className="work-mark" aria-label="Back to MOREU home">
      <Image
        src="/images/moreu-logo.png"
        alt="MOREU"
        width={128}
        height={34}
        className="work-logo-image"
      />
    </Link>
  );
}

function WorkHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="work-header">
      <MoreuMark />
      <nav className="work-header-nav" aria-label="Work navigation">
        <a href="#digital">Digital</a>
        <a href="#physical">Physical</a>
        <a href="#process">Process</a>
        <a href="#about">About</a>
      </nav>
      <div className="work-social"><span>Selected works</span><span>2025—26</span></div>
      <button className="work-menu-button" aria-label="Toggle work navigation" onClick={() => setOpen(!open)}>
        {open ? <X size={21} /> : <Menu size={21} />}
      </button>
      {open && (
        <nav className="work-mobile-nav">
          {["Digital", "Physical", "Process", "About"].map((label) => (
            <a key={label} href={`#${label.toLowerCase()}`} onClick={() => setOpen(false)}>{label}</a>
          ))}
        </nav>
      )}
    </header>
  );
}

function ArtworkCaption({ title, type }: { title: string; type: string }) {
  return <div className="work-caption"><p>{title}</p><span>{type}</span></div>;
}

function IndexSection() {
  const [active, setActive] = useState("All");
  return (
    <section className="work-index" aria-labelledby="work-title">
      <div className="work-index-meta" data-reveal>
        <p className="work-signature">moreu studio</p>
        <div className="work-filters" aria-label="Filter projects">
          {filters.map((filter) => (
            <button key={filter} className={active === filter ? "active" : ""} onClick={() => setActive(filter)}>{filter}</button>
          ))}
        </div>
        <p>Independent creative systems<br />Taipei · Worldwide</p>
      </div>

      <div className={`work-art-grid filter-${active.toLowerCase()}`} data-reveal>
        <div className="work-digital" id="digital">
          <div className="work-section-heading">
            <h1 id="work-title">DIGITAL</h1>
            <p>A selection of digital worlds we&apos;ve built recently. View all <ArrowUpRight size={12} /></p>
          </div>
          <div className="work-digital-grid">
            <article className="work-project-card work-project-primary" data-reveal>
              <div className="work-media portrait">
                <Image src="/images/work-new-life.png" alt="Translucent profile sculpture in a sunlit gallery" fill priority className="object-cover" sizes="(max-width: 768px) 100vw, 36vw" />
              </div>
              <ArtworkCaption title="New Life (2026)" type="Digital artwork · Short film" />
            </article>
            <article className="work-project-card" data-reveal>
              <div className="work-media branch-art" aria-label="Abstract digital branch sculpture"><span /><span /><span /></div>
              <ArtworkCaption title="Vestige (2026)" type="Generative image series" />
            </article>
            <article className="work-project-card work-wide-card" data-reveal>
              <div className="work-media textile-art"><i /><i /><i /><i /></div>
              <ArtworkCaption title="Soft Architecture (2025)" type="Moving image · Installation" />
            </article>
          </div>
        </div>

        <aside className="work-physical" id="physical">
          <h2>PHYSICAL</h2>
          <article className="work-project-card" data-reveal>
            <div className="work-media landscape">
              <Image src="/images/work-skyward.png" alt="Blue pavilion sculpture on a salt plain at sunset" fill className="object-cover" sizes="(max-width: 768px) 100vw, 27vw" />
            </div>
            <ArtworkCaption title="SkyWard (2026)" type="Land art installation" />
          </article>
          <article className="work-project-card" data-reveal>
            <div className="work-media plinth-art"><div className="glass-plinth"><span /></div></div>
            <ArtworkCaption title="Holding Ground (2025)" type="Stone, glass, field recording" />
          </article>
        </aside>
      </div>
      <a href="#museum" className="work-down" aria-label="Continue to exhibition"><ArrowDown size={62} strokeWidth={1.15} /></a>
    </section>
  );
}

type NodeProps = { className: string; label: string; prompt?: string; image?: boolean; faded?: boolean };

function FlowNode({ className, label, prompt, image, faded }: NodeProps) {
  return (
    <div className={`flow-node ${className} ${faded ? "faded" : ""}`} data-reveal>
      <div className="flow-node-title"><span>{label}</span><i /></div>
      {prompt && <p>{prompt}</p>}
      {image && <div className="flow-node-image"><Image src="/images/work-botanical.png" alt="Surreal translucent botanical sculpture" fill className="object-cover" sizes="200px" /></div>}
      {image && <div className="flow-node-footer"><span>1024 × 1024</span><button>Run</button></div>}
    </div>
  );
}

function Workflow() {
  return (
    <section className="work-process" id="process">
      <div className="flow-canvas">
        <svg className="flow-lines" viewBox="0 0 1400 590" preserveAspectRatio="none" aria-hidden="true" data-draw>
          <path pathLength="1" d="M118 370 C190 370 210 208 295 208" className="pink" />
          <path pathLength="1" d="M218 96 C260 96 252 186 295 186" className="gold" />
          <path pathLength="1" d="M520 250 C590 250 570 314 665 314" className="green" />
          <path pathLength="1" d="M860 314 C960 314 986 363 1084 363" className="pink" />
          <path pathLength="1" d="M985 103 C1035 103 1024 335 1084 335" className="gold" />
          <circle cx="295" cy="197" r="5" /><circle cx="520" cy="250" r="5" /><circle cx="665" cy="314" r="5" /><circle cx="1084" cy="349" r="5" />
        </svg>
        <FlowNode className="node-input" label="Image input" image />
        <FlowNode className="node-prompt-one" label="Text input" prompt="The flower arrangement is in the middle of the street at night in New York City, lit by street lamps." />
        <FlowNode className="node-generate" label="Gen-4 Image" image />
        <FlowNode className="node-video" label="Gen-4 Video" image />
        <FlowNode className="node-prompt-two" label="Text input" prompt="Make the whole scene covered in snow in the dead of winter." />
        <FlowNode className="node-output" label="Aleph" image faded />
      </div>
    </section>
  );
}

function ProjectStory() {
  return (
    <section className="work-story" id="about" data-reveal>
      <div className="work-story-rule" />
      <h2>Two worlds, two spaces and the screen as the connection between them.</h2>
      <div className="work-story-copy">
        <p>I was invited to create a new moving-image piece focused on the relationship between a physical exhibition and a world created inside the screen.</p>
        <p>I interpreted that idea as a series of short journeys that move between reality and imagination—quietly linked by the same visual language.</p>
      </div>
      <div className="work-credits">
        <p>Credits</p>
        <p>Creative direction: MOREU Studio<br />Art direction: Lin Chen<br />3D &amp; Generative systems: MOREU Lab<br />Sound design: Field Office<br />Production: Another Space</p>
      </div>
      <div className="work-story-footer"><MoreuMark /><a href="#top">Back to top ↑</a></div>
    </section>
  );
}

export default function WorkPage() {
  return (
    <main className="work-page" id="top">
      <WorkHeader />
      <IndexSection />
      <section className="work-museum" id="museum" data-reveal>
        <Image src="/images/work-museum.png" alt="Light-filled contemporary art museum gallery" fill className="work-museum-image object-cover" sizes="100vw" data-parallax />
      </section>
      <Workflow />
      <ProjectStory />
    </main>
  );
}
