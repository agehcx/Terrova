# Terrova - Getting Started Guide

Welcome to Terrova! This guide will help you set up and run the project locally.

## Quick Start (5 minutes)

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment

```bash
cp .env.example .env.local
```

Leave the defaults for now. The app will work with the devnet configuration.

### 3. Start Development Server

```bash
pnpm dev
```

The app will open at http://localhost:3001

### 4. Explore

- **Landing Page**: See the Terrova branding and product information
- **Dashboard**: Connect your Solana wallet to access the dashboard
- **Demo Features**: All pages have mock data loaded from `lib/terrova/seed-data.ts`

## Full Setup Guide

### Prerequisites

Ensure you have installed:
- **Node.js 18+**: https://nodejs.org/
- **pnpm**: `npm install -g pnpm`
- **Git**: https://git-scm.com/

For smart contract development:
- **Rust**: https://rustup.rs/
- **Solana CLI**: https://docs.solana.com/cli/install-solana-cli-tools
- **Anchor CLI**: `cargo install --git https://github.com/coral-xyz/anchor avm --locked --force && avm install 0.30.0 && avm use 0.30.0`

### Step 1: Clone & Install

```bash
git clone https://github.com/yourusername/terrova.git
cd terrova
pnpm install
```

### Step 2: Configure Environment

Edit `.env.local`:

```env
# Use devnet for development
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_NETWORK=devnet
NEXT_PUBLIC_SOLANA_CLUSTER=devnet

# Leave empty until you deploy contracts
NEXT_PUBLIC_PROGRAM_ID=

# Optional: Add Mapbox token for enhanced maps
# Get one free at https://mapbox.com/
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=

# Demo settings
ENABLE_NODE_SIMULATOR=true
SIMULATOR_UPDATE_INTERVAL=5000
```

### Step 3: Start Development

```bash
pnpm dev
```

Server runs on http://localhost:3001

## Using the Dashboard

### Connect Wallet

1. Click the "Connect Wallet" button in the top-right
2. Select your preferred wallet (Phantom, Solflare, etc.)
3. Approve the connection in your wallet extension

**Note**: For testing, we recommend:
- **Phantom**: https://phantom.app/
- **Solflare**: https://solflare.com/

Get devnet SOL from the [Solana Faucet](https://faucet.solana.com/)

### Dashboard Sections

- **Overview**: View network statistics and recent activity
- **Network Map**: See nodes distributed globally (interactive map)
- **Nodes**: Register and manage verification nodes
- **Evidence**: Submit and view evidence submissions
- **Verifications**: Track and manage verification requests
- **Rewards**: View earned rewards and claim tokens

### Mock Data

All pages load with sample data from `lib/terrova/seed-data.ts`. This allows you to explore the UI without a deployed contract.

## Smart Contract Development

### Build the Contract

```bash
pnpm contract:build
```

This compiles the Anchor program in `contracts/programs/terrova/`.

### Test Locally

```bash
pnpm contract:test
```

Runs the test suite (requires Solana test validator running).

### Deploy to Devnet

1. **Check Solana balance**:
   ```bash
   solana balance --url devnet
   ```

2. **Deploy**:
   ```bash
   pnpm contract:deploy:devnet
   ```

3. **Update environment variable**:
   - Copy the program ID from deployment output
   - Paste into `NEXT_PUBLIC_PROGRAM_ID` in `.env.local`
   - Restart dev server: `pnpm dev`

### Deploy to Mainnet

**⚠️ Only after thorough testing!**

```bash
pnpm contract:deploy:mainnet
```

## Project Structure Explained

```
terrova/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Landing page
│   ├── layout.tsx         # Root layout with metadata
│   ├── globals.css        # Global styles + design tokens
│   └── dashboard/         # Protected routes
│       ├── page.tsx       # Dashboard overview
│       ├── map/           # Network visualization
│       ├── nodes/         # Node management
│       ├── evidence/      # Evidence submission
│       ├── verifications/ # Verification requests
│       └── rewards/       # Reward tracking
│
├── components/            # Reusable React components
│   ├── dashboard/         # Dashboard-specific components
│   ├── providers/         # Context providers
│   ├── ui/               # Shadcn/ui components
│   ├── error-boundary.tsx # Error handling
│   └── loading-state.tsx  # Loading skeletons
│
├── hooks/                 # Custom React hooks
│   ├── useTerrova.ts    # Main contract hook
│   ├── use-mobile.ts     # Mobile detection
│   └── use-toast.ts      # Toast notifications
│
├── lib/                   # Utilities and logic
│   ├── terrova/         # Terrova-specific logic
│   │   ├── client.ts     # Smart contract client
│   │   ├── types.ts      # TypeScript interfaces
│   │   ├── seed-data.ts  # Mock/demo data
│   │   └── terrova.types.ts # IDL types (auto-generated)
│   └── utils.ts          # Helper functions
│
├── contracts/             # Smart contracts (Anchor)
│   ├── programs/
│   │   └── terrova/
│   │       └── src/
│   │           └── lib.rs # Main contract logic
│   └── Anchor.toml        # Anchor configuration
│
└── public/                # Static assets
```

## Common Tasks

### Add a New Page

1. Create file: `app/dashboard/new-page/page.tsx`
2. Use layout from existing pages as template
3. Import components and hooks as needed

### Modify Dashboard Layout

Edit `components/dashboard/sidebar.tsx` to add navigation items.

### Update Design Theme

Colors and spacing defined in `app/globals.css`. Modify the CSS custom properties:

```css
--primary: oklch(0.55 0.15 175);  /* Teal */
--secondary: oklch(0.65 0.18 145); /* Green */
```

### Test Contract Interaction

Update `lib/terrova/client.ts` and use in components:

```tsx
const { registerNode, error } = useTerrova();
```

## Troubleshooting

### Port Already in Use

If port 3000/3001 is busy:

```bash
# Kill the process
kill $(lsof -t -i:3000)

# Or let Next.js use a different port
pnpm dev -- -p 3002
```

### Wallet Connection Issues

1. Ensure wallet extension is installed and unlocked
2. Check RPC URL in `.env.local`
3. Clear browser cache and reconnect
4. Try a different wallet

### Map Not Loading

1. Check Mapbox token in `.env.local`
2. Verify location data in map component
3. Check browser console for errors

### Contract Compilation Errors

```bash
# Update Anchor
avm use 0.30.0

# Clean and rebuild
cd contracts
rm -rf target
anchor build
```

### Missing Dependencies

```bash
# Reinstall everything
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Performance Tips

- **Enable Node Simulator**: Set `ENABLE_NODE_SIMULATOR=true` in `.env.local`
- **Adjust Interval**: Change `SIMULATOR_UPDATE_INTERVAL` (in milliseconds)
- **Use SWR**: Data fetching with `useSWR()` for better caching

## Learning Resources

- **Solana**: https://docs.solana.com/
- **Anchor**: https://www.anchor-lang.com/docs
- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com/docs
- **shadcn/ui**: https://ui.shadcn.com/

## Next Steps

1. **Explore the code**: Start with `app/page.tsx` (landing page)
2. **Test connections**: Try connecting your wallet
3. **Deploy contracts**: Follow the smart contract deployment guide
4. **Customize**: Modify colors, text, and features to your needs
5. **Build features**: Use the hook system to add functionality

## Support

- **Issues**: GitHub Issues (if in a repo)
- **Discussions**: GitHub Discussions
- **Email**: support@terrova.io

## Development Workflow

### Before Committing

```bash
# Type check
pnpm tsc --noEmit

# Lint
pnpm lint

# Build
pnpm build
```

### Deploy to Production

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy with `vercel deploy`

## Environment Variables Reference

| Variable | Purpose | Example |
|----------|---------|---------|
| `NEXT_PUBLIC_RPC_URL` | Solana RPC endpoint | `https://api.devnet.solana.com` |
| `NEXT_PUBLIC_PROGRAM_ID` | Deployed contract ID | `ABC123...` |
| `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` | Mapbox API key | `pk_live_...` |
| `ENABLE_NODE_SIMULATOR` | Enable mock data | `true` |
| `SIMULATOR_UPDATE_INTERVAL` | Refresh rate (ms) | `5000` |

## License

MIT - See LICENSE file

---

**Ready to start building? Run `pnpm dev` and open http://localhost:3001!**
