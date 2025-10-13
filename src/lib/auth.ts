import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"

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