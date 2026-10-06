import type { NextAuthConfig } from "next-auth"

const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = String(token.id)
        session.user.role = token.role === "EMPLOYEE" ? "EMPLOYEE" : "ADMIN"
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
