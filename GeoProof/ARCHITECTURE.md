# GeoProof Architecture Guide

A comprehensive overview of the GeoProof system architecture, components, and data flow.

## System Overview

GeoProof is a decentralized application (dApp) built on Solana that consists of:

1. **Frontend**: Next.js React application with Solana wallet integration
2. **Smart Contracts**: Anchor-based programs running on Solana blockchain
3. **Client Library**: TypeScript client for contract interaction
4. **Mock Data**: Simulator for development and testing

```
┌─────────────────────────────────────────────────────────┐
│                    User Browser                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         React Components (Next.js)                │  │
│  │  - Landing Page                                   │  │
│  │  - Dashboard with Map                             │  │
│  │  - Evidence Submission                            │  │
│  │  - Verification Tracking                          │  │
│  └──────────────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
   ┌────────────┐     ┌──────────────┐
   │   Wallet   │     │ GeoProof     │
   │  Adapter   │     │ Client       │
   │(Phantom,   │     │ (useGeoProof)│
   │ Solflare)  │     └──────┬───────┘
   └────────────┘            │
        │                    │
        └────────┬───────────┘
                 │ Solana Web3.js
                 │
        ┌────────▼──────────┐
        │   Solana Network  │
        │  (Devnet/Mainnet) │
        └────────┬──────────┘
                 │
        ┌────────▼──────────┐
        │  GeoProof Program  │
        │  (Smart Contract)  │
        └───────────────────┘
```

## Frontend Architecture

### Layer 1: Pages (App Router)

```
app/
├── page.tsx                 # Landing page
├── layout.tsx              # Root layout with theme & metadata
├── globals.css             # Design tokens, utilities
└── dashboard/
    ├── layout.tsx          # Dashboard wrapper with sidebar
    ├── page.tsx            # Overview/home
    ├── map/page.tsx        # Network map visualization
    ├── nodes/page.tsx      # Node management
    ├── evidence/page.tsx    # Evidence submission
    ├── verifications/page.tsx # Verification tracking
    └── rewards/page.tsx     # Reward system
```

**Purpose**: Define routes and page-level layouts. Pages compose components and handle high-level logic.

### Layer 2: Components

```
components/
├── dashboard/
│   ├── sidebar.tsx         # Navigation, dynamic menu
│   ├── header.tsx          # Top bar with wallet info
│   └── network-map.tsx     # Interactive Mapbox component
├── providers/
│   └── wallet-provider.tsx # Solana wallet context setup
├── ui/
│   ├── button.tsx          # Shadcn components
│   ├── card.tsx
│   └── ...
├── error-boundary.tsx      # Error handling wrapper
└── loading-state.tsx       # Skeleton loaders
```

**Purpose**: Reusable UI building blocks. All components are client components with proper error boundaries.

### Layer 3: Hooks

```
hooks/
├── useGeoProof.ts          # Main contract interaction hook
│   ├── registerNode()
│   ├── submitEvidence()
│   ├── createVerificationRequest()
│   ├── verifyEvidence()
│   └── claimRewards()
├── use-mobile.ts           # Responsive design helper
└── use-toast.ts            # Notification system
```

**Purpose**: Encapsulate stateful logic and side effects. `useGeoProof` is the primary bridge to smart contracts.

### Layer 4: Utilities

```
lib/
├── geoproof/
│   ├── client.ts           # GeoProofClient class
│   │   ├── registerNode()
│   │   ├── submitEvidence()
│   │   └── ... (methods)
│   ├── types.ts            # TypeScript interfaces
│   ├── seed-data.ts        # Mock data for UI development
│   └── geoproof.types.ts   # IDL-generated types from contract
└── utils.ts                # Helper functions (cn, formatters)
```

**Purpose**: Core business logic separated from React. The `GeoProofClient` class handles all Solana interactions.

## Smart Contract Architecture

### Program Structure

```rust
// contracts/programs/geoproof/src/lib.rs

#[program]
pub mod geoproof {
    pub fn register_node(...) -> Result<()>
    pub fn submit_evidence(...) -> Result<()>
    pub fn create_verification_request(...) -> Result<()>
    pub fn verify_evidence(...) -> Result<()>
    pub fn claim_rewards(...) -> Result<()>
}
```

### Account Structure

```
Node Account
├── authority: Pubkey         # Node operator wallet
├── name: String             # Node identifier
├── latitude: f64            # Location data
├── longitude: f64
├── region: String
├── verification_count: u64  # Stats
├── success_rate: f64
├── total_rewards: u64
└── created_at: i64

Evidence Account
├── verification_request_id: String  # Links to verification
├── submitter: Pubkey               # Who submitted
├── latitude: f64                   # Evidence location
├── longitude: f64
├── image_hash: String              # IPFS/content hash
├── timestamp: i64
├── is_verified: bool               # Verification status
└── verification_votes: u32         # Vote count

Verification Account
├── claim_id: String              # Insurance claim
├── requester: Pubkey             # Insurance company
├── target_latitude: f64          # Where to verify
├── target_longitude: f64
├── required_evidence: u32        # Needed submissions
├── submitted_evidence: u32       # Received count
├── verified_evidence: u32        # Verified count
├── status: VerificationStatus    # Pending/Approved/Rejected
├── created_at: i64
└── deadline: i64

Rewards Account
├── authority: Pubkey        # Operator wallet
├── total_earned: u64        # Accumulated rewards
├── total_claimed: u64       # Already paid out
├── available_balance: u64   # Ready to claim
└── last_claim_time: i64     # Claim rate limiting
```

### Event System

```rust
// Events emitted by program instructions

#[event]
pub struct NodeRegistered {
    #[index]
    pub authority: Pubkey,
    pub name: String,
    pub latitude: f64,
    pub longitude: f64,
}

#[event]
pub struct EvidenceSubmitted {
    #[index]
    pub verification_request_id: String,
    pub submitter: Pubkey,
    pub image_hash: String,
}

#[event]
pub struct VerificationCompleted {
    #[index]
    pub claim_id: String,
    pub status: String,
    pub verified_count: u32,
}
```

## Data Flow

### User Registration Flow

```
User connects wallet
    ↓
FrontendLayout renders WalletProvider
    ↓
useGeoProof() hook initializes GeoProofClient
    ↓
Client derives Node PDA from user's wallet address
    ↓
registerNode() instruction sent to blockchain
    ↓
Program verifies coordinates, creates Node account
    ↓
NodeRegistered event emitted
    ↓
Transaction confirmed, UI updates
```

### Evidence Submission Flow

```
User selects location on map
    ↓
Fills evidence form (image hash, timestamp)
    ↓
submitEvidence() called from components/dashboard/evidence-submission.tsx
    ↓
useGeoProof.submitEvidence() processes request
    ↓
GeoProofClient.submitEvidence() sends transaction
    ↓
Program creates Evidence account, links to Verification
    ↓
EvidenceSubmitted event fired
    ↓
Frontend listens to events, updates list in real-time
```

### Verification Flow

```
Insurance claim received
    ↓
createVerificationRequest() initiated
    ↓
Verification account created with location & requirements
    ↓
Nodes in region notified (off-chain, via websockets/polling)
    ↓
Nodes submit evidence (photos, measurements)
    ↓
Other nodes verify each submission
    ↓
verifyEvidence() votes recorded on-chain
    ↓
Once threshold reached → status changes to Approved/Rejected
    ↓
claimRewards() distributes earnings
```

## State Management

### Client-Side State

**React State** (within components):
```tsx
const [nodes, setNodes] = useState([]);
const [selectedNode, setSelectedNode] = useState(null);
```

**Hook State** (useGeoProof):
```tsx
const [client, setClient] = useState<GeoProofClient | null>(null);
const [error, setError] = useState<string | null>(null);
```

**Optional: Add SWR for data fetching**:
```tsx
const { data: nodes } = useSWR('/api/nodes', fetcher);
```

### On-Chain State

All user data stored as Solana accounts:
- Node information (name, location, stats)
- Evidence submissions (hash, timestamp, votes)
- Verification requests (claim info, status)
- Reward tracking (earned, claimed amounts)

## API Boundaries

### Frontend → Contract

**Direct interaction** via `GeoProofClient`:
```
useGeoProof() 
  → GeoProofClient.registerNode()
  → Program instruction
  → Blockchain
```

### Optional: Backend API Layer

For features not requiring blockchain:
```
App → Next.js API Routes (/api/)
    → Database (optional)
    → External services (Mapbox, IPFS)
```

Example:
```typescript
// pages/api/evidence/upload.ts
export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get('file');
  
  // Upload to IPFS, get hash
  const hash = await uploadToIPFS(file);
  
  // Return hash for blockchain submission
  return Response.json({ hash });
}
```

## Security Architecture

### Wallet & Transaction Security

```
User Action
  ↓
useGeoProof hook
  ↓
wallet.signTransaction() - User confirms in wallet
  ↓
Signed transaction sent to blockchain
  ↓
Program verifies signature = user's wallet
  ↓
Only then executed
```

### Contract Security

- **Signer checks**: All state-changing instructions verify the caller
- **PDA ownership**: Derived PDAs ensure accounts belong to proper owner
- **Bounds checking**: Coordinates validated (lat: -90 to 90, lon: -180 to 180)
- **Access control**: Node can only claim their own rewards

### Frontend Security

- **No private keys stored**: Uses wallet adapter for signing
- **Environment variables**: Sensitive config in `.env.local` (not committed)
- **HTTPS only**: Required for production (Vercel enforces this)
- **Content Security Policy**: Could be added to `next.config.js`

## Performance Optimizations

### Frontend

1. **Code Splitting**: Next.js automatically splits at route level
2. **Image Optimization**: Use Next.js `<Image>` component
3. **Dynamic Imports**: Lazy load heavy components
   ```tsx
   const NetworkMap = dynamic(() => import('@/components/dashboard/network-map'));
   ```
4. **Memoization**: React.memo for expensive components
5. **SWR Caching**: Prevents duplicate network requests

### Contract

1. **Account Caching**: Fetch accounts once, reuse in client
2. **Batch Operations**: Group multiple instructions when possible
3. **Index Structures**: Use PDAs for fast account lookups
4. **Instruction Efficiency**: Minimize compute units per transaction

## Scalability Considerations

### Horizontal Scaling

- **Multiple nodes**: Network grows with more node operators
- **Parallel verification**: Many simultaneous verification requests
- **Regional clustering**: Nodes in same region process together

### Vertical Scaling

- **Solana throughput**: Handles 1000s TPS (sufficient for MVP)
- **Database**: Optional off-chain DB for historical queries
- **Caching layer**: Redis for frequently accessed data

### Future Improvements

1. **Compressed NFTs**: Reduce account size
2. **State Compression**: Use Neon/Orca for more efficient storage
3. **Multi-sig**: Require multiple signatures for claim approvals
4. **Automated Market Maker**: For token economics

## Testing Strategy

### Unit Tests
```bash
pnpm contract:test  # Anchor tests
```

### Integration Tests
```tsx
// Test component + hook together
render(<EvidenceForm />);
fireEvent.click(screen.getByText('Submit'));
```

### End-to-End Tests
```typescript
// Test full user flow in browser
// Use Cypress or Playwright
```

## Deployment Pipeline

```
Code → Git Push
    ↓
GitHub Actions (optional)
    ├─ Run tests
    ├─ Lint code
    └─ Build
         ↓
    Vercel Deploy
         ↓
    Smart Contract (manual)
    ├─ anchor build
    └─ anchor deploy --provider.cluster devnet
```

## Monitoring & Logging

### Frontend Errors

```tsx
// Error boundary catches React errors
<ErrorBoundary>
  <Dashboard />
</ErrorBoundary>
```

### Contract Errors

Events logged to blockchain:
```rust
emit!(VerificationCompleted {
    claim_id,
    status: "rejected".to_string(),
    verified_count: 0,
});
```

### Optional: Analytics

```tsx
// In pages/dashboard/page.tsx
useEffect(() => {
  gtag.pageview('dashboard');
}, []);
```

## Related Documentation

- **Solana Docs**: https://docs.solana.com/
- **Anchor Book**: https://book.anchor-lang.com/
- **Next.js Guide**: https://nextjs.org/docs
- **Design System**: See `app/globals.css`

## Quick Reference

### Key Files

| File | Purpose |
|------|---------|
| `lib/geoproof/client.ts` | Smart contract client |
| `hooks/useGeoProof.ts` | React hook for contracts |
| `contracts/programs/geoproof/src/lib.rs` | Smart contract logic |
| `app/globals.css` | Design tokens & theme |
| `components/dashboard/sidebar.tsx` | Main navigation |

### Important Commands

```bash
pnpm dev              # Start dev server
pnpm contract:build   # Compile contract
pnpm contract:test    # Run contract tests
pnpm contract:deploy:devnet  # Deploy to testnet
```

---

**Last Updated**: 2026
**Version**: 1.0.0
