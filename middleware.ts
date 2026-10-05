import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET })
  const pathname = request.nextUrl.pathname

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (token.role === "EMPLOYEE" && pathname !== "/dashboard/employee") {
    return NextResponse.redirect(new URL("/dashboard/employee", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
