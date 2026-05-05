# Testing Rules

## Philosophy

Write tests that give confidence. Prefer integration tests over unit tests for UI. Test behavior, not implementation.

---

## Stack

| Tool | Purpose |
|------|---------|
| Vitest | Unit tests |
| Testing Library | Component tests |
| Playwright | E2E tests |
| Anchor | Contract tests |

---

## Test Structure

```
__tests__/
├── unit/                   # Pure functions
│   ├── utils.test.ts
│   └── validation.test.ts
├── components/             # Component tests
│   ├── node-card.test.tsx
│   └── stats-card.test.tsx
├── integration/            # Feature tests
│   └── evidence-submission.test.tsx
└── e2e/                    # End-to-end
    └── dashboard.spec.ts
```

---

## Naming Conventions

### Files

```
[name].test.ts      # Unit test
[name].test.tsx     # Component test
[name].spec.ts      # E2E test
```

### Tests

```typescript
describe('formatAddress', () => {
  it('truncates long addresses with ellipsis', () => {})
  it('returns short addresses unchanged', () => {})
  it('throws on invalid input', () => {})
})
```

Use descriptive names that explain:
1. What is being tested
2. What should happen
3. Under what conditions

---

## Unit Tests

### Pure Functions

```typescript
import { describe, it, expect } from 'vitest'
import { formatAddress, formatTokenAmount } from '@/lib/utils'

describe('formatAddress', () => {
  it('truncates address to 4 chars on each side by default', () => {
    const address = 'Gh4kLJwX9Kp3mN2vB5rT8qY6sZ1cD7eF'
    expect(formatAddress(address)).toBe('Gh4k...D7eF')
  })

  it('allows custom truncation length', () => {
    const address = 'Gh4kLJwX9Kp3mN2vB5rT8qY6sZ1cD7eF'
    expect(formatAddress(address, 6)).toBe('Gh4kLJ...1cD7eF')
  })

  it('returns short addresses unchanged', () => {
    expect(formatAddress('short')).toBe('short')
  })

  it('handles empty string', () => {
    expect(formatAddress('')).toBe('')
  })
})

describe('formatTokenAmount', () => {
  it('formats with 2 decimal places', () => {
    expect(formatTokenAmount(1234.5678)).toBe('1,234.57')
  })

  it('handles zero', () => {
    expect(formatTokenAmount(0)).toBe('0.00')
  })

  it('handles large numbers', () => {
    expect(formatTokenAmount(1000000)).toBe('1,000,000.00')
  })
})
```

### Validation

```typescript
import { describe, it, expect } from 'vitest'
import { evidenceSchema } from '@/lib/validations/evidence'

describe('evidenceSchema', () => {
  const validEvidence = {
    verificationId: '123e4567-e89b-12d3-a456-426614174000',
    latitude: 39.8283,
    longitude: -98.5795,
    imageUrl: 'https://example.com/image.jpg',
    timestamp: Date.now(),
  }

  it('accepts valid evidence', () => {
    const result = evidenceSchema.safeParse(validEvidence)
    expect(result.success).toBe(true)
  })

  it('rejects invalid latitude', () => {
    const result = evidenceSchema.safeParse({
      ...validEvidence,
      latitude: 91, // > 90
    })
    expect(result.success).toBe(false)
  })

  it('rejects non-https URLs', () => {
    const result = evidenceSchema.safeParse({
      ...validEvidence,
      imageUrl: 'http://example.com/image.jpg',
    })
    expect(result.success).toBe(false)
  })
})
```

---

## Component Tests

### Testing Library

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { NodeCard } from '@/components/dashboard/node-card'

const mockNode = {
  id: '1',
  name: 'Test Node',
  status: 'active',
  stake: 1000,
  reputation: 92.5,
  operator: 'Gh4k...D7eF',
}

describe('NodeCard', () => {
  it('renders node information', () => {
    render(<NodeCard node={mockNode} />)
    
    expect(screen.getByText('Test Node')).toBeInTheDocument()
    expect(screen.getByText('1,000 TRV')).toBeInTheDocument()
    expect(screen.getByText('92.5')).toBeInTheDocument()
  })

  it('shows active status badge', () => {
    render(<NodeCard node={mockNode} />)
    
    const badge = screen.getByText('Active')
    expect(badge).toHaveClass('bg-green-500/10')
  })

  it('calls onSelect when clicked', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    
    render(<NodeCard node={mockNode} onSelect={onSelect} />)
    
    await user.click(screen.getByRole('button'))
    
    expect(onSelect).toHaveBeenCalledWith(mockNode)
  })

  it('shows loading state', () => {
    render(<NodeCard node={mockNode} loading />)
    
    expect(screen.getByTestId('node-card-skeleton')).toBeInTheDocument()
  })
})
```

### With Providers

```typescript
import { render } from '@testing-library/react'
import { WalletContextProvider } from '@/components/providers/wallet-provider'

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <WalletContextProvider>
      {ui}
    </WalletContextProvider>
  )
}

describe('Dashboard', () => {
  it('shows connect wallet prompt when disconnected', () => {
    renderWithProviders(<Dashboard />)
    
    expect(screen.getByText('Connect Your Wallet')).toBeInTheDocument()
  })
})
```

---

## Integration Tests

```typescript
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { EvidenceSubmissionFlow } from '@/components/flows/evidence-submission'

const server = setupServer(
  rest.post('/api/evidence', (req, res, ctx) => {
    return res(ctx.json({ success: true, id: 'ev-123' }))
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Evidence Submission Flow', () => {
  it('submits evidence successfully', async () => {
    const user = userEvent.setup()
    render(<EvidenceSubmissionFlow verificationId="vrf-123" />)
    
    // Fill form
    await user.type(screen.getByLabelText('Latitude'), '39.8283')
    await user.type(screen.getByLabelText('Longitude'), '-98.5795')
    await user.upload(
      screen.getByLabelText('Evidence Photo'),
      new File([''], 'evidence.jpg', { type: 'image/jpeg' })
    )
    
    // Submit
    await user.click(screen.getByRole('button', { name: 'Submit Evidence' }))
    
    // Verify success
    await waitFor(() => {
      expect(screen.getByText('Evidence submitted successfully')).toBeInTheDocument()
    })
  })

  it('shows error on API failure', async () => {
    server.use(
      rest.post('/api/evidence', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }))
      })
    )
    
    const user = userEvent.setup()
    render(<EvidenceSubmissionFlow verificationId="vrf-123" />)
    
    // Fill and submit
    // ...
    
    await waitFor(() => {
      expect(screen.getByText('Failed to submit evidence')).toBeInTheDocument()
    })
  })
})
```

---

## E2E Tests

### Playwright

```typescript
// e2e/dashboard.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard')
  })

  test('displays network statistics', async ({ page }) => {
    await expect(page.getByText('Active Verifications')).toBeVisible()
    await expect(page.getByText('Evidence Submitted')).toBeVisible()
  })

  test('navigates to map view', async ({ page }) => {
    await page.click('text=Network Map')
    await expect(page).toHaveURL('/dashboard/map')
    await expect(page.getByTestId('network-map')).toBeVisible()
  })

  test('shows wallet connection prompt', async ({ page }) => {
    await expect(page.getByText('Connect Your Wallet')).toBeVisible()
  })
})

test.describe('Evidence Submission', () => {
  test('requires wallet connection', async ({ page }) => {
    await page.goto('/dashboard/evidence')
    await expect(page.getByText('Connect wallet to submit')).toBeVisible()
  })
})
```

---

## Contract Tests

### Anchor

```typescript
// contracts/tests/terrova.ts
import * as anchor from '@coral-xyz/anchor'
import { Program } from '@coral-xyz/anchor'
import { Terrova } from '../target/types/terrova'
import { expect } from 'chai'

describe('terrova', () => {
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)

  const program = anchor.workspace.Terrova as Program<Terrova>
  const user = provider.wallet

  let nodePda: anchor.web3.PublicKey

  it('registers a new node', async () => {
    const [pda] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from('node'), user.publicKey.toBuffer()],
      program.programId
    )
    nodePda = pda

    await program.methods
      .registerNode('Test Node', [39.8283, -98.5795])
      .accounts({
        node: nodePda,
        authority: user.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc()

    const nodeAccount = await program.account.node.fetch(nodePda)
    expect(nodeAccount.name).to.equal('Test Node')
    expect(nodeAccount.authority.toString()).to.equal(user.publicKey.toString())
  })

  it('stakes tokens to node', async () => {
    const stakeAmount = new anchor.BN(1000)

    await program.methods
      .stakeTokens(stakeAmount)
      .accounts({
        node: nodePda,
        authority: user.publicKey,
      })
      .rpc()

    const nodeAccount = await program.account.node.fetch(nodePda)
    expect(nodeAccount.stake.toNumber()).to.equal(1000)
  })

  it('prevents unauthorized stake withdrawal', async () => {
    const unauthorized = anchor.web3.Keypair.generate()

    try {
      await program.methods
        .withdrawStake(new anchor.BN(500))
        .accounts({
          node: nodePda,
          authority: unauthorized.publicKey,
        })
        .signers([unauthorized])
        .rpc()
      expect.fail('Should have thrown')
    } catch (error) {
      expect(error.message).to.include('Unauthorized')
    }
  })
})
```

---

## Coverage Requirements

| Type | Minimum |
|------|---------|
| Utilities | 90% |
| Hooks | 80% |
| Components | 70% |
| Pages | 60% |
| Contracts | 95% |

### Check Coverage

```bash
# Run tests with coverage
pnpm test --coverage

# View report
open coverage/lcov-report/index.html
```

---

## Best Practices

### Do

- Test behavior, not implementation
- Use descriptive test names
- Keep tests independent
- Mock external dependencies
- Test error states
- Test accessibility

### Don't

- Test implementation details
- Test library code
- Use arbitrary delays
- Share state between tests
- Over-mock (test integration when possible)

---

## Commands

```bash
# Run all tests
pnpm test

# Run in watch mode
pnpm test --watch

# Run specific file
pnpm test utils.test.ts

# Run with coverage
pnpm test --coverage

# Run E2E
pnpm test:e2e

# Run contract tests
cd contracts && anchor test
```
