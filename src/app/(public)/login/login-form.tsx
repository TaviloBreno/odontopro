"use client"

import { FormEvent, useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface LoginFormProps {
  googleEnabled: boolean
  githubEnabled: boolean
  testLoginEnabled: boolean
}

export function LoginForm({
  googleEnabled,
  githubEnabled,
  testLoginEnabled,
}: LoginFormProps) {
  const router = useRouter()
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleTestLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const result = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
      callbackUrl: "/dashboard",
    })

    setIsSubmitting(false)

    if (!result || result.error) {
      setError("E-mail ou senha inválidos. Confira os dados de acesso de teste.")
      return
    }

    router.push(result.url ?? "/dashboard")
    router.refresh()
  }

  async function handleOAuthLogin(provider: "google" | "github") {
    setError("")

    try {
      await signIn(provider, { redirectTo: "/dashboard" })
    } catch {
      setError(
        "Não foi possível entrar com esse provedor. Use o acesso de teste local, se disponível."
      )
    }
  }

  return (
    <div className="mt-6 space-y-5">
      {googleEnabled && (
        <Button
          className="w-full"
          type="button"
          onClick={() => handleOAuthLogin("google")}
        >
          Continuar com Google
        </Button>
      )}

      {githubEnabled && (
        <Button
          className="w-full"
          type="button"
          variant="outline"
          onClick={() => handleOAuthLogin("github")}
        >
          Continuar com GitHub
        </Button>
      )}

      {!googleEnabled && !githubEnabled && (
        <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-900">
          Login Google/GitHub não está configurado. O acesso de teste local
          continua disponível abaixo.
        </p>
      )}

      {testLoginEnabled && (
        <form className="space-y-4 border-t pt-5" onSubmit={handleTestLogin}>
          <div>
            <h2 className="font-semibold">Acesso de teste local</h2>
            <p className="mt-1 text-sm text-gray-600">
              Disponível somente durante a execução em desenvolvimento.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          <Button className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar com usuário de teste"}
          </Button>
        </form>
      )}

      {!testLoginEnabled && !googleEnabled && !githubEnabled && (
        <p className="text-sm text-red-600">
          Nenhum método de login está configurado. Configure o Google/GitHub ou
          habilite as credenciais locais de teste em desenvolvimento.
        </p>
      )}

      {error && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
