"use client"

import * as React from "react"
import { useWallet, type Wallet } from "@solana/wallet-adapter-react"
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronRight, 
  Wallet as WalletIcon, 
  AlertCircle, 
  Info,
  CheckCircle2,
  ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"

interface WalletModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function PhantomIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M64 128C99.3462 128 128 99.3462 128 64C128 28.6538 99.3462 0 64 0C28.6538 0 0 28.6538 0 64C0 99.3462 28.6538 128 64 128Z" fill="#AB9FF2"/>
      <path d="M85.3406 43.1594C85.3406 43.1594 76.5406 35.3406 64.0006 35.3406C51.4606 35.3406 42.6606 43.1594 42.6606 43.1594L38.4006 63.6006C38.4006 63.6006 36.4006 72.8006 44.4006 74.8006C52.4006 76.8006 58.0006 68.8006 58.0006 68.8006L64.0006 72.8006L70.0006 68.8006C70.0006 68.8006 75.6006 76.8006 83.6006 74.8006C91.6006 72.8006 89.6006 63.6006 89.6006 63.6006L85.3406 43.1594Z" fill="white"/>
      <circle cx="53" cy="53" r="4" fill="#AB9FF2"/>
      <circle cx="75" cy="53" r="4" fill="#AB9FF2"/>
    </svg>
  )
}

function MetaMaskIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 320 295" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M312.4 13.8l-123.6 98 25.1 43.9 98.5-41.9z" fill="#E17D28"/>
      <path d="M7.6 13.8l123.6 98-25.1 43.9-98.5-41.9z" fill="#E17D28"/>
      <path d="M266.6 220.1l-47.5 39.5-62.4-31.1-62.4 31.1-47.5-39.5 8.7-14.7 101.2 24.2 101.2-24.2z" fill="#E17D28"/>
      <path d="M259.9 113.8l-99.9 42.4-99.9-42.4 17.5-69 82.4 51.5 82.4-51.5z" fill="#E17D28"/>
      <path d="M160 156.2l39.9-16.9 25.1 43.9-65 37.1-65-37.1 25.1-43.9z" fill="#F48420"/>
    </svg>
  )
}

export function WalletConnectModal({ open, onOpenChange }: WalletModalProps) {
  const { wallets, select, connected, disconnect, wallet } = useWallet()

  const handleWalletSelect = (walletName: any) => {
    select(walletName)
    onOpenChange(false)
  }

  const solanaWallets = wallets.filter(w => w.adapter.name !== "MetaMask" && w.adapter.name !== "WalletConnect")
  
  // Non-Solana wallets (simulated or placeholder for UI as requested)
  const otherWallets = [
    { name: "MetaMask", icon: <MetaMaskIcon className="h-6 w-6" />, type: "EVM", available: false },
    { name: "WalletConnect", icon: <WalletIcon className="h-6 w-6" />, type: "Multi-chain", available: true },
    { name: "Coinbase Wallet", icon: <div className="h-6 w-6 rounded-full bg-blue-600" />, type: "Multi-chain", available: false },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden gap-0 border-none bg-background shadow-2xl">
        <div className="relative overflow-hidden bg-primary/5 p-8 border-b border-border/50">
          <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
          <DialogHeader className="relative z-10 text-left">
            <DialogTitle className="text-2xl font-bold tracking-tight">Connect Wallet</DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1.5">
              Choose your preferred method to interact with the GeoProof network.
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Solana Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">Solana Network</h3>
              <Badge variant="outline" className="text-[10px] uppercase font-bold bg-primary/5 text-primary border-primary/20">Recommended</Badge>
            </div>
            
            <div className="grid gap-2.5">
              {solanaWallets.map((w) => (
                <button
                  key={w.adapter.name}
                  onClick={() => handleWalletSelect(w.adapter.name)}
                  className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50 hover:bg-accent hover:border-primary/30 transition-all group relative overflow-hidden"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-background border border-border flex items-center justify-center group-hover:scale-105 transition-transform">
                      {w.adapter.name === "Phantom" ? (
                        <PhantomIcon className="h-6 w-6" />
                      ) : (
                        <img src={w.adapter.icon} alt={w.adapter.name} className="h-6 w-6" />
                      )}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold">{w.adapter.name}</div>
                      <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                        {w.readyState === "Installed" ? (
                          <span className="text-emerald-500 flex items-center gap-0.5">
                            <CheckCircle2 className="h-2.5 w-2.5" /> Detected
                          </span>
                        ) : (
                          "Browser Extension"
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </button>
              ))}
            </div>
          </div>

          {/* Other Wallets Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Other Platforms</h3>
            <div className="grid gap-2.5">
              {otherWallets.map((w) => (
                <button
                  key={w.name}
                  disabled={!w.available}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-xl border border-border transition-all group relative overflow-hidden",
                    w.available 
                      ? "bg-card/50 hover:bg-accent hover:border-primary/30" 
                      : "opacity-60 cursor-not-allowed bg-muted/50 grayscale"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-background border border-border flex items-center justify-center">
                      {w.icon}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold flex items-center gap-2">
                        {w.name}
                        {!w.available && <Badge variant="secondary" className="text-[8px] h-3 px-1 uppercase leading-none">Soon</Badge>}
                      </div>
                      <div className="text-[10px] text-muted-foreground">{w.type} Protocol</div>
                    </div>
                  </div>
                  {w.available ? (
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  ) : (
                    <Lock className="h-3.5 w-3.5 text-muted-foreground/50" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-border/50 bg-muted/20">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground font-medium px-2">
            <div className="flex items-center gap-1.5">
              <Info className="h-3 w-3" />
              New to Web3?
            </div>
            <a href="https://solana.com/wallets" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
              Learn more <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Lock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}
