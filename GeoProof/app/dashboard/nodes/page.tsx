"use client"

import { useState } from "react"
import { useBlockchain } from "@/lib/blockchain-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Signal,
  MapPin,
  Users,
  Search,
  Plus,
  TrendingUp,
  Clock,
  Coins,
  Shield,
} from "lucide-react"

// Use the seed data
const mockNodes = [
  {
    id: "node-1",
    pubkey: "7Vbm...3xKj",
    location: "Riley County, Kansas",
    coordinates: "39.0119, -96.7265",
    status: "active",
    reputation: 95,
    stake: 5000,
    evidenceCount: 234,
    coverageRadius: 50,
    registeredAt: "2023-06-15",
    earnings: 1284,
  },
  {
    id: "node-2",
    pubkey: "9Abc...7yZw",
    location: "Story County, Iowa",
    coordinates: "42.0358, -93.4619",
    status: "active",
    reputation: 88,
    stake: 3500,
    evidenceCount: 156,
    coverageRadius: 35,
    registeredAt: "2023-08-22",
    earnings: 892,
  },
  {
    id: "node-3",
    pubkey: "3Def...2qRs",
    location: "Lancaster County, Nebraska",
    coordinates: "40.7835, -96.6852",
    status: "active",
    reputation: 92,
    stake: 4200,
    evidenceCount: 189,
    coverageRadius: 45,
    registeredAt: "2023-07-10",
    earnings: 1056,
  },
  {
    id: "node-4",
    pubkey: "5Ghi...8pLm",
    location: "Taylor County, Texas",
    coordinates: "32.3018, -99.8762",
    status: "pending",
    reputation: 0,
    stake: 2000,
    evidenceCount: 0,
    coverageRadius: 60,
    registeredAt: "2024-01-10",
    earnings: 0,
  },
]

const statusConfig = {
  active: {
    label: "Active",
    color: "bg-green-500/10 text-green-500 border-green-500/20",
  },
  pending: {
    label: "Pending",
    color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  },
  inactive: {
    label: "Inactive",
    color: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  },
}

export default function NodesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isRegisterDialogOpen, setIsRegisterDialogOpen] = useState(false)
  const { nodes, registerNode } = useBlockchain()
  
  const [lat, setLat] = useState("")
  const [lng, setLng] = useState("")
  const [radius, setRadius] = useState("50")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Combine mock nodes with dynamic nodes from context
  const allNodes = [
    ...mockNodes,
    ...Object.values(nodes).map((n, idx) => ({
      id: `dynamic-${idx}`,
      pubkey: n.owner.slice(0,4) + "..." + n.owner.slice(-4),
      location: `Lat: ${n.location.latitude}, Lng: ${n.location.longitude}`,
      coordinates: `${n.location.latitude}, ${n.location.longitude}`,
      status: n.status.toLowerCase(),
      reputation: n.reputation,
      stake: 2000,
      evidenceCount: n.evidence_count,
      coverageRadius: n.coverage_radius_km,
      registeredAt: new Date(n.registered_at).toISOString().split('T')[0],
      earnings: 0,
    }))
  ]

  const filteredNodes = allNodes.filter(
    (node) =>
      node.pubkey.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalStaked = allNodes.reduce((acc, n) => acc + n.stake, 0)
  const totalEarnings = allNodes.reduce((acc, n) => acc + n.earnings, 0)
  const activeNodes = allNodes.filter((n) => n.status === "active")
  const averageReputation = activeNodes.length > 0
    ? activeNodes.reduce((acc, n) => acc + n.reputation, 0) / activeNodes.length
    : 0

  const handleRegister = async () => {
    try {
      setIsSubmitting(true)
      await registerNode({ latitude: parseFloat(lat), longitude: parseFloat(lng) }, parseInt(radius))
      setIsRegisterDialogOpen(false)
    } catch (e) {
      console.error(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Node Management</h1>
          <p className="text-muted-foreground">
            Register and manage your GeoProof node operators
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search nodes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Dialog open={isRegisterDialogOpen} onOpenChange={setIsRegisterDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Register Node
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Register New Node</DialogTitle>
                <DialogDescription>
                  Stake PROOF tokens to register as a node operator
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Minimum Stake Required</span>
                    <span className="font-semibold text-primary">2,000 PROOF</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="lat">Latitude</Label>
                    <Input id="lat" placeholder="e.g., 39.0119" value={lat} onChange={e => setLat(e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="lng">Longitude</Label>
                    <Input id="lng" placeholder="e.g., -96.7265" value={lng} onChange={e => setLng(e.target.value)} />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="radius">Coverage Radius (km)</Label>
                  <Input id="radius" type="number" placeholder="50" value={radius} onChange={e => setRadius(e.target.value)} />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="stake">Stake Amount (PROOF)</Label>
                  <Input id="stake" type="number" placeholder="2000" />
                </div>

                <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3">
                  <p className="text-xs text-yellow-500">
                    <Shield className="mr-1 inline h-3 w-3" />
                    Staked tokens will be locked and may be slashed for fraudulent evidence
                  </p>
                </div>

                <Button className="w-full gap-2" onClick={handleRegister} disabled={isSubmitting || !lat || !lng}>
                  <Signal className="h-4 w-4" />
                  {isSubmitting ? "Registering..." : "Register Node"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Your Nodes</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{allNodes.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Total Staked</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{totalStaked.toLocaleString()} PROOF</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Total Earnings</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{totalEarnings.toLocaleString()} PROOF</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Avg Reputation</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{averageReputation.toFixed(1)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Nodes List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Nodes</CardTitle>
          <CardDescription>All registered node operators under your wallet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {filteredNodes.map((node) => {
              const status = statusConfig[node.status as keyof typeof statusConfig]
              return (
                <div
                  key={node.id}
                  className="rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full ${
                          node.status === "active"
                            ? "bg-green-500/10"
                            : node.status === "pending"
                            ? "bg-yellow-500/10"
                            : "bg-gray-500/10"
                        }`}
                      >
                        <Signal
                          className={`h-6 w-6 ${
                            node.status === "active"
                              ? "text-green-500"
                              : node.status === "pending"
                              ? "text-yellow-500"
                              : "text-gray-500"
                          }`}
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">{node.pubkey}</p>
                          <Badge variant="outline" className={status.color}>
                            {status.label}
                          </Badge>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {node.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Since {node.registeredAt}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-6 lg:gap-8">
                      <div>
                        <p className="text-xs text-muted-foreground">Reputation</p>
                        <div className="mt-1 flex items-center gap-2">
                          <Progress value={node.reputation} className="h-2 w-16" />
                          <span className="text-sm font-medium">{node.reputation}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Staked</p>
                        <p className="text-sm font-medium">{node.stake} PROOF</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Evidence</p>
                        <p className="text-sm font-medium">{node.evidenceCount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Earnings</p>
                        <p className="text-sm font-medium text-green-500">
                          +{node.earnings} PROOF
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
