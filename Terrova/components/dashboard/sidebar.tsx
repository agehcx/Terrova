"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Map,
  Camera,
  FileCheck,
  Server,
  Coins,
  Settings,
  FileText,
  ExternalLink,
} from "lucide-react"

const mainNav = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Network Map", href: "/dashboard/map", icon: Map },
  { name: "Evidence", href: "/dashboard/evidence", icon: Camera },
  { name: "Verifications", href: "/dashboard/verifications", icon: FileCheck },
  { name: "Nodes", href: "/dashboard/nodes", icon: Server },
  { name: "Rewards", href: "/dashboard/rewards", icon: Coins },
]

const secondaryNav = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Docs", href: "/docs", icon: FileText },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden w-56 shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2 border-b border-border px-4">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-xs font-bold text-primary-foreground">
          T
        </div>
        <span className="font-semibold text-foreground">Terrova</span>
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-2 py-3">
        <div className="flex flex-col gap-0.5">
          {mainNav.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </div>

        <div className="my-3 border-t border-border" />

        <div className="flex flex-col gap-0.5">
          {secondaryNav.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                  isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3">
        <div className="rounded-md bg-muted/50 px-3 py-2">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-xs font-medium text-foreground">Devnet</span>
          </div>
          <div className="mt-1 font-mono text-[10px] text-muted-foreground">
            Block #285,421,038
          </div>
        </div>
        <a
          href="https://github.com/terrova"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 flex items-center gap-1.5 px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          GitHub
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </aside>
  )
}
