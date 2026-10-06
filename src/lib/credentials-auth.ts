import { timingSafeEqual } from "node:crypto"
import type { DemoCredential } from "@/lib/demo-credentials"
import type { UserRole } from "@prisma/client"

interface CredentialUser {
  id: string
  name: string | null
  email: string
  image: string | null
  status: boolean
  role: UserRole
  clinicOwnerId: string | null
  createdAt: Date
  password: string | null
  subscription: { plan: string } | null
}

export interface CredentialsAuthDependencies {
  findUser(email: string): Promise<CredentialUser | null>
  comparePassword(password: string, hash: string): Promise<boolean>
  demoCredentials: readonly DemoCredential[]
}

export async function authorizeCredentials(
  credentials: Partial<Record<"email" | "password", unknown>> | undefined,
  dependencies: CredentialsAuthDependencies,
) {
  const email =
    typeof credentials?.email === "string"
      ? credentials.email.trim().toLowerCase()
      : ""
  const password =
    typeof credentials?.password === "string" ? credentials.password : ""
  if (!email || !password || password.length > 256) return null

  const providedPassword = Buffer.from(password)
  const isDemoCredential = dependencies.demoCredentials.some((candidate) => {
    const configuredPassword = Buffer.from(candidate.password)
    return (
      candidate.email === email &&
      providedPassword.length === configuredPassword.length &&
      timingSafeEqual(providedPassword, configuredPassword)
    )
  })

  const user = await dependencies.findUser(email)
  if (!user || !user.status) return null

  if (
    !isDemoCredential &&
    (!user.password || !(await dependencies.comparePassword(password, user.password)))
  ) {
    return null
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    role: user.role,
    clinicOwnerId: user.clinicOwnerId,
    createdAt: user.createdAt,
    plan: user.subscription?.plan ?? null,
  }
}
