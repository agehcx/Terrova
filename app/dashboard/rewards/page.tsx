"use client"

import { useState } from "react"
import { useTerrovaWallet } from "@/hooks/useTerrovaWallet"
import { useBlockchain } from "@/lib/blockchain-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Coins,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle,
  Wallet,
  Gift,
  Calendar,
  ExternalLink,
  AlertCircle,
} from "lucide-react"

const mockRewardHistory = [
  { id: "RWD-001", type: "Evidence Verification", amount: 25, verification: "VRF-4521", status: "claimed", date: "2024-01-15" },
  { id: "RWD-002", type: "Evidence Verification", amount: 35, verification: "VRF-4520", status: "claimed", date: "2024-01-14" },
  { id: "RWD-003", type: "Consensus Bonus", amount: 10, verification: "VRF-4519", status: "pending", date: "2024-01-13" },
  { id: "RWD-004", type: "Evidence Verification", amount: 40, verification: "VRF-4518", status: "pending", date: "2024-01-12" },
  { id: "RWD-005", type: "Staking Reward", amount: 15, verification: "-", status: "claimed", date: "2024-01-11" },
]

export default function RewardsPage() {
  const { connected, publicKey } = useTerrovaWallet()
  const { evidences, nodes, rewards, claimRewards, isRealData } = useBlockchain()

  const [isClaiming, setIsClaiming] = useState(false)
  const [txResult, setTxResult] = useState<{ success: boolean; tx?: string; error?: string } | null>(null)

  const pubkeyStr = publicKey?.toBase58() || ""

  // Build reward history from user's own evidence submissions
  const dynamicRewards = evidences
    .filter(e => e.node === pubkeyStr)
    .map(e => ({
      id: `RWD-${e.id}`,
      type: "Evidence Verification",
      amount: 15,
      verification: e.verification_request.slice(0, 8),
      status: "pending",
      date: new Date(e.timestamp).toISOString().split("T")[0],
    }))

  const allRewards = [...mockRewardHistory, ...dynamicRewards]
  const pendingRewards = allRewards.filter(r => r.status === "pending")
  const claimedRewards = allRewards.filter(r => r.status === "claimed")

  // Real on-chain rewards take priority if available
  const availableBalance = rewards?.availableBalance ?? pendingRewards.reduce((a, r) => a + r.amount, 0)
  const totalEarned = rewards?.totalEarned ?? allRewards.reduce((a, r) => a + r.amount, 0)
  const totalClaimed = rewards?.totalClaimed ?? claimedRewards.reduce((a, r) => a + r.amount, 0)
  const stakingAPY = 12.5

  const handleClaim = async () => {
    if (!connected) return
    setIsClaiming(true)
    setTxResult(null)
    try {
      const result = await claimRewards()
      if (result.success) {
        setTxResult({ success: true, tx: result.tx })
      } else {
        const errMsg = result.error instanceof Error ? result.error.message : String(result.error ?? "Claim failed")
        setTxResult({ success: false, error: errMsg })
      }
    } catch (e: any) {
      setTxResult({ success: false, error: e?.message ?? "Unknown error" })
    } finally {
      setIsClaiming(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Rewards</h1>
          <p className="text-muted-foreground">Track and claim your TRV token rewards</p>
        </div>
        <Button
          className="gap-2"
          size="lg"
          onClick={handleClaim}
          disabled={isClaiming || !connected || availableBalance === 0}
        >
          <Wallet className="h-5 w-5" />
          {isClaiming ? "Claiming..." : `Claim All Rewards (${availableBalance} TRV)`}
        </Button>
      </div>

      {/* TX result banner */}
      {txResult && (
        <div
          className={`flex items-start gap-3 rounded-lg border p-4 ${
            txResult.success
              ? "border-green-500/20 bg-green-500/5"
              : "border-destructive/20 bg-destructive/5"
          }`}
        >
          {txResult.success ? (
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          )}
          <div className="flex-1 text-sm">
            {txResult.success ? (
              <>
                <span className="font-medium text-green-500">
                  Rewards claimed successfully.
                </span>
                {txResult.tx && (
                  <a
                    href={`https://solscan.io/tx/${txResult.tx}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 inline-flex items-center gap-1 text-muted-foreground underline hover:text-foreground"
                  >
                    View transaction <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </>
            ) : (
              <span className="text-destructive">{txResult.error}</span>
            )}
          </div>
          <button onClick={() => setTxResult(null)} className="text-muted-foreground hover:text-foreground">
            ×
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Total Earned</span>
            </div>
            <p className="mt-1 text-2xl font-bold text-primary">{totalEarned.toLocaleString()} TRV</p>
            <p className="text-xs text-muted-foreground">~${(totalEarned * 2).toLocaleString()} USD</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Available</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{availableBalance} TRV</p>
            <p className="text-xs text-muted-foreground">
              {isRealData ? "On-chain balance" : "Ready to claim"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Total Claimed</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{totalClaimed} TRV</p>
            {rewards?.lastClaimTime && (
              <p className="text-xs text-muted-foreground">
                Last: {rewards.lastClaimTime.toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Gift className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Staking APY</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{stakingAPY}%</p>
            <p className="text-xs text-muted-foreground">Annual yield</p>
          </CardContent>
        </Card>
      </div>

      {/* Earnings Breakdown + Pending */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Earnings Breakdown</CardTitle>
            <CardDescription>How you earn TRV tokens</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Evidence Verification</p>
                  <p className="text-sm text-muted-foreground">Rewards for approved evidence</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">892 TRV</p>
                <p className="text-xs text-muted-foreground">69%</p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">Consensus Bonus</p>
                  <p className="text-sm text-muted-foreground">Extra for accurate voting</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">245 TRV</p>
                <p className="text-xs text-muted-foreground">19%</p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
                  <Coins className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="font-medium">Staking Rewards</p>
                  <p className="text-sm text-muted-foreground">Passive yield on staked tokens</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">147 TRV</p>
                <p className="text-xs text-muted-foreground">12%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Pending Rewards</CardTitle>
                <CardDescription>Rewards ready to be claimed</CardDescription>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="gap-2"
                onClick={handleClaim}
                disabled={isClaiming || !connected || availableBalance === 0}
              >
                Claim All <ArrowUpRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {pendingRewards.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No pending rewards</p>
            ) : (
              pendingRewards.map(reward => (
                <div
                  key={reward.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-500/10">
                      <Clock className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{reward.type}</p>
                      <p className="text-xs text-muted-foreground">
                        {reward.verification !== "-" ? reward.verification : "Staking"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-primary">+{reward.amount} TRV</span>
                    <Button size="sm" variant="ghost" onClick={handleClaim} disabled={isClaiming || !connected}>
                      Claim
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* History */}
      <Card>
        <CardHeader>
          <CardTitle>Reward History</CardTitle>
          <CardDescription>Complete history of your TRV token rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {allRewards.map(reward => (
              <div
                key={reward.id}
                className="flex items-center justify-between rounded-lg border border-border p-4"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      reward.status === "claimed" ? "bg-green-500/10" : "bg-yellow-500/10"
                    }`}
                  >
                    {reward.status === "claimed" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{reward.type}</p>
                      <Badge
                        variant="outline"
                        className={
                          reward.status === "claimed"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-yellow-500/10 text-yellow-500"
                        }
                      >
                        {reward.status === "claimed" ? "Claimed" : "Pending"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{reward.verification !== "-" ? reward.verification : "Staking"}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {reward.date}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">+{reward.amount} TRV</p>
                  <p className="text-xs text-muted-foreground">~${reward.amount * 2} USD</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
