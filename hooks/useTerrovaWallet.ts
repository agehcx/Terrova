"use client"

import { usePrivy } from "@privy-io/react-auth"
import { useWallets, useSignTransaction } from "@privy-io/react-auth/solana"
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
  const { authenticated, logout: privyLogout, login: privyLogin } = usePrivy()
  const { wallets: privyWallets } = useWallets()
  const { signTransaction: privySignTransaction } = useSignTransaction()
  const solanaWalletAdapter = useWallet()

  // Get the primary Solana wallet from Privy (embedded or connected)
  const privySolanaWallet = useMemo(() => 
    privyWallets.find(w => w.walletClientType === "privy") || privyWallets[0] || null, 
  [privyWallets])

  const publicKey = useMemo(() => {
    // Priority: 1. External Wallet Adapter, 2. Privy Wallet
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
      // Serialize transaction to Uint8Array for Privy
      const serialized = transaction.serialize()
      
      const { signedTransaction } = await privySignTransaction({
        transaction: serialized,
        wallet: privySolanaWallet,
      })

      // Deserialize back to the correct type
      if (transaction instanceof VersionedTransaction) {
        return VersionedTransaction.deserialize(signedTransaction) as unknown as T
      } else {
        return Transaction.from(signedTransaction) as unknown as T
      }
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
