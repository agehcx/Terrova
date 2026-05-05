# Terrova - Quick Reference Card

**Keep this handy while developing Terrova!**

## 🚀 Get Started (2 minutes)

```bash
git clone <repo>
cd terrova
pnpm install
cp .env.example .env.local
pnpm dev
# → http://localhost:3001
```

## 📁 Project Structure at a Glance

```
app/                 # Pages and layouts
├── page.tsx         # Landing
├── globals.css      # Design tokens
└── dashboard/       # 7 protected pages

components/          # Reusable React parts
├── dashboard/       # Dashboard UI
├── ui/             # 40+ shadcn components
└── error-boundary.tsx

hooks/              # Custom React hooks
├── useTerrova.ts  # ⭐ Main contract hook

lib/terrova/       # Business logic
├── client.ts       # Smart contract client
├── types.ts        # Data interfaces
└── seed-data.ts    # Mock/demo data

contracts/          # Solana programs
└── programs/terrova/src/lib.rs
```

## 🎨 Design Tokens

```css
/* Colors in app/globals.css */
--primary: teal (oklch 0.55 0.15 175)
--secondary: green (oklch 0.65 0.18 145)
--background: dark blue-grey
--accent: earth tones

/* Fonts */
--font-sans: Inter
--font-mono: JetBrains Mono
```

## 🪝 useTerrova Hook

```tsx
import { useTerrova } from '@/hooks/useTerrova';

export function MyComponent() {
  const {
    client,              // TerrovaClient instance
    isInitialized,       // boolean
    error,              // string | null
    clearError,         // () => void
    registerNode,       // async function
    submitEvidence,     // async function
    createVerificationRequest,  // async
    verifyEvidence,     // async
    claimRewards,       // async
  } = useTerrova();

  if (!isInitialized) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <button onClick={async () => {
      const result = await registerNode(
        'Node Name',
        40.7128,    // latitude
        -74.0060,   // longitude
        'Region'
      );
      console.log(result);
    }}>
      Register
    </button>
  );
}
```

## 📝 Using Components

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export function MyPage() {
  return (
    <Card>
      <CardHeader>Title</CardHeader>
      <CardContent>
        <Button>Click Me</Button>
        <AlertCircle className="h-4 w-4" />
      </CardContent>
    </Card>
  );
}
```

## 🔌 Smart Contract Methods

### TerrovaClient Methods

```typescript
const client = new TerrovaClient(connection, wallet, programId);

// Register a node
await client.registerNode(name, lat, lon, region);

// Submit evidence
await client.submitEvidence(verifyId, lat, lon, imageHash, timestamp);

// Create verification request
await client.createVerificationRequest(
  claimId, targetLat, targetLon, requiredCount, timeoutSeconds
);

// Verify evidence
await client.verifyEvidence(verifyId, evidenceIndex, isValid);

// Claim rewards
await client.claimRewards();

// Fetch data
await client.fetchNode(nodeAddress);
await client.fetchAllNodes();
await client.fetchVerification(verificationAddress);
```

## 📍 Map Component

```tsx
import { NetworkMap } from '@/components/dashboard/network-map';

<NetworkMap
  nodes={nodes}
  selectedNode={selectedNode}
  onNodeSelect={setSelectedNode}
  center={{ lat: 20, lng: 0 }}
  zoom={2}
/>
```

## 🧪 Testing

```bash
# Frontend
pnpm dev              # Development
pnpm build            # Production build
pnpm lint             # Check code

# Smart Contracts
pnpm contract:build   # Compile
pnpm contract:test    # Run tests
pnpm contract:deploy:devnet  # Deploy to testnet
```

## 🔐 Environment Variables

```env
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=<your-program-id>
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=<mapbox-token>
ENABLE_NODE_SIMULATOR=true
SIMULATOR_UPDATE_INTERVAL=5000
```

## 📦 Key Dependencies

```json
{
  "@solana/web3.js": "Smart contract interaction",
  "@solana/wallet-adapter-react": "Wallet integration",
  "react-map-gl": "Interactive maps",
  "tailwindcss": "Styling",
  "zod": "Data validation",
  "react-hook-form": "Form handling",
  "lucide-react": "Icons"
}
```

## 💡 Common Patterns

### Handle Loading State

```tsx
import { DashboardLoadingSkeleton } from '@/components/loading-state';

if (isLoading) return <DashboardLoadingSkeleton />;
if (error) return <ErrorDisplay error={error} />;

return <DashboardContent />;
```

### Error Handling

```tsx
const { error, clearError } = useTerrova();

if (error) {
  return (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
      <Button onClick={clearError}>Dismiss</Button>
    </Alert>
  );
}
```

### Responsive Design

```tsx
// Use Tailwind responsive prefixes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* content */}
</div>

// Check mobile with hook
import { useIsMobile } from '@/hooks/use-mobile';
const isMobile = useIsMobile();
```

### Form with Validation

```tsx
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

const form = useForm({
  resolver: zodResolver(schema),
});

return (
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <input {...form.register('name')} />
    <button type="submit">Submit</button>
  </form>
);
```

## 🗺️ Dashboard Pages

| Page | Path | Purpose |
|------|------|---------|
| Overview | `/dashboard` | Network stats |
| Map | `/dashboard/map` | Node visualization |
| Nodes | `/dashboard/nodes` | Node management |
| Evidence | `/dashboard/evidence` | Evidence submission |
| Verifications | `/dashboard/verifications` | Verification tracking |
| Rewards | `/dashboard/rewards` | Reward claiming |

## 🎯 Smart Contract Account PDAs

```typescript
// Derive addresses using client
const nodePda = PublicKey.findProgramAddressSync(
  [Buffer.from('node'), authority.toBuffer()],
  programId
);

const evidencePda = PublicKey.findProgramAddressSync(
  [Buffer.from('evidence'), Buffer.from(verificationId)],
  programId
);
```

## 🚨 Debugging Tips

```tsx
// Log state changes
console.log("[v0] State updated:", state);

// Check wallet connection
console.log("[v0] Wallet:", wallet.publicKey?.toString());

// Monitor transactions
console.log("[v0] Transaction sent:", txSignature);

// Error tracking
catch (err) {
  console.error("[v0] Error:", err);
}

// Remove logs after debugging
// (Search for "[v0]" to find all debug statements)
```

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **README.md** | Project overview |
| **GETTING_STARTED.md** | Setup & tutorial |
| **ARCHITECTURE.md** | Technical deep dive |
| **PROJECT_SUMMARY.md** | Complete deliverables |
| **.env.example** | Configuration template |

## 🔗 Important Files

| File | Purpose |
|------|---------|
| `hooks/useTerrova.ts` | React hook for contracts |
| `lib/terrova/client.ts` | Smart contract client |
| `app/globals.css` | Design system |
| `components/dashboard/sidebar.tsx` | Navigation |
| `contracts/.../lib.rs` | Smart contract |

## ⚙️ Configuration Commands

```bash
# Development
pnpm dev

# Production build
pnpm build
pnpm start

# Smart contracts
cd contracts
anchor build
anchor test
anchor deploy --provider.cluster devnet

# Back to root
cd ..
```

## 🌐 Network Configuration

| Network | RPC | Status | Use Case |
|---------|-----|--------|----------|
| Devnet | api.devnet.solana.com | Test | Development |
| Testnet | api.testnet.solana.com | Unstable | Testing |
| Mainnet Beta | api.mainnet-beta.solana.com | Production | Live |

## 💰 Getting Devnet SOL

```bash
# Via CLI
solana airdrop 2 --url devnet

# Via Web
# https://faucet.solana.com/
```

## 🛡️ Security Checklist

- [ ] Never commit .env.local
- [ ] Keep private keys in wallet, not code
- [ ] Validate all user input
- [ ] Use HTTPS in production
- [ ] Update dependencies regularly
- [ ] Audit smart contracts before mainnet
- [ ] Test transactions on devnet first

## 📞 Need Help?

- **Docs**: See GETTING_STARTED.md
- **Architecture**: See ARCHITECTURE.md
- **Summary**: See PROJECT_SUMMARY.md
- **Errors**: Check browser console
- **Contract Issues**: Run `pnpm contract:test`

## ⚡ Pro Tips

1. **Use mock data first**: Start with seed-data.ts before contracts
2. **Test on devnet**: Deploy contracts to devnet before mainnet
3. **Monitor gas**: Check compute units in Anchor tests
4. **Validate inputs**: Always validate coordinates and hashes
5. **Use PDAs**: Derived accounts prevent account conflicts
6. **Stream updates**: Use websockets for real-time data
7. **Cache aggressively**: Store contract data locally when possible
8. **Batch operations**: Group multiple instructions in one transaction

## 🎓 Learning Path

1. **Start**: `pnpm dev` and explore the landing page
2. **Connect**: Link your Solana wallet
3. **Understand**: Read through ARCHITECTURE.md
4. **Explore**: Check out dashboard pages and components
5. **Build**: Add a new page or feature
6. **Deploy**: Deploy contracts to devnet
7. **Customize**: Modify colors, text, and features

---

**Happy coding! 🚀**

For detailed info: See README.md, GETTING_STARTED.md, or ARCHITECTURE.md
