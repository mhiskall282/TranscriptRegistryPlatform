"use client"

import { useState } from "react"
import { type Address } from "viem"
import { useAccount } from "wagmi"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  usePlatformStats,
  usePlatformAdmin,
  useUniversityCount,
  useUniversity,
  useDeployUniversity,
  useDeactivateUniversity,
  useReactivateUniversity,
} from "@/hooks/use-university-factory"
import { truncateAddress, getHumanError } from "@/lib/utils"

function UniversityRow({ id }: { id: bigint }) {
  const { data } = useUniversity(id)
  const deactivate = useDeactivateUniversity()
  const reactivate = useReactivateUniversity()

  if (!data) return null

  const { name, contractAddress, registrar, isActive } = data

  return (
    <div className="flex items-center justify-between rounded-lg border border-[var(--tc-border)] bg-[var(--tc-surface)] p-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-[var(--tc-text)]">{name}</p>
          <Badge
            className={
              isActive
                ? "bg-[var(--tc-teal)]/10 text-[var(--tc-teal)]"
                : "bg-red-500/10 text-red-500"
            }
          >
            {isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <p className="font-mono text-[10px] text-[var(--tc-muted)]">
          Registry: {truncateAddress(contractAddress)} · Registrar:{" "}
          {truncateAddress(registrar)}
        </p>
      </div>
      <div>
        {isActive ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => deactivate.deactivate(id, "Admin deactivation")}
            disabled={deactivate.isPending || deactivate.isConfirming}
            className="border-red-500/30 text-red-500 hover:bg-red-500/10"
          >
            {deactivate.isPending || deactivate.isConfirming
              ? "..."
              : "Deactivate"}
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={() => reactivate.reactivate(id)}
            disabled={reactivate.isPending || reactivate.isConfirming}
            className="border-[var(--tc-teal)]/30 text-[var(--tc-teal)] hover:bg-[var(--tc-teal)]/10"
          >
            {reactivate.isPending || reactivate.isConfirming
              ? "..."
              : "Reactivate"}
          </Button>
        )}
      </div>
    </div>
  )
}

function UniversityList() {
  const { data: count } = useUniversityCount()
  const total = count ? Number(count) : 0

  if (total === 0) {
    return (
      <p className="py-8 text-center text-sm text-[var(--tc-muted)]">
        No universities deployed yet.
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: total }, (_, i) => (
        <UniversityRow key={i} id={BigInt(i)} />
      ))}
    </div>
  )
}

function DeployUniversityForm() {
  const [name, setName] = useState("")
  const [registrar, setRegistrar] = useState("")

  const { deploy, hash, isPending, isConfirming, isSuccess, error } =
    useDeployUniversity()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !registrar) return
    deploy(name, registrar as Address)
  }

  return (
    <Card className="border-[var(--tc-border)] bg-[var(--tc-bg)]">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-[var(--tc-text)]">
          Deploy New University
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs text-[var(--tc-muted)]">
              University Name
            </Label>
            <Input
              placeholder="e.g. Kwame Nkrumah University"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-[var(--tc-border)] bg-[var(--tc-surface)] text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-[var(--tc-muted)]">
              Registrar Address
            </Label>
            <Input
              placeholder="0x..."
              value={registrar}
              onChange={(e) => setRegistrar(e.target.value)}
              className="border-[var(--tc-border)] bg-[var(--tc-surface)] font-mono text-xs"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isPending || isConfirming}
            className="w-full bg-[var(--tc-gold)] text-white hover:bg-[var(--tc-gold-light)]"
          >
            {isPending
              ? "Confirm in wallet..."
              : isConfirming
                ? "Deploying..."
                : "Deploy University"}
          </Button>

          {isSuccess && hash && (
            <div className="rounded-lg border border-[var(--tc-teal)]/30 bg-[var(--tc-teal)]/5 p-4">
              <p className="text-sm font-medium text-[var(--tc-teal)]">
                University deployed!
              </p>
              <p className="mt-1 font-mono text-xs text-[var(--tc-muted)]">
                Tx: {hash}
              </p>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500">{getHumanError(error)}</p>
          )}
        </form>
      </CardContent>
    </Card>
  )
}

export default function AdminPage() {
  const { address } = useAccount()
  const { data: adminAddress } = usePlatformAdmin()
  const { data: stats } = usePlatformStats()

  const isAdmin =
    address && adminAddress && address.toLowerCase() === adminAddress.toLowerCase()

  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1
            className="mb-2 text-xl font-light text-[var(--tc-text)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Admin Access Required
          </h1>
          <p className="text-sm text-[var(--tc-muted)]">
            Only the platform admin can access this page.
          </p>
        </div>
      </div>
    )
  }

  const totalUniversities = stats ? Number(stats[0]) : 0
  const activeCount = stats ? Number(stats[1]) : 0

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1
          className="text-2xl font-light tracking-tight text-[var(--tc-text)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Platform Admin
        </h1>
        <p className="mt-1 text-sm text-[var(--tc-muted)]">
          Manage universities and platform settings
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="border-[var(--tc-border)] bg-[var(--tc-bg)]">
          <CardContent className="p-5">
            <p className="text-xs text-[var(--tc-muted)]">Total Universities</p>
            <p
              className="text-2xl font-semibold text-[var(--tc-text)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {totalUniversities}
            </p>
          </CardContent>
        </Card>
        <Card className="border-[var(--tc-border)] bg-[var(--tc-bg)]">
          <CardContent className="p-5">
            <p className="text-xs text-[var(--tc-muted)]">Active</p>
            <p
              className="text-2xl font-semibold text-[var(--tc-teal)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {activeCount}
            </p>
          </CardContent>
        </Card>
      </div>

      <DeployUniversityForm />

      <Card className="border-[var(--tc-border)] bg-[var(--tc-bg)]">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-[var(--tc-text)]">
            Universities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <UniversityList />
        </CardContent>
      </Card>
    </div>
  )
}
