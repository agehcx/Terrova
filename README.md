# Terrova

**Decentralized Agricultural Insurance Verification on Solana**

Terrova is a DePIN (Decentralized Physical Infrastructure Network) protocol that enables trustless, on-chain verification of agricultural insurance claims. Field data nodes stake TRV tokens to submit cryptographically signed, geotagged evidence that replaces slow and subjective manual insurance adjusters.

---

## What Is Terrova?

Traditional agricultural insurance claims take **45+ days** to settle due to manual field adjusters and fragmented, unverifiable data sources. Terrova collapses this into a deterministic, automated pipeline:

1. **Register Node** — Operators stake TRV tokens and declare a coverage zone
2. **Submit Evidence** — Nodes capture GPS-tagged, timestamped field photos and weather data
3. **Consensus Vote** — Other nodes in range vote on the validity of the submitted evidence
4. **Settle Claim** — Once consensus is reached, smart contracts distribute USDC payouts instantly

All state lives on Solana devnet. No manual intervention. No subjective outcomes.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Blockchain | Solana (Devnet) |
| Smart Contracts | Anchor Framework (Rust) |
| Frontend | Next.js 16 + Turbopack |
| Wallet | Phantom / any Solana wallet adapter |
| UI | Radix UI + Tailwind CSS |
| Maps | Mapbox GL |
| Charts | Recharts |

---

## How to Use the App

### 1. Connect Your Wallet

Click **Connect Wallet** in the top-right corner of the dashboard. Terrova supports Phantom and any Standard Wallet. Make sure you are on **Solana Devnet**.

> You can get free devnet SOL from the [Solana Faucet](https://faucet.solana.com/).

### 2. Register as a Node Operator

Go to **Nodes** in the sidebar. Click **Register Node**, set your location and coverage radius, and approve the transaction. Your node will be staked and marked Active.

### 3. Browse Verification Requests

Go to **Verifications** to see open insurance claims that need field evidence. Each request shows the GPS location, claim type, bounty amount, and deadline.

### 4. Submit Evidence

Select a verification request that falls within your node's coverage radius. Submit a photo hash, your GPS coordinates, and weather readings. The transaction is signed and stored on-chain.

### 5. Vote on Evidence

Other nodes in the network vote `Approve` or `Reject` on your submission. Once enough approvals accumulate, the verification reaches `InProgress` status.

### 6. Claim Rewards

Go to **Rewards**. Once a verification you participated in is finalized, your earned TRV tokens become claimable. Click **Claim Rewards** to withdraw.

---

## Dashboard Pages

| Page | Description |
|---|---|
| `/dashboard` | Overview — protocol stats, live activity feed, quick actions |
| `/dashboard/map` | Network Map — live node locations and coverage zones |
| `/dashboard/evidence` | Evidence — browse and submit field evidence |
| `/dashboard/verifications` | Verifications — open claims, deadlines, and bounties |
| `/dashboard/nodes` | Nodes — register and manage your node |
| `/dashboard/rewards` | Rewards — track earnings and claim TRV tokens |

---

## Smart Contract

The Terrova Anchor program is deployed on Solana Devnet.

**Program ID:** `B3j3WKTsuHuBVeNbqcKX5wTyiPtnUGJ7ZpuCHctYPxwH`

### Instructions

| Instruction | Description |
|---|---|
| `initialize` | Set up the protocol with admin and config |
| `register_node` | Register a staked node with a geolocation |
| `create_verification_request` | Open a new insurance claim for verification |
| `submit_evidence` | Submit geotagged photo evidence for a claim |
| `vote_on_evidence` | Approve or reject a submitted evidence entry |
| `finalize_verification` | Finalize a completed verification request |
| `claim_rewards` | Withdraw earned TRV tokens |
| `slash_node` | Admin-only — penalize a malicious node |

### On-Chain Accounts

- **Protocol** — Global config (admin, stake requirements, consensus threshold)
- **Node** — Individual node operator state (location, reputation, stake)
- **VerificationRequest** — An open insurance claim with bounty and deadline
- **Evidence** — A submitted field evidence payload
- **EvidenceVote** — A node's vote on a piece of evidence
- **Rewards** — A node's claimable reward balance

---

## Running the Smart Contract Tests

Make sure `solana-test-validator` is installed. From the `contracts/` directory:

```bash
# Start a local validator with the program loaded
solana-test-validator \
  --bpf-program B3j3WKTsuHuBVeNbqcKX5wTyiPtnUGJ7ZpuCHctYPxwH \
  target/deploy/terrova.so \
  --reset &

# Wait a few seconds, then run tests
ANCHOR_PROVIDER_URL=http://127.0.0.1:8899 \
ANCHOR_WALLET=~/.config/solana/id.json \
npx ts-mocha -p ./tsconfig.json -t 60000 'tests/**/*.ts'
```

---

## Project Structure

```
Terrova/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Dashboard pages (map, evidence, nodes, etc.)
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/
│   ├── dashboard/          # Dashboard-specific components (sidebar, header)
│   ├── providers/          # Wallet adapter provider
│   └── ui/                 # Radix UI primitives
├── contracts/
│   ├── programs/terrova/   # Anchor smart contract (Rust)
│   ├── tests/              # TypeScript integration tests
│   └── Anchor.toml         # Anchor config
├── hooks/                  # React hooks (useTerrova)
├── lib/
│   ├── terrova/            # Client SDK, IDL, types
│   └── blockchain-context.tsx
└── next.config.mjs
```

---

## Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

Built for the **Colosseum Hackathon 2026** by the Terrova team.

---

## License

MIT
