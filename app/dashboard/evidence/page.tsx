"use client"

import { useState } from "react"
import { useBlockchain } from "@/lib/blockchain-context"
import { useTerrovaWallet } from "@/hooks/useTerrovaWallet"
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
  ExternalLink,
} from "lucide-react"

const mockEvidence = [
  {
    id: "EVD-001",
    verificationId: "VRF-4521",
    type: "Photo",
    location: "38.5234, -98.7821",
    timestamp: "2024-01-15 14:32:00",
    status: "approved",
    hash: "0x7f83b1657...2c4e",
    weatherData: { temp: 72, humidity: 45, wind: 12 },
  },
  {
    id: "EVD-002",
    verificationId: "VRF-4520",
    type: "Photo",
    location: "41.8781, -93.0977",
    timestamp: "2024-01-15 10:15:00",
    status: "pending",
    hash: "0x9a23c4857...1b3f",
    weatherData: { temp: 65, humidity: 78, wind: 8 },
  },
  {
    id: "EVD-003",
    verificationId: "VRF-4519",
    type: "Photo",
    location: "40.8234, -96.7012",
    timestamp: "2024-01-14 16:45:00",
    status: "rejected",
    hash: "0x3b42d5912...8e7a",
    weatherData: { temp: 58, humidity: 62, wind: 22 },
  },
  {
    id: "EVD-004",
    verificationId: "VRF-4518",
    type: "Photo",
    location: "31.9686, -99.9018",
    timestamp: "2024-01-13 09:20:00",
    status: "approved",
    hash: "0x6d91f2345...4c2d",
    weatherData: { temp: 85, humidity: 35, wind: 15 },
  },
]

const statusConfig = {
  approved: { label: "Approved", color: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle },
  Approved: { label: "Approved", color: "bg-green-500/10 text-green-500 border-green-500/20", icon: CheckCircle },
  pending: { label: "Pending", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: Clock },
  Pending: { label: "Pending", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: Clock },
  rejected: { label: "Rejected", color: "bg-red-500/10 text-red-500 border-red-500/20", icon: XCircle },
  Rejected: { label: "Rejected", color: "bg-red-500/10 text-red-500 border-red-500/20", icon: XCircle },
}

export default function EvidencePage() {
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const { evidences, verifications, submitEvidence, isRealData } = useBlockchain()
  const { connected } = useTerrovaWallet()

  const [selectedVerificationPubkey, setSelectedVerificationPubkey] = useState("")
  const [lat, setLat] = useState("")
  const [lng, setLng] = useState("")
  const [temp, setTemp] = useState("72")
  const [humidity, setHumidity] = useState("45")
  const [wind, setWind] = useState("12")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [txResult, setTxResult] = useState<{ success: boolean; tx?: string; error?: string } | null>(null)

  const allEvidence = [
    ...mockEvidence,
    ...evidences.map(e => ({
      id: e.id,
      verificationId: e.verification_request.slice(0, 8),
      type: "Photo",
      location: `${e.location.latitude.toFixed(4)}, ${e.location.longitude.toFixed(4)}`,
      timestamp: new Date(e.timestamp).toLocaleString(),
      status: e.status.toLowerCase(),
      hash: e.photo_hash.length > 14 ? e.photo_hash.substring(0, 10) + "..." + e.photo_hash.slice(-4) : e.photo_hash,
      weatherData: {
        temp: e.weather_data?.temperature ?? 70,
        humidity: e.weather_data?.humidity ?? 50,
        wind: e.weather_data?.windSpeed ?? 10,
      },
    })),
  ]

  const generatePhotoHash = (files: File[]): string => {
    const names = files.map(f => f.name + f.size).join("")
    let hash = 0
    for (let i = 0; i < names.length; i++) {
      hash = ((hash << 5) - hash + names.charCodeAt(i)) | 0
    }
    return "0x" + Math.abs(hash).toString(16).padStart(8, "0") + Date.now().toString(16)
  }

  const handleSubmit = async () => {
    if (!selectedVerificationPubkey || !lat || !lng) return
    setIsSubmitting(true)
    setTxResult(null)
    try {
      const hash =
        selectedFiles.length > 0
          ? generatePhotoHash(selectedFiles)
          : "0x" + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join("")

      const result = await submitEvidence(
        selectedVerificationPubkey,
        { latitude: parseFloat(lat), longitude: parseFloat(lng) },
        hash,
        { temp: parseInt(temp), humidity: parseInt(humidity), wind: parseInt(wind) }
      )

      if (result.success) {
        setTxResult({ success: true, tx: result.tx })
        setIsSubmitDialogOpen(false)
        setSelectedFiles([])
        setLat("")
        setLng("")
        setSelectedVerificationPubkey("")
      } else {
        const errMsg = result.error instanceof Error ? result.error.message : String(result.error ?? "Submission failed")
        setTxResult({ success: false, error: errMsg })
      }
    } catch (e: any) {
      setTxResult({ success: false, error: e?.message ?? "Unknown error" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setSelectedFiles(Array.from(e.target.files))
  }

  // Build select options: real verifications by pubkey, then hardcoded mock fallbacks
  const selectableVerifications = verifications
    .filter(v => v.status === "Pending" || v.status === "InProgress")
    .map(v => ({
      value: v.pubkey ?? v.id,
      label: `${v.id} - ${v.claim_type}`,
    }))

  if (selectableVerifications.length === 0) {
    selectableVerifications.push(
      { value: "mock-vrf-4521", label: "VRF-4521 - Crop Damage (Kansas)" },
      { value: "mock-vrf-4520", label: "VRF-4520 - Flood Assessment (Iowa)" },
      { value: "mock-vrf-4519", label: "VRF-4519 - Hail Damage (Nebraska)" }
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Evidence Management</h1>
          <p className="text-muted-foreground">Submit and track evidence for verification requests</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => {
              setSelectedVerificationPubkey("mock-vrf-4521")
              setLat("38.5234")
              setLng("-98.7821")
              setTemp("75")
              setHumidity("40")
              setWind("10")
              setIsSubmitDialogOpen(true)
            }}
          >
            Quick Mock Data
          </Button>
          <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#a7e2c3] text-black hover:bg-[#8cd1ac] font-medium gap-2 border-0" disabled={!connected}>
                <Upload className="h-4 w-4" />
                Submit Evidence
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Submit Evidence</DialogTitle>
              <DialogDescription>
                Upload geotagged photos and field data for a verification request
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div className="flex flex-col gap-2">
                <Label>Verification Request</Label>
                <Select
                  onValueChange={setSelectedVerificationPubkey}
                  value={selectedVerificationPubkey}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verification request" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectableVerifications.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
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
                  <label htmlFor="photos" className="flex cursor-pointer flex-col items-center gap-2">
                    <Camera className="h-10 w-10 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Click to upload photos</span>
                    <span className="text-xs text-muted-foreground">PNG, JPG up to 10MB each</span>
                  </label>
                </div>
                {selectedFiles.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedFiles.map((file, i) => (
                      <Badge key={i} variant="secondary" className="gap-1">
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

              <div>
                <Label className="mb-2 block text-sm">Weather Conditions</Label>
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="temp" className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Thermometer className="h-3 w-3" /> Temp (°F)
                    </Label>
                    <Input id="temp" type="number" value={temp} onChange={e => setTemp(e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="humidity" className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Droplets className="h-3 w-3" /> Humidity %
                    </Label>
                    <Input id="humidity" type="number" value={humidity} onChange={e => setHumidity(e.target.value)} />
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label htmlFor="wind" className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Wind className="h-3 w-3" /> Wind (mph)
                    </Label>
                    <Input id="wind" type="number" value={wind} onChange={e => setWind(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Describe the field conditions observed..." rows={3} />
              </div>

              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">
                  <AlertCircle className="mr-1 inline h-3 w-3" />
                  {isRealData
                    ? "Evidence will be submitted on-chain to Solana devnet."
                    : "Demo mode — submission will update local state only."}
                </p>
              </div>

              <Button
                className="w-full gap-2 bg-[#a7e2c3] text-black hover:bg-[#8cd1ac] font-medium border-0"
                onClick={handleSubmit}
                disabled={isSubmitting || !selectedVerificationPubkey || !lat || !lng}
              >
                <Upload className="h-4 w-4" />
                {isSubmitting ? "Submitting on-chain..." : "Submit Evidence"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
                <span className="font-medium text-green-500">Evidence submitted on-chain.</span>
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
          <button onClick={() => setTxResult(null)} className="text-muted-foreground hover:text-foreground">×</button>
        </div>
      )}

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
            <p className="mt-1 text-2xl font-bold">
              {allEvidence.filter(e => e.status === "approved" || e.status === "Approved").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Pending</span>
            </div>
            <p className="mt-1 text-2xl font-bold">
              {allEvidence.filter(e => e.status === "pending" || e.status === "Pending").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              <span className="text-sm text-muted-foreground">Rejected</span>
            </div>
            <p className="mt-1 text-2xl font-bold">
              {allEvidence.filter(e => e.status === "rejected" || e.status === "Rejected").length}
            </p>
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
            {(["all", "approved", "pending", "rejected"] as const).map(tab => (
              <TabsContent key={tab} value={tab} className="mt-4">
                <div className="flex flex-col gap-4">
                  {allEvidence
                    .filter(e => tab === "all" || e.status === tab || e.status === tab.charAt(0).toUpperCase() + tab.slice(1))
                    .map(evidence => {
                      const normalizedStatus = evidence.status.toLowerCase() as keyof typeof statusConfig
                      const status = statusConfig[normalizedStatus] ?? statusConfig.pending
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
                              <p className="text-sm text-muted-foreground">For {evidence.verificationId}</p>
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

                          <div className="flex items-center gap-6 rounded-lg bg-muted/50 px-4 py-2">
                            <div className="flex items-center gap-1">
                              <Thermometer className="h-4 w-4 text-orange-500" />
                              <span className="text-sm">{evidence.weatherData.temp}°F</span>
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
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
