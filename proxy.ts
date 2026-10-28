import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const proxy = (request: NextRequest) => {
  const token = request.cookies.get("tech-events-session")?.value;
  const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");

  if (isDashboardRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: "/dashboard/:path*",
};
