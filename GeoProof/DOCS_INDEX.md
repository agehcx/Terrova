# GeoProof Documentation Index

Welcome to GeoProof! This index helps you navigate the complete documentation.

## 🚀 Get Started (Choose Your Path)

### I want to start coding RIGHT NOW
→ **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** (5 min read)
- Project structure overview
- Key dependencies and setup
- Common code patterns
- Essential commands

### I'm new and need hand-holding
→ **[GETTING_STARTED.md](GETTING_STARTED.md)** (15 min read)
- Step-by-step setup
- Environment configuration
- Dashboard walkthrough
- Troubleshooting guide

### I want the full picture
→ **[README.md](README.md)** (10 min read)
- Project overview
- Features and capabilities
- Technology stack
- Development guide

### I need technical deep dive
→ **[ARCHITECTURE.md](ARCHITECTURE.md)** (20 min read)
- System architecture diagrams
- Component layers
- Data flow
- Security design
- Performance optimization

### I want to see what's been built
→ **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** (10 min read)
- Complete deliverables
- File statistics
- Feature overview
- Next steps

---

## 📖 Documentation by Purpose

### For First-Time Users
1. Read **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Get oriented
2. Follow **[GETTING_STARTED.md](GETTING_STARTED.md)** - Set up locally
3. Run `pnpm dev` - Explore the app
4. Connect wallet - Try features

### For Frontend Developers
1. **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Component patterns
2. **[README.md](README.md)** - Project structure
3. **[ARCHITECTURE.md](ARCHITECTURE.md)** - Frontend layers
4. Code files - Explore `app/` and `components/`

### For Smart Contract Developers
1. **[ARCHITECTURE.md](ARCHITECTURE.md)** - Contract overview
2. `contracts/programs/geoproof/src/lib.rs` - Main program
3. **[GETTING_STARTED.md](GETTING_STARTED.md)** - Deployment guide
4. Run `pnpm contract:test` - Test locally

### For Product Managers
1. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - What's built
2. **[README.md](README.md)** - Features and roadmap
3. **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design
4. Visit `http://localhost:3001` - See it in action

### For DevOps/Infrastructure
1. **[GETTING_STARTED.md](GETTING_STARTED.md)** - Deployment section
2. **[ARCHITECTURE.md](ARCHITECTURE.md)** - Deployment pipeline
3. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Security checklist
4. `package.json` - Available scripts

### For Designers/UX
1. **[ARCHITECTURE.md](ARCHITECTURE.md)** - Design system section
2. `app/globals.css` - Color tokens and typography
3. `components/ui/` - Component library
4. Visit app - Explore design in browser

---

## 📚 Documentation Files

### Quick Reference
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** ⭐
  - 2-5 minute reference card
  - Code snippets and patterns
  - Commands and common tasks
  - **Best for**: Quick lookup while coding

### Getting Started (User Guide)
- **[GETTING_STARTED.md](GETTING_STARTED.md)** ⭐
  - 5-minute quick start
  - Full setup guide with prerequisites
  - Dashboard walkthrough
  - Troubleshooting
  - **Best for**: New users and setup

### Project Overview
- **[README.md](README.md)** ⭐
  - What is GeoProof
  - Features and capabilities
  - Technology stack
  - Contributing guidelines
  - **Best for**: Understanding the project

### Technical Architecture
- **[ARCHITECTURE.md](ARCHITECTURE.md)** ⭐
  - System design diagrams
  - Component layers and breakdown
  - Smart contract structure
  - Data flow
  - Security architecture
  - Performance considerations
  - **Best for**: Technical decisions and deep understanding

### Project Summary
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** ⭐
  - Complete deliverables list
  - What's been built
  - File statistics
  - Next steps for development
  - **Best for**: Project overview and planning

### Configuration
- **.env.example**
  - Environment variable template
  - Configuration options
  - **Best for**: Setting up .env.local

### This File
- **[DOCS_INDEX.md](DOCS_INDEX.md)** (you are here)
  - Navigation guide for all documentation
  - Purpose-based reading paths

---

## 🗂️ File Organization

```
geoproof/
├── 📘 README.md                # Start here for project overview
├── 📘 GETTING_STARTED.md       # Setup and tutorial guide
├── 📘 ARCHITECTURE.md          # Technical deep dive
├── 📘 PROJECT_SUMMARY.md       # Deliverables and summary
├── 📘 QUICK_REFERENCE.md       # Developer reference card
├── 📘 DOCS_INDEX.md            # This file
├── 📄 .env.example             # Configuration template
│
├── app/                         # 🎨 Pages and Layout
│   ├── page.tsx                # Landing page
│   ├── layout.tsx              # Root layout
│   ├── globals.css             # Design tokens
│   └── dashboard/              # Protected routes
│       ├── page.tsx
│       ├── map/page.tsx
│       ├── nodes/page.tsx
│       ├── evidence/page.tsx
│       ├── verifications/page.tsx
│       └── rewards/page.tsx
│
├── components/                  # 🧩 React Components
│   ├── dashboard/
│   │   ├── sidebar.tsx
│   │   ├── header.tsx
│   │   └── network-map.tsx
│   ├── providers/
│   │   └── wallet-provider.tsx
│   ├── ui/                      # 40+ shadcn components
│   ├── error-boundary.tsx
│   └── loading-state.tsx
│
├── hooks/                       # 🪝 Custom Hooks
│   ├── useGeoProof.ts          # ⭐ Main hook
│   ├── use-mobile.ts
│   └── use-toast.ts
│
├── lib/                         # 📦 Utilities
│   ├── geoproof/
│   │   ├── client.ts           # ⭐ Smart contract client
│   │   ├── types.ts            # TypeScript types
│   │   ├── seed-data.ts        # Mock data
│   │   └── geoproof.types.ts   # IDL types
│   └── utils.ts
│
├── contracts/                   # 🔗 Smart Contracts
│   ├── programs/geoproof/src/lib.rs  # ⭐ Main program
│   ├── Anchor.toml
│   └── programs/geoproof/Cargo.toml
│
├── public/                      # 🖼️ Static assets
└── package.json                # Dependencies and scripts
```

---

## 🎯 Reading Recommendations

### Scenario 1: "I have 5 minutes"
1. Read **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Get oriented
2. Skim **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - See what's built
3. Run `pnpm dev` - Explore

### Scenario 2: "I have 30 minutes"
1. Read **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** (5 min)
2. Follow **[GETTING_STARTED.md](GETTING_STARTED.md)** quick start (10 min)
3. Run app and explore (10 min)
4. Skim **[ARCHITECTURE.md](ARCHITECTURE.md)** (5 min)

### Scenario 3: "I want to understand everything"
1. **[README.md](README.md)** - Overview (10 min)
2. **[GETTING_STARTED.md](GETTING_STARTED.md)** - Setup & tutorial (15 min)
3. Run `pnpm dev` - Hands-on (15 min)
4. **[ARCHITECTURE.md](ARCHITECTURE.md)** - Technical details (20 min)
5. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Complete picture (10 min)
6. Explore code - Deep dive (30+ min)

### Scenario 4: "I'm deploying to production"
1. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Security checklist
2. **[ARCHITECTURE.md](ARCHITECTURE.md)** - Deployment pipeline
3. **[GETTING_STARTED.md](GETTING_STARTED.md)** - Deployment section
4. Review code - Audit smart contracts
5. Test thoroughly - Run full test suite

---

## 🔑 Key Concepts

### Smart Contract Client
- **File**: `lib/geoproof/client.ts`
- **Purpose**: Interact with Solana blockchain
- **Used in**: `hooks/useGeoProof.ts`
- **Docs**: See **[ARCHITECTURE.md](ARCHITECTURE.md)** - Data Flow section

### React Hook (useGeoProof)
- **File**: `hooks/useGeoProof.ts`
- **Purpose**: Easy contract interaction in React components
- **Pattern**: See **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - useGeoProof section
- **Examples**: Throughout dashboard pages

### Design System
- **File**: `app/globals.css`
- **Colors**: Teal, green, earth tones
- **Typography**: Inter + JetBrains Mono
- **Details**: See **[ARCHITECTURE.md](ARCHITECTURE.md)** - Design section

### Mock Data
- **File**: `lib/geoproof/seed-data.ts`
- **Purpose**: UI development without contracts
- **Usage**: Loaded automatically in dashboard pages
- **Benefits**: Quick iteration, realistic data

---

## 📖 Content by Topic

### Setup & Installation
- [GETTING_STARTED.md](GETTING_STARTED.md) - Prerequisites, step-by-step
- [README.md](README.md) - Getting Started section
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Quick setup

### Development
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Code patterns
- [README.md](README.md) - Development guide
- [ARCHITECTURE.md](ARCHITECTURE.md) - Frontend/Contract layers

### Smart Contracts
- [ARCHITECTURE.md](ARCHITECTURE.md) - Smart contract overview
- `contracts/programs/geoproof/src/lib.rs` - Source code
- [GETTING_STARTED.md](GETTING_STARTED.md) - Deployment guide

### Deployment
- [GETTING_STARTED.md](GETTING_STARTED.md) - Deployment section
- [ARCHITECTURE.md](ARCHITECTURE.md) - Deployment pipeline
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Security checklist

### Design & UI
- [ARCHITECTURE.md](ARCHITECTURE.md) - Design system
- `app/globals.css` - Design tokens
- `components/ui/` - Component library

### API Reference
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Code snippets
- `lib/geoproof/types.ts` - Data types
- `hooks/useGeoProof.ts` - Hook interface

---

## 🤔 FAQs

**Q: Where do I start?**  
A: Run `pnpm dev` and open http://localhost:3001

**Q: How do I use the smart contract?**  
A: Use the `useGeoProof()` hook. See **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)**

**Q: How do I deploy contracts?**  
A: See **[GETTING_STARTED.md](GETTING_STARTED.md)** - Smart Contract Development

**Q: What's the design system?**  
A: See **[ARCHITECTURE.md](ARCHITECTURE.md)** - Design System section

**Q: How do I add a new page?**  
A: See **[README.md](README.md)** - Development Guide

**Q: Can I use this on mainnet?**  
A: See **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - Security Checklist first

**Q: What if something breaks?**  
A: See **[GETTING_STARTED.md](GETTING_STARTED.md)** - Troubleshooting section

---

## 🔗 Quick Links

| Need | File | Section |
|------|------|---------|
| Project Overview | README.md | Top of file |
| Setup Instructions | GETTING_STARTED.md | Quick Start |
| Code Patterns | QUICK_REFERENCE.md | Code Examples |
| Architecture | ARCHITECTURE.md | System Overview |
| What's Built | PROJECT_SUMMARY.md | Deliverables |
| Next Steps | PROJECT_SUMMARY.md | Next Steps |
| Troubleshooting | GETTING_STARTED.md | Troubleshooting |
| Security | PROJECT_SUMMARY.md | Security Checklist |

---

## 📝 Document Statistics

| Document | Lines | Read Time | Best For |
|----------|-------|-----------|----------|
| README.md | 263 | 10 min | Project overview |
| GETTING_STARTED.md | 347 | 15 min | Setup and tutorial |
| ARCHITECTURE.md | 517 | 20 min | Technical details |
| PROJECT_SUMMARY.md | 397 | 10 min | Deliverables |
| QUICK_REFERENCE.md | 409 | 5 min | Quick lookup |
| DOCS_INDEX.md | This file | 5 min | Navigation |

**Total Documentation**: 2,300+ lines  
**Total Code**: 3,000+ lines

---

## 🚀 Next Steps

### To Get Started
1. Open [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
2. Follow the "Get Started (2 minutes)" section
3. Run `pnpm dev`
4. Open http://localhost:3001

### To Deploy
1. Read [GETTING_STARTED.md](GETTING_STARTED.md) - Smart Contract section
2. Review [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Security Checklist
3. Deploy contracts: `pnpm contract:deploy:devnet`
4. Update `.env.local` with program ID

### To Contribute
1. Read [README.md](README.md) - Contributing section
2. Check [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Next Steps
3. Create feature branch
4. Follow coding patterns in [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

---

## 💬 Questions?

1. **Setup issues** → See [GETTING_STARTED.md](GETTING_STARTED.md) - Troubleshooting
2. **Code questions** → See [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
3. **Architecture questions** → See [ARCHITECTURE.md](ARCHITECTURE.md)
4. **Feature questions** → See [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

---

**Ready to start? Open [QUICK_REFERENCE.md](QUICK_REFERENCE.md) →**

Or, if you prefer structured learning, follow [GETTING_STARTED.md](GETTING_STARTED.md) →
