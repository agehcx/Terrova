# Folder Structure Rules

## Overview

GeoProof follows a modular monorepo structure optimized for Next.js App Router and Solana smart contracts.

---

## Root Structure

```
geoproof/
├── app/                    # Next.js App Router pages
├── components/             # React components
├── contracts/              # Solana Anchor programs
├── docs/                   # Documentation
├── hooks/                  # Custom React hooks
├── lib/                    # Utilities and libraries
├── public/                 # Static assets
├── .github/                # GitHub configuration
└── [config files]          # Root configuration
```

---

## App Directory

```
app/
├── (auth)/                 # Auth route group
│   ├── login/
│   │   └── page.tsx
│   └── register/
│       └── page.tsx
├── (marketing)/            # Marketing route group
│   ├── page.tsx           # Landing page
│   ├── about/
│   └── pricing/
├── dashboard/              # Dashboard routes
│   ├── layout.tsx         # Dashboard layout
│   ├── page.tsx           # Dashboard home
│   ├── evidence/
│   │   └── page.tsx
│   ├── map/
│   │   └── page.tsx
│   ├── nodes/
│   │   └── page.tsx
│   ├── rewards/
│   │   └── page.tsx
│   └── verifications/
│       └── page.tsx
├── api/                    # API routes
│   ├── nodes/
│   │   └── route.ts
│   └── verifications/
│       └── route.ts
├── globals.css            # Global styles
├── layout.tsx             # Root layout
└── page.tsx               # Home page
```

### Rules

1. **Route groups** use `(name)` for organization without affecting URL
2. **Each route** has its own folder with `page.tsx`
3. **Layouts** in `layout.tsx` wrap child routes
4. **Loading states** in `loading.tsx`
5. **Error handling** in `error.tsx`
6. **API routes** use `route.ts` with HTTP method exports

---

## Components Directory

```
components/
├── ui/                     # shadcn/ui components (don't modify)
│   ├── button.tsx
│   ├── card.tsx
│   └── ...
├── dashboard/              # Dashboard-specific components
│   ├── header.tsx
│   ├── sidebar.tsx
│   ├── network-map.tsx
│   └── stats-card.tsx
├── forms/                  # Form components
│   ├── evidence-form.tsx
│   ├── node-registration.tsx
│   └── verification-request.tsx
├── providers/              # Context providers
│   ├── wallet-provider.tsx
│   └── theme-provider.tsx
├── shared/                 # Shared components
│   ├── loading-state.tsx
│   ├── error-boundary.tsx
│   └── empty-state.tsx
└── icons/                  # Custom icons
    └── solana-icon.tsx
```

### Rules

1. **ui/** contains only shadcn components - don't modify directly
2. **Feature folders** group related components (dashboard/, forms/)
3. **Providers** are separate for clean imports
4. **One component per file** - export as named export
5. **Index files** only for re-exporting public components

### Component File Template

```typescript
// components/dashboard/stats-card.tsx

import type { ComponentProps } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatsCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  description?: string
}

export function StatsCard({ title, value, icon, description }: StatsCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
```

---

## Contracts Directory

```
contracts/
├── programs/               # Anchor programs
│   └── geoproof/
│       ├── src/
│       │   ├── lib.rs     # Program entry point
│       │   ├── instructions/
│       │   │   ├── mod.rs
│       │   │   ├── register_node.rs
│       │   │   ├── submit_evidence.rs
│       │   │   └── verify.rs
│       │   ├── state/
│       │   │   ├── mod.rs
│       │   │   ├── node.rs
│       │   │   └── evidence.rs
│       │   └── errors.rs
│       └── Cargo.toml
├── tests/                  # Integration tests
│   └── geoproof.ts
├── migrations/             # Deployment scripts
│   └── deploy.ts
├── Anchor.toml            # Anchor configuration
└── Cargo.toml             # Workspace config
```

### Rules

1. **Instructions** separated into individual files
2. **State** (account definitions) in dedicated folder
3. **Errors** centralized in `errors.rs`
4. **Tests** in TypeScript for easier Anchor testing
5. **Migrations** for deployment automation

---

## Hooks Directory

```
hooks/
├── use-geoproof.ts         # Program interaction hook
├── use-nodes.ts            # Node data fetching
├── use-verifications.ts    # Verification data
├── use-wallet-balance.ts   # Wallet utilities
└── use-mobile.ts           # Responsive utilities
```

### Rules

1. **One hook per file**
2. **Prefix with `use`**
3. **Return consistent object shape** - `{ data, loading, error }`
4. **Handle cleanup** in useEffect returns

---

## Lib Directory

```
lib/
├── geoproof/               # Program-specific utilities
│   ├── client.ts          # Solana client wrapper
│   ├── types.ts           # TypeScript types
│   ├── geoproof.types.ts  # Generated IDL types
│   └── seed-data.ts       # Mock data
├── utils.ts               # General utilities
├── constants.ts           # App constants
└── validations/           # Zod schemas
    ├── evidence.ts
    └── node.ts
```

### Rules

1. **Domain folders** for specific functionality
2. **utils.ts** for general-purpose functions
3. **constants.ts** for magic values
4. **validations/** for Zod schemas

---

## Public Directory

```
public/
├── images/                 # Static images
│   ├── logo.svg
│   └── og-image.png
├── fonts/                  # Self-hosted fonts (if any)
└── favicon.ico
```

### Rules

1. **Optimize images** before adding
2. **Use SVG** for icons and logos
3. **Name descriptively** - `hero-background.jpg` not `img1.jpg`

---

## Docs Directory

```
docs/
├── rules/                  # Project rules
│   ├── CI.md
│   ├── CODING.md
│   ├── FOLDER_STRUCTURE.md
│   ├── GIT.md
│   ├── SECURITY.md
│   └── UI_DESIGN.md
├── api/                    # API documentation
│   └── endpoints.md
└── architecture/           # Architecture decisions
    └── decisions.md
```

---

## Config Files

```
geoproof/
├── .env.example           # Environment template
├── .env.local             # Local overrides (gitignored)
├── .eslintrc.json         # ESLint config
├── .gitignore             # Git ignore
├── .prettierrc            # Prettier config
├── components.json        # shadcn config
├── next.config.mjs        # Next.js config
├── package.json           # Dependencies
├── pnpm-lock.yaml         # Lock file
├── postcss.config.mjs     # PostCSS config
└── tsconfig.json          # TypeScript config
```

---

## Import Aliases

Configured in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

Usage:

```typescript
// Absolute imports (preferred)
import { Button } from '@/components/ui/button'
import { useNodes } from '@/hooks/use-nodes'
import { formatAddress } from '@/lib/utils'

// Relative imports (for same-folder components)
import { NodeCard } from './node-card'
```

---

## File Naming

| Type | Convention | Example |
|------|------------|---------|
| Component | kebab-case | `network-map.tsx` |
| Page | `page.tsx` | `app/dashboard/page.tsx` |
| Layout | `layout.tsx` | `app/dashboard/layout.tsx` |
| API route | `route.ts` | `app/api/nodes/route.ts` |
| Hook | camelCase with use | `useNodes.ts` |
| Utility | camelCase | `formatAddress.ts` |
| Type definitions | kebab-case | `node-types.ts` |
| Constants | UPPER_SNAKE in file | `constants.ts` |

---

## Adding New Features

When adding a new feature:

1. **Create component** in appropriate folder
2. **Create hook** if data fetching needed
3. **Add types** in `lib/geoproof/types.ts`
4. **Add validation** if user input
5. **Add page** in `app/` if new route
6. **Update sidebar** navigation if needed
7. **Add tests** for critical paths
