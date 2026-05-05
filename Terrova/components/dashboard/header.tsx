"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useWallet } from "@solana/wallet-adapter-react"
import { Menu, Bell, ExternalLink, LogOut, Wallet as WalletIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { WalletConnectModal } from "./wallet-modal"
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
  const { publicKey, connected, disconnect, wallet } = useWallet()
  const [modalOpen, setModalOpen] = useState(false)

  const currentPage = pageNames[pathname] || "Dashboard"

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
      {/* Left: Mobile menu + page title */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="h-9 w-9 lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-sm font-bold tracking-tight uppercase text-muted-foreground/60">{currentPage}</h1>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Network indicator */}
        <div className="hidden items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider lg:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-muted-foreground">Devnet</span>
        </div>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full border border-border/50">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-primary" />
        </Button>

        <div className="h-6 w-px bg-border/60 mx-1" />

        {/* Wallet Connection */}
        {connected && publicKey ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2.5 rounded-full border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                  {wallet?.adapter.icon ? (
                    <img src={wallet.adapter.icon} alt="" className="h-3 w-3" />
                  ) : (
                    <WalletIcon className="h-3 w-3 text-primary" />
                  )}
                </div>
                <span className="font-mono text-xs font-bold">
                  {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 mt-2">
              <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-muted-foreground">Connected Wallet</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer py-2.5" onClick={() => window.open(`https://solscan.io/account/${publicKey.toBase58()}?cluster=devnet`, '_blank')}>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">View on Solscan</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer py-2.5 text-destructive focus:text-destructive" onClick={() => disconnect()}>
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Disconnect</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button 
            size="sm" 
            className="h-9 gap-2 rounded-full font-bold shadow-lg shadow-primary/20 px-5"
            onClick={() => setModalOpen(true)}
          >
            <WalletIcon className="h-3.5 w-3.5" />
            Connect Wallet
          </Button>
        )}

        <WalletConnectModal open={modalOpen} onOpenChange={setModalOpen} />
      </div>
    </header>
  )
}
