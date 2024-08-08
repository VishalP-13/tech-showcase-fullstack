import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const url = new URL("/login", req.url);
    // url.searchParams.set("callbackUrl", req.url); // Optionally, set the callback URL for post-login redirection
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/users/:path*", "/posts/:path*", "/user:path", "/:path"],
};
