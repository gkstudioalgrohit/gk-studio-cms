import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, destroySession } from "@/lib/auth.js";
import { clearSessionCookie } from "@/lib/request-auth.js";

export async function POST(request) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (token) await destroySession(token).catch(() => {});
  const res = NextResponse.json({ ok: true });
  clearSessionCookie(res, request);
  return res;
}
