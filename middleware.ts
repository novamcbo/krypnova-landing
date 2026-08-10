import { NextRequest, NextResponse } from "next/server";
import { isLocale, isLocalizedLocale, pathForLocale, type Locale } from "@/lib/i18n";

const COOKIE_NAME = "krypnova_locale";
const PUBLIC_FILE = /\.[^/]+$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const firstSegment = pathname.split("/").filter(Boolean)[0];
  const explicitLocale: Locale =
    firstSegment && isLocalizedLocale(firstSegment) ? firstSegment : "en";

  if (explicitLocale === "en") {
    const cookieLocale = request.cookies.get(COOKIE_NAME)?.value;
    if (cookieLocale && isLocale(cookieLocale) && cookieLocale !== "en") {
      const url = request.nextUrl.clone();
      url.pathname = pathForLocale(pathname, cookieLocale);
      return NextResponse.redirect(url);
    }
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-krypnova-locale", explicitLocale);
  const response = NextResponse.next({ request: { headers: requestHeaders } });

  if (explicitLocale !== "en") {
    response.cookies.set(COOKIE_NAME, explicitLocale, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
      secure: true,
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
