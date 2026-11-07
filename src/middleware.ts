import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "dev-secret-change-me-32-chars-minimum!!");

async function getRole(req: NextRequest) {
  const token = req.cookies.get("grantly_session")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return (payload.role as string) || null;
  } catch { return null; }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const role = await getRole(req);
  const isProtected = pathname.startsWith("/student") || pathname.startsWith("/admin") || pathname.startsWith("/provider");
  if (isProtected && !role) {
    const url = req.nextUrl.clone(); url.pathname = "/login"; url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  if (pathname.startsWith("/admin") && role !== "ADMIN") return NextResponse.redirect(new URL(role ? "/" : "/login", req.url));
  if (pathname.startsWith("/provider") && role !== "PROVIDER" && role !== "ADMIN") return NextResponse.redirect(new URL(role ? "/" : "/login", req.url));
  if (pathname.startsWith("/student") && role !== "STUDENT" && role !== "ADMIN") return NextResponse.redirect(new URL(role ? "/" : "/login", req.url));
  return NextResponse.next();
}

export const config = { matcher: ["/student/:path*", "/admin/:path*", "/provider/:path*"] };
