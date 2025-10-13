import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import prisma from "./prisma"

// Função para verificar se as credenciais são válidas
const hasValidCredentials = (clientId?: string, clientSecret?: string) => {
  return clientId && 
         clientSecret && 
         clientId !== "your-google-client-id" && 
         clientId !== "your-github-client-id" &&
         clientSecret !== "your-google-client-secret" &&
         clientSecret !== "your-github-client-secret"
}

const providers = []

// Provider de credenciais (email/senha)
providers.push(CredentialsProvider({
  name: "credentials",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" }
  },
  async authorize(credentials) {
    if (!credentials?.email || !credentials?.password) {
      return null
    }

    // Usuário de teste para desenvolvimento (funciona sem banco de dados)
    if (credentials.email === 'dr.joao@teste.com' && credentials.password === '123456') {
      return {
        id: 'test-user-123',
        email: 'dr.joao@teste.com',
        name: 'Dr. João Silva',
      }
    }

    if (credentials.email === 'admin@odontopro.com' && credentials.password === 'admin123') {
      return {
        id: 'admin-user-456',
        email: 'admin@odontopro.com',
        name: 'Administrador OdontoPro',
      }
    }

    // Tentar buscar no banco de dados se configurado
    try {
      const user = await prisma.user.findUnique({
        where: { email: credentials.email }
      })

      if (!user || !user.password) {
        return null
      }

      const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

      if (!isPasswordValid) {
        return null
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
      }
    } catch (error) {
      console.log("Database not available, using test users only:", error)
      return null
    }
  }
}))

// Só adiciona o Google se as credenciais estiverem configuradas
if (hasValidCredentials(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET)) {
  providers.push(GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }))
}

// Só adiciona o GitHub se as credenciais estiverem configuradas  
if (hasValidCredentials(process.env.GITHUB_CLIENT_ID, process.env.GITHUB_CLIENT_SECRET)) {
  providers.push(GitHubProvider({
    clientId: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  }))
}

export const authOptions: NextAuthOptions = {
  providers,
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Redirecionar para dashboard após login bem-sucedido
      if (url === "/dashboard" || url.includes("/dashboard")) {
        return `${baseUrl}/dashboard`
      }
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return baseUrl
    },
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET,
}

// Função auth para ser usada em server components
import { getServerSession } from "next-auth"

export async function auth() {
  return await getServerSession(authOptions)
}