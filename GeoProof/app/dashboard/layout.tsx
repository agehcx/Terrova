import { WalletProvider } from "@/components/providers/wallet-provider"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardHeader } from "@/components/dashboard/header"
import { BlockchainProvider } from "@/lib/blockchain-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <WalletProvider>
      <BlockchainProvider>
        <div className="flex min-h-screen bg-background">
          <DashboardSidebar />
          <div className="flex flex-1 flex-col">
            <DashboardHeader />
            <main className="flex-1 overflow-auto p-6">{children}</main>
          </div>
        </div>
      </BlockchainProvider>
    </WalletProvider>
  )
}
