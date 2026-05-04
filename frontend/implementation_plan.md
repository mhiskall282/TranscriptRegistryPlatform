# CredAxis Frontend Refine & Web App Features

This plan outlines the steps to refactor the frontend landing page, apply the new light theme, install necessary libraries, and initialize Web3 providers for Phase 1 and 2 of the [todo.md](file:///Users/samueldanso/Resourses/temp/TranscriptRegistry/frontend/todo.md) tasks.

## User Review Required

- The theme transition requires changing `--tc-*` CSS variables to light mode defaults while preserving dark backgrounds for specific sections like the Hero.
- We will install multiple heavy libraries (Three.js, GSAP, Framer Motion, Wagmi, Privy). Please confirm if you have specific valid API keys for Privy to include in `.env`, otherwise they will be left blank in `.env.example`.

## Proposed Changes

### Project Configuration & Setup

#### [MODIFY] [package.json](file:///Users/samueldanso/Resourses/temp/TranscriptRegistry/frontend/package.json)
- Add dependencies using `bun add`: `framer-motion`, `gsap`, `three`, `@react-three/fiber`, `@react-three/drei`, `@privy-io/react-auth`, `wagmi`, `viem`, `zod`, `zustand`, `@tanstack/react-query` (needed for Wagmi). Note: `@hugeicons/react` is already installed.

#### [NEW] `.env.example`

- Add basic environment variable templates: `NEXT_PUBLIC_PRIVY_APP_ID`, `NEXT_PUBLIC_ALCHEMY_API_KEY`, etc.

### Theme & Styling

#### [MODIFY] [app/layout.tsx](file:///Users/samueldanso/Resourses/temp/TranscriptRegistry/frontend/app/layout.tsx)

- Remove `className="dark"` from the `<html>` tag to default to standard light mode.
- Update `metadata.title` / `metadata.description` to ensure "CredAxis" is used consistently.

#### [MODIFY] [app/globals.css](file:///Users/samueldanso/Resourses/temp/TranscriptRegistry/frontend/app/globals.css)

- Refactor `--tc-*` custom variables in `:root` to a sleek light theme (e.g., light surface backgrounds, dark text).
- Create `.dark-section` utility classes or update specific sections (like Hero) to maintain the required dark background/effects.

### Components Refactoring

#### [NEW] `components/ui/logo.tsx`

- Build a new SVG logo specifically for CredAxis.

#### [NEW] `components/landing/*`

- Extract sections from [page.tsx](file:///Users/samueldanso/Resourses/temp/TranscriptRegistry/frontend/app/page.tsx) into modular components: `@components/landing/navbar.tsx`, `hero.tsx`, `how-it-works.tsx`, `features.tsx`, `cta-section.tsx`, `footer.tsx`.
- Inside these components:
    - Replace hardcoded SVG icons (Shield, Key, Bolt, Chain) with components from `@hugeicons/react`.
    - Replace native HTML `<button>` tags with the Shadcn UI `Button` component imported from `components/ui/button`.
    - Replace "TranscriptChain" text references to "CredAxis".
    - Add Framer Motion and GSAP animations for a modern, professional feel.

#### [MODIFY] [app/page.tsx](file:///Users/samueldanso/Resourses/temp/TranscriptRegistry/frontend/app/page.tsx)

- Clean up the file to simply import and render the new landing components.

### Web3 Providers & State

#### [NEW] `components/providers/web3-provider.tsx`

- Implement a provider component that wraps the application with `<PrivyProvider>`, `<WagmiProvider>`, and TanStack's `<QueryClientProvider>`.

#### [MODIFY] [app/layout.tsx](file:///Users/samueldanso/Resourses/temp/TranscriptRegistry/frontend/app/layout.tsx)

- Wrap the `children` prop with the new `Web3Provider` component.

## Verification Plan

### Automated Verification

- Run `bun run lint` and `bun run build` to verify there are no TypeScript, Next.js build, or ESLint errors after the refactor.

### Manual Verification

- The user will start the application using `bun run dev`.
- Visually verify the landing page loads successfully with the light theme and correct CredAxis branding.
- Verify framer-motion animations trigger smoothly on load and scroll.
- Verify the browser console does not have matching errors for Web3 providers, confirming Privy and Wagmi contexts are properly initialized.
