import { spawnSync } from "node:child_process"
import { config } from "dotenv"

config()

const sourceUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL
if (!sourceUrl) {
  console.error("Defina DATABASE_URL ou TEST_DATABASE_URL para executar os testes.")
  process.exit(1)
}

let testDatabaseUrl
try {
  const url = new URL(sourceUrl)
  const isLocalDatabase = ["localhost", "127.0.0.1", "::1"].includes(url.hostname)
  const databaseName = decodeURIComponent(url.pathname.slice(1)).toLowerCase()
  if (
    !isLocalDatabase &&
    (!process.env.TEST_DATABASE_URL || !databaseName.includes("test"))
  ) {
    console.error(
      "Por segurança, TEST_DATABASE_URL remoto deve apontar para um banco cujo nome contenha 'test'.",
    )
    process.exit(1)
  }
  url.searchParams.set("schema", "odontopro_test")
  testDatabaseUrl = url.toString()
} catch {
  console.error("A URL de conexão PostgreSQL para testes é inválida.")
  process.exit(1)
}

const env = {
  ...process.env,
  DATABASE_URL: testDatabaseUrl,
  NODE_ENV: "test",
  TEST_LOGIN_ENABLED: "false",
}

function runNode(args) {
  const result = spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    env,
    stdio: "inherit",
  })
  if (result.error) {
    console.error("Não foi possível iniciar o processo de teste:", result.error.message)
    process.exit(1)
  }
  if (result.status !== 0) process.exit(result.status ?? 1)
}

runNode(["node_modules/prisma/build/index.js", "migrate", "deploy"])
runNode(["node_modules/prisma/build/index.js", "migrate", "deploy"])
runNode(["node_modules/vitest/vitest.mjs", "run"])
runNode(["node_modules/next/dist/bin/next", "build"])
runNode([
  "node_modules/@playwright/test/cli.js",
  "test",
  "--config=playwright.config.ts",
  ...process.argv.slice(2),
])
