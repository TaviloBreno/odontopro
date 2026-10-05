import { vi } from "vitest"

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

vi.mock("@/lib/auth", () => ({
  auth: vi.fn(),
}))
