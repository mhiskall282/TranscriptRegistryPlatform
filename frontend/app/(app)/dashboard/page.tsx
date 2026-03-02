"use client"

import { useAccount } from "wagmi"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Certificate01Icon,
  Shield01Icon,
  FlashIcon,
  Building06Icon,
} from "@hugeicons/core-free-icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { usePlatformStats, usePlatformAdmin } from "@/hooks/use-university-factory"
import { truncateAddress } from "@/lib/utils"

function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: typeof Certificate01Icon
}) {
  return (
    <Card className="border-[var(--tc-border)] bg-[var(--tc-bg)]">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[var(--tc-gold)]/10 text-[var(--tc-gold)]">
          <HugeiconsIcon icon={icon} size={20} color="currentColor" />
        </div>
        <div>
          <p className="text-xs text-[var(--tc-muted)]">{label}</p>
          <p
            className="text-xl font-semibold text-[var(--tc-text)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function DashboardPage() {
  const { address } = useAccount()
  const { data: stats } = usePlatformStats()
  const { data: adminAddress } = usePlatformAdmin()

  const isAdmin = address && adminAddress && address.toLowerCase() === adminAddress.toLowerCase()
  const totalUniversities = stats ? Number(stats[0]) : 0
  const activeCount = stats ? Number(stats[1]) : 0

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1
          className="text-2xl font-light tracking-tight text-[var(--tc-text)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Dashboard
        </h1>
        <div className="mt-1 flex items-center gap-2">
          {address && (
            <span className="font-mono text-xs text-[var(--tc-muted)]">
              {truncateAddress(address)}
            </span>
          )}
          {isAdmin && (
            <Badge className="bg-[var(--tc-gold)]/10 text-[var(--tc-gold)]">
              Platform Admin
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Universities"
          value={String(totalUniversities)}
          icon={Building06Icon}
        />
        <StatCard
          label="Active"
          value={String(activeCount)}
          icon={Shield01Icon}
        />
        <StatCard
          label="Transcripts"
          value="—"
          icon={Certificate01Icon}
        />
        <StatCard
          label="Verifications"
          value="—"
          icon={FlashIcon}
        />
      </div>

      <Card className="border-[var(--tc-border)] bg-[var(--tc-bg)]">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-[var(--tc-text)]">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <QuickAction
            href="/transcripts"
            label="My Transcripts"
            description="View and manage your credentials"
          />
          <QuickAction
            href="/verify"
            label="Verify a Record"
            description="Check transcript authenticity"
          />
          <QuickAction
            href="/issue"
            label="Issue Transcript"
            description="Register a new credential on-chain"
          />
        </CardContent>
      </Card>
    </div>
  )
}

function QuickAction({
  href,
  label,
  description,
}: {
  href: string
  label: string
  description: string
}) {
  return (
    <a
      href={href}
      className="rounded-lg border border-[var(--tc-border)] p-4 transition-colors hover:border-[var(--tc-gold)]/30 hover:bg-[var(--tc-surface)]"
    >
      <p className="text-sm font-medium text-[var(--tc-text)]">{label}</p>
      <p className="mt-0.5 text-xs text-[var(--tc-muted)]">{description}</p>
    </a>
  )
}
