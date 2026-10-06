import { NextResponse } from "next/server"
import NextAuth from "next-auth"
import authConfig from "@/auth.config"

const { auth } = NextAuth(authConfig)

export default auth((request) => {
  const pathname = request.nextUrl.pathname

  if (process.env.NODE_ENV === "production" && isDemoRoute(pathname)) {
    return new NextResponse(null, { status: 404 })
  }

  if (!pathname.startsWith("/dashboard")) {
    if (pathname.startsWith("/platform")) {
      const role = request.auth?.user?.role
      if (!request.auth?.user?.id) {
        return NextResponse.redirect(new URL("/login", request.url))
      }
      if (role !== "PLATFORM_ADMIN") {
        const dashboard = role === "CLIENT"
          ? "/dashboard/client"
          : role === "EMPLOYEE"
            ? "/dashboard/employee"
            : "/dashboard"
        return NextResponse.redirect(new URL(dashboard, request.url))
      }
    }
    return NextResponse.next()
  }

  const session = request.auth
  if (!session?.user?.id) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  if (session.user.role === "EMPLOYEE" && pathname !== "/dashboard/employee") {
    return NextResponse.redirect(new URL("/dashboard/employee", request.url))
  }
  if (session.user.role === "CLIENT" && pathname !== "/dashboard/client") {
    return NextResponse.redirect(new URL("/dashboard/client", request.url))
  }
  if (session.user.role === "PLATFORM_ADMIN") {
    return NextResponse.redirect(new URL("/platform/plans", request.url))
  }

  return NextResponse.next()
})

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
    "/platform/:path*",
  ],
}
