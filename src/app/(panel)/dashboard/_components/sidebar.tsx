"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import Link from "next/link"
import Image from "next/image"
import {
  Banknote,
  CalendarCheck2,
  ChevronLeft,
  ChevronRight,
  Folder,
  List,
  LogOut,
  Settings,
  Users,
} from "lucide-react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import logoImg from "../../../../../public/logo-odonto.png"
import type { UserRole } from "@prisma/client"

const adminLinks = [
  { href: "/dashboard", label: "Agendamentos", icon: CalendarCheck2 },
  { href: "/dashboard/services", label: "Serviços", icon: Folder },
  { href: "/dashboard/team", label: "Equipe", icon: Users },
  { href: "/dashboard/profile", label: "Meu perfil", icon: Settings },
  { href: "/dashboard/plans", label: "Assinatura", icon: Banknote },
]

const employeeLinks = [
  { href: "/dashboard/employee", label: "Agenda da clínica", icon: CalendarCheck2 },
]

const clientLinks = [
  { href: "/dashboard/client", label: "Meus agendamentos", icon: CalendarCheck2 },
]

export function SidebarDashboard({
  children,
  role,
}: {
  children: React.ReactNode
  role: UserRole | null
}) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const links = role === "EMPLOYEE"
    ? employeeLinks
    : role === "CLIENT"
      ? clientLinks
      : adminLinks
  const roleLabel = role === "EMPLOYEE"
    ? "Funcionário"
    : role === "CLIENT"
      ? "Cliente"
      : "Administrador da clínica"

  return (
    <div className="flex min-h-screen w-full">
      <aside
        className={clsx("fixed hidden h-full flex-col border-r bg-background p-4 transition-all duration-300 md:flex", {
          "w-20": isCollapsed,
          "w-64": !isCollapsed,
        })}
      >
        <div className="mb-6 mt-4">
          {!isCollapsed && (
            <Image src={logoImg} alt="Logo do OdontoPro" priority quality={100} />
          )}
        </div>
        <Button
          className="mb-2 self-end bg-gray-100 text-zinc-900 hover:bg-gray-50"
          onClick={() => setIsCollapsed((collapsed) => !collapsed)}
          aria-label={isCollapsed ? "Expandir menu" : "Recolher menu"}
        >
          {isCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </Button>
        <nav className="flex flex-1 flex-col gap-1 overflow-hidden">
          {!isCollapsed && (
            <span className="mt-1 text-sm font-medium uppercase text-gray-400">
              {roleLabel}
            </span>
          )}
          {links.map((item) => (
            <SidebarLink
              key={item.href}
              href={item.href}
              label={item.label}
              pathname={pathname}
              isCollapsed={isCollapsed}
              icon={<item.icon className="h-6 w-6" />}
            />
          ))}
        </nav>
        <Button
          className="mt-4 justify-start gap-2"
          variant="outline"
          onClick={() => signOut({ redirectTo: "/" })}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && "Sair"}
        </Button>
      </aside>

      <div
        className={clsx("flex flex-1 flex-col transition-all duration-300", {
          "md:ml-20": isCollapsed,
          "md:ml-64": !isCollapsed,
        })}
      >
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-white px-2 md:hidden">
          <Sheet>
            <div className="flex items-center gap-4">
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Abrir menu">
                  <List className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <h1 className="text-base font-semibold">
                {role === "EMPLOYEE"
                  ? "Painel do funcionário"
                  : role === "CLIENT"
                    ? "Painel do cliente"
                    : "Painel da clínica"}
              </h1>
            </div>
            <SheetContent side="right" className="text-black sm:max-w-xs">
              <SheetTitle>OdontoPRO</SheetTitle>
              <SheetDescription>
                {role === "EMPLOYEE"
                  ? "Menu do funcionário"
                  : role === "CLIENT"
                    ? "Menu do cliente"
                    : "Menu do administrador"}
              </SheetDescription>
              <nav className="grid gap-2 pt-5">
                {links.map((item) => (
                  <SidebarLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    pathname={pathname}
                    isCollapsed={false}
                    icon={<item.icon className="h-6 w-6" />}
                  />
                ))}
                <Button
                  className="mt-3 justify-start gap-2"
                  variant="outline"
                  onClick={() => signOut({ redirectTo: "/" })}
                >
                  <LogOut className="h-5 w-5" />
                  Sair
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex-1 px-2 py-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}

interface SidebarLinkProps {
  href: string
  icon: React.ReactNode
  label: string
  pathname: string
  isCollapsed: boolean
}

function SidebarLink({ href, icon, isCollapsed, label, pathname }: SidebarLinkProps) {
  const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(`${href}/`))

  return (
    <Link href={href} aria-current={active ? "page" : undefined}>
      <div
        className={clsx("flex items-center gap-2 rounded-md px-3 py-2 transition-colors", {
          "bg-blue-500 text-white": active,
          "text-gray-700 hover:bg-gray-100": !active,
        })}
      >
        <span className="h-6 w-6 shrink-0">{icon}</span>
        {!isCollapsed && <span>{label}</span>}
      </div>
    </Link>
  )
}
