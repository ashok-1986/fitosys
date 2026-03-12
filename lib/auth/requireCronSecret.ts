import { NextRequest, NextResponse } from "next/server";

export function requireCronSecret(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");

  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  return null; // null means pass — proceed with cron logic
}
