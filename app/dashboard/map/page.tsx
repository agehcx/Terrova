"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Signal, MapPin, Filter, RefreshCw } from "lucide-react"
import { mockNodes, mockVerificationRequests } from "@/components/dashboard/network-map"

// Dynamic import to avoid SSR issues with mapbox-gl
const NetworkMap = dynamic(
  () => import("@/components/dashboard/network-map").then((mod) => mod.NetworkMap),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center bg-muted/50">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">Loading map...</p>
        </div>
      </div>
    ),
  }
)

export default function MapPage() {
  const [showNodes, setShowNodes] = useState(true)
  const [showVerifications, setShowVerifications] = useState(true)
  const [selectedTab, setSelectedTab] = useState("all")

  const activeNodes = mockNodes.filter((n) => n.status === "active")
  const pendingVerifications = mockVerificationRequests.filter((v) => v.status === "pending")

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col gap-6 lg:flex-row">
      {/* Map Container */}
      <div className="flex-1 overflow-hidden rounded-xl border border-border">
        <NetworkMap
          showNodes={showNodes}
          showVerifications={showVerifications}
        />
      </div>

      {/* Sidebar */}
      <div className="flex w-full flex-col gap-4 lg:w-80">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Signal className="h-4 w-4 text-green-500" />
                <span className="text-sm text-muted-foreground">Active Nodes</span>
              </div>
              <p className="mt-1 text-2xl font-bold">{activeNodes.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm text-muted-foreground">Pending</span>
              </div>
              <p className="mt-1 text-2xl font-bold">{pendingVerifications.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Filters</CardTitle>
              <Filter className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={showNodes ? "default" : "outline"}
              onClick={() => setShowNodes(!showNodes)}
            >
              <Signal className="mr-2 h-4 w-4" />
              Nodes
            </Button>
            <Button
              size="sm"
              variant={showVerifications ? "default" : "outline"}
              onClick={() => setShowVerifications(!showVerifications)}
            >
              <MapPin className="mr-2 h-4 w-4" />
              Requests
            </Button>
          </CardContent>
        </Card>

        {/* Tabs for Nodes/Verifications List */}
        <Card className="flex-1 overflow-hidden">
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <CardHeader className="pb-0">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="nodes">Nodes</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-80">
                <TabsContent value="all" className="m-0 p-4">
                  <div className="flex flex-col gap-3">
                    {mockVerificationRequests.map((v) => (
                      <div
                        key={v.id}
                        className="flex items-center justify-between rounded-lg border border-border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                            <MapPin className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{v.type}</p>
                            <p className="text-xs text-muted-foreground">{v.id}</p>
                          </div>
                        </div>
                        <Badge
                          variant="outline"
                          className={
                            v.status === "pending"
                              ? "bg-yellow-500/10 text-yellow-500"
                              : "bg-blue-500/10 text-blue-500"
                          }
                        >
                          {v.bounty} TRV
                        </Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="nodes" className="m-0 p-4">
                  <div className="flex flex-col gap-3">
                    {mockNodes.map((node) => (
                      <div
                        key={node.id}
                        className="flex items-center justify-between rounded-lg border border-border p-3"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              node.status === "active"
                                ? "bg-green-500/10"
                                : node.status === "pending"
                                ? "bg-yellow-500/10"
                                : "bg-gray-500/10"
                            }`}
                          >
                            <Signal
                              className={`h-4 w-4 ${
                                node.status === "active"
                                  ? "text-green-500"
                                  : node.status === "pending"
                                  ? "text-yellow-500"
                                  : "text-gray-500"
                              }`}
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{node.pubkey}</p>
                            <p className="text-xs text-muted-foreground">{node.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{node.reputation}</p>
                          <p className="text-xs text-muted-foreground">rep</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </ScrollArea>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
