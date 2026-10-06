import { spawnSync } from "node:child_process"
import { homedir } from "node:os"
import path from "node:path"
import { mkdir, stat } from "node:fs/promises"
import { parsePostgresConnection } from "./postgres-connection.mjs"

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  console.error("Defina DATABASE_URL para criar o backup.")
  process.exit(1)
}

let connection
try {
  connection = parsePostgresConnection(connectionString)
} catch (error) {
  console.error(error instanceof Error ? error.message : "DATABASE_URL inválida.")
  process.exit(1)
}

const backupDirectory = path.resolve(
  process.env.BACKUP_DIR || path.join(homedir(), "odontopro-backups"),
)
const projectDirectory = path.resolve(".")
const relativeBackupPath = path.relative(projectDirectory, backupDirectory)
if (
  relativeBackupPath === "" ||
  (!relativeBackupPath.startsWith(`..${path.sep}`) && relativeBackupPath !== ".." && !path.isAbsolute(relativeBackupPath))
) {
  console.error("BACKUP_DIR precisa ficar fora da pasta do projeto.")
  process.exit(1)
}

await mkdir(backupDirectory, { recursive: true })
const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
const outputPath = path.join(backupDirectory, `odontopro-${connection.schema}-${timestamp}.dump`)
const result = spawnSync(
  "pg_dump",
  [
    ...connection.arguments,
    "--schema", connection.schema,
    "--format=custom",
    "--no-owner",
    "--no-acl",
    "--file", outputPath,
  ],
  { env: connection.environment, stdio: "inherit" },
)

if (result.error || result.status !== 0) {
  console.error("pg_dump falhou; backup não deve ser considerado válido.")
  process.exit(result.status ?? 1)
}

const backupStat = await stat(outputPath)
if (backupStat.size === 0) {
  console.error("O arquivo de backup está vazio.")
  process.exit(1)
}

const verification = spawnSync(
  "pg_restore",
  ["--list", outputPath],
  { encoding: "utf8", env: connection.environment },
)
if (verification.error || verification.status !== 0) {
  console.error("Não foi possível verificar o arquivo com pg_restore.")
  process.exit(1)
}

console.info(JSON.stringify({
  event: "postgres.backup.created",
  file: outputPath,
  bytes: backupStat.size,
  schema: connection.schema,
  verified: true,
}))
