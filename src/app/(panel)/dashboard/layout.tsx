import { redirect } from "next/navigation"
import { SidebarDashboard } from "./_components/sidebar"
import { getClinicAccess } from "@/lib/clinic-access"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const access = await getClinicAccess()
  if (!access) redirect("/login")

  return (
    <>
      <SidebarDashboard role={access?.role ?? null}>
        {children}
      </SidebarDashboard>
    </>
  )
}