# Task Plan: Phase 2 — CredAxis Web App

## Goal
Build the authenticated web app with role-based UI for issuing, viewing, granting access, and verifying transcripts on-chain.

## Features / Steps
- [x] Feature 1: Contract config — ABIs, addresses, chain config, typed hooks
- [x] Feature 2: App layout — sidebar navigation, topbar with wallet connect, auth gate
- [x] Feature 3: Dashboard page — role-aware overview with stats
- [x] Feature 4: Student — My Transcripts list + transcript detail with access management
- [x] Feature 5: Registrar — Issue Transcript form
- [x] Feature 6: Verifier — Verify Transcript page
- [x] Feature 7: Admin — University management panel

## Current
**Working on**: Complete
**Status**: done

## Decisions
- Using V1 contracts (TranscriptRegistry + UniversityFactory) as primary target
- Writing ABIs as TypeScript const arrays from Solidity function signatures
- Chain: Ethereum Sepolia (chainId 11155111)
- Privy for auth, wagmi hooks for contract interactions
- Role detection: compare connected wallet against on-chain admin/registrar addresses

## Errors
- (none yet)
