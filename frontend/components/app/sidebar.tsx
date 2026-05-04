"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  GridIcon,
  FileValidationIcon,
  Certificate01Icon,
  SearchAreaIcon,
  Settings01Icon,
} from "@hugeicons/core-free-icons"
import { Logo } from "@/components/ui/logo"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: GridIcon },
  { label: "Transcripts", href: "/transcripts", icon: Certificate01Icon },
  { label: "Issue", href: "/issue", icon: FileValidationIcon },
  { label: "Verify", href: "/verify", icon: SearchAreaIcon },
  { label: "Admin", href: "/admin", icon: Settings01Icon },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-[var(--tc-border)] bg-[var(--tc-bg)]">
      <div className="flex h-16 items-center px-5">
        <Logo size="sm" />
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-[var(--tc-gold)]/10 text-[var(--tc-gold)]"
                  : "text-[var(--tc-muted)] hover:bg-[var(--tc-surface)] hover:text-[var(--tc-text)]",
              )}
            >
              <HugeiconsIcon icon={item.icon} size={18} color="currentColor" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-[var(--tc-border)] px-3 py-4">
        <div className="flex items-center gap-1.5 rounded-full border border-[var(--tc-border)] bg-[var(--tc-surface)] px-3 py-1.5">
          <span className="size-1.5 rounded-full bg-[var(--tc-teal)]" />
          <span className="font-mono text-[10px] text-[var(--tc-muted)]">
            Sepolia
          </span>
        </div>
      </div>
    </aside>
  )
}
