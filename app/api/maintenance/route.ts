import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getSessionUser } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const item_id = searchParams.get("item_id");

  const supabase = getSupabaseAdmin();
  let query = supabase
    .from("maintenance_log")
    .select("*")
    .order("done_at", { ascending: false });

  if (item_id) {
    query = query.eq("item_id", item_id);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const enriched = await Promise.all(
    (data ?? []).map(async (entry) => {
      if (!entry.receipt_path) return { ...entry, receipt_url: null };
      const { data: signed } = await supabase.storage
        .from("receipts")
        .createSignedUrl(entry.receipt_path, 3600);
      return { ...entry, receipt_url: signed?.signedUrl ?? null };
    }),
  );

  return NextResponse.json(enriched);
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const { item_id, item_name, km_at, price, shop, receipt_path } = body;

  if (!item_id || !item_name || typeof km_at !== "number") {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("maintenance_log")
    .insert({ item_id, item_name, km_at, price: price ?? null, shop: shop ?? null, receipt_path: receipt_path ?? null })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ...data, receipt_url: null }, { status: 201 });
}

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  const body = await request.json().catch(() => null);
  if (!body?.receipt_path) return NextResponse.json({ error: "receipt_path required" }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("maintenance_log")
    .update({ receipt_path: body.receipt_path })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: signed } = await supabase.storage
    .from("receipts")
    .createSignedUrl(body.receipt_path, 3600);

  return NextResponse.json({ ...data, receipt_url: signed?.signedUrl ?? null });
}
