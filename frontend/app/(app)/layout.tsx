"use client"

import { Sidebar } from "@/components/app/sidebar"
import { Topbar } from "@/components/app/topbar"
import { AuthGate } from "@/components/app/auth-gate"
import type { ReactNode } from "react"

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGate>
      <div className="flex h-screen bg-[var(--tc-bg)]">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar />
          <main className="flex-1 overflow-y-auto bg-[var(--tc-surface)] p-6">
            {children}
          </main>
        </div>
      </div>
    </AuthGate>
  )
}
