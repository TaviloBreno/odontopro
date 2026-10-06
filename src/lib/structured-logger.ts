type LogLevel = "info" | "warn" | "error"

function writeLog(
  level: LogLevel,
  event: string,
  attributes: Record<string, string | number | boolean | undefined> = {},
  error?: unknown,
) {
  const safeAttributes = Object.fromEntries(
    Object.entries(attributes).filter(([, value]) => value !== undefined),
  )
  const record = {
    timestamp: new Date().toISOString(),
    level,
    event,
    ...safeAttributes,
    ...(error === undefined
      ? {}
      : { errorType: error instanceof Error ? error.name : "UnknownError" }),
  }
  const output = JSON.stringify(record)

  if (level === "error") {
    console.error(output)
  } else if (level === "warn") {
    console.warn(output)
  } else {
    console.info(output)
  }
}

export const logger = {
  info: (event: string, attributes?: Record<string, string | number | boolean | undefined>) =>
    writeLog("info", event, attributes),
  warn: (event: string, attributes?: Record<string, string | number | boolean | undefined>) =>
    writeLog("warn", event, attributes),
  error: (
    event: string,
    error?: unknown,
    attributes?: Record<string, string | number | boolean | undefined>,
  ) => writeLog("error", event, attributes, error),
}
