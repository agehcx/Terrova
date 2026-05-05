# Git Rules

## Branch Strategy

### Main Branches

| Branch | Purpose | Deploy |
|--------|---------|--------|
| `main` | Production | Auto |
| `develop` | Staging | Auto |

### Feature Branches

```
<type>/<ticket>-<description>
```

Examples:
```
feat/GP-123-network-map
fix/GP-456-wallet-disconnect
chore/update-dependencies
docs/api-documentation
refactor/node-registration
```

### Types

| Type | Usage |
|------|-------|
| `feat` | New feature |
| `fix` | Bug fix |
| `chore` | Maintenance |
| `docs` | Documentation |
| `refactor` | Code restructure |
| `test` | Testing |
| `perf` | Performance |

---

## Commit Messages

### Format

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Rules

1. **Subject line** - max 72 characters
2. **Imperative mood** - "add" not "added" or "adds"
3. **No period** at end of subject
4. **Body** - explain what and why, not how
5. **Footer** - reference issues, breaking changes

### Examples

```
feat(dashboard): add network map visualization

Implements interactive map showing node distribution using
react-map-gl and Mapbox. Includes clustering for dense areas.

Closes GP-123
```

```
fix(wallet): handle disconnection during transaction

Previously, disconnecting wallet mid-transaction caused an
unhandled promise rejection. Now gracefully handles this case
and shows appropriate error message.

Fixes GP-456
```

```
chore(deps): bump @solana/web3.js to 1.95.0

BREAKING CHANGE: Transaction confirmation API changed.
See migration guide in CHANGELOG.md.
```

### Scopes

| Scope | Usage |
|-------|-------|
| `dashboard` | Dashboard UI |
| `landing` | Marketing pages |
| `wallet` | Wallet integration |
| `contract` | Smart contract |
| `api` | API routes |
| `map` | Map visualization |
| `deps` | Dependencies |
| `ci` | CI/CD |
| `docs` | Documentation |

---

## Pull Requests

### Title

Same format as commit messages:

```
feat(dashboard): add network map visualization
```

### Description Template

```markdown
## Summary
Brief description of changes.

## Changes
- Added NetworkMap component
- Integrated react-map-gl
- Added clustering for dense nodes

## Testing
- [ ] Tested on desktop
- [ ] Tested on mobile
- [ ] Tested wallet connect/disconnect

## Screenshots
[Add relevant screenshots]

## Related Issues
Closes #123
```

### Rules

1. **One feature per PR** - small, focused changes
2. **Must pass CI** before review
3. **Squash merge** to main (single commit per feature)
4. **Delete branch** after merge
5. **At least 1 approval** required
6. **Author resolves own comments**

### Size Guidelines

| Size | Lines Changed | Review Time |
|------|---------------|-------------|
| XS | < 50 | < 30 min |
| S | 50-200 | 30-60 min |
| M | 200-500 | 1-2 hours |
| L | 500-1000 | 2-4 hours |
| XL | > 1000 | Split PR |

---

## Code Review

### What to Check

1. **Functionality** - does it work?
2. **Code quality** - clean, readable, maintainable?
3. **Testing** - adequate test coverage?
4. **Security** - any vulnerabilities?
5. **Performance** - any regressions?
6. **Accessibility** - keyboard/screen reader support?

### Comment Types

```
// Blocking - must fix before merge
BLOCKING: This will cause a runtime error when wallet is undefined.

// Suggestion - nice to have
SUGGESTION: Consider using useMemo here to avoid recalculation.

// Question - seeking clarification
QUESTION: Why was this approach chosen over using SWR?

// Nitpick - minor style issues
NITPICK: Prefer `const` over `let` for this variable.
```

### Response Expectations

- **Respond within 24 hours** (business days)
- **Author addresses all comments** before re-request
- **Resolve own threads** when addressed

---

## Merge Strategy

### Feature to Develop

1. Squash and merge
2. Delete feature branch
3. Automatic deploy to staging

### Develop to Main

1. Create release PR
2. Normal merge (preserve commits)
3. Tag release
4. Automatic deploy to production

---

## Versioning

Follow [Semantic Versioning](https://semver.org/):

```
MAJOR.MINOR.PATCH
```

| Change | Bump |
|--------|------|
| Breaking API change | MAJOR |
| New feature | MINOR |
| Bug fix | PATCH |

### Tagging

```bash
# Create tag
git tag -a v1.2.3 -m "Release v1.2.3"

# Push tag
git push origin v1.2.3
```

---

## Protected Branch Rules

### Main

- Require PR with 1+ approvals
- Require status checks to pass
- Require up-to-date branches
- No force pushes
- No direct pushes

### Develop

- Require status checks to pass
- No force pushes

---

## Hotfix Process

1. Create branch from `main`: `hotfix/GP-999-critical-bug`
2. Fix issue with minimal changes
3. PR to `main` with expedited review
4. After merge, cherry-pick to `develop`

```bash
# Create hotfix
git checkout main
git pull
git checkout -b hotfix/GP-999-critical-bug

# After merge to main, cherry-pick to develop
git checkout develop
git pull
git cherry-pick <commit-hash>
git push
```

---

## .gitignore

```gitignore
# Dependencies
node_modules/
.pnpm-store/

# Build
.next/
out/
dist/
target/

# Environment
.env
.env.local
.env.*.local

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
pnpm-debug.log*

# Testing
coverage/

# Solana
contracts/target/
*.so

# Misc
*.pem
.vercel
```

---

## Git Hooks

Using Husky for pre-commit hooks:

```json
// package.json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

### Pre-commit

```bash
#!/bin/sh
pnpm lint-staged
```

### Lint-staged Config

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

---

## Common Commands

```bash
# Start fresh feature
git checkout develop
git pull
git checkout -b feat/GP-123-feature-name

# Update feature branch
git checkout develop
git pull
git checkout feat/GP-123-feature-name
git rebase develop

# Squash commits before PR
git rebase -i HEAD~3  # squash last 3 commits

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard all local changes
git checkout -- .
git clean -fd

# View history
git log --oneline --graph --decorate

# Find commit that introduced bug
git bisect start
git bisect bad  # current is bad
git bisect good <commit>  # known good commit
```
