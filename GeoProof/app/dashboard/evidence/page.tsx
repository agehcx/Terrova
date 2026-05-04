"use client"

import { useState } from "react"
import { useBlockchain } from "@/lib/blockchain-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
import {
  Camera,
  Upload,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileImage,
  Thermometer,
  Droplets,
  Wind,
} from "lucide-react"

// Mock evidence data
const mockEvidence = [
  {
    id: "EVD-001",
    verificationId: "VRF-4521",
    type: "Photo",
    location: "38.5234, -98.7821",
    timestamp: "2024-01-15 14:32:00",
    status: "approved",
    hash: "0x7f83b1657...2c4e",
    weatherData: {
      temp: 72,
      humidity: 45,
      wind: 12,
    },
  },
  {
    id: "EVD-002",
    verificationId: "VRF-4520",
    type: "Photo",
    location: "41.8781, -93.0977",
    timestamp: "2024-01-15 10:15:00",
    status: "pending",
    hash: "0x9a23c4857...1b3f",
    weatherData: {
      temp: 65,
      humidity: 78,
      wind: 8,
    },
  },
  {
    id: "EVD-003",
    verificationId: "VRF-4519",
    type: "Photo",
    location: "40.8234, -96.7012",
    timestamp: "2024-01-14 16:45:00",
    status: "rejected",
    hash: "0x3b42d5912...8e7a",
    weatherData: {
      temp: 58,
      humidity: 62,
      wind: 22,
    },
  },
  {
    id: "EVD-004",
    verificationId: "VRF-4518",
    type: "Photo",
    location: "31.9686, -99.9018",
    timestamp: "2024-01-13 09:20:00",
    status: "approved",
    hash: "0x6d91f2345...4c2d",
    weatherData: {
      temp: 85,
      humidity: 35,
      wind: 15,
    },
  },
]

const statusConfig = {
  approved: {
    label: "Approved",
    color: "bg-green-500/10 text-green-500 border-green-500/20",
    icon: CheckCircle,
  },
  pending: {
    label: "Pending",
    color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    icon: Clock,
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-500/10 text-red-500 border-red-500/20",
    icon: XCircle,
  },
}

export default function EvidencePage() {
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const { evidences, verifications, submitEvidence } = useBlockchain()
  
  const [selectedVerification, setSelectedVerification] = useState("")
  const [lat, setLat] = useState("")
  const [lng, setLng] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Combine mock evidence with dynamic ones
  const allEvidence = [
    ...mockEvidence,
    ...evidences.map(e => ({
      id: e.id,
      verificationId: e.verification_request,
      type: "Photo",
      location: `${e.location.latitude}, ${e.location.longitude}`,
      timestamp: new Date(e.timestamp).toLocaleString(),
      status: e.status.toLowerCase(),
      hash: e.photo_hash.substring(0, 10) + "..." + e.photo_hash.slice(-4),
      weatherData: {
        temp: 70,
        humidity: 50,
        wind: 10,
      },
    }))
  ]

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      const mockHash = "0x" + Array.from({length: 40}, () => Math.floor(Math.random()*16).toString(16)).join('')
      await submitEvidence(
        selectedVerification, 
        { latitude: parseFloat(lat), longitude: parseFloat(lng) }, 
        mockHash
      )
      setIsSubmitDialogOpen(false)
      setSelectedFiles([])
      setLat("")
      setLng("")
    } catch (e) {
      console.error(e)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files))
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Evidence Management</h1>
          <p className="text-muted-foreground">
            Submit and track evidence for verification requests
          </p>
        </div>
        <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Upload className="h-4 w-4" />
              Submit Evidence
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Submit Evidence</DialogTitle>
              <DialogDescription>
                Upload geotagged photos and data for a verification request
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="verification">Verification Request</Label>
                <Select onValueChange={setSelectedVerification} value={selectedVerification}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verification request" />
                  </SelectTrigger>
                  <SelectContent>
                    {verifications.filter(v => v.status === "Pending" || v.status === "InProgress").map(v => (
                      <SelectItem key={v.id} value={v.id}>{v.id} - {v.claim_type}</SelectItem>
                    ))}
                    <SelectItem value="vrf-4521">VRF-4521 - Crop Damage (Kansas)</SelectItem>
                    <SelectItem value="vrf-4520">VRF-4520 - Flood Assessment (Iowa)</SelectItem>
                    <SelectItem value="vrf-4519">VRF-4519 - Hail Damage (Nebraska)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="photos">Photos</Label>
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 transition-colors hover:border-primary/50">
                  <input
                    type="file"
                    id="photos"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="photos"
                    className="flex cursor-pointer flex-col items-center gap-2"
                  >
                    <Camera className="h-10 w-10 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload photos
                    </span>
                    <span className="text-xs text-muted-foreground">
                      PNG, JPG up to 10MB each
                    </span>
                  </label>
                </div>
                {selectedFiles.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedFiles.map((file, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        <FileImage className="h-3 w-3" />
                        {file.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="lat">Latitude</Label>
                  <Input id="lat" placeholder="e.g., 38.5234" value={lat} onChange={e => setLat(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="lng">Longitude</Label>
                  <Input id="lng" placeholder="e.g., -98.7821" value={lng} onChange={e => setLng(e.target.value)} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Describe the field conditions observed..."
                  rows={3}
                />
              </div>

              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">
                  <AlertCircle className="mr-1 inline h-3 w-3" />
                  Weather data will be automatically captured from your location
                </p>
              </div>

              <Button className="w-full gap-2" onClick={handleSubmit} disabled={isSubmitting || !selectedVerification || !lat || !lng || selectedFiles.length === 0}>
                <Upload className="h-4 w-4" />
                {isSubmitting ? "Submitting..." : "Submit Evidence"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">Total Submitted</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{allEvidence.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Approved</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{allEvidence.filter(e => e.status === "approved").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Pending</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{allEvidence.filter(e => e.status === "pending").length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-muted-foreground">Rejected</span>
            </div>
            <p className="mt-1 text-2xl font-bold">{allEvidence.filter(e => e.status === "rejected").length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Evidence List */}
      <Card>
        <CardHeader>
          <CardTitle>Evidence History</CardTitle>
          <CardDescription>All evidence submissions from your node</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-4">
              <div className="flex flex-col gap-4">
                {allEvidence.map((evidence) => {
                  const status = statusConfig[evidence.status as keyof typeof statusConfig]
                  const StatusIcon = status.icon
                  return (
                    <div
                      key={evidence.id}
                      className="flex flex-col gap-4 rounded-lg border border-border p-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                          <FileImage className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{evidence.id}</p>
                            <Badge variant="outline" className={status.color}>
                              <StatusIcon className="mr-1 h-3 w-3" />
                              {status.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            For {evidence.verificationId}
                          </p>
                          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {evidence.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {evidence.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Weather Data */}
                      <div className="flex items-center gap-6 rounded-lg bg-muted/50 px-4 py-2">
                        <div className="flex items-center gap-1">
                          <Thermometer className="h-4 w-4 text-orange-500" />
                          <span className="text-sm">{evidence.weatherData.temp}F</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{evidence.weatherData.humidity}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Wind className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">{evidence.weatherData.wind} mph</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">Hash</p>
                        <code className="text-xs text-primary">{evidence.hash}</code>
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>
            <TabsContent value="approved" className="mt-4">
              <div className="flex flex-col gap-4">
                {allEvidence
                  .filter((e) => e.status === "approved")
                  .map((evidence) => {
                    const status = statusConfig[evidence.status as keyof typeof statusConfig]
                    const StatusIcon = status.icon
                    return (
                      <div
                        key={evidence.id}
                        className="flex flex-col gap-4 rounded-lg border border-border p-4 md:flex-row md:items-center md:justify-between"
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
                            <FileImage className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">{evidence.id}</p>
                              <Badge variant="outline" className={status.color}>
                                <StatusIcon className="mr-1 h-3 w-3" />
                                {status.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              For {evidence.verificationId}
                            </p>
                          </div>
                        </div>
                        <code className="text-xs text-primary">{evidence.hash}</code>
                      </div>
                    )
                  })}
              </div>
            </TabsContent>
            <TabsContent value="pending" className="mt-4">
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                {allEvidence.filter((e) => e.status === "pending").length === 0
                  ? "No pending evidence"
                  : allEvidence
                      .filter((e) => e.status === "pending")
                      .map((e) => <p key={e.id}>{e.id}</p>)}
              </div>
            </TabsContent>
            <TabsContent value="rejected" className="mt-4">
              <div className="flex items-center justify-center py-8 text-muted-foreground">
                {allEvidence.filter((e) => e.status === "rejected").length === 0
                  ? "No rejected evidence"
                  : allEvidence
                      .filter((e) => e.status === "rejected")
                      .map((e) => <p key={e.id}>{e.id}</p>)}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
