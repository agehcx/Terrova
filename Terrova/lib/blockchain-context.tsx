"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"
import { useTerrova } from "@/hooks/useTerrova"
import { seedNodes, seedVerificationRequests, seedEvidence } from "./terrova/seed-data"

// Types matching our Smart Contract & UI
export interface GeoLocation {
  latitude: number
  longitude: number
}

export type ClaimType = "CropDamage" | "FloodAssessment" | "HailDamage" | "DroughtVerification" | "FireDamage" | "PestInfestation" | "Other"
export type VerificationStatus = "Pending" | "InProgress" | "Completed" | "Rejected" | "Expired" | "Disputed"

export interface VerificationRequest {
  id: string
  pubkey?: string
  requester: string
  location: GeoLocation
  radius_km: number
  claim_type: ClaimType
  bounty: number // in SOL/Tokens
  required_evidence: number
  submitted_evidence: number
  status: VerificationStatus
  deadline: number // timestamp
  created_at: number // timestamp
}

export interface NodeInfo {
  pubkey?: string
  owner: string
  location: GeoLocation
  coverage_radius_km: number
  reputation: number
  evidence_count: number
  status: string
  registered_at: number
}

export interface Evidence {
  id: string
  verification_request: string
  node: string
  photo_hash: string
  location: GeoLocation
  timestamp: number
  status: string
}

interface BlockchainContextType {
  verifications: VerificationRequest[]
  nodes: Record<string, NodeInfo>
  evidences: Evidence[]
  loading: boolean
  isRealData: boolean
  registerNode: (location: GeoLocation, radius: number) => Promise<any>
  createVerification: (location: GeoLocation, radius: number, type: ClaimType, bounty: number) => Promise<any>
  submitEvidence: (verificationId: string, location: GeoLocation, hash: string) => Promise<any>
  refreshData: () => Promise<void>
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined)

export function BlockchainProvider({ children }: { children: ReactNode }) {
  const { publicKey, connected } = useWallet()
  const { client, isInitialized, registerNode: contractRegister, submitEvidence: contractSubmit, createVerificationRequest: contractCreate } = useTerrova()
  
  const [verifications, setVerifications] = useState<VerificationRequest[]>([])
  const [nodes, setNodes] = useState<Record<string, NodeInfo>>({})
  const [evidences, setEvidences] = useState<Evidence[]>([])
  const [loading, setLoading] = useState(true)
  const [isRealData, setIsRealData] = useState(false)

  const refreshData = useCallback(async () => {
    setLoading(true)
    
    // If we have a real client initialized, fetch from chain
    if (isInitialized && client) {
      try {
        console.log("[BlockchainContext] Fetching real data from Solana...")
        const realNodes = await client.fetchAllNodes()
        
        // Map real nodes to our Record format
        const nodeMap: Record<string, NodeInfo> = {}
        realNodes.forEach(n => {
          nodeMap[n.owner] = {
            ...n,
            registered_at: n.registeredAt.getTime()
          }
        })

        // Combine with seed nodes for visual density
        seedNodes.forEach(sn => {
          const ownerStr = sn.owner.toBase58()
          if (!nodeMap[ownerStr]) {
            nodeMap[ownerStr] = {
              pubkey: sn.pubkey.toBase58(),
              owner: ownerStr,
              location: sn.location,
              coverage_radius_km: sn.coverageRadiusKm,
              reputation: sn.reputation,
              evidence_count: sn.evidenceCount,
              status: "Active",
              registered_at: sn.registeredAt.getTime()
            }
          }
        })

        setNodes(nodeMap)
        setIsRealData(true)
      } catch (err) {
        console.error("[BlockchainContext] Error fetching real data:", err)
        loadMockData()
      }
    } else {
      loadMockData()
    }
    
    setLoading(false)
  }, [isInitialized, client])

  const loadMockData = () => {
    console.log("[BlockchainContext] Using mock/seed data")
    const nodeMap: Record<string, NodeInfo> = {}
    seedNodes.forEach(sn => {
      nodeMap[sn.owner.toBase58()] = {
        pubkey: sn.pubkey.toBase58(),
        owner: sn.owner.toBase58(),
        location: sn.location,
        coverage_radius_km: sn.coverageRadiusKm,
        reputation: sn.reputation,
        evidence_count: sn.evidenceCount,
        status: "Active",
        registered_at: sn.registeredAt.getTime()
      }
    })

    const mockVrfs: VerificationRequest[] = seedVerificationRequests.map(v => ({
      id: v.pubkey.toBase58().slice(0, 8),
      pubkey: v.pubkey.toBase58(),
      requester: v.requester.toBase58(),
      location: v.location,
      radius_km: v.radiusKm,
      claim_type: "CropDamage", // Simplification
      bounty: v.bounty,
      required_evidence: v.requiredEvidence,
      submitted_evidence: v.submittedEvidence,
      status: "Pending", // Simplification
      deadline: v.deadline.getTime(),
      created_at: v.createdAt.getTime(),
    }))

    setNodes(nodeMap)
    setVerifications(mockVrfs)
    setIsRealData(false)
  }

  useEffect(() => {
    refreshData()
  }, [refreshData])

  const registerNode = async (location: GeoLocation, radius: number) => {
    if (isInitialized && client) {
      const result = await contractRegister("My Node", location.latitude, location.longitude, "Region")
      if (result.success) refreshData()
      return result
    } else {
      // Mock implementation
      await new Promise(r => setTimeout(r, 1000))
      const owner = publicKey?.toBase58() || "mock-owner"
      setNodes(prev => ({
        ...prev,
        [owner]: {
          owner,
          location,
          coverage_radius_km: radius,
          reputation: 100,
          evidence_count: 0,
          status: "Active",
          registered_at: Date.now()
        }
      }))
      return { success: true }
    }
  }

  const createVerification = async (location: GeoLocation, radius: number, type: ClaimType, bounty: number) => {
    if (isInitialized && client) {
      // Scale bounty if needed
      const result = await contractCreate(
        location.latitude, 
        location.longitude, 
        radius, 
        { [type]: {} }, 
        bounty, 
        3, 
        Math.floor(Date.now() / 1000) + 86400 * 7
      )
      if (result.success) refreshData()
      return result
    } else {
      await new Promise(r => setTimeout(r, 1000))
      const newVrf: VerificationRequest = {
        id: `VRF-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
        requester: publicKey?.toBase58() || "system",
        location,
        radius_km: radius,
        claim_type: type,
        bounty,
        required_evidence: 3,
        submitted_evidence: 0,
        status: "Pending",
        deadline: Date.now() + 86400000 * 7,
        created_at: Date.now()
      }
      setVerifications(prev => [newVrf, ...prev])
      return { success: true }
    }
  }

  const submitEvidence = async (verificationId: string, location: GeoLocation, hash: string) => {
    if (isInitialized && client) {
      // Real submission
      // Note: Needs real verificationRequest PDA and node PDA in production
      return { success: false, error: "Real submission requires valid account addresses" }
    } else {
      await new Promise(r => setTimeout(r, 1000))
      // Update mock state
      setVerifications(prev => prev.map(v => {
        if (v.id === verificationId || v.pubkey === verificationId) {
          return { ...v, submitted_evidence: v.submitted_evidence + 1 }
        }
        return v
      }))
      return { success: true }
    }
  }

  return (
    <BlockchainContext.Provider value={{ 
      verifications, 
      nodes, 
      evidences, 
      loading, 
      isRealData,
      registerNode, 
      createVerification, 
      submitEvidence,
      refreshData
    }}>
      {children}
    </BlockchainContext.Provider>
  )
}

export function useBlockchain() {
  const context = useContext(BlockchainContext)
  if (context === undefined) {
    throw new Error("useBlockchain must be used within a BlockchainProvider")
  }
  return context
}
