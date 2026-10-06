"use client"

import { useState, useTransition } from "react"
import type { Plan, PlatformPlan } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { savePlatformPlan } from "./actions"

const planNames: Record<Plan, string> = {
  BASIC: "Básico",
  PROFESSIONAL: "Profissional",
  PREMIUM: "Premium",
}

type EditablePlan = Pick<
  PlatformPlan,
  | "key"
  | "name"
  | "description"
  | "monthlyPriceCents"
  | "previousPriceCents"
  | "features"
  | "stripePriceId"
  | "active"
>

export function PlanEditor({ plans }: { plans: EditablePlan[] }) {
  const [message, setMessage] = useState("")
  const [isPending, startTransition] = useTransition()

  function save(formData: FormData) {
    const key = formData.get("key") as Plan
    const name = String(formData.get("name") ?? "")
    const description = String(formData.get("description") ?? "")
    const monthlyPriceCents = Math.round(Number(formData.get("monthlyPriceCents")) * 100)
    const previousPriceInput = String(formData.get("previousPrice") ?? "").trim()
    const previousPriceCents = previousPriceInput
      ? Math.round(Number(previousPriceInput) * 100)
      : null
    const features = String(formData.get("features") ?? "")
      .split("\n")
      .map((feature) => feature.trim())
      .filter(Boolean)
    const stripePriceId = String(formData.get("stripePriceId") ?? "").trim() || null
    const active = formData.get("active") === "on"

    setMessage("")
    startTransition(async () => {
      const result = await savePlatformPlan({
        key,
        name,
        description,
        monthlyPriceCents,
        previousPriceCents,
        features,
        stripePriceId,
        active,
      })
      setMessage(result.error ?? result.data ?? "")
    })
  }

  return (
    <section className="grid gap-5 lg:grid-cols-3">
      {plans.map((plan) => (
        <form
          key={plan.key}
          action={save}
          className="space-y-4 rounded-lg border bg-white p-5 shadow-sm"
        >
          <input type="hidden" name="key" value={plan.key} />
          <div>
            <h2 className="text-xl font-semibold">{planNames[plan.key]}</h2>
            <p className="text-sm text-gray-500">
              Chave interna fixa para manter a compatibilidade com assinaturas e limites.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${plan.key}-name`}>Nome comercial</Label>
            <Input id={`${plan.key}-name`} name="name" defaultValue={plan.name} maxLength={80} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${plan.key}-description`}>Descrição</Label>
            <Textarea id={`${plan.key}-description`} name="description" defaultValue={plan.description} maxLength={300} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor={`${plan.key}-price`}>Preço mensal (R$)</Label>
              <Input
                id={`${plan.key}-price`}
                name="monthlyPriceCents"
                type="number"
                min="0"
                step="0.01"
                defaultValue={(plan.monthlyPriceCents / 100).toFixed(2)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${plan.key}-previous`}>Preço anterior (R$)</Label>
              <Input
                id={`${plan.key}-previous`}
                name="previousPrice"
                type="number"
                min="0"
                step="0.01"
                defaultValue={plan.previousPriceCents === null ? "" : (plan.previousPriceCents / 100).toFixed(2)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${plan.key}-features`}>Recursos (um por linha)</Label>
            <Textarea
              id={`${plan.key}-features`}
              name="features"
              defaultValue={plan.features.join("\n")}
              rows={5}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${plan.key}-stripe`}>Stripe Price ID</Label>
            <Input
              id={`${plan.key}-stripe`}
              name="stripePriceId"
              defaultValue={plan.stripePriceId ?? ""}
              maxLength={191}
              placeholder="price_..."
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="active" defaultChecked={plan.active} />
            Disponível para clínicas
          </label>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Salvando..." : "Salvar plano"}
          </Button>
          {message && <p role="status" className="text-sm text-gray-700">{message}</p>}
        </form>
      ))}
    </section>
  )
}
