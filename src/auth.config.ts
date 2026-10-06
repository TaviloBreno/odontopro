import type { NextAuthConfig } from "next-auth"
import { isUserRole } from "@/lib/user-roles"

const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = String(token.id)
        session.user.role = isUserRole(token.role) ? token.role : "ADMIN"
        session.user.clinicOwnerId =
          typeof token.clinicOwnerId === "string" ? token.clinicOwnerId : null
        session.user.plan = typeof token.plan === "string" ? token.plan : null
        session.user.createdAt = new Date(
          typeof token.createdAt === "string" ? token.createdAt : Date.now(),
        )
      }
      return session
    },
  },
} satisfies NextAuthConfig

export default authConfig
