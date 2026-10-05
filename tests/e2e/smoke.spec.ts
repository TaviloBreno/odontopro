import { expect, test } from "@playwright/test"

test("home lista a clínica pública e abre a página de reserva", async ({ page }) => {
  await page.goto("/")
  await expect(page.getByRole("heading", { name: /encontre os melhores profissionais/i }))
    .toBeVisible()
  await expect(page.getByRole("heading", { name: "Clínica E2E" })).toBeVisible()

  await page.goto("/clinica/e2e-test-clinic")
  await expect(page.getByRole("heading", { name: "Clínica E2E" })).toBeVisible()
  await page.getByRole("combobox").first().click()
  await expect(page.getByRole("option", { name: /Consulta automatizada/ })).toBeVisible()
})

test("login rejeita senha incorreta e autentica no dashboard", async ({ page }) => {
  await page.goto("/auth/signin")
  await page.getByLabel("Email").fill("e2e-clinic@example.test")
  await page.getByLabel("Senha").fill("senha-incorreta")
  await page.getByRole("button", { name: "Entrar" }).click()
  await expect(page.getByText("Email ou senha incorretos")).toBeVisible()

  await page.getByLabel("Senha").fill("e2e-test-password")
  await page.getByRole("button", { name: "Entrar" }).click()
  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(page.getByRole("link", { name: "Novo agendamento" })).toBeVisible()
})

test("dashboard redireciona visitante sem sessão para login", async ({ page }) => {
  await page.goto("/dashboard")
  await expect(page).toHaveURL(/\/login$/)
})
