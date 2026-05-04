"use client"

import { motion } from "framer-motion"

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
    accent: "#4f6ef7",
    steps: [
      "Request access from the student",
      "Query the smart contract on-chain",
      "Get instant cryptographic confirmation",
    ],
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[var(--tc-surface)] py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-[var(--tc-gold)]">
            How it Works
          </p>
          <h2
            className="text-3xl font-light tracking-tight text-[var(--tc-text)] md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Three roles. One trust layer.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {HOW_IT_WORKS.map((item, idx) => (
            <motion.div
              key={item.role}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
                delay: idx * 0.1,
              }}
              className="group rounded-xl border border-[var(--tc-border)] bg-[var(--tc-bg)] p-6 transition-all hover:border-[var(--tc-surface-2)] hover:shadow-sm"
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
                      className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded text-[10px] font-bold text-white"
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
