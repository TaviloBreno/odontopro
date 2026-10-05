import NextAuth from "next-auth"
import prisma from './prisma'
import { PrismaAdapter } from "@auth/prisma-adapter"
import { Adapter } from "next-auth/adapters"
import GitHub from "next-auth/providers/github"
import Google from 'next-auth/providers/google'
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { authorizeCredentials } from "@/lib/credentials-auth"
import { getDemoCredentials } from "@/lib/demo-credentials"

const hasGoogleCredentials = Boolean(
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
)
const hasGitHubCredentials = Boolean(
  process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
)
const testAccounts = getDemoCredentials(process.env)

const credentialsProvider = Credentials({
  id: "credentials",
  name: "E-mail e senha",
  credentials: {
    email: { label: "E-mail", type: "email" },
    password: { label: "Senha", type: "password" },
  },
  async authorize(credentials) {
    return authorizeCredentials(credentials, {
      findUser: (email) => prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          status: true,
          role: true,
          clinicOwnerId: true,
          createdAt: true,
          password: true,
          subscription: { select: { plan: true } },
        },
      }),
      comparePassword: bcrypt.compare,
      demoCredentials: testAccounts,
    })
  },
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  trustHost: true,
  session: { strategy: "jwt" },
  providers: [
    ...(hasGoogleCredentials ? [Google] : []),
    ...(hasGitHubCredentials ? [GitHub] : []),
    credentialsProvider,
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        const storedUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            role: true,
            clinicOwnerId: true,
            createdAt: true,
            subscription: { select: { plan: true } },
          },
        })
        token.role =
          storedUser?.role ?? (user.role === "EMPLOYEE" ? "EMPLOYEE" : "ADMIN")
        token.clinicOwnerId =
          storedUser?.clinicOwnerId ??
          (typeof user.clinicOwnerId === "string" ? user.clinicOwnerId : null)
        token.createdAt = (
          storedUser?.createdAt ??
          ("createdAt" in user && user.createdAt instanceof Date
            ? user.createdAt
            : new Date())
        ).toISOString()
        token.plan = storedUser?.subscription?.plan ?? user.plan ?? null
      }

      return token
    },
    session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = String(token.id)
        session.user.role = token.role === "EMPLOYEE" ? "EMPLOYEE" : "ADMIN"
        session.user.clinicOwnerId =
          typeof token.clinicOwnerId === "string" ? token.clinicOwnerId : null
        session.user.plan =
          typeof token.plan === "string" ? token.plan : null
        session.user.createdAt = new Date(
          typeof token.createdAt === "string"
            ? token.createdAt
            : Date.now()
        )
      }

      return session
    },
  },
})