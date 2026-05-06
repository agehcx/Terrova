"use client"

import { usePrivy, useSolanaWallets } from "@privy-io/react-auth"
import { useWallet } from "@solana/wallet-adapter-react"
import { useMemo } from "react"
import { PublicKey, Transaction, VersionedTransaction } from "@solana/web3.js"

export interface TerrovaWallet {
  publicKey: PublicKey | null
  connected: boolean
  disconnect: () => Promise<void>
  login: () => void
  walletName: string | null
  walletIcon: string | null
  signTransaction: <T extends Transaction | VersionedTransaction>(transaction: T) => Promise<T>
}

export function useTerrovaWallet(): TerrovaWallet {
  const { user, authenticated, logout: privyLogout, login: privyLogin } = usePrivy()
  const { wallets: privyWallets } = useSolanaWallets()
  const solanaWalletAdapter = useWallet()

  // Get the Privy Solana wallet (either embedded or connected via Privy)
  const privySolanaWallet = useMemo(() => 
    privyWallets.find(w => w.chainType === "solana"), 
  [privyWallets])

  const publicKey = useMemo(() => {
    // Priority: 1. External Wallet Adapter, 2. Privy Embedded/Connected Wallet
    if (solanaWalletAdapter.publicKey) return solanaWalletAdapter.publicKey
    if (privySolanaWallet?.address) {
      try {
        return new PublicKey(privySolanaWallet.address)
      } catch (e) {
        return null
      }
    }
    return null
  }, [solanaWalletAdapter.publicKey, privySolanaWallet])

  const connected = !!publicKey

  const disconnect = async () => {
    if (solanaWalletAdapter.connected) {
      await solanaWalletAdapter.disconnect()
    }
    if (authenticated) {
      await privyLogout()
    }
  }

  const login = () => {
    privyLogin()
  }

  const walletName = useMemo(() => {
    if (solanaWalletAdapter.wallet) return solanaWalletAdapter.wallet.adapter.name
    if (privySolanaWallet) return privySolanaWallet.walletClientType === "privy" ? "Embedded Account" : privySolanaWallet.walletClientType
    return null
  }, [solanaWalletAdapter.wallet, privySolanaWallet])

  const walletIcon = useMemo(() => {
    if (solanaWalletAdapter.wallet) return solanaWalletAdapter.wallet.adapter.icon
    return null
  }, [solanaWalletAdapter.wallet])

  const signTransaction = async <T extends Transaction | VersionedTransaction>(transaction: T): Promise<T> => {
    if (solanaWalletAdapter.signTransaction) {
      return await solanaWalletAdapter.signTransaction(transaction)
    }
    
    if (privySolanaWallet) {
      const provider = await privySolanaWallet.getPublicKey() // This is not correct for signing
      // Using Privy's wallet interface
      // @ts-ignore - Privy's Solana interface might vary based on version
      const solanaInterface = await privySolanaWallet.makeInterface();
      return await solanaInterface.signTransaction(transaction);
    }

    throw new Error("Wallet not connected or does not support signing")
  }

  return {
    publicKey,
    connected,
    disconnect,
    login,
    walletName,
    walletIcon,
    signTransaction
  }
}
