"use client"

import { useState } from "react"
import { useBlockchain, ClaimType } from "@/lib/blockchain-context"
import { useTerrovaWallet } from "@/hooks/useTerrovaWallet"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import {
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  FileCheck,
  Search,
  ArrowRight,
  Coins,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Plus,
} from "lucide-react"

const mockVerifications = [
  {
    id: "VRF-4521",
    pubkey: "mock-4521",
    type: "Crop Damage Assessment",
    location: "Riley County, Kansas",
    coordinates: "39.0119, -98.4842",
    status: "pending",
    bounty: 75,
    requiredEvidence: 3,
    submittedEvidence: 1,
    deadline: "2024-01-20",
    description: "Assess crop damage from recent frost event. Document affected areas and estimate damage percentage.",
    claimAmount: "$45,000",
  },
  {
    id: "VRF-4520",
    pubkey: "mock-4520",
    type: "Flood Assessment",
    location: "Story County, Iowa",
    coordinates: "41.8781, -93.0977",
    status: "in_progress",
    bounty: 100,
    requiredEvidence: 5,
    submittedEvidence: 3,
    deadline: "2024-01-18",
    description: "Document flood damage to agricultural fields. Include water levels and soil condition.",
    claimAmount: "$120,000",
  },
  {
    id: "VRF-4519",
    pubkey: "mock-4519",
    type: "Hail Damage Verification",
    location: "Lancaster County, Nebraska",
    coordinates: "40.8234, -96.7012",
    status: "completed",
    bounty: 60,
    requiredEvidence: 3,
    submittedEvidence: 3,
    deadline: "2024-01-15",
    description: "Verify hail damage to corn crops from storm on January 10th.",
    claimAmount: "$32,000",
  },
  {
    id: "VRF-4518",
    pubkey: "mock-4518",
    type: "Drought Verification",
    location: "Taylor County, Texas",
    coordinates: "31.9686, -99.9018",
    status: "completed",
    bounty: 80,
    requiredEvidence: 4,
    submittedEvidence: 4,
    deadline: "2024-01-12",
    description: "Document drought conditions and impact on cattle grazing land.",
    claimAmount: "$78,000",
  },
]

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Pending Evidence", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: Clock },
  Pending: { label: "Pending Evidence", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: Clock },
  in_progress: { label: "In Progress", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: AlertCircle },
  InProgress: { label: "In Progress", color: "bg-blue-500/10 text-blue-500 border-blue-500/20", icon: AlertCircle },
  completed: { label: "Completed", color: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle },
  Completed: { label: "Completed", color: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle },
}

const claimTypeOptions: { value: ClaimType; label: string }[] = [
  { value: "CropDamage", label: "Crop Damage" },
  { value: "FloodAssessment", label: "Flood Assessment" },
  { value: "HailDamage", label: "Hail Damage" },
  { value: "DroughtVerification", label: "Drought Verification" },
  { value: "FireDamage", label: "Fire Damage" },
  { value: "PestInfestation", label: "Pest Infestation" },
  { value: "Other", label: "Other" },
]

export default function VerificationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVerification, setSelectedVerification] = useState<any>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { verifications, evidences, createVerification, voteOnEvidence, isRealData } = useBlockchain()
  const { connected } = useTerrovaWallet()

  // Create form state
  const [lat, setLat] = useState("")
  const [lng, setLng] = useState("")
  const [radius, setRadius] = useState("50")
  const [claimType, setClaimType] = useState<ClaimType>("CropDamage")
  const [bounty, setBounty] = useState("100")
  const [requiredEvidence, setRequiredEvidence] = useState("3")
  const [deadlineDays, setDeadlineDays] = useState("7")
  const [isCreating, setIsCreating] = useState(false)
  const [createTxResult, setCreateTxResult] = useState<{ success: boolean; tx?: string; error?: string } | null>(null)

  // Vote state per evidence pubkey
  const [votingId, setVotingId] = useState<string | null>(null)
  const [voteResults, setVoteResults] = useState<Record<string, { success: boolean; tx?: string }>>({})

  const allVerifications = [
    ...mockVerifications,
    ...verifications
      .filter(v => !mockVerifications.find(m => m.id === v.id))
      .map(v => ({
        id: v.id,
        pubkey: v.pubkey ?? v.id,
        type: v.claim_type,
        location: `Lat: ${v.location.latitude.toFixed(4)}, Lng: ${v.location.longitude.toFixed(4)}`,
        coordinates: `${v.location.latitude}, ${v.location.longitude}`,
        status: v.status === "InProgress" ? "in_progress" : v.status.toLowerCase(),
        bounty: v.bounty,
        requiredEvidence: v.required_evidence,
        submittedEvidence: v.submitted_evidence,
        deadline: new Date(v.deadline).toISOString().split("T")[0],
        description: "On-chain verification request.",
        claimAmount: "TBD",
      })),
  ]

  const filteredVerifications = allVerifications.filter(
    v =>
      v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreate = async () => {
    if (!lat || !lng) return
    setIsCreating(true)
    setCreateTxResult(null)
    try {
      const result = await createVerification(
        { latitude: parseFloat(lat), longitude: parseFloat(lng) },
        parseInt(radius),
        claimType,
        parseFloat(bounty),
        parseInt(requiredEvidence),
        parseInt(deadlineDays)
      )
      if (result.success) {
        setCreateTxResult({ success: true, tx: result.tx })
        setIsCreateDialogOpen(false)
        setLat("")
        setLng("")
        setBounty("100")
      } else {
        const errMsg = result.error instanceof Error ? result.error.message : String(result.error ?? "Failed")
        setCreateTxResult({ success: false, error: errMsg })
      }
    } catch (e: any) {
      setCreateTxResult({ success: false, error: e?.message ?? "Unknown error" })
    } finally {
      setIsCreating(false)
    }
  }

  const handleVote = async (evidencePubkey: string, vote: boolean) => {
    if (!evidencePubkey || evidencePubkey.startsWith("mock-")) return
    setVotingId(evidencePubkey)
    try {
      const result = await voteOnEvidence(evidencePubkey, vote)
      setVoteResults(prev => ({ ...prev, [evidencePubkey]: { success: result.success, tx: result.tx } }))
    } finally {
      setVotingId(null)
    }
  }

  // Get evidence for a given verification
  const getEvidenceForVerification = (vrfId: string, vrfPubkey?: string) =>
    evidences.filter(
      e =>
        e.verification_request === vrfPubkey ||
        e.verification_request.slice(0, 8) === vrfId ||
        e.id.startsWith(vrfId.replace("VRF-", "EVD-"))
    )

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Verification Requests</h1>
          <p className="text-muted-foreground">Browse and accept verification tasks in your area</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search verifications..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 whitespace-nowrap" disabled={!connected}>
                <Plus className="h-4 w-4" />
                Create Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>New Verification Request</DialogTitle>
                <DialogDescription>
                  Submit a new insurance claim to the Terrova network for on-chain verification.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>Latitude</Label>
                    <Input placeholder="e.g. 39.0119" value={lat} onChange={e => setLat(e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Longitude</Label>
                    <Input placeholder="e.g. -96.7265" value={lng} onChange={e => setLng(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>Radius (km)</Label>
                    <Input type="number" value={radius} onChange={e => setRadius(e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Bounty (TRV)</Label>
                    <Input type="number" value={bounty} onChange={e => setBounty(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label>Claim Type</Label>
                    <Select value={claimType} onValueChange={v => setClaimType(v as ClaimType)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {claimTypeOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Required Evidence</Label>
                    <Input type="number" value={requiredEvidence} onChange={e => setRequiredEvidence(e.target.value)} />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Deadline (days from now)</Label>
                  <Input type="number" value={deadlineDays} onChange={e => setDeadlineDays(e.target.value)} />
                </div>

                <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                  {isRealData
                    ? "Request will be stored on Solana devnet."
                    : "Demo mode — request will be stored locally."}
                </div>

                <Button
                  className="w-full gap-2"
                  onClick={handleCreate}
                  disabled={isCreating || !lat || !lng}
                >
                  <FileCheck className="h-4 w-4" />
                  {isCreating ? "Submitting on-chain..." : "Submit Request"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* TX result banners */}
      {createTxResult && (
        <div
          className={`flex items-start gap-3 rounded-lg border p-4 ${
            createTxResult.success
              ? "border-green-500/20 bg-green-500/5"
              : "border-destructive/20 bg-destructive/5"
          }`}
        >
          {createTxResult.success ? (
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
          ) : (
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
          )}
          <div className="flex-1 text-sm">
            {createTxResult.success ? (
              <>
                <span className="font-medium text-green-500">Verification request created.</span>
                {createTxResult.tx && (
                  <a
                    href={`https://solscan.io/tx/${createTxResult.tx}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 inline-flex items-center gap-1 text-muted-foreground underline hover:text-foreground"
                  >
                    View transaction <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </>
            ) : (
              <span className="text-destructive">{createTxResult.error}</span>
            )}
          </div>
          <button onClick={() => setCreateTxResult(null)} className="text-muted-foreground hover:text-foreground">×</button>
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Total Requests</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{allVerifications.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Pending</span>
            </div>
            <p className="mt-1 text-2xl font-bold">
              {allVerifications.filter(v => v.status === "pending" || v.status === "Pending").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">In Progress</span>
            </div>
            <p className="mt-1 text-2xl font-bold">
              {allVerifications.filter(v => v.status === "in_progress" || v.status === "InProgress").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Completed</span>
            </div>
            <p className="mt-1 text-2xl font-bold">
              {allVerifications.filter(v => v.status === "completed" || v.status === "Completed").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Requests</CardTitle>
          <CardDescription>Verification requests available in your registered regions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="available">Available</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="flex flex-col gap-4">
                {filteredVerifications.map(verification => {
                  const statusKey = verification.status as string
                  const status = statusConfig[statusKey] ?? statusConfig.pending
                  const StatusIcon = status.icon
                  const progress = (verification.submittedEvidence / verification.requiredEvidence) * 100
                  const vrfEvidence = getEvidenceForVerification(verification.id, verification.pubkey)

                  return (
                    <Dialog key={verification.id}>
                      <DialogTrigger asChild>
                        <button
                          className="w-full rounded-lg border border-border p-4 text-left transition-colors hover:border-primary/50 hover:bg-muted/50"
                          onClick={() => setSelectedVerification(verification)}
                        >
                          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">{verification.id}</p>
                                <Badge variant="outline" className={status.color}>
                                  <StatusIcon className="mr-1 h-3 w-3" />
                                  {status.label}
                                </Badge>
                              </div>
                              <p className="mt-1 text-foreground">{verification.type}</p>
                              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {verification.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  Due: {verification.deadline}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <div className="w-32">
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span>Evidence</span>
                                  <span>{verification.submittedEvidence}/{verification.requiredEvidence}</span>
                                </div>
                                <Progress value={progress} className="mt-1 h-2" />
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold text-primary">{verification.bounty} TRV</p>
                                <p className="text-xs text-muted-foreground">Bounty</p>
                              </div>
                              <ArrowRight className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </div>
                        </button>
                      </DialogTrigger>

                      <DialogContent className="sm:max-w-lg">
                        <DialogHeader>
                          <DialogTitle>{verification.id}</DialogTitle>
                          <DialogDescription>{verification.type}</DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-4 py-4">
                          <div className="rounded-lg bg-muted/50 p-4">
                            <p className="text-sm">{verification.description}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground">Location</p>
                              <p className="font-medium">{verification.location}</p>
                              <p className="text-xs text-muted-foreground">{verification.coordinates}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Claim Amount</p>
                              <p className="font-medium">{verification.claimAmount}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Deadline</p>
                              <p className="font-medium">{verification.deadline}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">Bounty Reward</p>
                              <p className="font-medium text-primary">{verification.bounty} TRV</p>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Evidence Progress</span>
                              <span>{verification.submittedEvidence} of {verification.requiredEvidence}</span>
                            </div>
                            <Progress value={progress} className="mt-2" />
                          </div>

                          {/* Evidence with vote buttons */}
                          {vrfEvidence.length > 0 && (
                            <div className="flex flex-col gap-2">
                              <p className="text-sm font-medium">Submitted Evidence</p>
                              {vrfEvidence.map(e => {
                                const voteResult = voteResults[e.id]
                                const isVoting = votingId === e.id
                                return (
                                  <div
                                    key={e.id}
                                    className="flex items-center justify-between rounded-lg border border-border p-3"
                                  >
                                    <div>
                                      <p className="font-mono text-xs">{e.id}</p>
                                      <p className="text-xs text-muted-foreground">
                                        {e.approve_votes ?? 0} approve · {e.reject_votes ?? 0} reject
                                      </p>
                                    </div>
                                    <div className="flex gap-2">
                                      {voteResult ? (
                                        <span className={`text-xs ${voteResult.success ? "text-green-500" : "text-destructive"}`}>
                                          {voteResult.success ? "Voted" : "Failed"}
                                          {voteResult.tx && (
                                            <a
                                              href={`https://solscan.io/tx/${voteResult.tx}?cluster=devnet`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="ml-1 inline-flex items-center"
                                            >
                                              <ExternalLink className="h-3 w-3" />
                                            </a>
                                          )}
                                        </span>
                                      ) : (
                                        <>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="gap-1 text-green-500 border-green-500/30 hover:bg-green-500/10"
                                            onClick={() => handleVote(e.id, true)}
                                            disabled={isVoting || !connected}
                                          >
                                            <ThumbsUp className="h-3 w-3" />
                                            Approve
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="gap-1 text-red-500 border-red-500/30 hover:bg-red-500/10"
                                            onClick={() => handleVote(e.id, false)}
                                            disabled={isVoting || !connected}
                                          >
                                            <ThumbsDown className="h-3 w-3" />
                                            Reject
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          )}

                          {verification.status === "pending" && (
                            <Button className="w-full gap-2">
                              <Users className="h-4 w-4" />
                              Accept Verification Task
                            </Button>
                          )}
                          {verification.status === "completed" && (
                            <Button variant="outline" className="w-full gap-2" disabled>
                              <CheckCircle className="h-4 w-4" />
                              Verification Complete
                            </Button>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  )
                })}
              </div>
            </TabsContent>

            {(["available", "in_progress", "completed"] as const).map(tab => (
              <TabsContent key={tab} value={tab} className="mt-4">
                <div className="flex flex-col gap-4">
                  {filteredVerifications
                    .filter(v => {
                      if (tab === "available") return v.status === "pending" || v.status === "Pending"
                      if (tab === "in_progress") return v.status === "in_progress" || v.status === "InProgress"
                      return v.status === "completed" || v.status === "Completed"
                    })
                    .map(v => (
                      <div key={v.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                        <div>
                          <p className="font-semibold">{v.id}</p>
                          <p className="text-sm text-muted-foreground">{v.type}</p>
                          <p className="text-xs text-muted-foreground">{v.location}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-primary">{v.bounty} TRV</p>
                          <p className="text-xs text-muted-foreground">Due {v.deadline}</p>
                        </div>
                      </div>
                    ))}
                  {filteredVerifications.filter(v => {
                    if (tab === "available") return v.status === "pending" || v.status === "Pending"
                    if (tab === "in_progress") return v.status === "in_progress" || v.status === "InProgress"
                    return v.status === "completed" || v.status === "Completed"
                  }).length === 0 && (
                    <p className="py-8 text-center text-muted-foreground">No {tab.replace("_", " ")} verifications</p>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
