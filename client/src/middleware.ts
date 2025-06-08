import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("access_token")?.value;

  // ถ้าไม่มี token, redirect ไป login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/register")
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ถ้ามี token ให้ผ่านได้
  return NextResponse.next();
}

// Apply middleware เฉพาะเส้นทางที่ต้องการ
export const config = {
  matcher: ["/", "/login", "/register"],
};
