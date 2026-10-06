export function parsePostgresConnection(connectionString) {
  const url = new URL(connectionString)
  if (!["postgres:", "postgresql:"].includes(url.protocol)) {
    throw new Error("A conexão precisa usar o protocolo PostgreSQL.")
  }

  const database = decodeURIComponent(url.pathname.replace(/^\//, ""))
  const schema = url.searchParams.get("schema") || "public"
  const environment = { ...process.env }
  if (url.password) environment.PGPASSWORD = decodeURIComponent(url.password)
  if (url.searchParams.has("sslmode")) {
    environment.PGSSLMODE = url.searchParams.get("sslmode")
  }
  if (url.searchParams.has("sslrootcert")) {
    environment.PGSSLROOTCERT = url.searchParams.get("sslrootcert")
  }

  return {
    database,
    schema,
    environment,
    arguments: [
      "--host", url.hostname,
      "--port", url.port || "5432",
      "--username", decodeURIComponent(url.username),
      "--dbname", database,
    ],
  }
}
