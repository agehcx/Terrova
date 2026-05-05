"use client"

import { useState, useCallback } from "react"
import { Map, Marker, Popup, NavigationControl, ScaleControl } from "react-map-gl/mapbox"
import "mapbox-gl/dist/mapbox-gl.css"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Signal, Clock, CheckCircle } from "lucide-react"

// Mock node data - in production this would come from on-chain data
export const mockNodes = [
  {
    id: "node-1",
    pubkey: "7Vbm...3xKj",
    lat: 39.0119,
    lng: -98.4842,
    location: "Kansas, USA",
    status: "active",
    reputation: 95,
    stake: 5000,
    evidenceCount: 234,
  },
  {
    id: "node-2",
    pubkey: "9Abc...7yZw",
    lat: 41.8781,
    lng: -93.0977,
    location: "Iowa, USA",
    status: "active",
    reputation: 88,
    stake: 3500,
    evidenceCount: 156,
  },
  {
    id: "node-3",
    pubkey: "3Def...2qRs",
    lat: 41.4925,
    lng: -99.9018,
    location: "Nebraska, USA",
    status: "active",
    reputation: 92,
    stake: 4200,
    evidenceCount: 189,
  },
  {
    id: "node-4",
    pubkey: "5Ghi...8pLm",
    lat: 31.9686,
    lng: -99.9018,
    location: "Texas, USA",
    status: "pending",
    reputation: 0,
    stake: 2000,
    evidenceCount: 0,
  },
  {
    id: "node-5",
    pubkey: "2Jkl...4nOp",
    lat: 44.9778,
    lng: -93.2650,
    location: "Minnesota, USA",
    status: "active",
    reputation: 97,
    stake: 8000,
    evidenceCount: 412,
  },
  {
    id: "node-6",
    pubkey: "8Mno...6rSt",
    lat: 43.0731,
    lng: -89.4012,
    location: "Wisconsin, USA",
    status: "inactive",
    reputation: 72,
    stake: 1500,
    evidenceCount: 89,
  },
  {
    id: "node-7",
    pubkey: "4Uvw...9xYz",
    lat: 38.6270,
    lng: -90.1994,
    location: "Missouri, USA",
    status: "active",
    reputation: 91,
    stake: 4800,
    evidenceCount: 201,
  },
  {
    id: "node-8",
    pubkey: "6Abc...1dEf",
    lat: 35.0078,
    lng: -97.0929,
    location: "Oklahoma, USA",
    status: "active",
    reputation: 85,
    stake: 3200,
    evidenceCount: 145,
  },
]

// Mock verification requests
export const mockVerificationRequests = [
  {
    id: "vrf-001",
    lat: 38.5,
    lng: -98.0,
    type: "Crop Damage",
    status: "pending",
    bounty: 50,
  },
  {
    id: "vrf-002",
    lat: 42.0,
    lng: -94.5,
    type: "Flood Assessment",
    status: "in_progress",
    bounty: 75,
  },
  {
    id: "vrf-003",
    lat: 40.8,
    lng: -96.7,
    type: "Hail Damage",
    status: "pending",
    bounty: 60,
  },
]

interface NodeMarkerProps {
  node: typeof mockNodes[0]
  onClick: () => void
}

function NodeMarker({ node, onClick }: NodeMarkerProps) {
  const statusColors = {
    active: "bg-green-500",
    pending: "bg-yellow-500",
    inactive: "bg-gray-500",
  }

  return (
    <button
      onClick={onClick}
      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 border-white shadow-lg transition-transform hover:scale-110 ${
        statusColors[node.status as keyof typeof statusColors]
      }`}
    >
      <Signal className="h-4 w-4 text-white" />
    </button>
  )
}

interface VerificationMarkerProps {
  verification: typeof mockVerificationRequests[0]
  onClick: () => void
}

function VerificationMarker({ verification, onClick }: VerificationMarkerProps) {
  return (
    <button
      onClick={onClick}
      className="flex h-8 w-8 animate-pulse items-center justify-center rounded-full border-2 border-white bg-primary shadow-lg transition-transform hover:scale-110"
    >
      <MapPin className="h-4 w-4 text-white" />
    </button>
  )
}

interface NetworkMapProps {
  showNodes?: boolean
  showVerifications?: boolean
  onNodeSelect?: (node: typeof mockNodes[0]) => void
  onVerificationSelect?: (verification: typeof mockVerificationRequests[0]) => void
}

export function NetworkMap({
  showNodes = true,
  showVerifications = true,
  onNodeSelect,
  onVerificationSelect,
}: NetworkMapProps) {
  const [viewState, setViewState] = useState({
    latitude: 39.8283,
    longitude: -98.5795,
    zoom: 4,
  })

  const [selectedNode, setSelectedNode] = useState<typeof mockNodes[0] | null>(null)
  const [selectedVerification, setSelectedVerification] = useState<
    typeof mockVerificationRequests[0] | null
  >(null)

  const handleNodeClick = useCallback(
    (node: typeof mockNodes[0]) => {
      setSelectedNode(node)
      setSelectedVerification(null)
      onNodeSelect?.(node)
    },
    [onNodeSelect]
  )

  const handleVerificationClick = useCallback(
    (verification: typeof mockVerificationRequests[0]) => {
      setSelectedVerification(verification)
      setSelectedNode(null)
      onVerificationSelect?.(verification)
    },
    [onVerificationSelect]
  )

  // Use a public Mapbox style that doesn't require an access token for demo
  // In production, you'd use process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "demo"

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        mapboxAccessToken={mapboxToken}
        attributionControl={false}
      >
        <NavigationControl position="top-right" />
        <ScaleControl position="bottom-left" />

        {/* Node Markers */}
        {showNodes &&
          mockNodes.map((node) => (
            <Marker
              key={node.id}
              latitude={node.lat}
              longitude={node.lng}
              anchor="center"
            >
              <NodeMarker node={node} onClick={() => handleNodeClick(node)} />
            </Marker>
          ))}

        {/* Verification Request Markers */}
        {showVerifications &&
          mockVerificationRequests.map((verification) => (
            <Marker
              key={verification.id}
              latitude={verification.lat}
              longitude={verification.lng}
              anchor="center"
            >
              <VerificationMarker
                verification={verification}
                onClick={() => handleVerificationClick(verification)}
              />
            </Marker>
          ))}

        {/* Node Popup */}
        {selectedNode && (
          <Popup
            latitude={selectedNode.lat}
            longitude={selectedNode.lng}
            anchor="bottom"
            onClose={() => setSelectedNode(null)}
            closeOnClick={false}
            className="z-50"
          >
            <Card className="border-0 bg-transparent shadow-none">
              <CardContent className="p-0">
                <div className="w-56">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">Node {selectedNode.pubkey}</h4>
                    <Badge
                      variant="outline"
                      className={
                        selectedNode.status === "active"
                          ? "bg-green-500/10 text-green-500"
                          : selectedNode.status === "pending"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-gray-500/10 text-gray-500"
                      }
                    >
                      {selectedNode.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{selectedNode.location}</p>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-muted-foreground">Reputation</p>
                      <p className="font-semibold text-foreground">{selectedNode.reputation}/100</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Staked</p>
                      <p className="font-semibold text-foreground">{selectedNode.stake} TRV</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-muted-foreground">Evidence Submitted</p>
                      <p className="font-semibold text-foreground">{selectedNode.evidenceCount}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Popup>
        )}

        {/* Verification Popup */}
        {selectedVerification && (
          <Popup
            latitude={selectedVerification.lat}
            longitude={selectedVerification.lng}
            anchor="bottom"
            onClose={() => setSelectedVerification(null)}
            closeOnClick={false}
            className="z-50"
          >
            <Card className="border-0 bg-transparent shadow-none">
              <CardContent className="p-0">
                <div className="w-56">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-foreground">{selectedVerification.type}</h4>
                    <Badge
                      variant="outline"
                      className={
                        selectedVerification.status === "pending"
                          ? "bg-yellow-500/10 text-yellow-500"
                          : "bg-blue-500/10 text-blue-500"
                      }
                    >
                      {selectedVerification.status === "pending" ? "Pending" : "In Progress"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">ID: {selectedVerification.id}</p>
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground">Bounty Reward</p>
                    <p className="font-semibold text-primary">
                      {selectedVerification.bounty} TRV
                    </p>
                  </div>
                  <Button size="sm" className="mt-3 w-full">
                    Accept Task
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Popup>
        )}
      </Map>

      {/* Map Legend */}
      <div className="absolute bottom-4 right-4 rounded-lg border border-border bg-background/90 p-3 backdrop-blur-sm">
        <p className="mb-2 text-xs font-semibold text-foreground">Legend</p>
        <div className="flex flex-col gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-green-500" />
            <span className="text-muted-foreground">Active Node</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-yellow-500" />
            <span className="text-muted-foreground">Pending Node</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-gray-500" />
            <span className="text-muted-foreground">Inactive Node</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-3 w-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">Verification Request</span>
          </div>
        </div>
      </div>
    </div>
  )
}
