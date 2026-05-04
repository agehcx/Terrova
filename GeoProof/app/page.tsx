"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  ArrowRight,
  Terminal,
  Menu,
  X,
  ExternalLink,
  Copy,
  Check,
  ShieldCheck,
  MapPin,
  Zap,
  Globe,
  Coins,
  Search,
  Lock,
  ChevronRight,
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
  { value: "2,847", label: "Active Nodes", detail: "43 countries" },
  { value: "156K", label: "Proofs Verified", detail: "this month" },
  { value: "99.2%", label: "Network Uptime", detail: "30d rolling" },
  { value: "$4.2M", label: "TVL Staked", detail: "in PROOF" },
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
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const copyCode = () => {
    navigator.clipboard.writeText("npm install @geoproof/sdk")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* Background Ornaments */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="grid-background absolute inset-0 opacity-20" />
        <div className="radial-glow absolute -top-[10%] -left-[10%] h-[50%] w-[50%] rounded-full opacity-10" />
        <div className="radial-glow absolute top-[20%] -right-[10%] h-[40%] w-[40%] rounded-full opacity-5" />
      </div>

      {/* Nav */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-border/40 bg-background/80 backdrop-blur-xl py-2" : "bg-transparent py-4"}`}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] group-hover:scale-105 transition-transform">
              <span className="text-lg font-bold">G</span>
            </div>
            <span className="text-xl font-bold tracking-tight">GeoProof</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a href="https://geoproof.gitbook.io/geoproof-docs/documentation" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Documentation
            </a>
            <Link href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Network Explorer
            </Link>
            <a href="https://github.com/geoproof" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              GitHub
            </a>
            <div className="h-4 w-px bg-border/60" />
            <Link href="/dashboard">
              <Button size="sm" className="font-semibold shadow-lg shadow-primary/20">
                Launch Dashboard
              </Button>
            </Link>
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 border-t border-border bg-background/95 backdrop-blur-xl p-6 md:hidden animate-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col gap-5">
              <a href="https://geoproof.gitbook.io/geoproof-docs/documentation" className="text-lg font-medium">Docs</a>
              <Link href="/dashboard" className="text-lg font-medium">Network Explorer</Link>
              <a href="https://github.com/geoproof" className="text-lg font-medium">GitHub</a>
              <Link href="/dashboard">
                <Button className="w-full">Launch Dashboard</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary animate-in fade-in slide-in-from-bottom-2 duration-700">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-none text-[10px] h-5">NEW</Badge>
              <span>Mainnet Launching Q2 2026</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>

            <h1 className="mt-8 text-4xl font-extrabold tracking-tight md:text-6xl lg:text-7xl">
              Verification layer for <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-primary via-emerald-400 to-primary bg-clip-text text-transparent">
                Agricultural Insurance
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl leading-relaxed">
              GeoProof is a decentralized DePIN network on Solana that enables trustless verification of crop damage through cryptographically-secured geospatial evidence.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="h-12 px-8 text-base font-bold shadow-xl shadow-primary/25 group">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="h-12 px-8 text-base font-semibold group" onClick={copyCode}>
                <Terminal className="mr-2 h-4 w-4 text-primary" />
                <span>npm i @geoproof/sdk</span>
                {copied ? (
                  <Check className="ml-2 h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="ml-2 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                )}
              </Button>
            </div>

            <div className="mt-16 flex items-center justify-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all">
              <div className="flex items-center gap-2 text-sm font-bold">
                <SolanaLogo className="h-5 w-5" />
                POWERED BY SOLANA
              </div>
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase">
                <ShieldCheck className="h-5 w-5 text-primary" />
                DePIN NETWORK
              </div>
            </div>
          </div>
        </section>

        {/* Network Stats */}
        <section className="py-12 border-y border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {networkStats.map((stat, i) => (
                <div key={stat.label} className="flex flex-col items-center md:items-start">
                  <div className="text-3xl md:text-4xl font-black text-foreground">{stat.value}</div>
                  <div className="mt-1 text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
                  <div className="text-xs text-primary font-semibold mt-0.5">{stat.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Onboarding Paths */}
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Choose your role</h2>
              <p className="mt-4 text-muted-foreground text-lg">Whether you are an insurer or an operator, joining GeoProof is seamless.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Path 1: Insurers */}
              <Card className="glass-card overflow-hidden group hover:border-primary/50 transition-colors border-white/5 bg-white/2">
                <CardContent className="p-8 md:p-12">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">For Insurance Providers</h3>
                  <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                    Automate your claims process with high-fidelity, on-chain verification. Reduce fraud and overhead costs by 70%.
                  </p>
                  <ul className="space-y-4 mb-10">
                    {[
                      "Create verification requests in seconds",
                      "Monitor evidence collection in real-time",
                      "Automated consensus-based settlement",
                      "Transparent audit trail on Solana"
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm font-medium">
                        <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/dashboard/verifications">
                    <Button className="w-full h-12 text-base font-bold">Request Verification</Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Path 2: Operators */}
              <Card className="glass-card overflow-hidden group hover:border-emerald-500/50 transition-colors border-white/5 bg-white/2">
                <CardContent className="p-8 md:p-12">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <Coins className="h-8 w-8 text-emerald-500" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">For Node Operators</h3>
                  <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                    Earn rewards by collecting geospatial evidence. Help secure the network and provide vital data for farmers.
                  </p>
                  <ul className="space-y-4 mb-10">
                    {[
                      "Stake PROOF to join the network",
                      "Receive localized verification tasks",
                      "Capture & sign encrypted evidence",
                      "Earn high APY on your staked tokens"
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm font-medium">
                        <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                          <Check className="h-3 w-3 text-emerald-500" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Link href="/dashboard/nodes">
                    <Button variant="outline" className="w-full h-12 text-base font-bold hover:bg-emerald-500/10 hover:text-emerald-500 border-emerald-500/20">Become an Operator</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How it Works - Process */}
        <section className="py-24 bg-card/20 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
              <div className="max-w-2xl">
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">How it works</h2>
                <p className="mt-4 text-muted-foreground text-lg italic">The journey from claim request to on-chain settlement.</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-sm font-medium text-primary">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  Live Protocol
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-5 gap-4 relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/5 via-primary/40 to-primary/5 -translate-y-[100px] z-0" />

              {[
                { step: "01", title: "Request", desc: "Insurer posts verification job with USDC bounty.", icon: Search },
                { step: "02", title: "Match", desc: "Network routes job to nearby reputable nodes.", icon: Zap },
                { step: "03", title: "Collect", desc: "Operators capture signed geospatial evidence.", icon: MapPin },
                { step: "04", title: "Consensus", desc: "Nodes verify data authenticity on-chain.", icon: Lock },
                { step: "05", title: "Settle", desc: "Rewards distributed & claim auto-payout.", icon: Coins },
              ].map((item, i) => (
                <div key={item.step} className="relative z-10 flex flex-col items-center text-center group">
                  <div className="h-16 w-16 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center mb-6 group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(var(--primary),0.3)] transition-all duration-300">
                    <item.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="text-xs font-black text-primary uppercase tracking-[0.2em] mb-2">{item.step}</div>
                  <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed px-4">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Developer Experience */}
        <section className="py-24 md:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <Badge className="mb-4">DEVELOPER FIRST</Badge>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
                  Build the future of <br />
                  <span className="text-primary">InsureTech</span>
                </h2>
                <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                  The GeoProof SDK provides a seamless interface to integrate decentralized verification into any application. Written in TypeScript, optimized for Solana.
                </p>

                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold">Lightning Fast</div>
                      <p className="text-sm text-muted-foreground">Verification events emitted in under 400ms via Solana's high-speed network.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-10 w-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-bold">Global Coverage</div>
                      <p className="text-sm text-muted-foreground">Access nodes in over 40 countries through a single unified API.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex gap-4">
                  <a href="https://geoproof.gitbook.io/geoproof-docs/documentation" target="_blank" rel="noopener noreferrer">
                    <Button className="font-bold">View SDK Docs</Button>
                  </a>
                  <a href="https://github.com/geoproof" target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" className="font-bold gap-2">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.841 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                      GitHub
                    </Button>
                  </a>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117] shadow-2xl">
                  <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/5">
                    <div className="flex gap-2">
                      <div className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                      <div className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                      <div className="h-3 w-3 rounded-full bg-[#27c93f]" />
                    </div>
                    <span className="text-xs font-mono text-white/40">geoproof-demo.ts</span>
                  </div>
                  <pre className="overflow-x-auto p-8 text-sm leading-relaxed custom-scrollbar">
                    <code className="font-mono text-[14px] text-emerald-400">
                      {codeExample}
                    </code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 border-t border-border/50">
          <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-12">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {[
                { q: "How does GeoProof prevent location spoofing?", a: "We use Trusted Execution Environments (TEEs) and device-level hardware attestation on our mobile node software to ensure that GPS coordinates are authentic and captured in real-time." },
                { q: "What tokens are used for rewards?", a: "Bounties are paid in USDC or SOL by the insurer, while node operators also earn PROOF tokens as an incentive for maintaining high reputation and long-term staking." },
                { q: "Can I integrate this into an existing web2 insurance platform?", a: "Absolutely. Our SDK provides a standard REST-like interface and hooks that allow you to interact with the Solana program without needing to manage private keys for your users directly." },
                { q: "What happens if nodes disagree on evidence?", a: "The protocol uses a majority-consensus model. Nodes that submit evidence that is significantly different from the consensus are penalized through stake slashing, ensuring high data integrity." }
              ].map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-border/50 px-2">
                  <AccordionTrigger className="text-left font-bold py-6 hover:text-primary transition-colors">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="radial-glow absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] opacity-20 pointer-events-none" />
          <div className="mx-auto max-w-7xl px-6 text-center">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-8">
              Ready to verify the <br />
              <span className="text-primary">physical world?</span>
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/dashboard">
                <Button size="lg" className="h-14 px-10 text-lg font-bold">Launch App</Button>
              </Link>
              <a href="https://geoproof.gitbook.io/geoproof-docs/documentation" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="h-14 px-10 text-lg font-bold">Read the Docs</Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-card/50 backdrop-blur-md pt-16 pb-12">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-6">
                <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-primary-foreground">G</div>
                GeoProof
              </Link>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Decentralized geospatial verification for the next generation of parametric insurance.
              </p>
              <div className="flex gap-4">
                <a href="#" className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-primary/10 hover:border-primary transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="h-10 w-10 rounded-full border border-border flex items-center justify-center hover:bg-primary/10 hover:border-primary transition-colors">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.841 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-primary">Protocol</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link href="/dashboard" className="hover:text-foreground">Network Explorer</Link></li>
                <li><Link href="/governance" className="hover:text-foreground">Governance</Link></li>
                <li><Link href="/staking" className="hover:text-foreground">Staking</Link></li>
                <li><Link href="/whitepaper" className="hover:text-foreground">Whitepaper</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-primary">Resources</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><a href="https://geoproof.gitbook.io/geoproof-docs/documentation" className="hover:text-foreground">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground">API Reference</a></li>
                <li><a href="#" className="hover:text-foreground">Brand Assets</a></li>
                <li><a href="#" className="hover:text-foreground">Media Kit</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-primary">Legal</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li><Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-foreground">Terms of Service</Link></li>
                <li><Link href="/compliance" className="hover:text-foreground">Compliance</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-xs text-muted-foreground font-medium">
              © 2026 GeoProof Protocol. All rights reserved.
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground/60">
              BUILT ON <SolanaLogo className="h-3 w-3" /> SOLANA
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
