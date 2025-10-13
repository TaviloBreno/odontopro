"use client"

import { useState } from 'react'
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "../../../components/ui/button";
import { LogIn, Menu } from "lucide-react";
import { useSession } from 'next-auth/react'
import { handleRegister } from '../_actions/login'

export function Header() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "#profissionais", label: "Profissionais" },
  ]

  async function handleLogin() {
    try {
      console.log('Clicou no botão de login - redirecionando...')
      // Redirecionar diretamente para a página de login personalizada
      window.location.href = "/auth/signin"
    } catch (error) {
      console.error('Erro no login:', error)
    }
  }

  const handleScrollToSection = (href: string) => {
    const targetId = href.replace('#', '')
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
    setIsOpen(false)
  }

  const NavLinks = () => (
    <>
      {navItems.map((item) => (
        <Button
          onClick={() => handleScrollToSection(item.href)}
          key={item.href}
          className="bg-transparent hover:bg-transparent text-black shadow-none text-base font-medium hover:text-emerald-600 transition-colors cursor-pointer"
        >
          {item.label}
        </Button>
      ))}

      {status === 'loading' ? (
        <></>
      ) : session ? (
        <Link
          href="/dashboard"
          className='flex items-center justify-center gap-2 bg-zinc-900 text-white py-1 rounded-md px-4'
        >
          Acessar clinica
        </Link>
      ) : (
        <Button onClick={handleLogin}>
          <LogIn />
          Portal da clinica
        </Button>
      )}
    </>
  )



  return (
    <header
      className="fixed top-0 right-0 left-0 z-[999] py-4 px-6 bg-white"
    >
      <div className="container mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="text-3xl font-bold text-zinc-900"
        >
          Odonto<span className="text-emerald-500">PRO</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-4">
          <NavLinks />
        </nav>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button
              className="text-black hover:bg-transparent"
              variant="ghost"
              size="icon"
            >
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" className="w-[240px] sm:w-[300px] z-[9999]">
            <SheetTitle>Menu</SheetTitle>
            <SheetHeader></SheetHeader>

            <SheetDescription>
              Veja nossos links
            </SheetDescription>

            <nav className='flex flex-col space-y-4 mt-6'>
              <NavLinks />
            </nav>

          </SheetContent>

        </Sheet>
      </div>
    </header>
  )
}