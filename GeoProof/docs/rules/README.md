# GeoProof Rules & Guidelines

This directory contains all project rules and conventions. **Read these before contributing.**

## Quick Links

| Rule | Purpose |
|------|---------|
| [CI.md](./CI.md) | CI/CD workflows, pipelines, deployment |
| [CODING.md](./CODING.md) | TypeScript, React, Next.js, Solana patterns |
| [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) | Project organization, file naming |
| [GIT.md](./GIT.md) | Branching, commits, PRs, code review |
| [SECURITY.md](./SECURITY.md) | Security practices, secrets, validation |
| [TESTING.md](./TESTING.md) | Test structure, coverage, best practices |
| [UI_DESIGN.md](./UI_DESIGN.md) | Colors, typography, components, layout |

## Priority

When rules conflict, follow this priority:

1. **Security** - never compromise on security
2. **Accessibility** - all users must be able to use the app
3. **Consistency** - follow existing patterns
4. **Performance** - don't ship slow code
5. **Readability** - code is read more than written

## New Contributors

Start with:

1. [FOLDER_STRUCTURE.md](./FOLDER_STRUCTURE.md) - understand the project
2. [CODING.md](./CODING.md) - learn the patterns
3. [GIT.md](./GIT.md) - understand the workflow

## Updating Rules

Rules are living documents. To propose changes:

1. Create a PR with the change
2. Add `docs: update [RULE].md` as commit message
3. Request review from 2+ team members
4. Merge after approval
