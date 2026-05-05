# Security Rules

## Overview

Terrova handles financial transactions and sensitive user data. Security is non-negotiable.

---

## Environment Variables

### Classification

| Type | Example | Exposure |
|------|---------|----------|
| Secret | `DATABASE_URL` | Server only |
| Public | `NEXT_PUBLIC_*` | Client safe |

### Rules

1. **Never commit secrets** - use `.env.local`
2. **Prefix public vars** with `NEXT_PUBLIC_`
3. **Rotate secrets** quarterly minimum
4. **Different secrets** per environment
5. **Document all vars** in `.env.example`

### Required Secrets

```bash
# Server-only (never exposed to client)
DATABASE_URL=
SOLANA_PRIVATE_KEY=
API_SECRET_KEY=

# Client-safe (prefixed)
NEXT_PUBLIC_SOLANA_RPC_URL=
NEXT_PUBLIC_SOLANA_NETWORK=
NEXT_PUBLIC_MAPBOX_TOKEN=
NEXT_PUBLIC_TERROVA_PROGRAM_ID=
```

---

## Input Validation

### All User Input Must Be Validated

```typescript
import { z } from 'zod'

// Define schema
const evidenceSchema = z.object({
  verificationId: z.string().uuid(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  imageUrl: z.string().url().startsWith('https://'),
  timestamp: z.number().int().positive(),
  signature: z.string().min(64).max(128),
})

// Validate
export async function POST(request: Request) {
  const body = await request.json()
  
  const result = evidenceSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: result.error.flatten() },
      { status: 400 }
    )
  }
  
  // Process validated data
  const evidence = result.data
}
```

### Sanitization

```typescript
// Sanitize strings for display
import DOMPurify from 'dompurify'

function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong'],
    ALLOWED_ATTR: []
  })
}

// Escape for database queries (use parameterized queries instead)
// WRONG: `SELECT * FROM nodes WHERE id = '${id}'`
// RIGHT: Use parameterized queries
```

---

## Authentication

### Wallet-Based Auth

```typescript
import { verifyMessage } from '@solana/web3.js'
import { sign } from 'tweetnacl'

async function verifyWalletSignature(
  message: string,
  signature: Uint8Array,
  publicKey: PublicKey
): Promise<boolean> {
  const messageBytes = new TextEncoder().encode(message)
  return sign.detached.verify(messageBytes, signature, publicKey.toBytes())
}

// Session handling
interface Session {
  wallet: string
  expires: number
  nonce: string
}

function createSession(wallet: string): Session {
  return {
    wallet,
    expires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    nonce: crypto.randomUUID(),
  }
}
```

### Session Rules

1. **Short expiration** - 24 hours max
2. **Secure cookies** - HttpOnly, Secure, SameSite=Strict
3. **Rotate on auth** - new session after login
4. **Validate on each request** - check expiration

---

## API Security

### Rate Limiting

```typescript
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '10 s'), // 10 requests per 10 seconds
})

export async function middleware(request: Request) {
  const ip = request.headers.get('x-forwarded-for') ?? 'anonymous'
  const { success, limit, reset, remaining } = await ratelimit.limit(ip)
  
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests' },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': limit.toString(),
          'X-RateLimit-Remaining': remaining.toString(),
          'X-RateLimit-Reset': reset.toString(),
        }
      }
    )
  }
}
```

### CORS

```typescript
// next.config.mjs
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: 'https://terrova.io' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
}
```

---

## Solana Security

### Transaction Validation

```typescript
// Always verify transaction contents before signing
async function validateTransaction(tx: Transaction): Promise<boolean> {
  // Check instructions are from expected program
  for (const ix of tx.instructions) {
    if (!ix.programId.equals(TERROVA_PROGRAM_ID)) {
      console.error('Unexpected program in transaction')
      return false
    }
  }
  
  // Check fee payer
  if (!tx.feePayer?.equals(expectedPayer)) {
    console.error('Unexpected fee payer')
    return false
  }
  
  return true
}
```

### Key Management

```typescript
// NEVER expose private keys in frontend
// NEVER log private keys
// NEVER store private keys in database without encryption

// Use environment variables for deployment keys
const deployerKeypair = Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(process.env.DEPLOYER_KEYPAIR!))
)

// For user keys, use wallet adapter
const { publicKey, signTransaction } = useWallet()
```

### Smart Contract Security

```rust
// Always validate signers
#[account(
    mut,
    constraint = authority.key() == node.authority @ TerrovaError::Unauthorized
)]
pub authority: Signer<'info>,

// Use checked arithmetic
let new_balance = node.stake
    .checked_add(amount)
    .ok_or(TerrovaError::ArithmeticOverflow)?;

// Validate account ownership
#[account(
    constraint = node.owner == program_id @ TerrovaError::InvalidOwner
)]
pub node: Account<'info, Node>,

// Prevent reentrancy with proper account ordering
// Process state changes before external calls
```

---

## Data Protection

### Sensitive Data

| Data | Storage | Encryption |
|------|---------|------------|
| Private keys | Never stored | N/A |
| Session tokens | HttpOnly cookie | Signed |
| User wallets | Database | None (public) |
| Evidence images | Blob storage | At rest |

### Logging

```typescript
// NEVER log sensitive data
console.log('Processing for wallet:', publicKey) // OK - public
console.log('Private key:', privateKey) // NEVER
console.log('Full error:', error.stack) // Only in development

// Sanitize error messages for production
const sanitizedError = process.env.NODE_ENV === 'production'
  ? 'An error occurred'
  : error.message
```

---

## Dependency Security

### Audit

```bash
# Check for vulnerabilities
pnpm audit

# Update dependencies
pnpm update

# Check outdated
pnpm outdated
```

### Rules

1. **Pin versions** in production
2. **Review changelogs** before major updates
3. **Scan weekly** with automated tools
4. **No deprecated packages**

---

## Error Handling

### Don't Expose Stack Traces

```typescript
export async function GET(request: Request) {
  try {
    // Logic
  } catch (error) {
    // Log full error internally
    console.error('API Error:', error)
    
    // Return sanitized response
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Error Codes

```typescript
enum ErrorCode {
  UNAUTHORIZED = 'UNAUTHORIZED',
  INVALID_INPUT = 'INVALID_INPUT',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMITED = 'RATE_LIMITED',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
}

// Return consistent error format
return NextResponse.json({
  error: {
    code: ErrorCode.INVALID_INPUT,
    message: 'Invalid latitude value',
  }
}, { status: 400 })
```

---

## Content Security Policy

```typescript
// next.config.mjs
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval';
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https:;
  font-src 'self';
  connect-src 'self' https://*.solana.com wss://*.solana.com https://api.mapbox.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
`

const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: cspHeader.replace(/\n/g, '') },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
        ],
      },
    ]
  },
}
```

---

## Security Checklist

### Before Deployment

- [ ] All secrets in environment variables
- [ ] Input validation on all endpoints
- [ ] Rate limiting configured
- [ ] CORS restricted to allowed origins
- [ ] CSP headers configured
- [ ] Error messages sanitized
- [ ] Dependencies audited
- [ ] Smart contract audited

### Regular Checks

- [ ] Weekly dependency audit
- [ ] Monthly secret rotation
- [ ] Quarterly security review
- [ ] Annual penetration testing

---

## Incident Response

### If You Discover a Vulnerability

1. **Do not disclose publicly**
2. Document the issue
3. Notify security team immediately
4. Patch in private branch
5. Deploy fix
6. Disclose responsibly

### Contact

Security issues: security@terrova.io
