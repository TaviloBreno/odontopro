"use server"

import { redirect } from "next/navigation"

type LoginType = "google" | "github"

export async function handleRegister(provider: LoginType) {
  // Redirect to the NextAuth sign in page with the provider
  redirect(`/api/auth/signin/${provider}?callbackUrl=/dashboard`)
}