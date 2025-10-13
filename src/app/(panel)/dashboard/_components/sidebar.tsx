"use client"

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import clsx from 'clsx';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from '@/components/ui/button';
import { 
  Banknote, 
  CalendarCheck2, 
  ChevronLeft, 
  ChevronRight, 
  Folder, 
  List, 
  Settings,
  Users,
  Smartphone,
  FileText,
  Clock,
  Package,
  Bot,
  Video,
  DollarSign,
  Network,
  Shield,
  Building2,
  Star,
  BarChart3,
  Stethoscope,
  Database,
  Calendar
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import getSesion from '@/lib/getSession';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"


export function SidebarDashboard({ children }: { children: React.ReactNode }) {

  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userPlan, setUserPlan] = useState<string>('BASIC');

  useEffect(() => {
    const checkUserPlan = async () => {
      try {
        const session = await getSesion();
        setUserPlan(session?.user?.plan || 'BASIC');
      } catch (error) {
        console.error('Erro ao verificar plano:', error);
      }
    };
    checkUserPlan();
  }, []);

  const getNavigationItems = () => {
    const baseItems = [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: <BarChart3 className='w-6 h-6' />,
        category: "Painel",
        badge: undefined
      },
      {
        href: "/dashboard/appointments",
        label: "Agendamentos",
        icon: <CalendarCheck2 className='w-6 h-6' />,
        category: "Painel",
        badge: undefined
      },
      {
        href: "/dashboard/patients",
        label: "Pacientes",
        icon: <Users className='w-6 h-6' />,
        category: "Painel",
        badge: undefined
      },
      {
        href: "/dashboard/services",
        label: "Serviços",
        icon: <Stethoscope className='w-6 h-6' />,
        category: "Painel",
        badge: undefined
      }
    ];

    const professionalItems = [
      {
        href: "/dashboard/sms",
        label: "SMS & WhatsApp",
        icon: <Smartphone className='w-6 h-6' />,
        category: "Professional",
        badge: "Pro"
      },
      {
        href: "/dashboard/reports",
        label: "Relatórios",
        icon: <FileText className='w-6 h-6' />,
        category: "Professional",
        badge: "Pro"
      },
      {
        href: "/dashboard/calendar",
        label: "Calendário",
        icon: <Calendar className='w-6 h-6' />,
        category: "Professional",
        badge: "Pro"
      },
      {
        href: "/dashboard/reminders",
        label: "Lembretes",
        icon: <Clock className='w-6 h-6' />,
        category: "Professional",
        badge: "Pro"
      },
      {
        href: "/dashboard/inventory",
        label: "Estoque",
        icon: <Package className='w-6 h-6' />,
        category: "Professional",
        badge: "Pro"
      },
      {
        href: "/dashboard/backup",
        label: "Backup",
        icon: <Database className='w-6 h-6' />,
        category: "Professional",
        badge: "Pro"
      }
    ];

    const premiumItems = [
      {
        href: "/dashboard/ai-treatment",
        label: "IA Tratamentos",
        icon: <Bot className='w-6 h-6' />,
        category: "Premium",
        badge: "Premium"
      },
      {
        href: "/dashboard/telemedicine",
        label: "Telemedicina",
        icon: <Video className='w-6 h-6' />,
        category: "Premium",
        badge: "Premium"
      },
      {
        href: "/dashboard/financial-analytics",
        label: "Analytics Financeiro",
        icon: <DollarSign className='w-6 h-6' />,
        category: "Premium",
        badge: "Premium"
      },
      {
        href: "/dashboard/audit",
        label: "Auditoria",
        icon: <Shield className='w-6 h-6' />,
        category: "Premium",
        badge: "Premium"
      },
      {
        href: "/dashboard/multi-location",
        label: "Multi-localização",
        icon: <Building2 className='w-6 h-6' />,
        category: "Premium",
        badge: "Premium"
      }
    ];

    const configItems = [
      {
        href: "/dashboard/profile",
        label: "Perfil",
        icon: <Settings className='w-6 h-6' />,
        category: "Configurações",
        badge: undefined
      },
      {
        href: "/dashboard/plans",
        label: "Planos",
        icon: <Banknote className='w-6 h-6' />,
        category: "Configurações",
        badge: undefined
      }
    ];

    switch (userPlan) {
      case 'PROFESSIONAL':
        return [...baseItems, ...professionalItems, ...configItems];
      case 'PREMIUM':
        return [...baseItems, ...professionalItems, ...premiumItems, ...configItems];
      default:
        return [...baseItems, ...configItems];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className='flex min-h-screen w-full'>

      <aside
        className={clsx("flex flex-col border-r bg-background transition-all duration-300 p-4 h-full", {
          "w-20": isCollapsed,
          "w-64": !isCollapsed,
          "hidden md:flex md:fixed": true
        })}
      >
        <div className='mb-6 mt-4'>
          {!isCollapsed && (
            <Image
              src="/logo-odonto.png"
              alt="Logo do odontopro"
              width={150}
              height={50}
              priority
              quality={100}
            />
          )}
        </div>

        <Button
          className='bg-gray-100 hover:bg-gray-50 text-zinc-900 self-end mb-2'
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {!isCollapsed ? <ChevronLeft className='w-12 h-12' /> : <ChevronRight className='w-12 h-12' />}
        </Button>


        {/* Mostrar apenas quando a sidebar está recolhida */}
        {isCollapsed && (
          <nav className='flex flex-col gap-1 overflow-hidden mt-2'>
            {navigationItems.slice(0, 6).map((item) => (
              <SidebarLink
                key={item.href}
                href={item.href}
                label={item.label}
                pathname={pathname}
                isCollapsed={isCollapsed}
                icon={item.icon}
              />
            ))}
          </nav>
        )}

        <Collapsible open={!isCollapsed}>
          <CollapsibleContent>
            <nav className='flex flex-col gap-1 overflow-hidden'>
              {/* Agrupar itens por categoria */}
              {['Painel', 'Professional', 'Premium', 'Configurações'].map((category) => {
                const categoryItems = navigationItems.filter(item => item.category === category);
                if (categoryItems.length === 0) return null;

                return (
                  <div key={category}>
                    <span className='text-sm text-gray-400 font-medium mt-4 mb-1 uppercase first:mt-1'>
                      {category === 'Professional' ? 'Professional' : 
                       category === 'Premium' ? 'Premium' : category}
                    </span>
                    {categoryItems.map((item) => (
                      <SidebarLink
                        key={item.href}
                        href={item.href}
                        label={item.label}
                        pathname={pathname}
                        isCollapsed={isCollapsed}
                        icon={item.icon}
                        badge={item.badge}
                      />
                    ))}
                  </div>
                );
              })}
            </nav>
          </CollapsibleContent>
        </Collapsible>
      </aside>

      <div className={clsx("flex flex-1 flex-col transition-all duration-300", {
        "md:ml-20": isCollapsed,
        "md:ml-64": !isCollapsed
      })}>

        <header
          className='md:hidden flex items-center justify-between border-b px-2 md:px-6 h-14 z-10 sticky top-0 bg-white'
        >
          <Sheet>
            <div className='flex items-center gap-4'>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className='md:hidden'
                  onClick={() => setIsCollapsed(false)}
                >
                  <List className='w-5 h-5' />
                </Button>
              </SheetTrigger>

              <h1 className='text-base md:text-lg font-semibold'>
                Menu OdontoPRO
              </h1>
            </div>

            <SheetContent side="right" className='sm:max-w-xs text-black'>
              <SheetTitle>OdontoPRO</SheetTitle>
              <SheetDescription>
                Menu administrativo
              </SheetDescription>

              <nav className='grid gap-2 text-base pt-5'>
                {navigationItems.map((item) => (
                  <SidebarLink
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    pathname={pathname}
                    isCollapsed={isCollapsed}
                    icon={item.icon}
                    badge={item.badge}
                  />
                ))}
              </nav>
            </SheetContent>
          </Sheet>

        </header>

        <main className='flex-1 py-4 px-2 md:p-6'>
          {children}
        </main>

      </div>

    </div>
  )
}


interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  pathname: string;
  isCollapsed: boolean;
  badge?: string;
}

function SidebarLink({ href, icon, isCollapsed, label, pathname, badge }: SidebarLinkProps) {
  return (
    <Link href={href}>
      <div
        className={clsx("flex items-center justify-between gap-2 px-3 py-2 rounded-md transition-colors", {
          "text-white bg-red-500": pathname === href,
          "text-gray-700 hover:bg-gray-100": pathname !== href,
        })}
      >
        <div className="flex items-center gap-2">
          <span className='w-6 h-6'>{icon}</span>
          {!isCollapsed && <span>{label}</span>}
        </div>
        {!isCollapsed && badge && (
          <span className={clsx("px-2 py-0.5 rounded-full text-xs font-medium", {
            "bg-red-100 text-red-800": badge === "Premium",
            "bg-blue-100 text-blue-800": badge === "Pro",
          })}>
            {badge}
          </span>
        )}
      </div>
    </Link>
  )
}