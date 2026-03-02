"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

const STATS = [
  { label: "Partner Universities", value: "3" },
  { label: "Transcripts Issued", value: "1,200+" },
  { label: "Avg. Verification", value: "< 5s" },
]

const EASE = [0.16, 1, 0.3, 1] as const

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.65, ease: EASE, delay },
  }
}

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-white pt-16">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#fdf8f2] via-white to-white" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,rgba(201,147,63,0.07),transparent)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_80%,rgba(201,147,63,0.04),transparent)]" />

      <div className="pointer-events-none absolute inset-y-0 right-0 flex select-none items-center overflow-hidden pr-4 md:pr-12">
        <span
          className="font-bold uppercase tracking-widest text-[#0f1117] opacity-[0.04]"
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
        <motion.div
          {...fadeUp(0)}
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-[#f9fafb] px-3 py-1.5"
        >
          <span className="size-1.5 animate-pulse rounded-full bg-[var(--tc-gold)]" />
          <span className="font-mono text-xs text-[#6b7280]">
            Introducing CredAxis
          </span>
        </motion.div>

        <motion.h1
          {...fadeUp(0.1)}
          className="mb-6 text-5xl font-light leading-[1.05] tracking-tight text-[#0f1117] md:text-7xl lg:text-[5.5rem]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Academic Transcripts,
          <br />
          <em className="not-italic font-semibold text-[var(--tc-gold)]">
            Built for Trust.
          </em>
        </motion.h1>

        <motion.p
          {...fadeUp(0.2)}
          className="mb-10 max-w-lg text-base leading-relaxed text-[#4b5563] md:text-lg"
        >
          Immutable. Verifiable. Student-controlled. Issue and verify academic
          credentials on-chain — no intermediaries, no delays.
        </motion.p>

        <motion.div {...fadeUp(0.3)} className="mb-16 flex flex-wrap gap-3">
          <Button
            asChild
            size="lg"
            className="bg-[var(--tc-gold)] px-6 text-white transition-all hover:-translate-y-0.5 hover:bg-[var(--tc-gold-light)] hover:shadow-[0_8px_24px_rgba(201,147,63,0.25)]"
          >
            <Link href="/issue">Issue Transcript →</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-[#e5e7eb] px-6 text-[#0f1117] transition-all hover:-translate-y-0.5 hover:bg-[#f9fafb]"
          >
            <Link href="/verify">Verify a Record →</Link>
          </Button>
        </motion.div>

        <motion.div
          {...fadeUp(0.45)}
          className="flex flex-wrap items-center gap-8 border-t border-[#e5e7eb] pt-8"
        >
          {STATS.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-8">
              <div>
                <div
                  className="mb-0.5 text-2xl font-semibold text-[#0f1117] md:text-3xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {stat.value}
                </div>
                <div className="text-xs uppercase tracking-wider text-[#6b7280]">
                  {stat.label}
                </div>
              </div>
              {i < STATS.length - 1 && (
                <div className="h-8 w-px bg-[#e5e7eb]" />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
