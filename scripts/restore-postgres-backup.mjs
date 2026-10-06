import { spawnSync } from "node:child_process"
import { access, stat } from "node:fs/promises"
import path from "node:path"
import { parsePostgresConnection } from "./postgres-connection.mjs"

const backupFile = process.argv[2]
const restoreUrl = process.env.RESTORE_DATABASE_URL
if (!backupFile || !restoreUrl) {
  console.error("Uso: npm run db:backup:restore -- <arquivo.dump>; defina RESTORE_DATABASE_URL.")
  process.exit(1)
}

const absoluteBackupPath = path.resolve(backupFile)
await access(absoluteBackupPath)
if ((await stat(absoluteBackupPath)).size === 0) {
  console.error("O arquivo de backup está vazio.")
  process.exit(1)
}

let connection
try {
  connection = parsePostgresConnection(restoreUrl)
} catch (error) {
  console.error(error instanceof Error ? error.message : "RESTORE_DATABASE_URL inválida.")
  process.exit(1)
}

if (!/(?:^|[_-])(?:test|restore)(?:$|[_-])/i.test(connection.database)) {
  console.error("A restauração de verificação só pode usar um banco com 'test' ou 'restore' no nome.")
  process.exit(1)
}

const preflight = spawnSync(
  "pg_restore",
  ["--list", absoluteBackupPath],
  { encoding: "utf8", env: connection.environment },
)
if (preflight.error || preflight.status !== 0) {
  console.error("O arquivo não é um dump PostgreSQL legível.")
  process.exit(1)
}

const restored = spawnSync(
  "pg_restore",
  [
    ...connection.arguments,
    "--clean",
    "--if-exists",
    "--no-owner",
    "--no-acl",
    absoluteBackupPath,
  ],
  { env: connection.environment, stdio: "inherit" },
)
if (restored.error || restored.status !== 0) {
  console.error("A restauração de verificação falhou.")
  process.exit(restored.status ?? 1)
}

console.info(JSON.stringify({
  event: "postgres.backup.restore_verified",
  database: connection.database,
  schema: connection.schema,
  verified: true,
}))
