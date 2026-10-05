import NextAuth from "next-auth"
import prisma from './prisma'
import { PrismaAdapter } from "@auth/prisma-adapter"
import { Adapter } from "next-auth/adapters"
import GitHub from "next-auth/providers/github"
import Google from 'next-auth/providers/google'
import Credentials from "next-auth/providers/credentials"
import { timingSafeEqual } from "node:crypto"
import bcrypt from "bcryptjs"

const hasGoogleCredentials = Boolean(
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
)
const hasGitHubCredentials = Boolean(
  process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
)
const testLoginEnabled =
  process.env.NODE_ENV === "development" &&
  process.env.TEST_LOGIN_ENABLED === "true"

const testAccounts = testLoginEnabled
  ? [
      {
        email: process.env.TEST_LOGIN_EMAIL?.trim().toLowerCase(),
        password: process.env.TEST_LOGIN_PASSWORD,
      },
      {
        email: process.env.TEST_EMPLOYEE_EMAIL?.trim().toLowerCase(),
        password: process.env.TEST_EMPLOYEE_PASSWORD,
      },
    ].filter(
      (account): account is { email: string; password: string } =>
        Boolean(account.email && account.password)
    )
  : []

const credentialsProvider = Credentials({
  id: "credentials",
  name: "E-mail e senha",
  credentials: {
    email: { label: "E-mail", type: "email" },
    password: { label: "Senha", type: "password" },
  },
  async authorize(credentials) {
    const email =
      typeof credentials?.email === "string"
        ? credentials.email.trim().toLowerCase()
        : ""
    const password =
      typeof credentials?.password === "string" ? credentials.password : ""
    if (!email || !password || password.length > 256) {
      return null
    }

    const providedPassword = Buffer.from(password)
    const isTestAccount = testAccounts.some((candidate) => {
      const configuredPassword = Buffer.from(candidate.password)
      return (
        candidate.email === email &&
        providedPassword.length === configuredPassword.length &&
        timingSafeEqual(providedPassword, configuredPassword)
      )
    })

    const user = await prisma.user.findUnique({
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
    })

    if (!user?.status) {
      return null
    }

    if (
      !isTestAccount &&
      (!user.password || !(await bcrypt.compare(password, user.password)))
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