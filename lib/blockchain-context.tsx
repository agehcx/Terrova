"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react"
import { PublicKey } from "@solana/web3.js"
import { useTerrova } from "@/hooks/useTerrova"
import { useTerrovaWallet } from "@/hooks/useTerrovaWallet"
import { seedNodes, seedVerificationRequests, seedEvidence } from "./terrova/seed-data"

export interface GeoLocation {
  latitude: number
  longitude: number
}

export type ClaimType =
  | "CropDamage"
  | "FloodAssessment"
  | "HailDamage"
  | "DroughtVerification"
  | "FireDamage"
  | "PestInfestation"
  | "Other"

export type VerificationStatus =
  | "Pending"
  | "InProgress"
  | "Completed"
  | "Rejected"
  | "Expired"
  | "Disputed"

export interface VerificationRequest {
  id: string
  pubkey?: string
  requester: string
  location: GeoLocation
  radius_km: number
  claim_type: ClaimType
  bounty: number
  required_evidence: number
  submitted_evidence: number
  status: VerificationStatus
  deadline: number
  created_at: number
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
  weather_data?: { temperature: number; humidity: number; windSpeed: number }
  timestamp: number
  status: string
  approve_votes?: number
  reject_votes?: number
}

export interface RewardsInfo {
  totalEarned: number
  totalClaimed: number
  availableBalance: number
  lastClaimTime: Date | null
}

interface BlockchainContextType {
  verifications: VerificationRequest[]
  nodes: Record<string, NodeInfo>
  evidences: Evidence[]
  rewards: RewardsInfo | null
  loading: boolean
  isRealData: boolean
  registerNode: (location: GeoLocation, radius: number) => Promise<any>
  createVerification: (
    location: GeoLocation,
    radius: number,
    type: ClaimType,
    bounty: number,
    requiredEvidence?: number,
    deadlineDays?: number
  ) => Promise<any>
  submitEvidence: (
    verificationPubkey: string,
    location: GeoLocation,
    hash: string,
    weather?: { temp: number; humidity: number; wind: number }
  ) => Promise<any>
  voteOnEvidence: (evidencePubkey: string, vote: boolean) => Promise<any>
  claimRewards: () => Promise<any>
  refreshData: () => Promise<void>
}

const BlockchainContext = createContext<BlockchainContextType | undefined>(undefined)

export function BlockchainProvider({ children }: { children: ReactNode }) {
  const { publicKey } = useTerrovaWallet()
  const {
    client,
    isInitialized,
    registerNode: contractRegister,
    submitEvidence: contractSubmit,
    createVerificationRequest: contractCreate,
    voteOnEvidence: contractVote,
    claimRewards: contractClaim,
  } = useTerrova()

  const [verifications, setVerifications] = useState<VerificationRequest[]>([])
  const [nodes, setNodes] = useState<Record<string, NodeInfo>>({})
  const [evidences, setEvidences] = useState<Evidence[]>([])
  const [rewards, setRewards] = useState<RewardsInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [isRealData, setIsRealData] = useState(false)

  const loadMockData = useCallback(() => {
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
        registered_at: sn.registeredAt.getTime(),
      }
    })

    const mockVrfs: VerificationRequest[] = seedVerificationRequests.map(v => ({
      id: v.pubkey.toBase58().slice(0, 8),
      pubkey: v.pubkey.toBase58(),
      requester: v.requester.toBase58(),
      location: v.location,
      radius_km: v.radiusKm,
      claim_type: "CropDamage" as ClaimType,
      bounty: v.bounty,
      required_evidence: v.requiredEvidence,
      submitted_evidence: v.submittedEvidence,
      status: "Pending" as VerificationStatus,
      deadline: v.deadline.getTime(),
      created_at: v.createdAt.getTime(),
    }))

    const mockEvidence: Evidence[] = seedEvidence.map(e => ({
      id: e.pubkey.toBase58().slice(0, 8),
      verification_request: e.verificationRequest.toBase58(),
      node: e.node.toBase58(),
      photo_hash: e.photoHash,
      location: e.location,
      timestamp: e.timestamp.getTime(),
      status: "Pending",
    }))

    setNodes(nodeMap)
    setVerifications(mockVrfs)
    setEvidences(mockEvidence)
    setIsRealData(false)
  }, [])

  const refreshData = useCallback(async () => {
    setLoading(true)

    if (isInitialized && client) {
      try {
        const [realNodes, realVerifications, realEvidence, realRewards] = await Promise.all([
          client.fetchAllNodes(),
          client.fetchAllVerifications(),
          client.fetchAllEvidence(),
          publicKey ? client.fetchRewards(publicKey) : Promise.resolve(null),
        ])

        // Build node map — real nodes first, then seed nodes for visual density
        const nodeMap: Record<string, NodeInfo> = {}
        realNodes.forEach(n => {
          nodeMap[n.owner] = {
            pubkey: n.pubkey,
            owner: n.owner,
            location: n.location,
            coverage_radius_km: n.coverageRadiusKm,
            reputation: n.reputation,
            evidence_count: n.evidenceCount,
            status: n.status,
            registered_at: n.registeredAt.getTime(),
          }
        })
        seedNodes.forEach(sn => {
          const key = sn.owner.toBase58()
          if (!nodeMap[key]) {
            nodeMap[key] = {
              pubkey: sn.pubkey.toBase58(),
              owner: key,
              location: sn.location,
              coverage_radius_km: sn.coverageRadiusKm,
              reputation: sn.reputation,
              evidence_count: sn.evidenceCount,
              status: "Active",
              registered_at: sn.registeredAt.getTime(),
            }
          }
        })

        // Map verifications
        const chainVrfs: VerificationRequest[] = realVerifications.map(v => ({
          id: v.pubkey.slice(0, 8),
          pubkey: v.pubkey,
          requester: v.requester,
          location: v.location,
          radius_km: v.radiusKm,
          claim_type: v.claimType as ClaimType,
          bounty: v.bounty,
          required_evidence: v.requiredEvidence,
          submitted_evidence: v.submittedEvidence,
          status: v.status as VerificationStatus,
          deadline: v.deadline.getTime(),
          created_at: v.createdAt.getTime(),
        }))

        // Map evidence
        const chainEvidence: Evidence[] = realEvidence.map(e => ({
          id: e.pubkey.slice(0, 8),
          verification_request: e.verificationRequest,
          node: e.node,
          photo_hash: e.photoHash,
          location: e.location,
          weather_data: e.weatherData,
          timestamp: e.timestamp.getTime(),
          status: e.status,
          approve_votes: e.approveVotes,
          reject_votes: e.rejectVotes,
        }))

        // Fall back to seed data for verifications/evidence if chain is empty
        const finalVrfs =
          chainVrfs.length > 0
            ? chainVrfs
            : seedVerificationRequests.map(v => ({
                id: v.pubkey.toBase58().slice(0, 8),
                pubkey: v.pubkey.toBase58(),
                requester: v.requester.toBase58(),
                location: v.location,
                radius_km: v.radiusKm,
                claim_type: "CropDamage" as ClaimType,
                bounty: v.bounty,
                required_evidence: v.requiredEvidence,
                submitted_evidence: v.submittedEvidence,
                status: "Pending" as VerificationStatus,
                deadline: v.deadline.getTime(),
                created_at: v.createdAt.getTime(),
              }))

        setNodes(nodeMap)
        setVerifications(finalVrfs)
        setEvidences(chainEvidence)
        setRewards(realRewards)
        setIsRealData(true)
      } catch (err) {
        console.error("[BlockchainContext] Chain fetch error:", err)
        loadMockData()
      }
    } else {
      loadMockData()
    }

    setLoading(false)
  }, [isInitialized, client, publicKey, loadMockData])

  useEffect(() => {
    refreshData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, publicKey])

  const registerNode = async (location: GeoLocation, radius: number) => {
    if (isInitialized && client) {
      const result = await contractRegister(location.latitude, location.longitude, radius)
      if (result.success) await refreshData()
      return result
    }

    // Mock fallback
    await new Promise(r => setTimeout(r, 800))
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
        registered_at: Date.now(),
      },
    }))
    return { success: true }
  }

  const createVerification = async (
    location: GeoLocation,
    radius: number,
    type: ClaimType,
    bounty: number,
    requiredEvidence = 3,
    deadlineDays = 7
  ) => {
    if (isInitialized && client) {
      const deadline = Math.floor(Date.now() / 1000) + deadlineDays * 86400
      const result = await contractCreate(
        location.latitude,
        location.longitude,
        radius,
        { [type]: {} },
        bounty,
        requiredEvidence,
        deadline
      )
      if (result.success) await refreshData()
      return result
    }

    // Mock fallback
    await new Promise(r => setTimeout(r, 800))
    const newVrf: VerificationRequest = {
      id: `VRF-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
      requester: publicKey?.toBase58() || "system",
      location,
      radius_km: radius,
      claim_type: type,
      bounty,
      required_evidence: requiredEvidence,
      submitted_evidence: 0,
      status: "Pending",
      deadline: Date.now() + deadlineDays * 86400000,
      created_at: Date.now(),
    }
    setVerifications(prev => [newVrf, ...prev])
    return { success: true }
  }

  const submitEvidence = async (
    verificationPubkey: string,
    location: GeoLocation,
    hash: string,
    weather = { temp: 72, humidity: 45, wind: 12 }
  ) => {
    if (isInitialized && client) {
      try {
        const verificationAddress = new PublicKey(verificationPubkey)
        const nodePda = client.getNodePda()
        const result = await contractSubmit(
          verificationAddress,
          nodePda,
          hash,
          location.latitude,
          location.longitude,
          weather
        )
        if (result.success) await refreshData()
        return result
      } catch (err) {
        console.error("[BlockchainContext] submitEvidence error:", err)
        return { success: false, error: err }
      }
    }

    // Mock fallback
    await new Promise(r => setTimeout(r, 800))
    setVerifications(prev =>
      prev.map(v =>
        v.pubkey === verificationPubkey || v.id === verificationPubkey
          ? { ...v, submitted_evidence: v.submitted_evidence + 1 }
          : v
      )
    )
    const newEvidence: Evidence = {
      id: Math.random().toString(36).substr(2, 8),
      verification_request: verificationPubkey,
      node: publicKey?.toBase58() || "mock-node",
      photo_hash: hash,
      location,
      timestamp: Date.now(),
      status: "Pending",
    }
    setEvidences(prev => [newEvidence, ...prev])
    return { success: true }
  }

  const voteOnEvidence = async (evidencePubkey: string, vote: boolean) => {
    if (isInitialized && client) {
      try {
        const evidenceAddress = new PublicKey(evidencePubkey)
        const voterNodePda = client.getNodePda()
        const result = await contractVote(evidenceAddress, voterNodePda, vote)
        if (result.success) await refreshData()
        return result
      } catch (err) {
        console.error("[BlockchainContext] voteOnEvidence error:", err)
        return { success: false, error: err }
      }
    }

    // Mock fallback
    await new Promise(r => setTimeout(r, 800))
    setEvidences(prev =>
      prev.map(e => {
        if (e.id !== evidencePubkey) return e
        return {
          ...e,
          approve_votes: vote ? (e.approve_votes ?? 0) + 1 : e.approve_votes,
          reject_votes: !vote ? (e.reject_votes ?? 0) + 1 : e.reject_votes,
        }
      })
    )
    return { success: true }
  }

  const claimRewards = async () => {
    if (isInitialized && client) {
      const result = await contractClaim()
      if (result.success) await refreshData()
      return result
    }

    // Mock fallback
    await new Promise(r => setTimeout(r, 800))
    setRewards(prev =>
      prev
        ? { ...prev, totalClaimed: prev.totalClaimed + prev.availableBalance, availableBalance: 0, lastClaimTime: new Date() }
        : null
    )
    return { success: true }
  }

  return (
    <BlockchainContext.Provider
      value={{
        verifications,
        nodes,
        evidences,
        rewards,
        loading,
        isRealData,
        registerNode,
        createVerification,
        submitEvidence,
        voteOnEvidence,
        claimRewards,
        refreshData,
      }}
    >
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
