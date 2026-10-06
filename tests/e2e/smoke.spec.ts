import { expect, test } from "@playwright/test"

test("home lista a clínica pública e abre a página de reserva", async ({ page }) => {
  await page.goto("/")
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR")
  await expect(page.getByRole("heading", { name: /encontre os melhores profissionais/i }))
    .toBeVisible()
  await expect(page.getByRole("heading", { name: "Clínica E2E" })).toBeVisible()

  await page.goto("/clinica/e2e-test-clinic")
  await expect(page.getByRole("heading", { name: "Clínica E2E" })).toBeVisible()
  await page.getByRole("combobox").first().click()
  await expect(page.getByRole("option", { name: /Consulta automatizada/ })).toBeVisible()
  await page.goto("/privacy")
  await expect(page.getByRole("heading", { name: "Aviso de Privacidade" })).toBeVisible()
  await page.goto("/terms")
  await expect(page.getByRole("heading", { name: "Termos de Uso" })).toBeVisible()
  await page.goto("/support")
  await expect(page.getByRole("heading", { name: "Suporte" })).toBeVisible()
  await page.goto("/about")
  await expect(page.getByRole("heading", { name: "Sobre a plataforma" })).toBeVisible()
  await page.goto("/contact")
  await expect(page.getByRole("heading", { name: "Contato", exact: true })).toBeVisible()
  await expect(page.getByTitle(/Rua Manoel Idelfonso/)).toBeVisible()
  await expect(page.getByRole("link", { name: "Abrir rotas no Google Maps" }))
    .toHaveAttribute("href", /google\.com\/maps\/search/)
})

test("login rejeita senha incorreta e autentica no dashboard", async ({ page }) => {
  test.setTimeout(120_000)
  await page.goto("/auth/signin")
  const email = page.locator('input[type="email"]')
  const password = page.locator('input[type="password"]')
  const submit = page.getByRole("button", { name: "Entrar", exact: true })
  await email.fill("e2e-clinic@example.test")
  await password.fill("senha-incorreta")
  await submit.click()
  await expect(submit).toBeEnabled({ timeout: 30_000 })
  await expect(page.getByText("Email ou senha incorretos")).toBeVisible()

  await password.fill("e2e-test-password")
  await submit.click()
  await expect.poll(async () => {
    const session = await page.request.get("/api/auth/session")
    const sessionData = await session.json() as { user?: { id?: string } } | null
    return sessionData?.user?.id
  }, { timeout: 30_000 }).toBe("e2e-test-clinic")
  await page.goto("/dashboard")
  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(page.getByRole("link", { name: "Novo agendamento" })).toBeVisible()
})

test("dashboard redireciona visitante sem sessão para login", async ({ page }) => {
  await page.goto("/dashboard")
  await expect(page).toHaveURL(/\/login$/)
})
