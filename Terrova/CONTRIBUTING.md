# Contributing to Terrova

## Getting Started

1. Fork the repository
2. Clone your fork
3. Install dependencies: `pnpm install`
4. Create a branch: `git checkout -b feat/your-feature`
5. Make changes
6. Run tests: `pnpm test`
7. Commit: `git commit -m "feat: your feature"`
8. Push: `git push origin feat/your-feature`
9. Open a Pull Request

## Development

```bash
# Start development server
pnpm dev

# Run linter
pnpm lint

# Type check
pnpm tsc --noEmit

# Run tests
pnpm test

# Build for production
pnpm build
```

## Rules

Before contributing, read the rules in `docs/rules/`:

- [CI.md](./docs/rules/CI.md) - CI/CD
- [CODING.md](./docs/rules/CODING.md) - Code conventions
- [FOLDER_STRUCTURE.md](./docs/rules/FOLDER_STRUCTURE.md) - Project structure
- [GIT.md](./docs/rules/GIT.md) - Git workflow
- [SECURITY.md](./docs/rules/SECURITY.md) - Security
- [TESTING.md](./docs/rules/TESTING.md) - Testing
- [UI_DESIGN.md](./docs/rules/UI_DESIGN.md) - Design system

## Commit Messages

Follow conventional commits:

```
<type>(<scope>): <description>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
- `feat(dashboard): add network map`
- `fix(wallet): handle disconnect`
- `docs(api): update endpoints`

## Pull Requests

- One feature per PR
- Must pass CI
- Requires 1+ approval
- Squash merge to main

## Code Review

When reviewing:
- Check functionality
- Check code quality
- Check tests
- Check security
- Check accessibility

## Questions

Open an issue or reach out to the team.
