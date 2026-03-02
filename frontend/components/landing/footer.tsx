import Link from "next/link"
import { Logo } from "@/components/ui/logo"

export function Footer() {
  return (
    <footer className="border-t border-[var(--tc-border)] bg-[var(--tc-bg)] py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
        <Logo size="sm" />

        <div className="flex items-center gap-6 text-xs text-[var(--tc-muted)]">
          <Link href="/dashboard" className="transition-colors hover:text-[var(--tc-text)]">
            Launch App
          </Link>
          <Link href="/verify" className="transition-colors hover:text-[var(--tc-text)]">
            Verify
          </Link>
          <Link href="#features" className="transition-colors hover:text-[var(--tc-text)]">
            Features
          </Link>
        </div>

        <p className="text-xs text-[var(--tc-muted)]">
          © 2025 CredAxis. Built on Ethereum.
        </p>
      </div>
    </footer>
  )
}
