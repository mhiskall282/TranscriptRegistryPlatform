"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { truncateAddress } from "@/lib/utils"

export function Topbar() {
  const { login, logout, authenticated, ready } = usePrivy()
  const { address } = useAccount()

  return (
    <header className="flex h-16 items-center justify-end border-b border-[var(--tc-border)] bg-[var(--tc-bg)] px-6">
      {!ready ? (
        <div className="size-8 animate-pulse rounded-lg bg-[var(--tc-surface)]" />
      ) : !authenticated ? (
        <Button
          onClick={login}
          size="lg"
          className="bg-[var(--tc-gold)] px-5 text-white hover:bg-[var(--tc-gold-light)]"
        >
          Sign In
        </Button>
      ) : (
        <div className="flex items-center gap-3">
          {address && (
            <span className="rounded-md border border-[var(--tc-border)] bg-[var(--tc-surface)] px-3 py-1.5 font-mono text-xs text-[var(--tc-text)]">
              {truncateAddress(address)}
            </span>
          )}
          <Button variant="ghost" size="sm" onClick={logout}>
            Disconnect
          </Button>
        </div>
      )}
    </header>
  )
}
