import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUserAccess } from "@/lib/current-user-access"
import { PlatformSignOutButton } from "./signout-button"

export default async function PlatformLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getCurrentUserAccess()
  if (!user) redirect("/login")
  if (user.role !== "PLATFORM_ADMIN") {
    const dashboard = user.role === "CLIENT"
      ? "/dashboard/client"
      : user.role === "EMPLOYEE"
        ? "/dashboard/employee"
        : "/dashboard"
    redirect(dashboard)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="flex items-center justify-between border-b bg-white px-6 py-4">
        <div>
          <p className="font-semibold">Odonto PRO</p>
          <p className="text-sm text-gray-600">Administração da plataforma</p>
        </div>
        <nav aria-label="Administração da plataforma">
          <Link className="font-medium underline" href="/platform/plans">
            Planos comerciais
          </Link>
        </nav>
        <PlatformSignOutButton />
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  )
}
