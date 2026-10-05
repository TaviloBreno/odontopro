import { getToken } from "next-auth/jwt"
import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (process.env.NODE_ENV === "production" && isDemoRoute(pathname)) {
    return new NextResponse(null, { status: 404 })
  }

  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next()
  }

  const token = await getToken({ req: request, secret: process.env.AUTH_SECRET })
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (token.role === "EMPLOYEE" && pathname !== "/dashboard/employee") {
    return NextResponse.redirect(new URL("/dashboard/employee", request.url))
  }

  return NextResponse.next()
}

function isDemoRoute(pathname: string) {
  return [
    "/debug",
    "/simple-test",
    "/test",
    "/test-auth",
    "/test-clinicas",
    "/test-login",
    "/checkout/test",
  ].includes(pathname) || pathname === "/demo" || pathname.startsWith("/demo/")
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/debug",
    "/simple-test",
    "/test",
    "/test-auth",
    "/test-clinicas",
    "/test-login",
    "/demo/:path*",
    "/checkout/test",
  ],
}
