import { useRef, type ReactNode } from "react";
import type React from "react";
import { Logo } from "../components/Logo";
import { MoonIcon, SunIcon } from "../components/Toolbar";
import { href } from "../route";
import { useTheme } from "../theme";
import { EXAMPLES, type Example } from "./examples";
import { Preview } from "./Preview";

/** The app's version, from package.json (vite.config.ts). */
export const APP_VERSION = `v${__APP_VERSION__}`;

/** Where the project lives, and how to reach its author. */
export const REPO_URL = "https://github.com/MatthewYu402/LeetCode-Visualizer";
export const CONTACT_EMAIL = "myu22826@gmail.com";

/** Languages, in the order they arrived. */
export const LANGUAGE_STATUS: { name: string; ready: boolean; note: string }[] = [
  { name: "C++", ready: true, note: "Available now" },
  { name: "Python", ready: true, note: "Available now" },
  { name: "Java", ready: true, note: "Available now" },
];

/**
 * The home page (docs/frontend.md §12): what the tool is, a live preview, a way in with your
 * own Solution, example problems that open the sandbox filled in, how a run works, and the
 * languages. It scrolls, unlike the sandbox, which is one screen.
 */
export function Home() {
  const { theme, toggle } = useTheme();
  const otherTheme = theme === "dark" ? "light" : "dark";
  const examplesRef = useRef<HTMLElement>(null);
  const howRef = useRef<HTMLElement>(null);
  const langsRef = useRef<HTMLElement>(null);
  // In-page jumps scroll, never set a #anchor: the hash is the route.
  const jump = (ref: React.RefObject<HTMLElement | null>) => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  const sections: { label: string; ref: React.RefObject<HTMLElement | null> }[] = [
    { label: "Examples", ref: examplesRef },
    { label: "How it works", ref: howRef },
    { label: "Languages", ref: langsRef },
  ];

  return (
    <div className="home">
      <header className="home-bar">
        <a className="brand" href={href({ page: "home" })}>
          <Logo height={18} />
          <span className="brand-name">Visi</span>
        </a>
        <nav className="home-nav" aria-label="Sections">
          {sections.map((n) => (
            <button key={n.label} type="button" className="home-nav-link" onClick={() => jump(n.ref)}>
              {n.label}
            </button>
          ))}
        </nav>
        <div className="topbar-end">
          <button type="button" className="control icon-control" aria-label={`Switch to the ${otherTheme} theme`} title={`Switch to the ${otherTheme} theme`} onClick={toggle}>
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <a className="run-button" href={href({ page: "sandbox" })}>
            Open the sandbox
          </a>
        </div>
      </header>

      <main className="home-main">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-text">
            <p className="version-badge">
              <span className="lang-dot is-ready" aria-hidden="true" />
              {APP_VERSION}
            </p>
            <h1 id="hero-title" className="hero-title">
              Watch your Solution run,
              <br />
              <span className="hero-accent">one line at a time.</span>
            </h1>
            <p className="hero-lede">
              Paste a <code>Solution</code> class, add an example, and step through it. Every array, map, stack, linked list,
              tree, and graph it touches is drawn as it changes, beside the line that changed it.
            </p>
            <div className="hero-actions">
              <a className="run-button hero-cta" href={href({ page: "sandbox" })}>
                <PasteIcon />
                Paste a Solution
              </a>
              <button type="button" className="control hero-secondary" onClick={() => jump(examplesRef)}>
                Try an example
              </button>
            </div>
            <p className="hero-note">
              <span className="lang-dot is-ready" aria-hidden="true" />
              C++, Python, and Java.
            </p>
          </div>
          <Preview />
        </section>

        <section ref={examplesRef} className="home-section" aria-labelledby="examples-title">
          <div className="section-head">
            <h2 id="examples-title" className="section-title">
              Start from an example
            </h2>
            <p className="section-lede">
              Each opens the sandbox with the C++ Solution in the editor and the example in the inputs. Press Run code to see it. The sandbox's Examples
              menu has each one in Python and Java too.
            </p>
          </div>
          <ul className="example-grid">
            {EXAMPLES.map((e) => (
              <li key={e.slug}>
                <ExampleCard example={e} />
              </li>
            ))}
          </ul>
        </section>

        <section ref={howRef} className="home-section" aria-labelledby="how-title">
          <div className="section-head">
            <h2 id="how-title" className="section-title">
              How it works
            </h2>
            <p className="section-lede">Your code runs as written, in its own language. What comes back is a recording of its data, one snapshot per line.</p>
          </div>
          <ol className="how">
            <HowStep n={1} title="Your Solution and an example" visual={<HowCode />}>
              Your <code>Solution</code> class in the LeetCode format, with the commented <code>ListNode</code>, <code>TreeNode</code>, or <code>Node</code> above
              it, and an example input. Visi builds on those comments to know how your lists, trees, and graphs are made. Nothing to annotate.
            </HowStep>
            <HowStep n={2} title="Run in a sandbox" visual={<HowSandbox />}>
              The code is instrumented before each line and run in an isolated container, with no network and strict limits.
            </HowStep>
            <HowStep n={3} title="A trace" visual={<HowTrace />}>
              Every step, the whole call stack and every value, written in one language-neutral format: <code>array</code>, <code>map</code>, <code>ref</code>,
              not <code>vector</code> or <code>dict</code>.
            </HowStep>
            <HowStep n={4} title="The canvas" visual={<HowCanvas />}>
              Each structure gets a card. Step forward, back, or scrub; what changed is highlighted, and so is what the line read.
            </HowStep>
          </ol>
        </section>

        <section ref={langsRef} className="home-section" aria-labelledby="langs-title">
          <div className="section-head">
            <h2 id="langs-title" className="section-title">
              Languages
            </h2>
            <p className="section-lede">The canvas never knows which language ran, so each new language needs only its own adapter.</p>
          </div>
          <ul className="lang-list">
            {LANGUAGE_STATUS.map((l) => (
              <li key={l.name} className={`lang-item${l.ready ? " is-ready" : ""}`}>
                <span className={`lang-dot${l.ready ? " is-ready" : ""}`} aria-hidden="true" />
                <span className="lang-name">{l.name}</span>
                <span className="lang-note">{l.note}</span>
              </li>
            ))}
          </ul>
        </section>

        <footer className="home-foot">
          <Logo height={14} />
          <span>Visi · Apache License 2.0</span>
          <span className="home-foot-links">
            <a className="foot-link" href={REPO_URL} target="_blank" rel="noopener noreferrer">
              <CodeIcon />
              GitHub
            </a>
            <a className="foot-link" href={`mailto:${CONTACT_EMAIL}`}>
              <MailIcon />
              {CONTACT_EMAIL}
            </a>
          </span>
        </footer>
      </main>
    </div>
  );
}

function ExampleCard({ example }: { example: Example }) {
  return (
    <a className="example-card" href={href({ page: "sandbox", example: example.slug })}>
      <span className="example-card-head">
        <span className="example-card-title">{example.title}</span>
        <span className={`difficulty is-${example.difficulty.toLowerCase()}`}>{example.difficulty}</span>
      </span>
      <span className="example-card-blurb">{example.blurb}</span>
      <span className="example-card-foot">
        <span className="example-tags">
          {example.tags.map((t) => (
            <span key={t} className="example-tag">
              {t}
            </span>
          ))}
        </span>
        <span className="example-open" aria-hidden="true">
          Open
          <svg className="icon-stroke" width="12" height="12" viewBox="0 0 12 12">
            <path d="M2.5 6h7M6.5 3l3 3-3 3" />
          </svg>
        </span>
      </span>
    </a>
  );
}

/**
 * One step of How it works: its number on the rail that joins the steps, its title and text, and
 * beside them (under them on narrow screens) a small picture of what that step looks like, taken
 * from the Reverse Linked List example the preview replays.
 */
function HowStep({ n, title, visual, children }: { n: number; title: string; visual: ReactNode; children: ReactNode }) {
  return (
    <li className="how-step">
      <span className="how-rail" aria-hidden="true">
        <span className="how-n">{n}</span>
      </span>
      <div className="how-body">
        <h3 className="how-title">{title}</h3>
        <p className="how-text">{children}</p>
      </div>
      <div className="how-visual">{visual}</div>
    </li>
  );
}

/** Step 1: the class as pasted, its commented node definition, and an example. */
function HowCode() {
  return (
    <pre className="how-sample" aria-label="A Solution class with its commented ListNode, and an example input">
      <span className="tok-comment">{"/* struct ListNode { int val; ListNode *next; }; */"}</span>
      {"\n"}
      <span className="tok-keyword">class</span>
      {" Solution {\n"}
      <span className="tok-keyword">public</span>
      {":\n    ListNode* reverseList(ListNode* head) { \u2026 }\n};\n\n"}
      <span className="how-sample-muted">Input:</span>
      {" head = [4,8,15,16,23]"}
    </pre>
  );
}

const SANDBOX_LIMITS = ["no network", "read-only files", "10 s to run", "a memory cap", "one container per run"];

/** Step 2: the container and its limits (docs/sandboxing.md §3). */
function HowSandbox() {
  return (
    <div className="how-box">
      <span className="how-box-title">isolated container · gVisor</span>
      <ul className="how-chips">
        {SANDBOX_LIMITS.map((l) => (
          <li key={l} className="how-chip">
            {l}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Step 3: part of a real step of the Reverse Linked List trace (step 7), with "…" for what is left out. */
function HowTrace() {
  const str = (t: string) => <span className="tok-string">{t}</span>;
  return (
    <pre className="how-sample" aria-label="Part of one step of a trace, in JSON">
      {'{"step": 7,\n "frames": [{"id": '}
      {str('"f1"')}
      {', "function": '}
      {str('"reverseList"')}
      {', "line": 7,\n   "locals": {\n     "prev": {"kind": '}
      {str('"ref"')}
      {', "id": '}
      {str('"n1"')}
      {'},\n     "curr": {"kind": '}
      {str('"ref"')}
      {', "id": '}
      {str('"n2"')}
      {'}, \u2026}}],\n "heap": {"n1": {"kind": '}
      {str('"object"')}
      {', "fields": {"val": 4, \u2026}}, \u2026}}'}
    </pre>
  );
}

/** Step 4: the same step drawn as a card: 4 already reversed (prev), 8 onward still ahead (curr). */
function HowCanvas() {
  const values = [4, 8, 15, 16, 23];
  return (
    <figure className="how-box how-card" aria-label="A linked list card: prev on 4, curr on 8, then 15, 16, and 23">
      <figcaption className="how-card-head">
        <span className="how-card-name">head</span> · linked list · 5
      </figcaption>
      <ol className="how-nodes" aria-hidden="true">
        {values.map((v, i) => (
          <li key={v} className={`how-node${i === 0 ? " is-prev" : i === 1 ? " is-curr" : ""}${i >= 2 ? " has-link" : ""}`}>
            <span className="how-node-tag">{i === 0 ? "prev" : i === 1 ? "curr" : ""}</span>
            <span className="how-node-box">{v}</span>
          </li>
        ))}
      </ol>
    </figure>
  );
}

function PasteIcon() {
  return (
    <svg className="icon-stroke" aria-hidden="true" width="14" height="14" viewBox="0 0 16 16">
      <rect x="3.5" y="3" width="9" height="11" rx="2" />
      <path d="M6 3V2.5A1 1 0 0 1 7 1.5h2a1 1 0 0 1 1 1V3M6 7.5h4M6 10h2.5" />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg className="icon-stroke" aria-hidden="true" width="13" height="13" viewBox="0 0 16 16">
      <path d="M5.5 4.5 2 8l3.5 3.5M10.5 4.5 14 8l-3.5 3.5" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg className="icon-stroke" aria-hidden="true" width="13" height="13" viewBox="0 0 16 16">
      <rect x="2" y="3.5" width="12" height="9" rx="1.5" />
      <path d="m2.5 4.5 5.5 4 5.5-4" />
    </svg>
  );
}
