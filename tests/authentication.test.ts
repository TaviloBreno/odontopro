import bcrypt from "bcryptjs"
import { describe, expect, it, vi } from "vitest"
import { authorizeCredentials } from "@/lib/credentials-auth"
import { getDemoCredentials } from "@/lib/demo-credentials"

const admin = {
  id: "admin-1",
  name: "Admin",
  email: "admin@example.test",
  image: null,
  status: true,
  role: "ADMIN" as const,
  clinicOwnerId: null,
  createdAt: new Date("2026-01-01T00:00:00Z"),
  password: null,
  subscription: { plan: "BASIC" },
}

describe("credential authentication", () => {
  it("normalizes email and authenticates a bcrypt password", async () => {
    const hash = await bcrypt.hash("correct-password", 4)
    const findUser = vi.fn().mockResolvedValue({ ...admin, password: hash })

    const user = await authorizeCredentials(
      { email: "  ADMIN@EXAMPLE.TEST ", password: "correct-password" },
      { findUser, comparePassword: bcrypt.compare, demoCredentials: [] },
    )

    expect(findUser).toHaveBeenCalledWith("admin@example.test")
    expect(user).toMatchObject({ id: "admin-1", role: "ADMIN", plan: "BASIC" })
    expect(user).not.toHaveProperty("password")
  })

  it("rejects incorrect passwords and users without stored credentials", async () => {
    const hash = await bcrypt.hash("correct-password", 4)
    const dependencies = {
      findUser: vi.fn().mockResolvedValue({ ...admin, password: hash }),
      comparePassword: bcrypt.compare,
      demoCredentials: [],
    }

    await expect(authorizeCredentials(
      { email: admin.email, password: "wrong-password" },
      dependencies,
    )).resolves.toBeNull()
    await expect(authorizeCredentials(
      { email: admin.email, password: "password" },
      { ...dependencies, findUser: vi.fn().mockResolvedValue(admin) },
    )).resolves.toBeNull()
  })

  it("rejects missing or inactive users, malformed input and oversized passwords", async () => {
    const dependencies = {
      findUser: vi.fn().mockResolvedValue(null),
      comparePassword: vi.fn(),
      demoCredentials: [],
    }

    await expect(authorizeCredentials(
      { email: "missing@example.test", password: "password" },
      dependencies,
    )).resolves.toBeNull()
    await expect(authorizeCredentials(
      { email: "", password: "password" },
      dependencies,
    )).resolves.toBeNull()
    await expect(authorizeCredentials(
      { email: admin.email, password: "x".repeat(257) },
      dependencies,
    )).resolves.toBeNull()
    await expect(authorizeCredentials(
      { email: "employee@example.test", password: "password" },
      {
        ...dependencies,
        findUser: vi.fn().mockResolvedValue({
          ...admin,
          role: "EMPLOYEE",
          status: false,
        }),
      },
    )).resolves.toBeNull()
    await expect(authorizeCredentials(
      { email: admin.email, password: "password" },
      {
        ...dependencies,
        findUser: vi.fn().mockResolvedValue({ ...admin, status: false }),
      },
    )).resolves.toBeNull()
  })

  it("accepts demo credentials only when development and the explicit flag are enabled", async () => {
    const developmentAccounts = getDemoCredentials({
      NODE_ENV: "development",
      TEST_LOGIN_ENABLED: "true",
      TEST_LOGIN_EMAIL: " DEMO@example.test ",
      TEST_LOGIN_PASSWORD: "demo-password",
    })
    expect(developmentAccounts).toEqual([
      { email: "demo@example.test", password: "demo-password" },
    ])

    expect(getDemoCredentials({
      NODE_ENV: "production",
      TEST_LOGIN_ENABLED: "true",
      TEST_LOGIN_EMAIL: "demo@example.test",
      TEST_LOGIN_PASSWORD: "demo-password",
    })).toEqual([])
    expect(getDemoCredentials({
      NODE_ENV: "development",
      TEST_LOGIN_ENABLED: "false",
      TEST_LOGIN_EMAIL: "demo@example.test",
      TEST_LOGIN_PASSWORD: "demo-password",
    })).toEqual([])

    const user = await authorizeCredentials(
      { email: "DEMO@example.test", password: "demo-password" },
      {
        findUser: vi.fn().mockResolvedValue(admin),
        comparePassword: vi.fn(),
        demoCredentials: developmentAccounts,
      },
    )
    expect(user?.id).toBe(admin.id)
  })
})
