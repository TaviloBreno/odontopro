"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function PlatformSignOutButton() {
  return (
    <Button variant="outline" onClick={() => signOut({ redirectTo: "/" })}>
      Sair
    </Button>
  )
}
