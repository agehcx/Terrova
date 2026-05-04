import {
  Node,
  NodeStatus,
  VerificationRequest,
  VerificationStatus,
  ClaimType,
  Evidence,
  EvidenceStatus,
  GeoLocation,
  WeatherData,
} from "./types"
import { PublicKey, Keypair } from "@solana/web3.js"

// ============================================================================
// SEED DATA GENERATORS
// ============================================================================

/**
 * Generate a random public key for mock data
 */
function randomPubkey(): PublicKey {
  return Keypair.generate().publicKey
}

/**
 * Generate a random date within the last N days
 */
function randomRecentDate(daysAgo: number = 30): Date {
  const now = Date.now()
  const pastTime = now - Math.random() * daysAgo * 24 * 60 * 60 * 1000
  return new Date(pastTime)
}

/**
 * Generate a future date within N days
 */
function randomFutureDate(daysAhead: number = 14): Date {
  const now = Date.now()
  const futureTime = now + Math.random() * daysAhead * 24 * 60 * 60 * 1000
  return new Date(futureTime)
}

/**
 * Generate random weather data
 */
function randomWeatherData(): WeatherData {
  return {
    temperature: Math.floor(Math.random() * 60) + 30, // 30-90F
    humidity: Math.floor(Math.random() * 80) + 20, // 20-100%
    windSpeed: Math.floor(Math.random() * 30) + 5, // 5-35 mph
  }
}

// ============================================================================
// US AGRICULTURAL REGIONS (Midwest focus)
// ============================================================================

const agriculturalRegions = [
  { name: "Riley County, Kansas", lat: 39.0119, lng: -96.7265 },
  { name: "Story County, Iowa", lat: 42.0358, lng: -93.4619 },
  { name: "Lancaster County, Nebraska", lat: 40.7835, lng: -96.6852 },
  { name: "Taylor County, Texas", lat: 32.3018, lng: -99.8762 },
  { name: "Blue Earth County, Minnesota", lat: 44.0445, lng: -94.0253 },
  { name: "Dane County, Wisconsin", lat: 43.0667, lng: -89.4000 },
  { name: "Boone County, Missouri", lat: 38.9900, lng: -92.3310 },
  { name: "Cleveland County, Oklahoma", lat: 35.2226, lng: -97.2907 },
  { name: "Pottawattamie County, Iowa", lat: 41.3500, lng: -95.7833 },
  { name: "McLean County, Illinois", lat: 40.4907, lng: -88.8454 },
  { name: "Cass County, North Dakota", lat: 47.0000, lng: -97.0000 },
  { name: "Brown County, South Dakota", lat: 45.5833, lng: -98.3500 },
]

// ============================================================================
// SEED NODES
// ============================================================================

export const seedNodes: Node[] = agriculturalRegions.map((region, index) => ({
  pubkey: randomPubkey(),
  owner: randomPubkey(),
  stakeAccount: randomPubkey(),
  location: { latitude: region.lat, longitude: region.lng },
  coverageRadiusKm: Math.floor(Math.random() * 50) + 25, // 25-75km
  reputation: Math.floor(Math.random() * 30) + 70, // 70-100
  evidenceCount: Math.floor(Math.random() * 500) + 50,
  status: index < 10 ? NodeStatus.Active : index < 11 ? NodeStatus.Inactive : NodeStatus.Suspended,
  registeredAt: randomRecentDate(90),
  bump: 255,
}))

// ============================================================================
// SEED VERIFICATION REQUESTS
// ============================================================================

const verificationTypes: { type: ClaimType; name: string }[] = [
  { type: ClaimType.CropDamage, name: "Crop Damage Assessment" },
  { type: ClaimType.FloodAssessment, name: "Flood Damage Assessment" },
  { type: ClaimType.HailDamage, name: "Hail Damage Verification" },
  { type: ClaimType.DroughtVerification, name: "Drought Impact Assessment" },
  { type: ClaimType.FireDamage, name: "Fire Damage Evaluation" },
  { type: ClaimType.PestInfestation, name: "Pest Infestation Survey" },
]

export const seedVerificationRequests: VerificationRequest[] = agriculturalRegions
  .slice(0, 8)
  .map((region, index) => {
    const verificationType = verificationTypes[index % verificationTypes.length]
    const requiredEvidence = Math.floor(Math.random() * 3) + 3 // 3-5
    const submittedEvidence = Math.floor(Math.random() * (requiredEvidence + 1))
    
    let status: VerificationStatus
    if (submittedEvidence === 0) {
      status = VerificationStatus.Pending
    } else if (submittedEvidence < requiredEvidence) {
      status = VerificationStatus.InProgress
    } else {
      status = Math.random() > 0.2 ? VerificationStatus.Completed : VerificationStatus.Rejected
    }

    return {
      pubkey: randomPubkey(),
      requester: randomPubkey(),
      location: {
        latitude: region.lat + (Math.random() - 0.5) * 0.2,
        longitude: region.lng + (Math.random() - 0.5) * 0.2,
      },
      radiusKm: Math.floor(Math.random() * 30) + 20, // 20-50km
      claimType: verificationType.type,
      bounty: Math.floor(Math.random() * 100) + 25, // 25-125 PROOF
      requiredEvidence,
      submittedEvidence,
      status,
      deadline: randomFutureDate(14),
      createdAt: randomRecentDate(7),
      bump: 255,
    }
  })

// ============================================================================
// SEED EVIDENCE
// ============================================================================

export const seedEvidence: Evidence[] = seedVerificationRequests
  .filter((req) => req.submittedEvidence > 0)
  .flatMap((request) => {
    const evidenceCount = request.submittedEvidence
    return Array.from({ length: evidenceCount }, (_, i) => {
      let status: EvidenceStatus
      if (request.status === VerificationStatus.Completed) {
        status = EvidenceStatus.Approved
      } else if (request.status === VerificationStatus.Rejected) {
        status = i === 0 ? EvidenceStatus.Rejected : EvidenceStatus.Approved
      } else {
        status = EvidenceStatus.Pending
      }

      return {
        pubkey: randomPubkey(),
        verificationRequest: request.pubkey,
        node: seedNodes[Math.floor(Math.random() * seedNodes.length)].pubkey,
        photoHash: `0x${Array.from({ length: 64 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join("")}`,
        location: {
          latitude: request.location.latitude + (Math.random() - 0.5) * 0.05,
          longitude: request.location.longitude + (Math.random() - 0.5) * 0.05,
        },
        weatherData: randomWeatherData(),
        timestamp: new Date(
          request.createdAt.getTime() + Math.random() * 2 * 24 * 60 * 60 * 1000
        ),
        status,
        approveVotes: status === EvidenceStatus.Approved ? Math.floor(Math.random() * 5) + 3 : 0,
        rejectVotes: status === EvidenceStatus.Rejected ? Math.floor(Math.random() * 5) + 3 : 0,
        bump: 255,
      }
    })
  })

// ============================================================================
// NETWORK STATISTICS
// ============================================================================

export interface NetworkStats {
  totalNodes: number
  activeNodes: number
  totalVerifications: number
  pendingVerifications: number
  completedVerifications: number
  totalEvidenceSubmitted: number
  totalStaked: number // in PROOF tokens
  networkUptime: number // percentage
  averageReputation: number
}

export function calculateNetworkStats(): NetworkStats {
  const activeNodes = seedNodes.filter((n) => n.status === NodeStatus.Active).length
  const pendingVerifications = seedVerificationRequests.filter(
    (v) => v.status === VerificationStatus.Pending || v.status === VerificationStatus.InProgress
  ).length
  const completedVerifications = seedVerificationRequests.filter(
    (v) => v.status === VerificationStatus.Completed
  ).length
  const totalEvidenceSubmitted = seedEvidence.length
  const totalStaked = seedNodes.reduce(
    (acc, node) => acc + Math.floor(Math.random() * 5000) + 1000,
    0
  )
  const averageReputation =
    seedNodes.reduce((acc, node) => acc + node.reputation, 0) / seedNodes.length

  return {
    totalNodes: seedNodes.length,
    activeNodes,
    totalVerifications: seedVerificationRequests.length,
    pendingVerifications,
    completedVerifications,
    totalEvidenceSubmitted,
    totalStaked,
    networkUptime: 99.2 + Math.random() * 0.7, // 99.2-99.9%
    averageReputation: Math.round(averageReputation * 10) / 10,
  }
}

// ============================================================================
// SIMULATOR FUNCTIONS
// ============================================================================

/**
 * Simulate a new verification request being created
 */
export function simulateNewVerificationRequest(): VerificationRequest {
  const region = agriculturalRegions[Math.floor(Math.random() * agriculturalRegions.length)]
  const verificationType = verificationTypes[Math.floor(Math.random() * verificationTypes.length)]

  return {
    pubkey: randomPubkey(),
    requester: randomPubkey(),
    location: {
      latitude: region.lat + (Math.random() - 0.5) * 0.2,
      longitude: region.lng + (Math.random() - 0.5) * 0.2,
    },
    radiusKm: Math.floor(Math.random() * 30) + 20,
    claimType: verificationType.type,
    bounty: Math.floor(Math.random() * 100) + 25,
    requiredEvidence: Math.floor(Math.random() * 3) + 3,
    submittedEvidence: 0,
    status: VerificationStatus.Pending,
    deadline: randomFutureDate(14),
    createdAt: new Date(),
    bump: 255,
  }
}

/**
 * Simulate evidence submission for a request
 */
export function simulateEvidenceSubmission(
  request: VerificationRequest,
  node: Node
): Evidence {
  return {
    pubkey: randomPubkey(),
    verificationRequest: request.pubkey,
    node: node.pubkey,
    photoHash: `0x${Array.from({ length: 64 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("")}`,
    location: {
      latitude: request.location.latitude + (Math.random() - 0.5) * 0.05,
      longitude: request.location.longitude + (Math.random() - 0.5) * 0.05,
    },
    weatherData: randomWeatherData(),
    timestamp: new Date(),
    status: EvidenceStatus.Pending,
    approveVotes: 0,
    rejectVotes: 0,
    bump: 255,
  }
}

/**
 * Simulate node registration
 */
export function simulateNodeRegistration(
  location: GeoLocation,
  coverageRadiusKm: number = 50
): Node {
  return {
    pubkey: randomPubkey(),
    owner: randomPubkey(),
    stakeAccount: randomPubkey(),
    location,
    coverageRadiusKm,
    reputation: 100, // Start with perfect reputation
    evidenceCount: 0,
    status: NodeStatus.Active,
    registeredAt: new Date(),
    bump: 255,
  }
}
