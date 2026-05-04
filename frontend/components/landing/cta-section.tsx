"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="bg-[var(--tc-surface)] py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-2xl border border-[var(--tc-border)] bg-[var(--tc-bg)] p-10 md:p-16"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_110%,rgba(201,147,63,0.06),transparent)]" />
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
              Join KNUST, UG, and UCC on CredAxis. Get your institution&apos;s
              isolated, upgradeable registry deployed in minutes.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="bg-[var(--tc-gold)] px-6 text-white transition-all hover:-translate-y-0.5 hover:bg-[var(--tc-gold-light)]"
              >
                <Link href="/dashboard">Sign In →</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-[var(--tc-border)] px-6 text-[var(--tc-muted)] transition-all hover:border-[var(--tc-surface-2)] hover:text-[var(--tc-text)]"
              >
                <Link href="/verify">Verify a Record</Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
