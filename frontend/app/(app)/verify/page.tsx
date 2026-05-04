"use client"

import { useState } from "react"
import { type Address, toHex } from "viem"
import { useAccount } from "wagmi"
import { HugeiconsIcon } from "@hugeicons/react"
import { Shield01Icon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  useTranscript,
  useCheckAccess,
  useVerifyTranscript,
} from "@/hooks/use-transcript-registry"
import { formatTimestamp, truncateAddress, getHumanError } from "@/lib/utils"
import { TRANSCRIPT_STATUS, type TranscriptStatus } from "@/lib/contracts"

export default function VerifyPage() {
  const { address } = useAccount()
  const [registryAddress, setRegistryAddress] = useState("")
  const [recordId, setRecordId] = useState("")
  const [fileHashInput, setFileHashInput] = useState("")
  const [looked, setLooked] = useState(false)

  const { data: transcript } = useTranscript(
    registryAddress as Address,
    recordId as `0x${string}`,
  )

  const { data: hasAccess } = useCheckAccess(
    registryAddress as Address,
    recordId as `0x${string}`,
    address ?? ("0x0" as Address),
  )

  const { verify, isPending, isConfirming, isSuccess, error } = useVerifyTranscript()

  function handleLookup(e: React.FormEvent) {
    e.preventDefault()
    setLooked(true)
  }

  function handleVerify() {
    if (!registryAddress || !recordId || !fileHashInput) return

    const fileHash = fileHashInput.startsWith("0x")
      ? (fileHashInput as `0x${string}`)
      : (toHex(BigInt(`0x${fileHashInput}`), { size: 32 }) as `0x${string}`)

    verify(registryAddress as Address, recordId as `0x${string}`, fileHash)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1
          className="text-2xl font-light tracking-tight text-[var(--tc-text)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Verify Transcript
        </h1>
        <p className="mt-1 text-sm text-[var(--tc-muted)]">
          Check the authenticity of an academic credential on-chain
        </p>
      </div>

      <Card className="border-[var(--tc-border)] bg-[var(--tc-bg)]">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-[var(--tc-text)]">
            Lookup Record
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLookup} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-[var(--tc-muted)]">
                University Registry Address
              </Label>
              <Input
                placeholder="0x..."
                value={registryAddress}
                onChange={(e) => {
                  setRegistryAddress(e.target.value)
                  setLooked(false)
                }}
                className="border-[var(--tc-border)] bg-[var(--tc-surface)] font-mono text-xs"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-[var(--tc-muted)]">Record ID</Label>
              <Input
                placeholder="0x... (bytes32)"
                value={recordId}
                onChange={(e) => {
                  setRecordId(e.target.value)
                  setLooked(false)
                }}
                className="border-[var(--tc-border)] bg-[var(--tc-surface)] font-mono text-xs"
                required
              />
            </div>

            <Button
              type="submit"
              variant="outline"
              className="w-full border-[var(--tc-border)]"
            >
              Lookup
            </Button>
          </form>
        </CardContent>
      </Card>

      {looked && transcript && (
        <Card className="border-[var(--tc-border)] bg-[var(--tc-bg)]">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-[var(--tc-text)]">
              Record Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-[var(--tc-muted)]">Status</p>
                <p className="font-medium text-[var(--tc-text)]">
                  {TRANSCRIPT_STATUS[transcript[5] as TranscriptStatus]}
                </p>
              </div>
              <div>
                <p className="text-[var(--tc-muted)]">Issued</p>
                <p className="font-medium text-[var(--tc-text)]">
                  {formatTimestamp(transcript[4])}
                </p>
              </div>
              <div>
                <p className="text-[var(--tc-muted)]">Issuer</p>
                <p className="font-mono text-[var(--tc-text)]">
                  {truncateAddress(transcript[3])}
                </p>
              </div>
              <div>
                <p className="text-[var(--tc-muted)]">Metadata CID</p>
                <p className="font-mono text-[var(--tc-text)]">
                  {transcript[1].slice(0, 16)}...
                </p>
              </div>
            </div>

            {hasAccess ? (
              <div className="space-y-3 border-t border-[var(--tc-border)] pt-4">
                <div className="flex items-center gap-2 text-[var(--tc-teal)]">
                  <HugeiconsIcon icon={Shield01Icon} size={16} color="currentColor" />
                  <span className="text-xs font-medium">
                    You have access to verify this record
                  </span>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-[var(--tc-muted)]">
                    File Hash (SHA-256)
                  </Label>
                  <Input
                    placeholder="0x... (hash of the original file)"
                    value={fileHashInput}
                    onChange={(e) => setFileHashInput(e.target.value)}
                    className="border-[var(--tc-border)] bg-[var(--tc-surface)] font-mono text-xs"
                  />
                </div>
                <Button
                  onClick={handleVerify}
                  disabled={isPending || isConfirming || !fileHashInput}
                  className="w-full bg-[var(--tc-gold)] text-white hover:bg-[var(--tc-gold-light)]"
                >
                  {isPending
                    ? "Confirm in wallet..."
                    : isConfirming
                      ? "Verifying on-chain..."
                      : "Verify Transcript"}
                </Button>

                {isSuccess && (
                  <div className="flex items-center gap-2 rounded-lg border border-[var(--tc-teal)]/30 bg-[var(--tc-teal)]/5 p-4">
                    <HugeiconsIcon icon={Shield01Icon} size={20} color="var(--tc-teal)" />
                    <div>
                      <p className="text-sm font-medium text-[var(--tc-teal)]">
                        Verified! Transcript is authentic.
                      </p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/5 p-4">
                    <HugeiconsIcon icon={Cancel01Icon} size={20} color="#ef4444" />
                    <p className="text-sm text-red-500">{getHumanError(error)}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="border-t border-[var(--tc-border)] pt-4 text-center">
                <p className="text-xs text-[var(--tc-muted)]">
                  You don&apos;t have access to verify this record. Ask the student to
                  grant you access.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
