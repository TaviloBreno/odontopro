import { getServerSession } from "next-auth"
import { authOptions } from "./auth"

export default function getSession() {
  return getServerSession(authOptions)
}