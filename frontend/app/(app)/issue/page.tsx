"use client"

import { useState } from "react"
import { type Address, keccak256, encodePacked, toHex } from "viem"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRegisterTranscript } from "@/hooks/use-transcript-registry"
import { getHumanError } from "@/lib/utils"

export default function IssuePage() {
  const [registryAddress, setRegistryAddress] = useState("")
  const [studentAddress, setStudentAddress] = useState("")
  const [metadataCID, setMetadataCID] = useState("")
  const [fileHashInput, setFileHashInput] = useState("")

  const { register, hash, isPending, isConfirming, isSuccess, error } =
    useRegisterTranscript()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!registryAddress || !studentAddress || !metadataCID || !fileHashInput) return

    const studentHashVal = keccak256(
      encodePacked(["address"], [studentAddress as Address]),
    )

    const fileHash = fileHashInput.startsWith("0x")
      ? (fileHashInput as `0x${string}`)
      : (toHex(BigInt(`0x${fileHashInput}`), { size: 32 }) as `0x${string}`)

    register(registryAddress as Address, studentHashVal, metadataCID, fileHash)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1
          className="text-2xl font-light tracking-tight text-[var(--tc-text)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Issue Transcript
        </h1>
        <p className="mt-1 text-sm text-[var(--tc-muted)]">
          Register a new academic credential on-chain (Registrar only)
        </p>
      </div>

      <Card className="border-[var(--tc-border)] bg-[var(--tc-bg)]">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-[var(--tc-text)]">
            Transcript Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-[var(--tc-muted)]">
                University Registry Address
              </Label>
              <Input
                placeholder="0x..."
                value={registryAddress}
                onChange={(e) => setRegistryAddress(e.target.value)}
                className="border-[var(--tc-border)] bg-[var(--tc-surface)] font-mono text-xs"
                required
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-[var(--tc-muted)]">
                Student Wallet Address
              </Label>
              <Input
                placeholder="0x..."
                value={studentAddress}
                onChange={(e) => setStudentAddress(e.target.value)}
                className="border-[var(--tc-border)] bg-[var(--tc-surface)] font-mono text-xs"
                required
              />
              <p className="text-[10px] text-[var(--tc-muted)]">
                The student&apos;s address will be hashed on-chain for privacy
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-[var(--tc-muted)]">
                IPFS Metadata CID
              </Label>
              <Input
                placeholder="QmX... or bafy..."
                value={metadataCID}
                onChange={(e) => setMetadataCID(e.target.value)}
                className="border-[var(--tc-border)] bg-[var(--tc-surface)] font-mono text-xs"
                required
              />
              <p className="text-[10px] text-[var(--tc-muted)]">
                Upload the transcript metadata JSON to IPFS first
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-[var(--tc-muted)]">
                File Hash (SHA-256)
              </Label>
              <Input
                placeholder="0x... (bytes32 hash of the transcript file)"
                value={fileHashInput}
                onChange={(e) => setFileHashInput(e.target.value)}
                className="border-[var(--tc-border)] bg-[var(--tc-surface)] font-mono text-xs"
                required
              />
              <p className="text-[10px] text-[var(--tc-muted)]">
                SHA-256 hash of the original transcript PDF for verification
              </p>
            </div>

            <Button
              type="submit"
              disabled={isPending || isConfirming}
              className="w-full bg-[var(--tc-gold)] text-white hover:bg-[var(--tc-gold-light)]"
            >
              {isPending
                ? "Confirm in wallet..."
                : isConfirming
                  ? "Confirming on-chain..."
                  : "Register Transcript"}
            </Button>

            {isSuccess && hash && (
              <div className="rounded-lg border border-[var(--tc-teal)]/30 bg-[var(--tc-teal)]/5 p-4">
                <p className="text-sm font-medium text-[var(--tc-teal)]">
                  Transcript registered!
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
    </div>
  )
}
