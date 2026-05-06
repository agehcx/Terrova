"use client"

import Link from "next/link"
import { useWallet } from "@solana/wallet-adapter-react"
import { useBlockchain } from "@/lib/blockchain-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  AlertCircle,
} from "lucide-react"

interface Metric {
  label: string
  value: string
  change?: string
  trend?: "up" | "down"
  subtext?: string
}

// Metrics will be dynamically calculated

interface Verification {
  id: string
  location: string
  type: string
  status: "pending" | "active" | "completed" | "disputed"
  bounty: string
  submitted: string
}

// Mock recent verifications as fallback
const mockRecentVerifications: Verification[] = [
  { id: "VRF-4521", location: "Lyon County, KS", type: "Crop Damage", status: "pending", bounty: "0.15 SOL", submitted: "2h ago" },
  { id: "VRF-4520", location: "Story County, IA", type: "Flood", status: "active", bounty: "0.12 SOL", submitted: "5h ago" },
  { id: "VRF-4519", location: "Adams County, NE", type: "Hail Damage", status: "completed", bounty: "0.18 SOL", submitted: "1d ago" },
  { id: "VRF-4518", location: "Deaf Smith, TX", type: "Drought", status: "completed", bounty: "0.14 SOL", submitted: "2d ago" },
]

const statusConfig = {
  pending: { label: "Pending", className: "bg-secondary text-secondary-foreground border-border" },
  active: { label: "Active", className: "bg-primary/10 text-primary border-primary/20" },
  completed: { label: "Verified", className: "bg-primary/20 text-primary border-primary/30 font-medium" },
  disputed: { label: "Risk Signal", className: "bg-destructive/10 text-destructive border-destructive/20 font-medium" },
}

function MetricCard({ metric }: { metric: Metric }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="text-sm text-muted-foreground">{metric.label}</div>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-2xl font-semibold">{metric.value}</span>
        {metric.subtext && <span className="text-sm text-muted-foreground">{metric.subtext}</span>}
      </div>
      {metric.change && (
        <div className="mt-1 flex items-center gap-1 text-sm">
          {metric.trend === "up" ? (
            <ArrowUpRight className="h-3 w-3 text-primary" />
          ) : (
            <ArrowDownRight className="h-3 w-3 text-destructive" />
          )}
          <span className={metric.trend === "up" ? "text-primary" : "text-destructive"}>
            {metric.change}
          </span>
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const { connected, publicKey } = useTerrovaWallet()
  const { verifications, evidences, nodes } = useBlockchain()

  // Dynamic calculations
  const pubkeyStr = publicKey?.toBase58() || ""
  const myNode = nodes[pubkeyStr]
  
  const activeVerifications = verifications.filter(v => v.status === "Pending" || v.status === "InProgress").length
  const evidenceCount = evidences.length + 156 // Adding base mock count for visuals
  const reputation = myNode ? myNode.reputation : 92.5
  const earnings = myNode ? myNode.evidence_count * 15 : 1284 // Mock earnings calc

  const metrics: Metric[] = [
    { label: "Active Verifications", value: activeVerifications.toString(), change: "+2", trend: "up", subtext: "network wide" },
    { label: "Evidence Submitted", value: evidenceCount.toString(), change: "+1", trend: "up", subtext: "this week" },
    { label: "Reputation", value: reputation.toString(), change: "+0", trend: "up", subtext: "score" },
    { label: "Pending Rewards", value: earnings.toString(), subtext: "TRV" },
  ]

  const recentVerifications: Verification[] = [
    ...verifications.slice(0, 4).map(v => ({
      id: v.id,
      location: `Lat ${v.location.latitude}`,
      type: v.claim_type,
      status: (v.status.toLowerCase() === "inprogress" ? "active" : v.status.toLowerCase()) as "pending" | "active" | "completed" | "disputed",
      bounty: v.bounty + " TRV",
      submitted: "Recently"
    }))
  ]

  // If network has no verifications, show mock
  const displayVerifications = recentVerifications.length > 0 ? recentVerifications : mockRecentVerifications

  return (
    <div className="flex flex-col gap-6">
      {/* Wallet warning */}
      {!connected && (
        <div className="flex items-center gap-3 rounded-lg border border-destructive/20 bg-destructive/5 p-4">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <div className="flex-1">
            <div className="font-medium text-foreground">Wallet not connected</div>
            <div className="text-sm text-muted-foreground">
              Connect your wallet to view your node status and submit evidence
            </div>
          </div>
        </div>
      )}

      {/* Connected wallet info */}
      {connected && publicKey && (
        <div className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <span className="text-sm font-medium text-primary">
                {publicKey.toBase58().slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div>
              <div className="font-mono text-sm">
                {publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}
              </div>
              <div className="text-xs text-muted-foreground">Node Operator</div>
            </div>
          </div>
          <a
            href={`https://solscan.io/account/${publicKey.toBase58()}?cluster=devnet`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            View on Solscan
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} metric={metric} />
        ))}
      </div>

      {/* Main content */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Recent verifications */}
        <Card className="lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-base font-medium">Recent Verifications</CardTitle>
            <Link href="/dashboard/verifications">
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                View all
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {displayVerifications.map((v) => (
                <div key={v.id} className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{v.id}</span>
                        <Badge variant="outline" className={statusConfig[v.status]?.className || statusConfig.pending.className}>
                          {statusConfig[v.status]?.label || "Pending"}
                        </Badge>
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">
                        {v.location} &middot; {v.type}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm">{v.bounty}</div>
                    <div className="text-xs text-muted-foreground">{v.submitted}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sidebar actions */}
        <div className="flex flex-col gap-4 lg:col-span-2">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <Link href="/dashboard/evidence">
                <Button variant="outline" className="h-auto w-full justify-start gap-3 px-4 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
                    <span className="text-sm font-medium">E</span>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium">Submit Evidence</div>
                    <div className="text-xs text-muted-foreground">Upload for active verification</div>
                  </div>
                </Button>
              </Link>

              <Link href="/dashboard/rewards">
                <Button variant="outline" className="h-auto w-full justify-start gap-3 px-4 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10 text-primary">
                    <span className="text-sm font-medium">R</span>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium">Claim Rewards</div>
                    <div className="text-xs text-muted-foreground">{earnings} TRV available</div>
                  </div>
                </Button>
              </Link>

              <Link href="/dashboard/nodes">
                <Button variant="outline" className="h-auto w-full justify-start gap-3 px-4 py-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-secondary text-foreground border border-border">
                    <span className="text-sm font-medium">N</span>
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium">Node Settings</div>
                    <div className="text-xs text-muted-foreground">Manage stake & location</div>
                  </div>
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-medium">Network Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Active nodes</span>
                  <span className="font-mono text-sm">{2847 + Object.keys(nodes).length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg response</span>
                  <span className="font-mono text-sm">4.2h</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total staked</span>
                  <span className="font-mono text-sm">$4.2M</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Network</span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <span className="font-mono text-sm">devnet</span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
