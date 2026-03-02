"use client"

import { useState } from "react"
import { useAccount } from "wagmi"
import { type Address } from "viem"
import { HugeiconsIcon } from "@hugeicons/react"
import { Certificate01Icon } from "@hugeicons/core-free-icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  useStudentTranscripts,
  useTranscript,
  useGrantAccess,
  useRevokeAccess,
} from "@/hooks/use-transcript-registry"
import {
  studentHash,
  truncateAddress,
  formatTimestamp,
  getHumanError,
} from "@/lib/utils"
import { TRANSCRIPT_STATUS, DURATION_OPTIONS, type TranscriptStatus } from "@/lib/contracts"

const STATUS_COLORS: Record<TranscriptStatus, string> = {
  0: "bg-[var(--tc-teal)]/10 text-[var(--tc-teal)]",
  1: "bg-red-500/10 text-red-500",
  2: "bg-amber-500/10 text-amber-500",
}

function TranscriptCard({
  recordId,
  registryAddress,
}: {
  recordId: `0x${string}`
  registryAddress: Address
}) {
  const [showAccess, setShowAccess] = useState(false)
  const [verifierAddr, setVerifierAddr] = useState("")
  const [duration, setDuration] = useState("")
  const [revokeAddr, setRevokeAddr] = useState("")

  const { data } = useTranscript(registryAddress, recordId)
  const grantAccess = useGrantAccess()
  const revokeAccess = useRevokeAccess()

  if (!data) return null

  const [, metadataCID, , issuer, timestamp, status] = data

  function handleGrant() {
    if (!verifierAddr || !duration) return
    grantAccess.grant(
      registryAddress,
      recordId,
      verifierAddr as Address,
      BigInt(duration),
    )
  }

  function handleRevoke() {
    if (!revokeAddr) return
    revokeAccess.revoke(registryAddress, recordId, revokeAddr as Address)
  }

  return (
    <Card className="border-[var(--tc-border)] bg-[var(--tc-bg)]">
      <CardContent className="p-5">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded bg-[var(--tc-gold)]/10 text-[var(--tc-gold)]">
              <HugeiconsIcon icon={Certificate01Icon} size={16} color="currentColor" />
            </div>
            <div>
              <p className="font-mono text-xs text-[var(--tc-text)]">
                {recordId.slice(0, 10)}...{recordId.slice(-6)}
              </p>
              <p className="text-[10px] text-[var(--tc-muted)]">
                Issued {formatTimestamp(timestamp)} by {truncateAddress(issuer)}
              </p>
            </div>
          </div>
          <Badge className={STATUS_COLORS[status as TranscriptStatus]}>
            {TRANSCRIPT_STATUS[status as TranscriptStatus]}
          </Badge>
        </div>

        <p className="mb-3 font-mono text-xs text-[var(--tc-muted)]">
          CID: {metadataCID.slice(0, 24)}...
        </p>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAccess(!showAccess)}
          className="w-full border-[var(--tc-border)]"
        >
          {showAccess ? "Hide" : "Manage"} Access
        </Button>

        {showAccess && (
          <div className="mt-4 space-y-4 border-t border-[var(--tc-border)] pt-4">
            <div className="space-y-2">
              <Label className="text-xs text-[var(--tc-muted)]">Grant Access</Label>
              <Input
                placeholder="Verifier address (0x...)"
                value={verifierAddr}
                onChange={(e) => setVerifierAddr(e.target.value)}
                className="border-[var(--tc-border)] bg-[var(--tc-surface)] font-mono text-xs"
              />
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="border-[var(--tc-border)] bg-[var(--tc-surface)] text-xs">
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  {DURATION_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={String(opt.value)}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                onClick={handleGrant}
                disabled={grantAccess.isPending || grantAccess.isConfirming}
                className="w-full bg-[var(--tc-gold)] text-white hover:bg-[var(--tc-gold-light)]"
              >
                {grantAccess.isPending
                  ? "Confirm in wallet..."
                  : grantAccess.isConfirming
                    ? "Confirming..."
                    : "Grant Access"}
              </Button>
              {grantAccess.isSuccess && (
                <p className="text-xs text-[var(--tc-teal)]">Access granted!</p>
              )}
              {grantAccess.error && (
                <p className="text-xs text-red-500">{getHumanError(grantAccess.error)}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-[var(--tc-muted)]">Revoke Access</Label>
              <Input
                placeholder="Verifier address to revoke (0x...)"
                value={revokeAddr}
                onChange={(e) => setRevokeAddr(e.target.value)}
                className="border-[var(--tc-border)] bg-[var(--tc-surface)] font-mono text-xs"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleRevoke}
                disabled={revokeAccess.isPending || revokeAccess.isConfirming}
                className="w-full border-red-500/30 text-red-500 hover:bg-red-500/10"
              >
                {revokeAccess.isPending
                  ? "Confirm in wallet..."
                  : revokeAccess.isConfirming
                    ? "Revoking..."
                    : "Revoke Access"}
              </Button>
              {revokeAccess.isSuccess && (
                <p className="text-xs text-[var(--tc-teal)]">Access revoked.</p>
              )}
              {revokeAccess.error && (
                <p className="text-xs text-red-500">{getHumanError(revokeAccess.error)}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function TranscriptsPage() {
  const { address } = useAccount()
  const [registryAddress, setRegistryAddress] = useState("")

  const hashValue = address ? studentHash(address) : ("0x" as `0x${string}`)
  const { data: recordIds, isLoading } = useStudentTranscripts(
    registryAddress as Address,
    hashValue,
  )

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1
          className="text-2xl font-light tracking-tight text-[var(--tc-text)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          My Transcripts
        </h1>
        <p className="mt-1 text-sm text-[var(--tc-muted)]">
          View your on-chain credentials and manage verifier access
        </p>
      </div>

      <Card className="border-[var(--tc-border)] bg-[var(--tc-bg)]">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-[var(--tc-text)]">
            University Registry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Enter university registry address (0x...)"
            value={registryAddress}
            onChange={(e) => setRegistryAddress(e.target.value)}
            className="border-[var(--tc-border)] bg-[var(--tc-surface)] font-mono text-xs"
          />
        </CardContent>
      </Card>

      {isLoading && (
        <div className="py-12 text-center text-sm text-[var(--tc-muted)]">
          Loading transcripts...
        </div>
      )}

      {recordIds && recordIds.length === 0 && (
        <div className="py-12 text-center text-sm text-[var(--tc-muted)]">
          No transcripts found for this wallet.
        </div>
      )}

      {recordIds && recordIds.length > 0 && (
        <div className="space-y-3">
          {recordIds.map((id) => (
            <TranscriptCard
              key={id}
              recordId={id}
              registryAddress={registryAddress as Address}
            />
          ))}
        </div>
      )}
    </div>
  )
}
