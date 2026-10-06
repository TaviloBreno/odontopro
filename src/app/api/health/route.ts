import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { logger } from "@/lib/structured-logger"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`
    return NextResponse.json(
      { status: "ok", checks: { database: "ok" } },
      { headers: { "Cache-Control": "no-store" } },
    )
  } catch (error) {
    logger.error("health.database.failed", error)
    return NextResponse.json(
      { status: "unavailable", checks: { database: "unavailable" } },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    )
  }
}
