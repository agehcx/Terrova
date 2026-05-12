import { PublicKey } from "@solana/web3.js"

// ============================================================================
// PROGRAM ID
// ============================================================================

export const TERROVA_PROGRAM_ID = new PublicKey(
  "B3j3WKTsuHuBVeNbqcKX5wTyiPtnUGJ7ZpuCHctYPxwH"
)

// ============================================================================
// ENUMS
// ============================================================================

export enum NodeStatus {
  Active = "active",
  Inactive = "inactive",
  Suspended = "suspended",
}

export enum VerificationStatus {
  Pending = "pending",
  InProgress = "in_progress",
  Completed = "completed",
  Rejected = "rejected",
  Expired = "expired",
}

export enum ClaimType {
  CropDamage = "crop_damage",
  FloodAssessment = "flood_assessment",
  HailDamage = "hail_damage",
  DroughtVerification = "drought_verification",
  FireDamage = "fire_damage",
  PestInfestation = "pest_infestation",
  Other = "other",
}

export enum EvidenceStatus {
  Pending = "pending",
  Approved = "approved",
  Rejected = "rejected",
}

// ============================================================================
// TYPES
// ============================================================================

export interface GeoLocation {
  latitude: number  // Decimal degrees (e.g., 39.0119)
  longitude: number // Decimal degrees (e.g., -98.4842)
}

export interface WeatherData {
  temperature: number   // Fahrenheit
  humidity: number      // Percentage (0-100)
  windSpeed: number     // mph
}

export interface ProtocolConfig {
  minStake: number        // Minimum TRV tokens to stake
  minEvidenceCount: number // Minimum evidence submissions required
  consensusThreshold: number // Percentage threshold for consensus (0-100)
}

// ============================================================================
// ACCOUNT TYPES
// ============================================================================

export interface Protocol {
  admin: PublicKey
  minStake: number
  minEvidenceCount: number
  consensusThreshold: number
  totalNodes: number
  totalVerifications: number
  bump: number
}

export interface Node {
  pubkey: PublicKey
  owner: PublicKey
  stakeAccount: PublicKey
  location: GeoLocation
  coverageRadiusKm: number
  reputation: number
  evidenceCount: number
  status: NodeStatus
  registeredAt: Date
  bump: number
}

export interface VerificationRequest {
  pubkey: PublicKey
  requester: PublicKey
  location: GeoLocation
  radiusKm: number
  claimType: ClaimType
  bounty: number
  requiredEvidence: number
  submittedEvidence: number
  status: VerificationStatus
  deadline: Date
  createdAt: Date
  bump: number
}

export interface Evidence {
  pubkey: PublicKey
  verificationRequest: PublicKey
  node: PublicKey
  photoHash: string
  location: GeoLocation
  weatherData: WeatherData
  timestamp: Date
  status: EvidenceStatus
  approveVotes: number
  rejectVotes: number
  bump: number
}

export interface EvidenceVote {
  pubkey: PublicKey
  voter: PublicKey
  evidence: PublicKey
  vote: boolean
  timestamp: Date
  bump: number
}

// ============================================================================
// INPUT TYPES
// ============================================================================

export interface RegisterNodeInput {
  location: GeoLocation
  coverageRadiusKm: number
  stakeAmount: number
}

export interface CreateVerificationRequestInput {
  location: GeoLocation
  radiusKm: number
  claimType: ClaimType
  bounty: number
  requiredEvidence: number
  deadline: Date
  description?: string
}

export interface SubmitEvidenceInput {
  verificationRequestPubkey: PublicKey
  photoHash: string
  location: GeoLocation
  weatherData: WeatherData
  notes?: string
}

// ============================================================================
// EVENTS
// ============================================================================

export interface NodeRegisteredEvent {
  node: PublicKey
  owner: PublicKey
  location: GeoLocation
}

export interface VerificationRequestCreatedEvent {
  request: PublicKey
  requester: PublicKey
  bounty: number
  location: GeoLocation
}

export interface EvidenceSubmittedEvent {
  evidence: PublicKey
  request: PublicKey
  node: PublicKey
}

export interface EvidenceVotedEvent {
  evidence: PublicKey
  voter: PublicKey
  vote: boolean
}

export interface VerificationFinalizedEvent {
  request: PublicKey
  status: VerificationStatus
}

export interface NodeSlashedEvent {
  node: PublicKey
  amount: number
  newReputation: number
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Convert decimal degrees to scaled integer (multiply by 1e7)
 */
export function toScaledCoordinate(decimal: number): number {
  return Math.round(decimal * 1e7)
}

/**
 * Convert scaled integer back to decimal degrees
 */
export function fromScaledCoordinate(scaled: number): number {
  return scaled / 1e7
}

/**
 * Calculate distance between two geo locations in kilometers
 */
export function calculateDistance(loc1: GeoLocation, loc2: GeoLocation): number {
  const R = 6371 // Earth's radius in km
  const dLat = toRadians(loc2.latitude - loc1.latitude)
  const dLon = toRadians(loc2.longitude - loc1.longitude)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(loc1.latitude)) *
      Math.cos(toRadians(loc2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180)
}

/**
 * Check if a node is within range of a verification request
 */
export function isNodeInRange(
  nodeLocation: GeoLocation,
  requestLocation: GeoLocation,
  radiusKm: number
): boolean {
  const distance = calculateDistance(nodeLocation, requestLocation)
  return distance <= radiusKm
}

/**
 * Format TRV token amount (assumes 9 decimals like SOL)
 */
export function formatProofAmount(amount: number): string {
  return (amount / 1e9).toFixed(2)
}

/**
 * Parse TRV token amount to lamports
 */
export function parseProofAmount(amount: number): number {
  return Math.round(amount * 1e9)
}
