"use client"

import { Button } from "@/components/ui/button"
import { LinkIcon } from "lucide-react"
import { toast } from 'sonner'


export function ButtonCopyLink({ userId }: { userId: string }) {

  async function handleCopyLink() {
    await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_URL}/clinica/${userId}`)

    toast("Link de agendamento copiado com sucesso!")
  }

  return (
    <Button onClick={handleCopyLink}>
      <LinkIcon className="w-5 h-5" />
    </Button>
  )
}