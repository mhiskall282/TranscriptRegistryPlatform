"use client"

import { usePrivy } from "@privy-io/react-auth"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import type { ReactNode } from "react"

interface AuthGateProps {
  children: ReactNode
}

export function AuthGate({ children }: AuthGateProps) {
  const { ready, authenticated, login } = usePrivy()

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--tc-bg)]">
        <div className="size-8 animate-pulse rounded-lg bg-[var(--tc-surface)]" />
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen">
        {/* Left — gradient brand panel */}
        <div className="relative hidden w-1/2 flex-col justify-end overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d14] via-[#1a1408] to-[#c9933f]/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(201,147,63,0.3),transparent)]" />

          <div className="relative z-10 p-12">
            <h2
              className="mb-3 text-3xl font-light leading-snug tracking-tight text-white/90 md:text-4xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Secure academic credentials,
              <br />
              verified on-chain.
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-white/50">
              Issue, manage, and verify transcripts with cryptographic trust.
              No intermediaries. No delays.
            </p>
          </div>
        </div>

        {/* Right — sign in */}
        <div className="flex w-full flex-col items-center justify-center bg-[var(--tc-bg)] px-8 lg:w-1/2">
          <div className="w-full max-w-sm">
            <Logo size="md" className="mb-10" />

            <h1
              className="mb-2 text-2xl font-light tracking-tight text-[var(--tc-text)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Welcome to CredAxis
            </h1>
            <p className="mb-8 text-sm text-[var(--tc-muted)]">
              Sign in to access your dashboard, manage transcripts, and verify
              credentials.
            </p>

            <Button
              onClick={login}
              className="w-full bg-[var(--tc-gold)] py-3 text-white hover:bg-[var(--tc-gold-light)]"
              size="lg"
            >
              Sign In
            </Button>

            <p className="mt-6 text-center text-xs text-[var(--tc-muted)]">
              Supports email, Google, or any Ethereum wallet
            </p>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
