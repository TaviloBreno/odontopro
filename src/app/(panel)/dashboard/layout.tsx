import { SidebarDashboard } from "./_components/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SidebarDashboard>
        {children}
      </SidebarDashboard>
    </>
  )
}