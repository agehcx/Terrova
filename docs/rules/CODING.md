# Coding Rules

## TypeScript

### Strict Mode

All code must pass strict TypeScript checks:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

### Type Definitions

```typescript
// Prefer interfaces for objects
interface User {
  id: string
  name: string
  wallet: string
}

// Use type for unions, intersections, primitives
type Status = 'pending' | 'active' | 'completed'
type NodeWithStats = Node & { stats: NodeStats }

// Always type function parameters and returns
function getNode(id: string): Promise<Node | null> {
  // ...
}

// Use generics when appropriate
function useData<T>(key: string): { data: T | undefined; loading: boolean }
```

### Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Variable | camelCase | `nodeCount` |
| Function | camelCase | `fetchNodes()` |
| Component | PascalCase | `NetworkMap` |
| Type/Interface | PascalCase | `VerificationRequest` |
| Constant | UPPER_SNAKE | `MAX_RETRIES` |
| File (component) | kebab-case | `network-map.tsx` |
| File (utility) | camelCase | `formatAddress.ts` |

### Imports

```typescript
// Order: external > internal > relative > types
import { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'

import { Button } from '@/components/ui/button'
import { formatAddress } from '@/lib/utils'

import { NodeCard } from './node-card'
import type { Node } from '@/lib/terrova/types'
```

---

## React

### Component Structure

```typescript
// Standard component template
'use client' // only if needed

import { useState } from 'react'
import type { ComponentProps } from 'react'

interface NodeCardProps {
  node: Node
  onSelect?: (node: Node) => void
}

export function NodeCard({ node, onSelect }: NodeCardProps) {
  const [expanded, setExpanded] = useState(false)

  const handleClick = () => {
    onSelect?.(node)
  }

  return (
    <div onClick={handleClick}>
      {/* JSX */}
    </div>
  )
}
```

### Hooks

```typescript
// Custom hook template
import { useState, useEffect } from 'react'

export function useNodes(filters?: NodeFilters) {
  const [nodes, setNodes] = useState<Node[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    // Effect logic
  }, [filters])

  return { nodes, loading, error }
}
```

### Rules

1. **Prefer function components** - no class components
2. **Use hooks for state** - no useState in loops
3. **Memoize expensive calculations** - useMemo, useCallback
4. **Keys must be stable** - never use array index
5. **No inline functions in JSX** - extract to handlers
6. **Props destructuring** - in function signature
7. **Default exports for pages** - named exports for components

---

## Next.js

### App Router Patterns

```typescript
// Server Component (default)
async function Page() {
  const data = await fetchData()
  return <div>{data}</div>
}

// Client Component
'use client'

import { useState } from 'react'

export function InteractiveWidget() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>
}
```

### Data Fetching

```typescript
// Server Component - direct fetch
async function NodeList() {
  const nodes = await getNodes()
  return <div>{nodes.map(n => <NodeCard key={n.id} node={n} />)}</div>
}

// Client Component - SWR
'use client'

import useSWR from 'swr'

function NodeList() {
  const { data: nodes, error, isLoading } = useSWR('/api/nodes', fetcher)
  
  if (isLoading) return <Loading />
  if (error) return <Error />
  return <div>{nodes.map(n => <NodeCard key={n.id} node={n} />)}</div>
}
```

### API Routes

```typescript
// app/api/nodes/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const nodes = await fetchNodes()
    return NextResponse.json(nodes)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch nodes' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  // Validate with Zod
  const result = nodeSchema.safeParse(body)
  if (!result.success) {
    return NextResponse.json(
      { error: result.error.errors },
      { status: 400 }
    )
  }
  // Process
}
```

---

## Solana

### Wallet Integration

```typescript
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'

function useTransaction() {
  const { publicKey, signTransaction, connected } = useWallet()
  const { connection } = useConnection()

  const sendTransaction = async (tx: Transaction) => {
    if (!publicKey || !signTransaction) {
      throw new Error('Wallet not connected')
    }

    tx.feePayer = publicKey
    tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash

    const signed = await signTransaction(tx)
    const signature = await connection.sendRawTransaction(signed.serialize())
    await connection.confirmTransaction(signature)

    return signature
  }

  return { sendTransaction, connected }
}
```

### Address Handling

```typescript
// Always validate public keys
function isValidPublicKey(address: string): boolean {
  try {
    new PublicKey(address)
    return true
  } catch {
    return false
  }
}

// Format for display
function formatAddress(address: string, length = 4): string {
  if (address.length <= length * 2) return address
  return `${address.slice(0, length)}...${address.slice(-length)}`
}
```

### Error Handling

```typescript
import { WalletError } from '@solana/wallet-adapter-base'

try {
  await sendTransaction(tx)
} catch (error) {
  if (error instanceof WalletError) {
    // Handle wallet-specific errors
    switch (error.name) {
      case 'WalletNotConnectedError':
        // Prompt to connect
        break
      case 'WalletSignTransactionError':
        // User rejected
        break
    }
  }
  throw error
}
```

---

## Error Handling

### Client Components

```typescript
'use client'

import { ErrorBoundary } from '@/components/error-boundary'

export function PageContent() {
  return (
    <ErrorBoundary fallback={<ErrorFallback />}>
      <ComponentThatMayError />
    </ErrorBoundary>
  )
}
```

### API Routes

```typescript
export async function GET(request: Request) {
  try {
    // Logic
  } catch (error) {
    console.error('[API] Error:', error)
    
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    
    if (error instanceof AuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Async Operations

```typescript
// Always handle errors in async operations
async function fetchData(): Promise<Data | null> {
  try {
    const response = await fetch('/api/data')
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }
    return response.json()
  } catch (error) {
    console.error('Failed to fetch data:', error)
    return null
  }
}
```

---

## Testing

### Unit Tests

```typescript
import { describe, it, expect } from 'vitest'
import { formatAddress } from '@/lib/utils'

describe('formatAddress', () => {
  it('truncates long addresses', () => {
    const address = 'Gh4kLJwX9Kp3mN2vB5rT8qY6sZ1cD7eF'
    expect(formatAddress(address)).toBe('Gh4k...7eF')
  })

  it('returns short addresses unchanged', () => {
    const address = 'short'
    expect(formatAddress(address)).toBe('short')
  })
})
```

### Component Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { NodeCard } from './node-card'

describe('NodeCard', () => {
  const mockNode = {
    id: '1',
    name: 'Test Node',
    status: 'active',
  }

  it('renders node information', () => {
    render(<NodeCard node={mockNode} />)
    expect(screen.getByText('Test Node')).toBeInTheDocument()
  })

  it('calls onSelect when clicked', () => {
    const onSelect = vi.fn()
    render(<NodeCard node={mockNode} onSelect={onSelect} />)
    fireEvent.click(screen.getByRole('button'))
    expect(onSelect).toHaveBeenCalledWith(mockNode)
  })
})
```

---

## Performance

### Code Splitting

```typescript
// Dynamic imports for heavy components
import dynamic from 'next/dynamic'

const NetworkMap = dynamic(() => import('./network-map'), {
  loading: () => <MapSkeleton />,
  ssr: false, // Map requires browser APIs
})
```

### Optimization

```typescript
// Memoize expensive computations
const sortedNodes = useMemo(() => {
  return [...nodes].sort((a, b) => b.stake - a.stake)
}, [nodes])

// Memoize callbacks
const handleSelect = useCallback((node: Node) => {
  setSelected(node)
}, [])

// Virtualize long lists
import { useVirtualizer } from '@tanstack/react-virtual'
```

---

## Security

### Input Validation

```typescript
import { z } from 'zod'

const evidenceSchema = z.object({
  verificationId: z.string().uuid(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  imageUrl: z.string().url(),
  timestamp: z.number().int().positive(),
})

// Validate before processing
const result = evidenceSchema.safeParse(input)
if (!result.success) {
  throw new ValidationError(result.error)
}
```

### Sensitive Data

```typescript
// Never log sensitive data
console.log('Processing transaction for user:', userId) // OK
console.log('Private key:', privateKey) // NEVER

// Sanitize error messages
catch (error) {
  // Log full error internally
  console.error('Transaction failed:', error)
  
  // Return sanitized message to client
  return { error: 'Transaction failed. Please try again.' }
}
```
