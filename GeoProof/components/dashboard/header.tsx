"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"
import { Menu, Bell, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const pageNames: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/map": "Network Map",
  "/dashboard/evidence": "Evidence",
  "/dashboard/verifications": "Verifications",
  "/dashboard/nodes": "Nodes",
  "/dashboard/rewards": "Rewards",
  "/dashboard/settings": "Settings",
}

export function DashboardHeader() {
  const pathname = usePathname()
  const { publicKey, connected } = useWallet()

  const currentPage = pageNames[pathname] || "Dashboard"

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-card px-4 lg:px-6">
      {/* Left: Mobile menu + page title */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-8 w-8 lg:hidden">
          <Menu className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-sm font-medium">{currentPage}</h1>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Network indicator */}
        <div className="hidden items-center gap-1.5 rounded-md bg-muted px-2.5 py-1.5 text-xs md:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-muted-foreground">Devnet</span>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </Button>

        {/* Wallet */}
        <div className={cn(
          "[&_.wallet-adapter-button]:!h-8 [&_.wallet-adapter-button]:!rounded-md [&_.wallet-adapter-button]:!px-3 [&_.wallet-adapter-button]:!text-xs",
          "[&_.wallet-adapter-button]:!bg-primary [&_.wallet-adapter-button]:!font-medium"
        )}>
          <WalletMultiButton />
        </div>

        {/* Connected address */}
        {connected && publicKey && (
          <a
            href={`https://solscan.io/account/${publicKey.toBase58()}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground lg:flex"
          >
            {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </header>
  )
}
