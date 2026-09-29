import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getSectionData, saveSection } from "@/lib/content-service.js";
import { sectionSchemas } from "@/lib/schemas.js";
import { withAdmin, jsonError } from "@/lib/request-auth.js";

export const GET = withAdmin(async (_req, { params }) => {
  if (!sectionSchemas[params.key]) return jsonError(404, "Unknown section.");
  return NextResponse.json({ data: await getSectionData(params.key) });
});

export const PUT = withAdmin(async (request, { params }) => {
  if (!sectionSchemas[params.key]) return jsonError(404, "Unknown section.");
  const body = await request.json().catch(() => ({}));
  const saved = await saveSection(params.key, body);
  revalidateTag("site"); // public site reflects the change on the very next request
  return NextResponse.json({ data: saved });
});
