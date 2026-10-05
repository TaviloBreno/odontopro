import type { UserRole } from "@prisma/client"
import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    role: UserRole
    clinicOwnerId: string | null
    createdAt: Date
  }

  interface Session {
    user: DefaultSession["user"] & {
      id: string
      role: UserRole
      clinicOwnerId: string | null
      createdAt: Date
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: UserRole
    clinicOwnerId?: string | null
    createdAt?: string
  }
}
