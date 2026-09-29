import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { updateProfile, SESSION_COOKIE } from "@/lib/auth.js";
import { withAdmin, jsonError } from "@/lib/request-auth.js";

export const POST = withAdmin(async (request, _ctx, admin) => {
  const body = await request.json().catch(() => ({}));
  const token = cookies().get(SESSION_COOKIE)?.value;
  const result = await updateProfile(admin.id, body, token);
  if (!result.ok) return jsonError(result.status, result.error);
  return NextResponse.json({ ok: true });
});
