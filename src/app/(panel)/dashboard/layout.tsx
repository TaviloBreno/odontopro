import { SidebarDashboard } from "./_components/sidebar"
import { getClinicAccess } from "@/lib/clinic-access"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const access = await getClinicAccess()

  return (
    <>
      <SidebarDashboard role={access?.role ?? null}>
        {children}
      </SidebarDashboard>
    </>
  )
}