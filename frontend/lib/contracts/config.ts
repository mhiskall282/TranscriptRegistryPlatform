import { type Address } from "viem"
import { sepolia } from "viem/chains"

export const CHAIN = sepolia

export const CONTRACT_ADDRESSES = {
  universityFactory: (process.env.NEXT_PUBLIC_REGISTRY_FACTORY_ADDRESS ??
    "") as Address,
} as const

export const TRANSCRIPT_STATUS = {
  0: "Active",
  1: "Revoked",
  2: "Amended",
} as const

export type TranscriptStatus = keyof typeof TRANSCRIPT_STATUS

export const DURATION_OPTIONS = [
  { label: "1 day", value: 86_400 },
  { label: "7 days", value: 604_800 },
  { label: "30 days", value: 2_592_000 },
  { label: "90 days", value: 7_776_000 },
  { label: "365 days", value: 31_536_000 },
] as const
