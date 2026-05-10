"use client"

import { useMemo, type ReactNode } from "react"
import { PrivyProvider } from "@privy-io/react-auth"
import { toSolanaWalletConnectors } from "@privy-io/react-auth/solana"
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from "@solana/wallet-adapter-react"
import { clusterApiUrl } from "@solana/web3.js"

// Import wallet adapter styles
import "@solana/wallet-adapter-react-ui/styles.css"

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  // Use devnet for development
  const endpoint = useMemo(() => clusterApiUrl("devnet"), [])

  // Configure Solana connectors for Privy to support both social and external wallets
  const solanaConnectors = useMemo(() => toSolanaWalletConnectors({
    shouldAutoConnect: true,
  }), [])

  const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID as string

  return (
    <PrivyProvider
      appId={privyAppId}
      config={{
        appearance: {
          theme: 'dark',
          accentColor: '#14b8a6', // teal-500 matching Terrova brand
          showWalletLoginFirst: false,
        },
        // Enable Solana support
        externalWallets: {
          solana: {
            connectors: solanaConnectors,
          },
        },
        embeddedWallets: {
          createOnLogin: 'users-without-wallets',
          requireUserPasswordOnCreate: false,
        },
        loginMethods: ['google', 'email', 'apple', 'wallet'],
      }}
    >
      <ConnectionProvider endpoint={endpoint}>
        <SolanaWalletProvider wallets={[]}>
          {children}
        </SolanaWalletProvider>
      </ConnectionProvider>
    </PrivyProvider>
  )
}
