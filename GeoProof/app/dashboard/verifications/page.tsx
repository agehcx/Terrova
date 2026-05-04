"use client"

import { useState } from "react"
import { useBlockchain, ClaimType } from "@/lib/blockchain-context"
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
} from "lucide-react"

// Mock verification requests
const mockVerifications = [
  {
    id: "VRF-4521",
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

const statusConfig = {
  pending: {
    label: "Pending Evidence",
    color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    icon: Clock,
  },
  in_progress: {
    label: "In Progress",
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    icon: AlertCircle,
  },
  completed: {
    label: "Completed",
    color: "bg-green-500/10 text-green-500 border-green-500/20",
    icon: CheckCircle,
  },
}

export default function VerificationsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedVerification, setSelectedVerification] = useState<any>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const { verifications, createVerification } = useBlockchain()

  const [lat, setLat] = useState("")
  const [lng, setLng] = useState("")
  const [radius, setRadius] = useState("50")
  const [claimType, setClaimType] = useState<ClaimType>("CropDamage")
  const [bounty, setBounty] = useState("100")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Combine mock verifications with dynamic verifications from context
  const allVerifications = [
    ...mockVerifications,
    ...verifications.filter(v => !mockVerifications.find(m => m.id === v.id)).map(v => ({
      id: v.id,
      type: v.claim_type,
      location: `Lat: ${v.location.latitude}, Lng: ${v.location.longitude}`,
      coordinates: `${v.location.latitude}, ${v.location.longitude}`,
      status: v.status.toLowerCase() === "inprogress" ? "in_progress" : v.status.toLowerCase(),
      bounty: v.bounty,
      requiredEvidence: v.required_evidence,
      submittedEvidence: v.submitted_evidence,
      deadline: new Date(v.deadline).toISOString().split('T')[0],
      description: "Dynamically requested verification.",
      claimAmount: "TBD",
    }))
  ]

  const filteredVerifications = allVerifications.filter(
    (v) =>
      v.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreate = async () => {
    try {
      setIsSubmitting(true)
      await createVerification(
        { latitude: parseFloat(lat), longitude: parseFloat(lng) },
        parseInt(radius),
        claimType,
        parseFloat(bounty)
      )
      setIsCreateDialogOpen(false)
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
          <h1 className="text-2xl font-bold text-foreground">Verification Requests</h1>
          <p className="text-muted-foreground">
            Browse and accept verification tasks in your area
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search verifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 whitespace-nowrap">
                <FileCheck className="h-4 w-4" />
                Create Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>New Verification Request</DialogTitle>
                <DialogDescription>Submit a new claim to the GeoProof network for verification.</DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Latitude</label>
                    <Input placeholder="e.g. 39.0119" value={lat} onChange={e => setLat(e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Longitude</label>
                    <Input placeholder="e.g. -96.7265" value={lng} onChange={e => setLng(e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Radius (km)</label>
                    <Input type="number" placeholder="10" value={radius} onChange={e => setRadius(e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium">Bounty (PROOF)</label>
                    <Input type="number" placeholder="100" value={bounty} onChange={e => setBounty(e.target.value)} />
                  </div>
                </div>
                <Button className="w-full gap-2 mt-2" onClick={handleCreate} disabled={isSubmitting || !lat || !lng}>
                  {isSubmitting ? "Submitting..." : "Submit Request"}
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
              <FileCheck className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Available</span>
            </div>
            <p className="mt-1 text-2xl font-bold">
              {allVerifications.filter((v) => v.status === "pending").length}
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
              {allVerifications.filter((v) => v.status === "in_progress").length}
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
              {allVerifications.filter((v) => v.status === "completed").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Coins className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Total Bounties</span>
            </div>
            <p className="mt-1 text-2xl font-bold">
              {allVerifications.reduce((acc, v) => acc + Number(v.bounty), 0)} PROOF
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Verification List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Requests</CardTitle>
          <CardDescription>
            Verification requests available in your registered regions
          </CardDescription>
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
                {filteredVerifications.map((verification) => {
                  const status = statusConfig[verification.status as keyof typeof statusConfig]
                  const StatusIcon = status.icon
                  const progress = (verification.submittedEvidence / verification.requiredEvidence) * 100

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
                              {/* Progress */}
                              <div className="w-32">
                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                  <span>Evidence</span>
                                  <span>
                                    {verification.submittedEvidence}/{verification.requiredEvidence}
                                  </span>
                                </div>
                                <Progress value={progress} className="mt-1 h-2" />
                              </div>

                              {/* Bounty */}
                              <div className="text-right">
                                <p className="text-lg font-bold text-primary">
                                  {verification.bounty} PROOF
                                </p>
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
                              <p className="font-medium text-primary">{verification.bounty} PROOF</p>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Evidence Progress</span>
                              <span>
                                {verification.submittedEvidence} of {verification.requiredEvidence}
                              </span>
                            </div>
                            <Progress value={progress} className="mt-2" />
                          </div>

                          {verification.status === "pending" && (
                            <Button className="w-full gap-2">
                              <Users className="h-4 w-4" />
                              Accept Verification Task
                            </Button>
                          )}
                          {verification.status === "in_progress" && (
                            <Button className="w-full gap-2">
                              Submit Evidence
                              <ArrowRight className="h-4 w-4" />
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
            <TabsContent value="available" className="mt-4">
              <div className="flex flex-col gap-4">
                {filteredVerifications.filter((v) => v.status === "pending").length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">
                    No available verifications
                  </p>
                ) : (
                  filteredVerifications
                    .filter((v) => v.status === "pending")
                    .map((v) => (
                      <div key={v.id} className="rounded-lg border border-border p-4">
                        <p className="font-semibold">{v.id}</p>
                        <p className="text-sm text-muted-foreground">{v.type}</p>
                      </div>
                    ))
                )}
              </div>
            </TabsContent>
            <TabsContent value="in_progress" className="mt-4">
              <div className="flex flex-col gap-4">
                {filteredVerifications.filter((v) => v.status === "in_progress").length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">
                    No verifications in progress
                  </p>
                ) : (
                  filteredVerifications
                    .filter((v) => v.status === "in_progress")
                    .map((v) => (
                      <div key={v.id} className="rounded-lg border border-border p-4">
                        <p className="font-semibold">{v.id}</p>
                        <p className="text-sm text-muted-foreground">{v.type}</p>
                      </div>
                    ))
                )}
              </div>
            </TabsContent>
            <TabsContent value="completed" className="mt-4">
              <div className="flex flex-col gap-4">
                {filteredVerifications.filter((v) => v.status === "completed").length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">
                    No completed verifications
                  </p>
                ) : (
                  filteredVerifications
                    .filter((v) => v.status === "completed")
                    .map((v) => (
                      <div key={v.id} className="rounded-lg border border-border p-4">
                        <p className="font-semibold">{v.id}</p>
                        <p className="text-sm text-muted-foreground">{v.type}</p>
                      </div>
                    ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
