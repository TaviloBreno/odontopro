import { redirect } from "next/navigation"
import { SidebarDashboard } from "./_components/sidebar"
import { getCurrentUserAccess } from "@/lib/current-user-access"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUserAccess()
  if (!user) redirect("/login")
  if (user.role === "PLATFORM_ADMIN") redirect("/platform/plans")
  if (user.role === "EMPLOYEE") redirect("/dashboard/employee")

  return (
    <>
      <SidebarDashboard role={user.role}>
        {children}
      </SidebarDashboard>
    </>
  )
}