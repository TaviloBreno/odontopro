import type { UserRole } from "@prisma/client"

const userRoles: UserRole[] = ["ADMIN", "EMPLOYEE", "CLIENT", "PLATFORM_ADMIN"]

export function isUserRole(value: unknown): value is UserRole {
  return typeof value === "string" && userRoles.some((role) => role === value)
}
