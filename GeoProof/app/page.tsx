"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  Terminal,
  Menu,
  X,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react"

function SolanaLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 397 311" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M64.6 237.9c2.4-2.4 5.7-3.8 9.2-3.8h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1l62.7-62.7z" fill="currentColor" />
      <path d="M64.6 3.8C67.1 1.4 70.4 0 73.8 0h317.4c5.8 0 8.7 7 4.6 11.1l-62.7 62.7c-2.4 2.4-5.7 3.8-9.2 3.8H6.5c-5.8 0-8.7-7-4.6-11.1L64.6 3.8z" fill="currentColor" />
      <path d="M332.1 120.2c-2.4-2.4-5.7-3.8-9.2-3.8H5.5c-5.8 0-8.7 7-4.6 11.1l62.7 62.7c2.4 2.4 5.7 3.8 9.2 3.8h317.4c5.8 0 8.7-7 4.6-11.1l-62.7-62.7z" fill="currentColor" />
    </svg>
  )
}

const networkStats = [
  { value: "2,847", label: "Nodes", detail: "43 countries" },
  { value: "156K", label: "Evidence", detail: "this month" },
  { value: "99.2%", label: "Uptime", detail: "30d rolling" },
  { value: "$4.2M", label: "Staked", detail: "in PROOF" },
]

const codeExample = `import { GeoProofClient } from '@geoproof/sdk'

const client = new GeoProofClient({
  network: 'mainnet-beta',
  commitment: 'confirmed'
})

// Request verification for a claim
const verification = await client.createVerification({
  claimId: 'CLM-2024-001847',
  location: { lat: 39.8283, lng: -98.5795 },
  radius: 5000, // meters
  bounty: 100_000_000 // 0.1 SOL
})

// Evidence submitted by nearby nodes
verification.on('evidence', (evidence) => {
  console.log('New evidence:', evidence.hash)
})`

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyCode = () => {
    navigator.clipboard.writeText("npm install @geoproof/sdk")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-primary text-primary-foreground">
              <span className="text-sm font-bold">G</span>
            </div>
            <span>GeoProof</span>
          </Link>

          <div className="hidden items-center gap-6 md:flex">
            <a href="https://geoproof.gitbook.io/geoproof-docs/documentation" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground">
              Docs
            </a>
            <Link href="/network" className="text-sm text-muted-foreground hover:text-foreground">
              Network
            </Link>
            <a href="https://github.com/geoproof" className="text-sm text-muted-foreground hover:text-foreground">
              GitHub
            </a>
            <Link href="/dashboard">
              <Button size="sm" variant="outline">
                Dashboard
              </Button>
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-border bg-background p-4 md:hidden">
            <div className="flex flex-col gap-3">
              <a href="https://geoproof.gitbook.io/geoproof-docs/documentation" target="_blank" rel="noopener noreferrer" className="text-sm">Docs</a>
              <Link href="/network" className="text-sm">Network</Link>
              <a href="https://github.com/geoproof" className="text-sm">GitHub</a>
              <Link href="/dashboard">
                <Button size="sm" className="w-full">Dashboard</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="inline-flex h-5 items-center rounded bg-primary/10 px-2 text-xs font-medium text-primary">
              v0.8.2
            </span>
            <span>Devnet live</span>
            <span className="text-muted-foreground/50">|</span>
            <span>Mainnet Q2 2026</span>
          </div>

          <h1 className="mt-6 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
            Decentralized verification for agricultural insurance claims
          </h1>

          <p className="mt-4 max-w-xl text-muted-foreground md:text-lg">
            GeoProof coordinates a network of node operators to collect geospatial evidence.
            Consensus-based verification enables trustless, automated claim resolution on Solana.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link href="/dashboard">
              <Button className="gap-2">
                Open Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="outline" className="gap-2" onClick={copyCode}>
              <Terminal className="h-4 w-4" />
              npm install @geoproof/sdk
              {copied ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3 text-muted-foreground" />
              )}
            </Button>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4">
            {networkStats.map((stat) => (
              <div key={stat.label} className="bg-card p-4 md:p-6">
                <div className="text-2xl font-semibold text-foreground md:text-3xl">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {stat.label} <span className="text-muted-foreground/60">/ {stat.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code example */}
      <section className="border-t border-border bg-card/30 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
                Built for developers
              </h2>
              <p className="mt-4 text-muted-foreground">
                The GeoProof SDK provides a simple interface to request verifications,
                monitor evidence collection, and integrate claim resolution into your workflow.
              </p>

              <div className="mt-8 relative flex flex-col gap-8 pl-6 before:absolute before:inset-y-0 before:left-[35px] before:w-px before:bg-gradient-to-b before:from-primary/50 before:via-primary/20 before:to-transparent">
                <div className="relative flex items-start gap-6 group">
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background border-2 border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.15)] text-sm font-bold text-primary transition-all duration-300 group-hover:scale-110 group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] group-hover:bg-primary/5">1</div>
                  <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm p-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-card group-hover:shadow-lg group-hover:border-primary/30 w-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <div className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">Create Verification Request</div>
                    <div className="mt-1.5 text-sm text-muted-foreground leading-relaxed">Specify claim location, geographic radius, date window, and the USDC bounty reward to initiate the verification process.</div>
                  </div>
                </div>

                <div className="relative flex items-start gap-6 group">
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background border-2 border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.15)] text-sm font-bold text-primary transition-all duration-300 group-hover:scale-110 group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] group-hover:bg-primary/5">2</div>
                  <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm p-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-card group-hover:shadow-lg group-hover:border-primary/30 w-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <div className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">Job Broadcasting & Routing</div>
                    <div className="mt-1.5 text-sm text-muted-foreground leading-relaxed">The protocol automatically routes your request to the most qualified and reputable active nodes operating within the target geographic region.</div>
                  </div>
                </div>

                <div className="relative flex items-start gap-6 group">
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background border-2 border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.15)] text-sm font-bold text-primary transition-all duration-300 group-hover:scale-110 group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] group-hover:bg-primary/5">3</div>
                  <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm p-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-card group-hover:shadow-lg group-hover:border-primary/30 w-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <div className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">Evidence Collection</div>
                    <div className="mt-1.5 text-sm text-muted-foreground leading-relaxed">Operators deploy to the field and capture verifiable, geotagged evidence secured by cryptographic signatures preventing location spoofing.</div>
                  </div>
                </div>

                <div className="relative flex items-start gap-6 group">
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background border-2 border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.15)] text-sm font-bold text-primary transition-all duration-300 group-hover:scale-110 group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] group-hover:bg-primary/5">4</div>
                  <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm p-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-card group-hover:shadow-lg group-hover:border-primary/30 w-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <div className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">Consensus & Confidence Scoring</div>
                    <div className="mt-1.5 text-sm text-muted-foreground leading-relaxed">The network analyzes the aggregated evidence, reaches consensus through on-chain voting, and calculates a final confidence score for the claim.</div>
                  </div>
                </div>

                <div className="relative flex items-start gap-6 group">
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-background border-2 border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.15)] text-sm font-bold text-primary transition-all duration-300 group-hover:scale-110 group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] group-hover:bg-primary/5">5</div>
                  <div className="rounded-xl border border-border/50 bg-card/40 backdrop-blur-sm p-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-card group-hover:shadow-lg group-hover:border-primary/30 w-full relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    <div className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">Automated Settlement</div>
                    <div className="mt-1.5 text-sm text-muted-foreground leading-relaxed">Smart contracts instantly execute the claim payout to the farmer and distribute the USDC bounty proportionally to contributing honest nodes.</div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <a href="https://geoproof.gitbook.io/geoproof-docs/documentation" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                  Read the documentation
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-border bg-[#0d1117]">
              <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-white/20" />
                <div className="h-3 w-3 rounded-full bg-white/20" />
                <div className="h-3 w-3 rounded-full bg-white/20" />
                <span className="ml-2 text-xs text-white/40">example.ts</span>
              </div>
              <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
                <code className="font-mono text-[13px] text-white/90">{codeExample}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Protocol mechanics
          </h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            GeoProof uses economic incentives and cryptographic verification to ensure honest reporting.
          </p>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="text-sm font-medium text-primary">Staking</div>
              <h3 className="mt-2 text-lg font-medium">Node operators stake PROOF</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Operators must stake tokens to participate. Stakes are slashed for dishonest behavior,
                creating economic alignment with accurate reporting.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="text-sm font-medium text-primary">Evidence</div>
              <h3 className="mt-2 text-lg font-medium">Geotagged proof collection</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Photos are cryptographically signed with GPS coordinates and timestamps.
                The mobile app prevents location spoofing through attestation.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-6">
              <div className="text-sm font-medium text-primary">Consensus</div>
              <h3 className="mt-2 text-lg font-medium">Multi-node verification</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Multiple independent operators must reach consensus. Outlier votes are penalized,
                ensuring reliable verification outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* For operators */}
      <section className="border-t border-border bg-card/30 py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <div className="text-sm font-medium text-primary">For node operators</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                Earn PROOF tokens
              </h2>
              <p className="mt-4 text-muted-foreground">
                Run a GeoProof node and earn rewards for collecting evidence. Higher stake and
                reputation scores increase your assignment probability and earnings.
              </p>

              <div className="mt-8 rounded-lg border border-border bg-card p-6">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">Average monthly earnings</span>
                  <span className="text-sm text-muted-foreground">10K PROOF staked</span>
                </div>
                <div className="mt-2 text-3xl font-semibold">847 PROOF</div>
                <div className="mt-1 text-sm text-muted-foreground">~$1,694 at current prices</div>

                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6">
                  <div>
                    <div className="text-sm text-muted-foreground">APY</div>
                    <div className="text-lg font-medium">101.6%</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Assignments/mo</div>
                    <div className="text-lg font-medium">~24</div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <a href="https://geoproof.gitbook.io/geoproof-docs/documentation" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2">
                    Operator guide
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>

            <div>
              <div className="text-sm font-medium text-primary">For insurers</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                Reduce fraud, automate claims
              </h2>
              <p className="mt-4 text-muted-foreground">
                Integrate GeoProof verification into your claims workflow. Get cryptographic proof
                of field conditions without sending adjusters.
              </p>

              <div className="mt-8 rounded-lg border border-border bg-card p-6">
                <div className="text-sm text-muted-foreground">Verification cost</div>
                <div className="mt-2 text-3xl font-semibold">$12 - $45</div>
                <div className="mt-1 text-sm text-muted-foreground">vs $150+ for field adjuster</div>

                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6">
                  <div>
                    <div className="text-sm text-muted-foreground">Avg resolution</div>
                    <div className="text-lg font-medium">4.2 hours</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Fraud reduction</div>
                    <div className="text-lg font-medium">73%</div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <a href="https://geoproof.gitbook.io/geoproof-docs/documentation" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="gap-2">
                    Integration guide
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Start building on GeoProof
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            The network is live on devnet. Run a node, integrate the SDK, or explore the dashboard.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/dashboard">
              <Button className="gap-2">
                Open Dashboard
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="https://geoproof.gitbook.io/geoproof-docs/documentation" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2">Documentation <ExternalLink className="h-4 w-4" /></Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/30">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
                <span className="text-xs font-bold">G</span>
              </div>
              <span className="font-medium">GeoProof</span>
              <span className="text-muted-foreground">|</span>
              <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                Built on <SolanaLogo className="h-3 w-3" /> Solana
              </span>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="https://geoproof.gitbook.io/geoproof-docs/documentation" target="_blank" rel="noopener noreferrer" className="hover:text-foreground">Docs</a>
              <a href="https://github.com/geoproof" className="hover:text-foreground">GitHub</a>
              <a href="https://twitter.com/geoproof" className="hover:text-foreground">Twitter</a>
              <Link href="/legal/privacy" className="hover:text-foreground">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
