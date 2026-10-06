import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { LoginForm } from "./login-form"

export default async function LoginPage() {
  const session = await auth()

  if (session) {
    redirect("/dashboard")
  }

  const testLoginEnabled =
    process.env.NODE_ENV === "development" &&
    process.env.TEST_LOGIN_ENABLED === "true" &&
    Boolean(process.env.TEST_LOGIN_EMAIL && process.env.TEST_LOGIN_PASSWORD)

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-20">
      <div className="mx-auto w-full max-w-md rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Acessar o portal da clínica</h1>
        <p className="mt-2 text-sm text-gray-600">
          Entre com sua conta de administrador, funcionário ou cliente.
        </p>
        <LoginForm
          googleEnabled={Boolean(
            process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
          )}
          githubEnabled={Boolean(
            process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
          )}
          testLoginEnabled={testLoginEnabled}
        />
      </div>
    </main>
  )
}
