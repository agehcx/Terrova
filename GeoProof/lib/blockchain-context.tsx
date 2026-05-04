"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { PublicKey } from "@solana/web3.js"

// Types matching our Smart Contract
export interface GeoLocation {
  latitude: number
  longitude: number
}

export type ClaimType = "CropDamage" | "FloodAssessment" | "HailDamage" | "DroughtVerification" | "FireDamage" | "PestInfestation" | "Other"
export type VerificationStatus = "Pending" | "InProgress" | "Completed" | "Rejected" | "Expired" | "Disputed"

export interface VerificationRequest {
  id: string
  requester: string
  location: GeoLocation
  radius_km: number
  claim_type: ClaimType
  bounty: number // in SOL
  required_evidence: number
  submitted_evidence: number
  status: VerificationStatus
  deadline: number // timestamp
  created_at: number // timestamp
}

export interface NodeInfo {
  owner: string
  location: GeoLocation
  coverage_radius_km: number
  reputation: number
  evidence_count: number
  status: "Active" | "Inactive" | "Suspended"
  registered_at: number
}

export interface Evidence {
  id: string
  verification_request: string
  node: string
  photo_hash: string
  location: GeoLocation
  timestamp: number
  status: "Pending" | "Approved" | "Rejected"
}

// Default mock data
const mockVerifications: VerificationRequest[] = [
  {
    id: "VRF-4521",
    requester: "Insurer-A",
    location: { latitude: 38.356, longitude: -96.223 },
    radius_km: 10,
    claim_type: "CropDamage",
    bounty: 0.15,
    required_evidence: 3,
    submitted_evidence: 0,
    status: "Pending",
    deadline: Date.now() + 86400000 * 3,
    created_at: Date.now() - 7200000,
  },
  {
    id: "VRF-4520",
    requester: "AgriCorp",
    location: { latitude: 41.977, longitude: -93.62 },
    radius_km: 5,
    claim_type: "FloodAssessment",
    bounty: 0.12,
    required_evidence: 5,
    submitted_evidence: 2,
    status: "InProgress",
    deadline: Date.now() + 86400000,
    created_at: Date.now() - 18000000,
  },
]

interface BlockchainContextType {
  verifications: VerificationRequest[]
  nodes: Record<string, NodeInfo>
  evidences: Evidence[]
  registerNode: (location: GeoLocation, radius: number) => Promise<void>
  createVerification: (location: GeoLocation, radius: number, type: ClaimType, bounty: number) => Promise<void>
  submitEvidence: (verificationId: string, location: GeoLocation, hash: string) => Promise<void>
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined)

export function BlockchainProvider({ children }: { children: ReactNode }) {
  const { publicKey } = useWallet()
  const [verifications, setVerifications] = useState<VerificationRequest[]>(mockVerifications)
  const [nodes, setNodes] = useState<Record<string, NodeInfo>>({})
  const [evidences, setEvidences] = useState<Evidence[]>([])

  // Simulated RPC Delay
  const simulateDelay = () => new Promise(resolve => setTimeout(resolve, 1500))

  const registerNode = async (location: GeoLocation, radius: number) => {
    if (!publicKey) throw new Error("Wallet not connected")
    await simulateDelay()
    
    setNodes(prev => ({
      ...prev,
      [publicKey.toBase58()]: {
        owner: publicKey.toBase58(),
        location,
        coverage_radius_km: radius,
        reputation: 100,
        evidence_count: 0,
        status: "Active",
        registered_at: Date.now(),
      }
    }))
  }

  const createVerification = async (location: GeoLocation, radius: number, type: ClaimType, bounty: number) => {
    if (!publicKey) throw new Error("Wallet not connected")
    await simulateDelay()

    const newVrf: VerificationRequest = {
      id: `VRF-${Math.floor(Math.random() * 10000)}`,
      requester: publicKey.toBase58(),
      location,
      radius_km: radius,
      claim_type: type,
      bounty,
      required_evidence: 3,
      submitted_evidence: 0,
      status: "Pending",
      deadline: Date.now() + 86400000 * 5, // 5 days
      created_at: Date.now(),
    }

    setVerifications(prev => [newVrf, ...prev])
  }

  const submitEvidence = async (verificationId: string, location: GeoLocation, hash: string) => {
    if (!publicKey) throw new Error("Wallet not connected")
    await simulateDelay()

    const newEvidence: Evidence = {
      id: `EVD-${Math.floor(Math.random() * 10000)}`,
      verification_request: verificationId,
      node: publicKey.toBase58(),
      photo_hash: hash,
      location,
      timestamp: Date.now(),
      status: "Pending",
    }

    setEvidences(prev => [newEvidence, ...prev])
    
    // Update verification state
    setVerifications(prev => prev.map(v => {
      if (v.id === verificationId) {
        const newCount = v.submitted_evidence + 1
        return {
          ...v,
          submitted_evidence: newCount,
          status: newCount >= v.required_evidence ? "Completed" : "InProgress"
        }
      }
      return v
    }))

    // Update node state
    setNodes(prev => {
      const pubkey = publicKey.toBase58()
      if (prev[pubkey]) {
        return {
          ...prev,
          [pubkey]: {
            ...prev[pubkey],
            evidence_count: prev[pubkey].evidence_count + 1
          }
        }
      }
      return prev
    })
  }

  return (
    <BlockchainContext.Provider value={{ verifications, nodes, evidences, registerNode, createVerification, submitEvidence }}>
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
