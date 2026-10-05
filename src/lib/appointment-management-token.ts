import { createHash } from "node:crypto"

export function isAppointmentManagementToken(value: string) {
  return /^[A-Za-z0-9_-]{43}$/.test(value)
}

export function hashAppointmentManagementToken(value: string) {
  return createHash("sha256").update(value).digest("hex")
}
