import { NextResponse } from "next/server";
import { withAdmin } from "@/lib/request-auth.js";

export const GET = withAdmin(async (_req, _ctx, admin) => NextResponse.json({ user: admin }));
