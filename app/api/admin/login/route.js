import { NextResponse } from "next/server";
import { loginWithPassword } from "@/lib/auth.js";
import { hasDatabase } from "@/lib/db.js";
import { getClientIp, jsonError, sameOrigin, setSessionCookie } from "@/lib/request-auth.js";

export async function POST(request) {
  try {
    if (!sameOrigin(request)) return jsonError(403, "Cross-site request blocked.");
    if (!hasDatabase()) return jsonError(503, "The database is not connected yet. See the README to finish setup.");
    const body = await request.json().catch(() => ({}));
    const result = await loginWithPassword({
      email: body.email,
      password: body.password,
      ip: getClientIp(request),
      userAgent: request.headers.get("user-agent") || "",
    });
    if (!result.ok) return jsonError(result.status, result.error);
    const res = NextResponse.json({ user: result.user });
    setSessionCookie(res, request, result.token, result.expires);
    return res;
  } catch (e) {
    console.error("[login]", e);
    return jsonError(500, "Something went wrong. Please try again.");
  }
}
