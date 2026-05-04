# GeoProof - Decentralized Agricultural Insurance Verification on Solana

GeoProof is a DePIN (Decentralized Physical Infrastructure Network) built on Solana that enables trustless verification of agricultural insurance claims through decentralized geospatial evidence collection.

## Features

- **Node Network**: Register and manage distributed nodes across agricultural regions
- **Geospatial Verification**: Submit and verify evidence using GPS coordinates and satellite imagery
- **Smart Contracts**: Anchor-based smart contracts for transparent, immutable verification
- **Reward System**: Earn tokens for successful evidence verification
- **Interactive Map**: Visualize nodes and verification requests globally
- **Solana Wallet Integration**: Full wallet adapter support for secure transactions

## Project Structure

```
geoproof/
├── app/
│   ├── dashboard/           # Main dashboard routes
│   │   ├── page.tsx        # Dashboard overview
│   │   ├── map/            # Network map visualization
│   │   ├── nodes/          # Node management
│   │   ├── evidence/       # Evidence submission
│   │   ├── verifications/  # Verification requests
│   │   └── rewards/        # Reward tracking
│   ├── layout.tsx          # Root layout with theme
│   ├── globals.css         # Global styles with design tokens
│   └── page.tsx            # Landing page
├── components/
│   ├── dashboard/          # Dashboard components
│   │   ├── sidebar.tsx     # Navigation sidebar
│   │   ├── header.tsx      # Top navigation
│   │   └── network-map.tsx # Map component
│   ├── providers/          # Context providers
│   │   └── wallet-provider.tsx
│   ├── error-boundary.tsx  # Error handling
│   ├── loading-state.tsx   # Loading skeletons
│   └── ui/                 # Shadcn UI components
├── contracts/
│   ├── programs/
│   │   └── geoproof/       # Anchor smart contract
│   │       └── src/
│   │           └── lib.rs  # Main program logic
│   └── Anchor.toml         # Anchor config
├── hooks/
│   ├── useGeoProof.ts      # GeoProof client hook
│   ├── use-mobile.ts       # Mobile detection
│   └── use-toast.ts        # Toast notifications
├── lib/
│   ├── geoproof/
│   │   ├── client.ts       # GeoProof client
│   │   ├── types.ts        # Data types
│   │   ├── seed-data.ts    # Mock data for demo
│   │   └── geoproof.types.ts # IDL-generated types
│   └── utils.ts            # Utility functions
└── public/                 # Static assets
```

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui
- **Blockchain**: Solana Web3.js, Anchor Framework
- **Maps**: react-map-gl, Mapbox GL
- **Wallet**: Solana Wallet Adapter
- **State**: React hooks, SWR (optional)

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Rust (for contract development)
- Solana CLI (for contract deployment)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/geoproof.git
   cd geoproof
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your values:
   - `NEXT_PUBLIC_RPC_URL`: Solana RPC endpoint (default: devnet)
   - `NEXT_PUBLIC_PROGRAM_ID`: Your deployed GeoProof program ID
   - `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`: (Optional) Mapbox token for enhanced maps

4. **Start the development server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development Guide

### Building Components

Components follow shadcn/ui patterns with Tailwind CSS. Use design tokens from `app/globals.css`:

```tsx
<button className="bg-primary text-primary-foreground hover:bg-primary/90">
  Action
</button>
```

### Using the GeoProof Hook

```tsx
import { useGeoProof } from '@/hooks/useGeoProof';

export function MyComponent() {
  const { registerNode, isInitialized, error } = useGeoProof();
  
  const handleRegister = async () => {
    const result = await registerNode(
      'Farm Node 1',
      40.7128,
      -74.0060,
      'New York'
    );
    if (result.success) {
      console.log('Node registered!', result.tx);
    }
  };

  if (!isInitialized) return <div>Connecting...</div>;
  if (error) return <div>Error: {error}</div>;

  return <button onClick={handleRegister}>Register Node</button>;
}
```

### Deploying Smart Contracts

1. **Build the program**
   ```bash
   cd contracts
   anchor build
   ```

2. **Test locally**
   ```bash
   anchor test
   ```

3. **Deploy to devnet**
   ```bash
   anchor deploy --provider.cluster devnet
   ```

4. **Update program ID**
   Update `NEXT_PUBLIC_PROGRAM_ID` in `.env.local` with the deployed program ID.

## Smart Contract Overview

### Core Instructions

- `register_node`: Register a new verification node
- `submit_evidence`: Submit geospatial evidence for a claim
- `create_verification_request`: Request verification for a claim
- `verify_evidence`: Verify submitted evidence
- `claim_rewards`: Claim earned tokens

### Accounts

- `Node`: Stores node operator data and statistics
- `Evidence`: Stores submitted evidence with location and imagery hash
- `Verification`: Manages verification request lifecycle
- `Rewards`: Tracks earned and claimed rewards

## Design System

The project uses a dark theme with teal and green accents reflecting agricultural/geospatial focus:

- **Primary**: Teal (0.55 L, 0.15 C, 175°)
- **Secondary**: Green (0.65 L, 0.18 C, 145°)
- **Background**: Deep blue-grey (0.12 L)
- **Accent**: Earth tones for data visualization

## Testing

Run tests with:
```bash
pnpm test
```

For contract testing:
```bash
cd contracts && anchor test
```

## Deployment

### To Vercel

1. Push to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Deploy

### To Solana Mainnet

1. Ensure contracts are audited
2. Deploy with `anchor deploy --provider.cluster mainnet-beta`
3. Update environment configuration
4. Deploy frontend

## Security Considerations

- All transactions are signed by user wallets
- Smart contracts use Anchor's built-in security checks
- Evidence is hashed before submission (hash verification only)
- Row-level security can be implemented for user data

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Start a discussion in our community forum
- Email: support@geoproof.io

## Roadmap

- [ ] Phase 1: Core MVP with node network and evidence submission
- [ ] Phase 2: Advanced verification with ML-based evidence validation
- [ ] Phase 3: Mobile app for evidence collection
- [ ] Phase 4: Integration with insurance providers
- [ ] Phase 5: Multi-chain expansion (Polygon, Arbitrum)

## Acknowledgments

Built with:
- [Anchor Framework](https://www.anchor-lang.com/)
- [Solana](https://solana.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
