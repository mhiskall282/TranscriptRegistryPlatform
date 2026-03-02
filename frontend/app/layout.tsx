import type { Metadata } from "next"
import { Cormorant_Garamond, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google"
import { Web3Provider } from "@/components/providers/web3-provider"
import "./globals.css"

const displayFont = Cormorant_Garamond({
	variable: "--font-display",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"],
})

const sansFont = Plus_Jakarta_Sans({
	variable: "--font-sans",
	subsets: ["latin"],
})

const monoFont = JetBrains_Mono({
	variable: "--font-mono",
	subsets: ["latin"],
	weight: ["400", "500"],
})

export const metadata: Metadata = {
	title: "CredAxis — Blockchain Academic Credentials",
	description:
		"Issue, manage, and verify academic transcripts on the blockchain. Secure, instant, student-controlled.",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body
				className={`${displayFont.variable} ${sansFont.variable} ${monoFont.variable} font-sans antialiased`}
			>
				<Web3Provider>{children}</Web3Provider>
			</body>
		</html>
	)
}
