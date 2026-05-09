import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase";
import { getSessionUser } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

type CarRow = {
  km: number;
  alert_dismissed: boolean;
};

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("car")
    .select("km, alert_dismissed")
    .eq("id", 1)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const row = data as CarRow;
  return NextResponse.json({ km: row.km, alertDismissed: row.alert_dismissed });
}

export async function PUT(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Body must be an object" }, { status: 400 });
  }

  const { km, alertDismissed } = body as { km?: unknown; alertDismissed?: unknown };

  const patch: Record<string, unknown> = {};
  if (km !== undefined) {
    if (typeof km !== "number" || !Number.isFinite(km) || km < 0) {
      return NextResponse.json({ error: "km must be a non-negative number" }, { status: 400 });
    }
    patch.km = Math.round(km);
  }
  if (alertDismissed !== undefined) {
    if (typeof alertDismissed !== "boolean") {
      return NextResponse.json(
        { error: "alertDismissed must be boolean" },
        { status: 400 },
      );
    }
    patch.alert_dismissed = alertDismissed;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("car")
    .update(patch)
    .eq("id", 1)
    .select("km, alert_dismissed")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const row = data as CarRow;
  return NextResponse.json({ km: row.km, alertDismissed: row.alert_dismissed });
}
