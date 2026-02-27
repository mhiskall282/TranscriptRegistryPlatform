/* ─── Icons ─────────────────────────────────────────────────────── */

function ShieldIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function KeyIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="7.5" cy="15.5" r="5.5" />
      <path d="M21 2l-9.6 9.6" />
      <path d="M15.5 7.5l3 3L22 7l-3-3" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  );
}

function ChainIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

/* ─── Data ──────────────────────────────────────────────────────── */

const STATS = [
  { label: "Partner Universities", value: "3" },
  { label: "Transcripts Issued", value: "1,200+" },
  { label: "Avg. Verification", value: "< 5s" },
];

const HOW_IT_WORKS = [
  {
    role: "Universities",
    accent: "var(--tc-gold)",
    steps: [
      "Deploy your institution's isolated registry",
      "Upload transcript files to IPFS",
      "Issue records on-chain with student privacy hash",
    ],
  },
  {
    role: "Students",
    accent: "var(--tc-teal)",
    steps: [
      "Receive your on-chain transcript",
      "Grant time-limited access to verifiers",
      "Revoke access at any time",
    ],
  },
  {
    role: "Verifiers",
    accent: "#7c9eff",
    steps: [
      "Request access from the student",
      "Query the smart contract on-chain",
      "Get instant cryptographic confirmation",
    ],
  },
];

const FEATURES = [
  {
    title: "Immutable Records",
    description:
      "Every transcript is cryptographically fingerprinted. Once issued on Ethereum, it cannot be altered or forged.",
    icon: <ShieldIcon />,
  },
  {
    title: "Student Access Control",
    description:
      "Students decide who sees their credentials. Grant time-limited access — revoke instantly, no intermediary needed.",
    icon: <KeyIcon />,
  },
  {
    title: "Instant Verification",
    description:
      "Employers and institutions get on-chain confirmation in under 5 seconds. No phone calls, no paperwork.",
    icon: <BoltIcon />,
  },
  {
    title: "Gas-Efficient by Design",
    description:
      "Beacon Proxy architecture reduces per-university deployment cost by 82%. Fully upgradeable without redeployment.",
    icon: <ChainIcon />,
  },
];

/* ─── Sections ──────────────────────────────────────────────────── */

function Navbar() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-16 border-b border-[var(--tc-border)] bg-[var(--tc-bg)]/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded bg-[var(--tc-gold)]">
            <span className="font-mono text-xs font-bold text-[var(--tc-bg)]">
              TR
            </span>
          </div>
          <span className="font-semibold tracking-tight text-[var(--tc-text)]">
            TranscriptChain
          </span>
        </div>

        <div className="hidden items-center gap-8 md:flex">
          {[
            { label: "How it Works", href: "#how-it-works" },
            { label: "Features", href: "#features" },
            { label: "Verify", href: "#verify" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-[var(--tc-muted)] transition-colors hover:text-[var(--tc-text)]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          type="button"
          className="cursor-not-allowed rounded-md bg-[var(--tc-gold)] px-4 py-2 text-sm font-medium text-[var(--tc-bg)] opacity-70"
        >
          Launch App
        </button>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="dot-grid relative flex min-h-screen flex-col justify-center overflow-hidden bg-[var(--tc-bg)] pt-16">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(201,147,63,0.14),transparent)]" />

      {/* Ghost "VERIFIED" decoration */}
      <div className="pointer-events-none absolute inset-y-0 right-0 flex select-none items-center overflow-hidden pr-4 md:pr-12">
        <span
          className="font-bold uppercase tracking-widest opacity-[0.028] text-[var(--tc-text)]"
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(5rem, 14vw, 16rem)",
            lineHeight: 1,
          }}
        >
          VERIFIED
        </span>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:py-36">
        {/* Eyebrow */}
        <div className="animate-in-1 mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--tc-border)] bg-[var(--tc-surface)] px-3 py-1.5">
          <span className="size-1.5 animate-pulse rounded-full bg-[var(--tc-teal)]" />
          <span className="font-mono text-xs text-[var(--tc-muted)]">
            Live on Ethereum Sepolia
          </span>
        </div>

        {/* Headline */}
        <h1
          className="animate-in-2 mb-6 text-5xl font-light leading-[1.05] tracking-tight text-[var(--tc-text)] md:text-7xl lg:text-[5.5rem]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Academic Transcripts,
          <br />
          <em className="not-italic font-semibold text-[var(--tc-gold)]">
            Built for Trust.
          </em>
        </h1>

        {/* Subtitle */}
        <p className="animate-in-3 mb-10 max-w-lg text-base leading-relaxed text-[var(--tc-muted)] md:text-lg">
          Immutable. Verifiable. Student-controlled. Issue and verify academic
          transcripts on-chain — no intermediaries, no delays.
        </p>

        {/* CTAs */}
        <div className="animate-in-4 mb-16 flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-md bg-[var(--tc-gold)] px-6 py-3 text-sm font-medium text-[var(--tc-bg)] transition-all hover:-translate-y-0.5 hover:bg-[var(--tc-gold-light)] hover:shadow-[0_8px_24px_rgba(201,147,63,0.25)]"
          >
            Issue Transcript →
          </button>
          <button
            type="button"
            className="rounded-md border border-[var(--tc-border)] px-6 py-3 text-sm font-medium text-[var(--tc-text)] transition-all hover:-translate-y-0.5 hover:bg-[var(--tc-surface)]"
          >
            Verify a Record →
          </button>
        </div>

        {/* Stats */}
        <div className="animate-in-5 flex flex-wrap items-center gap-8 border-t border-[var(--tc-border)] pt-8">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-8">
              <div>
                <div
                  className="mb-0.5 text-2xl font-semibold text-[var(--tc-text)] md:text-3xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {stat.value}
                </div>
                <div className="text-xs uppercase tracking-wider text-[var(--tc-muted)]">
                  {stat.label}
                </div>
              </div>
              {i < STATS.length - 1 && (
                <div className="h-8 w-px bg-[var(--tc-border)]" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-[var(--tc-surface)] py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[var(--tc-gold)]">
            How it Works
          </p>
          <h2
            className="text-3xl font-light tracking-tight text-[var(--tc-text)] md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Three roles. One trust layer.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {HOW_IT_WORKS.map((item) => (
            <div
              key={item.role}
              className="group rounded-xl border border-[var(--tc-border)] bg-[var(--tc-bg)] p-6 transition-all hover:border-[rgba(255,255,255,0.12)]"
            >
              <p
                className="mb-5 text-xs font-semibold uppercase tracking-[0.15em]"
                style={{ color: item.accent }}
              >
                {item.role}
              </p>
              <ol className="space-y-4">
                {item.steps.map((step, i) => (
                  <li key={step} className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded text-[10px] font-bold text-[var(--tc-bg)]"
                      style={{ backgroundColor: item.accent }}
                    >
                      {i + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-[var(--tc-muted)] transition-colors group-hover:text-[var(--tc-text)]">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section
      id="features"
      className="border-y border-[var(--tc-border)] bg-[var(--tc-bg)] py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[var(--tc-teal)]">
            Features
          </p>
          <h2
            className="text-3xl font-light tracking-tight text-[var(--tc-text)] md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Engineered for trust
            <br />
            at every layer.
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {FEATURES.map(({ title, description, icon }) => (
            <div
              key={title}
              className="group rounded-xl border border-[var(--tc-border)] bg-[var(--tc-surface)] p-6 transition-all hover:-translate-y-0.5 hover:border-[rgba(255,255,255,0.12)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-md border border-[var(--tc-border)] bg-[var(--tc-bg)] text-[var(--tc-gold)]">
                {icon}
              </div>
              <h3 className="mb-2 font-semibold text-[var(--tc-text)]">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--tc-muted)]">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="bg-[var(--tc-surface)] py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-2xl border border-[var(--tc-border)] bg-[var(--tc-bg)] p-10 md:p-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_110%,rgba(201,147,63,0.08),transparent)]" />
          <div className="relative max-w-lg">
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-[var(--tc-gold)]">
              Get Started
            </p>
            <h2
              className="mb-4 text-3xl font-light tracking-tight text-[var(--tc-text)] md:text-5xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Ready to bring your institution on-chain?
            </h2>
            <p className="mb-8 text-sm leading-relaxed text-[var(--tc-muted)]">
              Join KNUST, UG, and UCC on TranscriptChain. Get your
              institution&apos;s isolated, upgradeable registry deployed in
              minutes.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="rounded-md bg-[var(--tc-gold)] px-6 py-3 text-sm font-medium text-[var(--tc-bg)] transition-all hover:-translate-y-0.5 hover:bg-[var(--tc-gold-light)]"
              >
                Request Access →
              </button>
              <button
                type="button"
                className="rounded-md border border-[var(--tc-border)] px-6 py-3 text-sm text-[var(--tc-muted)] transition-all hover:border-[rgba(255,255,255,0.12)] hover:text-[var(--tc-text)]"
              >
                View Documentation
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[var(--tc-border)] bg-[var(--tc-bg)] py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded bg-[var(--tc-gold)]">
            <span className="font-mono text-[10px] font-bold text-[var(--tc-bg)]">
              TR
            </span>
          </div>
          <span className="text-sm text-[var(--tc-muted)]">
            TranscriptChain
          </span>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-[var(--tc-border)] bg-[var(--tc-surface)] px-3 py-1.5">
          <span className="size-1.5 rounded-full bg-[var(--tc-teal)]" />
          <span className="font-mono text-xs text-[var(--tc-muted)]">
            Sepolia: 0x3828Ddf3...230e
          </span>
        </div>

        <p className="text-xs text-[var(--tc-muted)]">
          © 2025 TranscriptChain. Built on Ethereum.
        </p>
      </div>
    </footer>
  );
}

/* ─── Page ──────────────────────────────────────────────────────── */

export default function Page() {
  return (
    <main>
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      <CTASection />
      <Footer />
    </main>
  );
}
