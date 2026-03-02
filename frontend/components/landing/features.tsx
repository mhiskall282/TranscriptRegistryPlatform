"use client"

import { motion } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Shield01Icon,
  Key01Icon,
  FlashIcon,
  Link01Icon,
} from "@hugeicons/core-free-icons"

const FEATURES = [
  {
    title: "Immutable Records",
    description:
      "Every transcript is cryptographically fingerprinted. Once issued on Ethereum, it cannot be altered or forged.",
    icon: Shield01Icon,
  },
  {
    title: "Student Access Control",
    description:
      "Students decide who sees their credentials. Grant time-limited access — revoke instantly, no intermediary needed.",
    icon: Key01Icon,
  },
  {
    title: "Instant Verification",
    description:
      "Employers and institutions get on-chain confirmation in under 5 seconds. No phone calls, no paperwork.",
    icon: FlashIcon,
  },
  {
    title: "Gas-Efficient by Design",
    description:
      "Beacon Proxy architecture reduces per-university deployment cost by 82%. Fully upgradeable without redeployment.",
    icon: Link01Icon,
  },
]

export function Features() {
  return (
    <section
      id="features"
      className="border-y border-[var(--tc-border)] bg-[var(--tc-bg)] py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16"
        >
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
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {FEATURES.map(({ title, description, icon }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.55,
                ease: [0.16, 1, 0.3, 1],
                delay: idx * 0.08,
              }}
              whileHover={{ y: -2 }}
              className="group rounded-xl border border-[var(--tc-border)] bg-[var(--tc-surface)] p-6 transition-colors hover:border-[var(--tc-surface-2)] hover:shadow-md"
            >
              <div className="mb-4 flex size-10 items-center justify-center rounded-md border border-[var(--tc-border)] bg-[var(--tc-bg)] text-[var(--tc-gold)]">
                <HugeiconsIcon icon={icon} size={20} color="currentColor" />
              </div>
              <h3 className="mb-2 font-semibold text-[var(--tc-text)]">{title}</h3>
              <p className="text-sm leading-relaxed text-[var(--tc-muted)]">
                {description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
