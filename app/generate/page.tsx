"use client";

import Image from "next/image";
import {
  ArrowUp,
  Check,
  ChevronDown,
  ChevronsUpDown,
  CircleHelp,
  Folder,
  History,
  Image as ImageIcon,
  Keyboard,
  Layers3,
  LogOut,
  Menu,
  MessageSquarePlus,
  Mic,
  Paperclip,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Settings,
  SlidersHorizontal,
  Sparkles,
  Video as VideoIcon,
  Wand2,
  X,
} from "lucide-react";
import { FormEvent, PointerEvent, useEffect, useRef, useState } from "react";
import ParticleVoiceOrb from "@/components/ParticleVoiceOrb";
import styles from "./generate.module.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

type GenerateMode = "image" | "video";
type SidebarDestination = "new-chat" | "history" | "projects";

const workflowTools = [
  ["Prompt edit", "Change the atmosphere to cinematic dusk with soft volumetric light"],
  ["Layerize text", "Separate the typography and image into editable visual layers"],
  ["Extend canvas", "Extend this scene beyond the original frame in every direction"],
  ["Reframe", "Reframe this concept as a bold vertical editorial composition"],
  ["Upscale", "Upscale the image while preserving texture and natural detail"],
  ["Style transfer", "Translate the scene into a tactile, art-directed film still"],
  ["Background swap", "Keep the subject and replace the background with a surreal landscape"],
  ["Motion brush", "Add subtle wind, fabric movement, and a slow camera push"],
  ["Storyboard", "Turn this idea into a six-frame cinematic storyboard"],
  ["Train LoRA", "Build a consistent visual language from these references"],
] as const;

const recentProjects = ["Alpine residence", "Soft geometry", "Chromatic study"];

const headlineWords = ["Tell", "me", "what", "you", "want", "to"];

const generatingPhrases = ["Composing the frame", "Shaping the light", "Mixing pigments", "Refining the details"];

const imageModels = [
  { id: "auto", name: "Auto", detail: "Smart routing", description: "Automatically routes to the best model for the task." },
  { id: "claude-47-opus", name: "Claude 4.7 Opus", detail: "Deep reasoning", description: "Best for complex reasoning and deep writing." },
  { id: "claude-46-sonnet", name: "Claude 4.6 Sonnet", detail: "Balanced", description: "Balanced speed and intelligence for everyday generation." },
  { id: "gpt-54", name: "GPT 5.4", detail: "Reasoning", description: "Strong reasoning and analysis for structured creative work." },
  { id: "gpt-55", name: "GPT 5.5", detail: "Flagship", description: "Flagship model for complex multi-step work." },
  { id: "gemini-31-pro", name: "Gemini 3.1 Pro", detail: "Long context", description: "Long-context model for large-file marketing planning." },
  { id: "grok-43", name: "Grok 4.3", detail: "Fast", description: "Fast, direct reasoning for rapid ideation and synthesis." },
] as const;

const videoModels = imageModels;

export default function GeneratePage() {
  const [mode, setMode] = useState<GenerateMode>("image");
  const [prompt, setPrompt] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarDestination, setSidebarDestination] = useState<SidebarDestination>("new-chat");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [creditsMenuOpen, setCreditsMenuOpen] = useState(false);
  const [modelMenuOpen, setModelMenuOpen] = useState(false);
  const [imageModel, setImageModel] = useState("auto");
  const [videoModel, setVideoModel] = useState("auto");
  const [listening, setListening] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [resultPrompt, setResultPrompt] = useState("");
  const [attachment, setAttachment] = useState<string | null>(null);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const fileInput = useRef<HTMLInputElement>(null);
  const workspaceRef = useRef<HTMLElement>(null);
  const resultCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (attachment) URL.revokeObjectURL(attachment);
    };
  }, [attachment]);

  useEffect(() => {
    if (!generating) return;
    setPhraseIndex(0);
    const timer = window.setInterval(() => setPhraseIndex((index) => (index + 1) % generatingPhrases.length), 640);
    return () => window.clearInterval(timer);
  }, [generating]);

  useEffect(() => {
    const focusComposer = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setUserMenuOpen(false);
        setCreditsMenuOpen(false);
        setModelMenuOpen(false);
        return;
      }
      if (event.key !== "/" || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "TEXTAREA" || target.tagName === "INPUT")) return;
      event.preventDefault();
      document.getElementById("prompt-input")?.focus();
    };
    window.addEventListener("keydown", focusComposer);
    return () => window.removeEventListener("keydown", focusComposer);
  }, []);

  const submitPrompt = (event: FormEvent) => {
    event.preventDefault();
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt || generating) return;
    setGenerating(true);
    setResultPrompt("");
    window.setTimeout(() => {
      setResultPrompt(cleanPrompt);
      setGenerating(false);
    }, 2600);
  };

  const resetCanvas = () => {
    setPrompt("");
    setResultPrompt("");
    setAttachment(null);
    setListening(false);
    setCreditsMenuOpen(false);
    setModelMenuOpen(false);
    setSidebarDestination("new-chat");
    setSidebarOpen(false);
  };

  const availableModels = mode === "image" ? imageModels : videoModels;
  const selectedModelId = mode === "image" ? imageModel : videoModel;
  const selectedModel = availableModels.find((model) => model.id === selectedModelId) ?? availableModels[0];

  const selectModel = (modelId: string) => {
    if (mode === "image") setImageModel(modelId);
    else setVideoModel(modelId);
    setModelMenuOpen(false);
  };

  const handleWorkspacePointer = (event: PointerEvent<HTMLElement>) => {
    const workspace = workspaceRef.current;
    if (!workspace) return;
    const bounds = workspace.getBoundingClientRect();
    workspace.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
    workspace.style.setProperty("--my", `${event.clientY - bounds.top}px`);
  };

  const handleCardTilt = (event: PointerEvent<HTMLDivElement>) => {
    const card = resultCardRef.current;
    if (!card || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const bounds = card.getBoundingClientRect();
    const tiltX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -3.4;
    const tiltY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 4.2;
    card.style.transform = `perspective(1100px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`;
  };

  const resetCardTilt = () => {
    if (resultCardRef.current) resultCardRef.current.style.transform = "";
  };

  return (
    <main className={styles.page}>
      <button
        className={styles.mobileMenu}
        type="button"
        aria-label="Open navigation"
        onClick={() => {
          setSidebarCollapsed(false);
          setSidebarOpen(true);
        }}
      >
        <Menu size={20} />
      </button>

      {sidebarOpen && <button className={styles.scrim} aria-label="Close navigation" onClick={() => setSidebarOpen(false)} />}

      {userMenuOpen && <button className={styles.menuScrim} type="button" aria-label="Close account menu" onClick={() => setUserMenuOpen(false)} />}

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""} ${sidebarCollapsed ? styles.sidebarRail : ""}`}>
        <div className={styles.sidebarTop}>
          <a href={`${basePath}/`} className={styles.wordmark} aria-label="MOREU home">
            <Image src={`${basePath}/images/moreu-logo-white.png`} alt="MOREU" width={151} height={40} priority />
          </a>
          <button
            className={styles.iconButton}
            type="button"
            aria-label="Close navigation"
            onClick={() => {
              if (window.matchMedia("(max-width: 900px)").matches) setSidebarOpen(false);
              else setSidebarCollapsed(true);
            }}
          >
            <PanelLeftClose size={18} />
          </button>
        </div>

        <nav className={styles.primaryNav} aria-label="Workspace navigation">
          <button
            className={`${styles.primaryItem} ${sidebarDestination === "new-chat" ? styles.primaryItemActive : ""}`}
            type="button"
            onClick={resetCanvas}
          >
            <MessageSquarePlus size={15} /><span>New chat</span><Plus size={12} />
          </button>
          <button
            className={`${styles.primaryItem} ${sidebarDestination === "history" ? styles.primaryItemActive : ""}`}
            type="button"
            onClick={() => setSidebarDestination("history")}
          >
            <History size={15} /><span>History</span>
          </button>
          <button
            className={`${styles.primaryItem} ${sidebarDestination === "projects" ? styles.primaryItemActive : ""}`}
            type="button"
            onClick={() => setSidebarDestination("projects")}
          >
            <Folder size={15} /><span>Projects</span><small>{recentProjects.length}</small>
          </button>
        </nav>

        <div className={styles.sidebarScroll}>
          <section className={styles.railSection}>
            <h2 className={styles.railHeading}>Generate <sup>04</sup></h2>
            <nav className={styles.railList} aria-label="Generate tools">
              <button className={`${styles.railItem} ${mode === "image" ? styles.railItemActive : ""}`} type="button" onClick={() => setMode("image")}>Image generator</button>
              <button className={`${styles.railItem} ${mode === "video" ? styles.railItemActive : ""}`} type="button" onClick={() => setMode("video")}>Video generator</button>
              <button className={styles.railItem} type="button" onClick={() => setPrompt("A realtime canvas for exploring composition, lighting, and materials")}>Realtime canvas</button>
              <button className={styles.railItem} type="button" onClick={resetCanvas}>New creation</button>
            </nav>
          </section>

          <section className={styles.railSection} id="workflows">
            <h2 className={styles.railHeading}>Workflows <sup>{String(workflowTools.length).padStart(2, "0")}</sup></h2>
            <div className={styles.railList}>
              {workflowTools.map(([label, toolPrompt]) => (
                <button className={styles.railItem} type="button" key={label} onClick={() => setPrompt(toolPrompt)}>{label}</button>
              ))}
            </div>
          </section>

          <section className={styles.railSection} id="projects">
            <h2 className={styles.railHeading}>Recent <sup>03</sup></h2>
            <div className={styles.railList}>
              {recentProjects.map((project) => (
                <button className={styles.railItem} type="button" key={project}>{project}</button>
              ))}
            </div>
          </section>
        </div>

        <div className={styles.sidebarBottom}>
          <button
            className={styles.userCard}
            type="button"
            aria-haspopup="menu"
            aria-expanded={userMenuOpen}
            onClick={() => {
              setCreditsMenuOpen(false);
              setUserMenuOpen((value) => !value);
            }}
          >
            <span className={styles.avatar}>M</span>
            <span className={styles.userMeta}>
              <span className={styles.userName}>Martino</span>
              <span className={styles.userPlan}>Free plan</span>
            </span>
            <ChevronsUpDown size={14} />
          </button>
        </div>

        <div className={styles.rail}>
          <a href={`${basePath}/`} className={styles.railMark} aria-label="MOREU home">M</a>
          <button className={styles.railIcon} type="button" aria-label="Expand navigation" onClick={() => setSidebarCollapsed(false)}>
            <PanelLeftOpen size={18} />
            <span className={styles.railTip}>Expand sidebar</span>
          </button>
          <span className={styles.railDivider} />
          <nav className={styles.railNav} aria-label="Workspace navigation">
            <button className={`${styles.railIcon} ${sidebarDestination === "new-chat" ? styles.railIconActive : ""}`} type="button" aria-label="New chat" onClick={resetCanvas}>
              <MessageSquarePlus size={18} /><span className={styles.railTip}>New chat</span>
            </button>
            <button className={`${styles.railIcon} ${sidebarDestination === "history" ? styles.railIconActive : ""}`} type="button" aria-label="History" onClick={() => setSidebarDestination("history")}>
              <History size={18} /><span className={styles.railTip}>History</span>
            </button>
            <button className={`${styles.railIcon} ${sidebarDestination === "projects" ? styles.railIconActive : ""}`} type="button" aria-label="Projects" onClick={() => setSidebarDestination("projects")}>
              <Folder size={18} /><span className={styles.railTip}>Projects</span>
            </button>
          </nav>
          <span className={styles.railDivider} />
          <nav className={styles.railNav} aria-label="Generate tools">
            <button className={`${styles.railIcon} ${mode === "image" ? styles.railIconActive : ""}`} type="button" aria-label="Image generator" onClick={() => setMode("image")}>
              <ImageIcon size={18} />
              <span className={styles.railTip}>Image generator</span>
            </button>
            <button className={`${styles.railIcon} ${mode === "video" ? styles.railIconActive : ""}`} type="button" aria-label="Video generator" onClick={() => setMode("video")}>
              <VideoIcon size={18} />
              <span className={styles.railTip}>Video generator</span>
            </button>
            <button className={styles.railIcon} type="button" aria-label="Realtime canvas" onClick={() => setPrompt("A realtime canvas for exploring composition, lighting, and materials")}>
              <Wand2 size={18} />
              <span className={styles.railTip}>Realtime canvas</span>
            </button>
            <button className={styles.railIcon} type="button" aria-label="New creation" onClick={resetCanvas}>
              <Plus size={18} />
              <span className={styles.railTip}>New creation</span>
            </button>
          </nav>
          <button
            className={`${styles.railIcon} ${styles.railAvatar}`}
            type="button"
            aria-haspopup="menu"
            aria-expanded={userMenuOpen}
            aria-label="Account menu"
            onClick={() => {
              setCreditsMenuOpen(false);
              setUserMenuOpen((value) => !value);
            }}
          >
            <span className={styles.avatar}>M</span>
            <span className={styles.railTip}>Martino · Free plan</span>
          </button>
        </div>

        {userMenuOpen && (
          <div className={styles.userMenu} role="menu">
            <div className={styles.userMenuHead}>
              <span className={styles.avatar}>M</span>
              <div>
                <p>Martino</p>
                <span>martino@moreu.studio</span>
              </div>
            </div>
            <div className={styles.menuDivider} />
            <button className={`${styles.menuItem} ${styles.menuItemHighlight}`} type="button" role="menuitem" onClick={() => setUserMenuOpen(false)}>
              <Sparkles size={14} /><span>Upgrade to Pro</span><em>NEW</em>
            </button>
            <button className={styles.menuItem} type="button" role="menuitem" onClick={() => setUserMenuOpen(false)}>
              <Settings size={14} /><span>Settings</span>
            </button>
            <button className={styles.menuItem} type="button" role="menuitem" onClick={() => setUserMenuOpen(false)}>
              <Keyboard size={14} /><span>Shortcuts</span><kbd>/</kbd>
            </button>
            <button className={styles.menuItem} type="button" role="menuitem" onClick={() => setUserMenuOpen(false)}>
              <CircleHelp size={14} /><span>Help &amp; feedback</span>
            </button>
            <div className={styles.menuDivider} />
            <button className={`${styles.menuItem} ${styles.menuItemDanger}`} type="button" role="menuitem" onClick={() => setUserMenuOpen(false)}>
              <LogOut size={14} /><span>Log out</span>
            </button>
          </div>
        )}
      </aside>

      <section className={styles.workspace} id="create" ref={workspaceRef} onPointerMove={handleWorkspacePointer}>
        <div className={styles.aurora} aria-hidden="true"><span /><span /></div>

        {creditsMenuOpen && <button className={styles.creditsMenuScrim} type="button" aria-label="Close credits menu" onClick={() => setCreditsMenuOpen(false)} />}

        <header className={styles.topbar}>
          <div className={styles.modeSwitch} data-mode={mode} aria-label="Generation type">
            <span className={styles.modeGlider} aria-hidden="true" />
            <button className={mode === "image" ? styles.modeActive : ""} onClick={() => { setMode("image"); setModelMenuOpen(false); }} type="button">Image</button>
            <button className={mode === "video" ? styles.modeActive : ""} onClick={() => { setMode("video"); setModelMenuOpen(false); }} type="button">Video</button>
          </div>
          <button
            className={styles.credits}
            type="button"
            aria-haspopup="menu"
            aria-expanded={creditsMenuOpen}
            onClick={() => {
              setUserMenuOpen(false);
              setModelMenuOpen(false);
              setCreditsMenuOpen((open) => !open);
            }}
          >
            <span>100</span>
            <span className={styles.creditsText}>credits</span>
            <ChevronDown size={11} />
          </button>
          {creditsMenuOpen && (
            <div className={styles.creditsMenu} role="menu" aria-label="Credits menu">
              <div className={styles.creditsMenuHead}>
                <div>
                  <span>Available balance</span>
                  <strong>100 credits</strong>
                </div>
                <em>Free plan</em>
              </div>
              <div className={styles.creditMeter} aria-hidden="true"><span /></div>
              <p className={styles.creditHint}>Credits refresh with your plan or can be purchased anytime.</p>
              <div className={styles.menuDivider} />
              <button className={`${styles.creditMenuItem} ${styles.creditMenuItemPrimary}`} type="button" role="menuitem" onClick={() => setCreditsMenuOpen(false)}>
                <Plus size={14} />
                <span><strong>Buy credits</strong><small>Add more credits instantly</small></span>
              </button>
              <button className={styles.creditMenuItem} type="button" role="menuitem" onClick={() => setCreditsMenuOpen(false)}>
                <History size={14} />
                <span><strong>View usage</strong><small>Review your credit activity</small></span>
              </button>
              <button className={styles.creditMenuItem} type="button" role="menuitem" onClick={() => setCreditsMenuOpen(false)}>
                <Settings size={14} />
                <span><strong>Manage plan</strong><small>Billing and plan settings</small></span>
              </button>
            </div>
          )}
        </header>

        <div className={`${styles.stage} ${resultPrompt || generating ? styles.stageWithResult : ""}`}>
          {!resultPrompt && !generating ? (
            <div className={styles.welcome}>
              <h1 className={styles.welcomeTitle} aria-label="Tell me what you want to make.">
                {headlineWords.map((word, index) => (
                  <span className={styles.wordMask} key={word} aria-hidden="true">
                    <span style={{ animationDelay: `${150 + index * 65}ms` }}>{word}&nbsp;</span>
                  </span>
                ))}
                <span className={styles.wordMask} aria-hidden="true">
                  <span className={styles.wordAccent} style={{ animationDelay: `${150 + headlineWords.length * 65}ms` }}>make.</span>
                </span>
              </h1>
              <p>Start with a thought — it doesn&apos;t have to be a perfect prompt.</p>
            </div>
          ) : (
            <div className={styles.resultArea} aria-live="polite">
              <div
                className={`${styles.resultCard} ${generating ? styles.isGenerating : ""}`}
                ref={resultCardRef}
                onPointerMove={handleCardTilt}
                onPointerLeave={resetCardTilt}
              >
                <Image
                  src={`${basePath}${mode === "image" ? "/images/cinematic-valley.png" : "/images/floating-sofa.png"}`}
                  alt="Generated concept preview"
                  fill
                  priority
                  sizes="(max-width: 900px) 92vw, 760px"
                />
                <div className={styles.resultShade} />
                {generating ? (
                  <>
                    <div className={styles.generatingLabel}>
                      <Sparkles size={17} />
                      <span>Creating your {mode}</span>
                      <span className={styles.ellipsis} aria-hidden="true"><i>.</i><i>.</i><i>.</i></span>
                    </div>
                    <div className={styles.resultProgress} aria-hidden="true"><span /></div>
                  </>
                ) : (
                  <div className={styles.resultMeta}>
                    <span>MOREU / {mode.toUpperCase()}</span>
                    <p>{resultPrompt}</p>
                  </div>
                )}
              </div>
              {!generating && (
                <div className={styles.resultActions}>
                  <button type="button"><SlidersHorizontal size={15} />Refine</button>
                  <button type="button" onClick={() => setPrompt(`${resultPrompt}, alternate composition`)}><Layers3 size={15} />Variations</button>
                </div>
              )}
            </div>
          )}

          <div className={styles.composerBlock}>
            <input
              ref={fileInput}
              className={styles.hiddenInput}
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) setAttachment(URL.createObjectURL(file));
              }}
            />

            {!resultPrompt && !generating ? (
              <>
                <div className={`${styles.orbShell} ${modelMenuOpen ? styles.orbShellMenuOpen : ""}`}>
                  <svg className={styles.orbOrbitText} viewBox="0 0 496 496" aria-hidden="true">
                    <defs>
                      <path id="moreu-orbit" d="M248 248 m -228 0 a 228 228 0 1 1 456 0 a 228 228 0 1 1 -456 0" />
                    </defs>
                    <text>
                      <textPath href="#moreu-orbit">MOREU CREATIVE STUDIO · DREAM IN PIXELS · MOREU CREATIVE STUDIO · DREAM IN PIXELS · MOREU CREATIVE STUDIO · DREAM IN PIXELS · MOREU CREATIVE STUDIO · DREAM IN PIXELS ·</textPath>
                    </text>
                  </svg>
                  <form className={`${styles.orbComposer} ${listening ? styles.orbListening : ""}`} onSubmit={submitPrompt}>
                    <ParticleVoiceOrb active={listening} className={styles.particleCanvas} />
                    <button
                      className={styles.orbStatus}
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={modelMenuOpen}
                      onClick={() => setModelMenuOpen((open) => !open)}
                    >
                      <i className={styles.modelDot} />
                      {selectedModel.name}
                      <ChevronDown size={10} />
                    </button>
                    <button
                      className={`${styles.modelMenuBackdrop} ${modelMenuOpen ? styles.modelMenuBackdropOpen : ""}`}
                      type="button"
                      aria-label="Close model menu"
                      aria-hidden={!modelMenuOpen}
                      tabIndex={modelMenuOpen ? 0 : -1}
                      onClick={() => setModelMenuOpen(false)}
                    />
                    <div
                      className={`${styles.modelMenu} ${modelMenuOpen ? styles.modelMenuOpen : ""}`}
                      role="menu"
                      aria-label={`${mode} models`}
                      aria-hidden={!modelMenuOpen}
                    >
                      <div className={styles.modelMenuLabel}><span />Models</div>
                      <p className={styles.modelDescription}>{selectedModel.description}</p>
                      <div className={styles.modelOptions}>
                        {availableModels.map((model) => {
                          const isSelected = model.id === selectedModel.id;
                          return (
                            <button
                              className={isSelected ? styles.modelOptionActive : ""}
                              type="button"
                              role="menuitemradio"
                              aria-checked={isSelected}
                              disabled={!modelMenuOpen}
                              key={model.id}
                              onClick={() => selectModel(model.id)}
                            >
                              <span className={styles.modelOptionIcon}>{isSelected ? <Check size={11} /> : <Plus size={11} />}</span>
                              <strong>{model.name}</strong>
                              <small>{model.detail}</small>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                    {attachment && (
                      <div className={styles.attachmentPreview}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={attachment} alt="Attached reference" />
                        <button type="button" aria-label="Remove attachment" onClick={() => setAttachment(null)}><X size={13} /></button>
                      </div>
                    )}
                    <div className={styles.orbCore}>
                      <textarea
                        id="prompt-input"
                        value={prompt}
                        onChange={(event) => setPrompt(event.target.value)}
                        placeholder="Describe it in your own words..."
                        rows={3}
                        aria-label={`Describe the ${mode} you want to create`}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" && !event.shiftKey) {
                            event.preventDefault();
                            event.currentTarget.form?.requestSubmit();
                          }
                        }}
                      />
                      <div className={styles.orbActionRow}>
                        <span />
                        <button className={styles.orbSubmit} type="submit" disabled={!prompt.trim()} aria-label="Generate"><ArrowUp size={19} /></button>
                        <span />
                      </div>
                    </div>
                    <div className={styles.orbTools}>
                      <button className={listening ? styles.listening : ""} type="button" onClick={() => setListening((value) => !value)}>
                        <Mic size={18} /><span>{listening ? "Listening" : "Voice"}</span>
                      </button>
                      <button type="button" onClick={() => fileInput.current?.click()}>
                        <Paperclip size={18} /><span>Reference</span>
                      </button>
                    </div>
                    <div className={styles.orbSettings}>
                      <button type="button"><SlidersHorizontal size={12} />{mode === "image" ? "16:9" : "5 sec"}</button>
                      <button type="button">Quality <ChevronDown size={11} /></button>
                    </div>
                  </form>
                </div>
                <p className={styles.orbHint}>A rough idea is enough — press <kbd>/</kbd> to begin.</p>
              </>
            ) : generating ? (
              <div className={styles.generatingStatus} role="status">
                <span className={styles.generatingDot} />
                <p key={phraseIndex}>{generatingPhrases[phraseIndex]}</p>
              </div>
            ) : (
              <form className={`${styles.composer} ${styles.followupComposer}`} onSubmit={submitPrompt}>
                <textarea
                  id="prompt-input"
                  value={prompt}
                  onChange={(event) => setPrompt(event.target.value)}
                  placeholder="Describe what you want to change..."
                  rows={1}
                  aria-label={`Describe what you want to change in the ${mode}`}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      event.currentTarget.form?.requestSubmit();
                    }
                  }}
                />
                <div className={styles.composerToolbar}>
                  <div className={styles.toolGroup}>
                    <button type="button" className={styles.roundTool} aria-label="Attach a reference" onClick={() => fileInput.current?.click()}><Paperclip size={16} /></button>
                    <button type="button" className={styles.settingPill}><span>Refine result</span><ChevronDown size={13} /></button>
                  </div>
                  <button className={styles.submitButton} type="submit" disabled={!prompt.trim()} aria-label="Generate"><ArrowUp size={18} /></button>
                </div>
              </form>
            )}
            <p className={styles.disclaimer}>MOREU can make mistakes. Review outputs before publishing.</p>
          </div>
        </div>
      </section>

      <div className={styles.grain} aria-hidden="true" />
    </main>
  );
}
