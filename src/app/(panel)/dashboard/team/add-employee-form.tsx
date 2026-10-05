"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createEmployee } from "../_actions/create-employee"

export function AddEmployeeForm() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitting(true)
    const form = event.currentTarget
    const data = new FormData(form)
    const result = await createEmployee({ email: String(data.get("email") ?? "") })
    setSubmitting(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success(result.data)
    form.reset()
    router.refresh()
  }

  return (
    <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={handleSubmit}>
      <div className="flex-1 space-y-2">
        <Label htmlFor="employee-email">E-mail do funcionário</Label>
        <Input
          id="employee-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
          placeholder="funcionario@clinica.com"
        />
      </div>
      <Button type="submit" disabled={submitting}>
        {submitting ? "Adicionando..." : "Adicionar funcionário"}
      </Button>
    </form>
  )
}
