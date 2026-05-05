# CI/CD Rules

## Overview

Terrova uses GitHub Actions for continuous integration and deployment. All code must pass CI checks before merging.

---

## Pipeline Structure

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    Lint     │───▶│    Build    │───▶│   Deploy    │
│  TypeCheck  │    │    Test     │    │   Preview   │
└─────────────┘    └─────────────┘    └─────────────┘
       │                 │                    │
       ▼                 ▼                    ▼
   Fail fast       Artifacts            PR Comment
```

---

## Workflows

### 1. CI (`ci.yml`)

Triggered on: Push/PR to `main`, `develop`

| Job | Purpose | Blocking |
|-----|---------|----------|
| `lint` | ESLint + TypeScript | Yes |
| `build` | Next.js production build | Yes |
| `test` | Jest/Vitest unit tests | Yes |
| `contract-build` | Anchor build | Yes |
| `security` | Trivy vulnerability scan | Yes |
| `deploy-preview` | Vercel preview URL | No |

### 2. Deploy (`deploy.yml`)

Triggered on: Push to `main`, Manual dispatch

| Environment | Trigger | Contract |
|-------------|---------|----------|
| Production | Auto on main | No deploy |
| Staging | Manual | Devnet |

### 3. Contract Audit (`contract-audit.yml`)

Triggered on: Changes to `contracts/`

| Check | Tool | Purpose |
|-------|------|---------|
| Dependencies | cargo-audit | CVE scan |
| Lints | clippy | Code quality |
| Format | rustfmt | Style |
| Custom | shell | Solana patterns |

---

## Rules

### PR Requirements

1. **All checks must pass** before merge
2. **At least 1 approval** required
3. **Branch must be up-to-date** with base
4. **No merge commits** (rebase only)

### Commit Messages

Follow conventional commits:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructure
- `test`: Tests
- `chore`: Maintenance

Examples:
```
feat(dashboard): add network map visualization
fix(wallet): handle disconnection gracefully
docs(api): update evidence submission docs
chore(deps): bump @solana/web3.js to 1.95.0
```

### Branch Naming

```
<type>/<ticket>-<description>

feat/GP-123-network-map
fix/GP-456-wallet-disconnect
chore/update-dependencies
```

---

## Environment Variables

### Required Secrets

| Secret | Environment | Purpose |
|--------|-------------|---------|
| `VERCEL_TOKEN` | All | Deployment |
| `VERCEL_ORG_ID` | All | Deployment |
| `VERCEL_PROJECT_ID` | All | Deployment |
| `NEXT_PUBLIC_SOLANA_RPC_URL` | All | Blockchain |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | All | Maps |
| `DEPLOYER_KEYPAIR` | Staging | Contract deploy |

### Adding Secrets

1. Go to repo Settings > Secrets > Actions
2. Click "New repository secret"
3. Add name and value
4. Use in workflow: `${{ secrets.NAME }}`

---

## Local CI Simulation

Run checks locally before pushing:

```bash
# All checks
pnpm lint && pnpm tsc --noEmit && pnpm build

# Contract checks
cd contracts
cargo fmt --check
cargo clippy
anchor build
```

---

## Failure Handling

### Lint Failures

```bash
# Auto-fix
pnpm lint --fix

# Check specific file
pnpm eslint src/file.tsx
```

### Type Failures

```bash
# Check errors
pnpm tsc --noEmit

# Watch mode
pnpm tsc --noEmit --watch
```

### Build Failures

```bash
# Clean build
rm -rf .next
pnpm build

# Check for missing env vars
```

### Contract Failures

```bash
cd contracts

# Format
cargo fmt

# Fix clippy warnings
cargo clippy --fix

# Rebuild
anchor build
```

---

## Performance Budgets

| Metric | Limit |
|--------|-------|
| Build time | < 5 min |
| Bundle size | < 500KB (gzipped) |
| First paint | < 1.5s |
| TTI | < 3s |

---

## Deployment Environments

| Environment | URL | Branch | Auto-deploy |
|-------------|-----|--------|-------------|
| Production | terrova.io | main | Yes |
| Staging | staging.terrova.io | develop | Yes |
| Preview | *.vercel.app | PR | Yes |

---

## Rollback Procedure

1. Go to Vercel dashboard
2. Select deployment to rollback to
3. Click "Promote to Production"
4. Verify health checks

Or via CLI:

```bash
vercel rollback [deployment-url]
```
