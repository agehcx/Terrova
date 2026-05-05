"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import {
  Menu,
  X,
  ArrowRight,
  MapPin,
  FileCheck,
  Network,
  Activity,
  Database,
  ShieldCheck,
  ChevronRight
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

const steps = [
  {
    id: "registerNode",
    title: "Register Node",
    desc: "Operators stake TRV tokens and broadcast their coverage zone.",
    icon: Network,
  },
  {
    id: "submitEvidence",
    title: "Submit Evidence",
    desc: "Nodes capture cryptographically signed, geotagged field data.",
    icon: MapPin,
  },
  {
    id: "createRequest",
    title: "Verify & Score",
    desc: "The network reaches consensus on the validity of the submission.",
    icon: ShieldCheck,
  },
  {
    id: "distributeReward",
    title: "Settle Claim",
    desc: "Smart contracts instantly distribute USDC to the claimant and nodes.",
    icon: FileCheck,
  },
]

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5 }
}

const staggerContainer = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="h-screen overflow-y-auto snap-y snap-mandatory bg-background text-foreground font-mono selection:bg-primary/20 selection:text-primary overflow-x-hidden scroll-smooth">

      {/* Infrastructure Grid Overlay - Wrapped in isMounted to prevent hydration mismatch */}
      {isMounted && (
        <div className="fixed inset-0 pointer-events-none z-0 opacity-40" suppressHydrationWarning>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "linear-gradient(to right, rgb(226, 232, 240) 1px, transparent 1px), linear-gradient(to bottom, rgb(226, 232, 240) 1px, transparent 1px)",
              backgroundSize: "60px 60px"
            }}
          />
        </div>
      )}

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <div className="flex h-6 w-6 items-center justify-center bg-foreground text-background">
              <span className="text-xs font-bold">TV</span>
            </div>
            <span>Terrova</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#flow" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Flow</a>
            <a href="#evidence" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Evidence</a>
            <a href="https://terrova.gitbook.io/terrova-docs/documentation" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Docs</a>
            <Link href="/dashboard">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-8 px-4 font-medium">
                  Dashboard
                </Button>
              </motion.div>
            </Link>
          </div>

          <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-border bg-background p-4 md:hidden overflow-hidden"
            >
              <div className="flex flex-col gap-4">
                <a href="#flow" className="text-sm font-medium text-muted-foreground">Flow</a>
                <a href="#evidence" className="text-sm font-medium text-muted-foreground">Evidence</a>
                <a href="https://terrova.gitbook.io/terrova-docs/documentation" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-foreground">Docs</a>
                <Link href="/dashboard">
                  <Button size="sm" className="w-full bg-primary text-primary-foreground rounded-none">Dashboard</Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="relative z-10 pt-14">
        {/* Hero */}
        <section className="relative min-h-[90vh] flex flex-col justify-center pt-24 pb-20 md:pt-32 md:pb-32 border-b border-border bg-background snap-start snap-always scroll-mt-14">
          <div className="mx-auto max-w-6xl px-4">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 mb-6">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs text-primary tracking-widest uppercase">Verifiable evidence for crop-risk decisions</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.1] text-foreground">
                When crop loss happens, verification should not take weeks.
              </h1>

              <p className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Terrova turns field evidence into a shared, objective verification layer for insurers, farmers, and data nodes.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Link href="/dashboard">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-12 px-8 font-medium">
                      View Demo Flow
                    </Button>
                  </motion.div>
                </Link>
                <a href="#evidence">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" variant="outline" className="rounded-none h-12 px-8 font-medium border-border hover:bg-secondary text-foreground">
                      See Verification Model
                    </Button>
                  </motion.div>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Stakes Band */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="border-b border-border bg-secondary/50 snap-start scroll-mt-14"
        >
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border font-mono">
              <motion.div {...fadeInUp} className="p-8">
                <div className="text-sm text-destructive mb-2 uppercase tracking-wide">System Delay</div>
                <div className="text-2xl text-foreground mb-1">45+ Days</div>
                <div className="text-sm text-muted-foreground">Average time to deploy field adjusters and settle agricultural claims.</div>
              </motion.div>
              <motion.div {...fadeInUp} transition={{ delay: 0.1 }} className="p-8">
                <div className="text-sm text-destructive mb-2 uppercase tracking-wide">Data Fragmentation</div>
                <div className="text-2xl text-foreground mb-1">Unverifiable Sources</div>
                <div className="text-sm text-muted-foreground">Drone imagery and ground reports lack cryptographic proof of location and time.</div>
              </motion.div>
              <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="p-8">
                <div className="text-sm text-destructive mb-2 uppercase tracking-wide">Trust Deficit</div>
                <div className="text-2xl text-foreground mb-1">Subjective Outcomes</div>
                <div className="text-sm text-muted-foreground">Manual assessment leads to disputes, increasing overhead for insurers and friction for farmers.</div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* The 4-Step Flow */}
        <section id="flow" className="py-24 min-h-[90vh] flex flex-col justify-center border-b border-border bg-background snap-start snap-always scroll-mt-14">
          <div className="mx-auto max-w-6xl px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 max-w-2xl"
            >
              <h2 className="text-3xl font-medium tracking-tight mb-4">Replacing subjectivity with sequence.</h2>
              <p className="text-muted-foreground text-lg">Terrova enforces a strict operational loop. Data is requested, objectively sourced, algorithmically scored, and settled without manual intervention.</p>
            </motion.div>

            <div className="relative">
              {/* Connecting Line */}
              <div className="absolute top-6 left-6 right-6 h-px bg-border hidden md:block" />

              <motion.div
                variants={staggerContainer}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-4 gap-8"
              >
                {steps.map((step, i) => (
                  <motion.div
                    key={step.id}
                    variants={fadeInUp}
                    className="relative z-10 flex flex-col items-start bg-background md:bg-transparent"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="flex h-12 w-12 items-center justify-center border border-border bg-surface text-primary mb-6"
                    >
                      <step.icon className="h-5 w-5" />
                    </motion.div>
                    <div className="text-xs text-muted-foreground mb-2 font-mono">Step 0{i + 1}</div>
                    <h3 className="text-xl font-medium text-foreground mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Evidence Scoring Explainer */}
        <section id="evidence" className="py-24 min-h-[90vh] flex flex-col justify-center border-b border-border bg-surface snap-start snap-always scroll-mt-14">
          <div className="mx-auto max-w-6xl px-4">
            <div className="grid md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-medium tracking-tight mb-6">Trust anchored in cryptographic evidence.</h2>
                <div className="space-y-6">
                  <p className="text-muted-foreground">
                    Photographic and sensor data is meaningless without context. Terrova nodes utilize hardware attestation to embed unalterable GPS coordinates and timestamps directly into the evidence payload.
                  </p>
                  <ul className="space-y-4">
                    {[
                      { title: "Geospatial Hashing", text: "Latitude, longitude, and elevation are cryptographically bound to the image hash." },
                      { title: "Rules-based Scoring", text: "Submissions are automatically evaluated against requested parameters (e.g., must be within 500m of parcel)." },
                      { title: "On-Chain Consensus", text: "Multiple nodes must provide corroborating evidence before an insurer's smart contract executes payout." }
                    ].map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                        <span className="text-sm text-foreground"><strong>{item.title}:</strong> {item.text}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>

              {/* Abstract Evidence Card Visual */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-background border border-border p-6 shadow-2xl relative"
              >
                <div className="absolute top-0 right-0 p-4">
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="flex items-center gap-2 border border-primary/30 bg-primary/10 px-2 py-1"
                  >
                    <ShieldCheck className="h-3 w-3 text-primary" />
                    <span className="text-[10px] text-primary uppercase">Verified Status</span>
                  </motion.div>
                </div>

                <div className="h-48 bg-secondary border border-border mb-6 flex items-center justify-center overflow-hidden relative group">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="absolute inset-0 opacity-30"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80')", backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(100%) contrast(120%)' }}
                  />
                  <div className="z-10 bg-background/90 backdrop-blur px-3 py-1.5 border border-border flex items-center gap-2">
                    <Activity className="h-4 w-4 text-primary animate-pulse" />
                    <span className="text-xs text-foreground">Analyzing field stress...</span>
                  </div>
                </div>

                <div className="space-y-4 font-mono">
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Coordinates</span>
                    <span className="text-sm text-foreground">39.8283° N, 98.5795° W</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Timestamp</span>
                    <span className="text-sm text-foreground">1684920194 UTC</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-border pb-2">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">SHA-256 Hash</span>
                    <span className="text-xs text-muted-foreground truncate w-32">e3b0c44298fc1c14...</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xs text-muted-foreground uppercase tracking-wide">Confidence Score</span>
                    <span className="text-lg text-primary">98.4%</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Network Ecosystem */}
        <section className="py-24 min-h-[90vh] flex flex-col justify-center border-b border-border bg-background overflow-hidden snap-start snap-always scroll-mt-14">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <motion.h2 {...fadeInUp} className="text-3xl font-medium tracking-tight mb-4">Infrastructure for an automated ecosystem.</motion.h2>
            <motion.p {...fadeInUp} transition={{ delay: 0.1 }} className="text-muted-foreground text-lg max-w-2xl mx-auto mb-16">
              Terrova connects localized data nodes directly to global insurance pools, settling transactions instantly via Solana devnet.
            </motion.p>

            <motion.div
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              {[
                { icon: Database, title: "Data Nodes", desc: "Independent operators staked with TRV tokens capturing primary evidence." },
                { icon: Network, title: "Consensus Protocol", desc: "The Anchor program evaluating hashes, verifying boundaries, and issuing scores." },
                { icon: FileCheck, title: "Insurance Oracles", desc: "Smart contracts consuming the verified state to trigger parametric payouts." }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  whileHover={{ y: -10 }}
                  className="border border-border bg-surface p-8 text-left transition-all hover:shadow-lg"
                >
                  <item.icon className="h-6 w-6 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Dashboard Preview & Final CTA */}
        <section className="py-24 min-h-[90vh] flex flex-col justify-center bg-surface relative overflow-hidden snap-start snap-always scroll-mt-14">
          {/* Animated Background Element */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -right-1/4 w-full h-full bg-primary/20 rounded-full blur-[120px] pointer-events-none"
          />

          <div className="mx-auto max-w-4xl px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 border border-border bg-background px-3 py-1 mb-8"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-xs text-foreground uppercase font-mono tracking-tighter">Devnet MVP Live</span>
            </motion.div>

            <motion.h2 {...fadeInUp} className="text-4xl font-medium tracking-tight mb-6">See the system in action.</motion.h2>
            <motion.p {...fadeInUp} transition={{ delay: 0.1 }} className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
              Explore the hackathon demo. Register a mock node, submit evidence against a verification request, and watch the state update in real-time.
            </motion.p>

            <Link href="/dashboard">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-none h-14 px-10 font-medium text-lg group">
                  Enter Dashboard
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background relative z-10">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 font-mono">
            <div className="flex items-center gap-4">
              <Link href="/" className="font-medium text-foreground tracking-tight hover:opacity-80 transition-opacity">
                Terrova
              </Link>
              <span className="text-border">|</span>
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground uppercase">
                <SolanaLogo className="h-3 w-3 text-muted-foreground" /> Built on Solana
              </span>
            </div>

            <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <a href="https://terrova.gitbook.io/terrova-docs/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Documentation</a>
              <a href="https://github.com/terrova" className="hover:text-foreground transition-colors">GitHub</a>
              <span className="hover:text-foreground transition-colors cursor-pointer">Privacy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
