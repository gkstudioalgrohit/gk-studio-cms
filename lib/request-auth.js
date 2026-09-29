// Helpers for admin pages and API routes. EVERY admin API route goes through withAdmin().
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { SESSION_COOKIE, getUserBySessionToken } from "./auth.js";
import { hasDatabase } from "./db.js";
import { AppError } from "./errors.js";
import { formatZodError } from "./schemas.js";

export const getAdmin = cache(async () => {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token || !hasDatabase()) return null;
  try {
    return await getUserBySessionToken(token);
  } catch (e) {
    console.error("[auth] session lookup failed:", e.message);
    return null;
  }
});

export async function requireAdminPage() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export const jsonError = (status, message, extra = {}) => NextResponse.json({ error: message, ...extra }, { status });

export function getClientIp(request) {
  const xff = request.headers.get("x-forwarded-for");
  return (xff ? xff.split(",")[0].trim() : request.headers.get("x-real-ip")) || "unknown";
}

// CSRF defence (on top of SameSite cookies): state-changing requests must come from our own site.
export function sameOrigin(request) {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const origin = request.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).host === host;
    } catch {
      return false;
    }
  }
  const site = request.headers.get("sec-fetch-site");
  return site === "same-origin" || site === "none";
}

export function errorResponse(err) {
  if (err instanceof AppError) return jsonError(err.status, err.message, err.extra);
  if (err instanceof ZodError) return jsonError(400, formatZodError(err) || "Invalid data.");
  console.error("[api] unexpected error:", err);
  return jsonError(500, "Something went wrong on the server.");
}

export function isSecureRequest(request) {
  return request.nextUrl.protocol === "https:" || request.headers.get("x-forwarded-proto") === "https";
}

export function setSessionCookie(res, request, token, expires) {
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: isSecureRequest(request),
    sameSite: "lax",
    path: "/",
    expires,
  });
}
export function clearSessionCookie(res, request) {
  res.cookies.set(SESSION_COOKIE, "", { httpOnly: true, secure: isSecureRequest(request), sameSite: "lax", path: "/", maxAge: 0 });
}

// Wrap a route handler: same-origin check, sign-in check, uniform error handling.
export function withAdmin(handler, { publicRoute = false } = {}) {
  return async (request, ctx) => {
    try {
      if (!["GET", "HEAD", "OPTIONS"].includes(request.method) && !sameOrigin(request)) {
        return jsonError(403, "Cross-site request blocked.");
      }
      if (!hasDatabase()) return jsonError(503, "Database is not configured yet.");
      if (publicRoute) return await handler(request, ctx, null);
      const admin = await getAdmin();
      if (!admin) return jsonError(401, "Your session has expired. Please sign in again.");
      return await handler(request, ctx, admin);
    } catch (err) {
      return errorResponse(err);
    }
  };
}
