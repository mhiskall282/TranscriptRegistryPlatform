"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"

const NAV_LINKS = [
  { label: "How it Works", href: "#how-it-works" },
  { label: "Features", href: "#features" },
  { label: "Verify", href: "/verify" },
]

export function Navbar() {
  return (
    <motion.nav
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 h-16 border-b border-[var(--tc-border)] bg-[var(--tc-bg)]/80 backdrop-blur-md"
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        <Logo size="sm" />

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-sm text-[var(--tc-muted)] transition-colors hover:text-[var(--tc-text)]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <Button asChild size="lg" className="bg-[var(--tc-gold)] px-5 text-white hover:bg-[var(--tc-gold-light)]">
          <Link href="/dashboard">Sign In</Link>
        </Button>
      </div>
    </motion.nav>
  )
}
