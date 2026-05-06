import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase";
import type { ItemsState } from "@/lib/types";

export const dynamic = "force-dynamic";

type ItemRow = {
  id: string;
  done: boolean;
  price: number | string | null;
  shop: string | null;
};

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("items")
    .select("id, done, price, shop");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const state: ItemsState = {};
  for (const row of (data ?? []) as ItemRow[]) {
    state[row.id] = {
      done: row.done,
      price: row.price == null ? null : Number(row.price),
      shop: row.shop,
    };
  }
  return NextResponse.json(state);
}

export async function PUT(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Body must be an object" }, { status: 400 });
  }

  const { id, done, price, shop } = body as {
    id?: unknown;
    done?: unknown;
    price?: unknown;
    shop?: unknown;
  };

  if (typeof id !== "string" || id.length === 0) {
    return NextResponse.json({ error: "Missing item id" }, { status: 400 });
  }

  const patch: Record<string, unknown> = { id, updated_at: new Date().toISOString() };
  if (done !== undefined) {
    if (typeof done !== "boolean") {
      return NextResponse.json({ error: "done must be boolean" }, { status: 400 });
    }
    patch.done = done;
  }
  if (price !== undefined) {
    if (price !== null && typeof price !== "number") {
      return NextResponse.json({ error: "price must be number or null" }, { status: 400 });
    }
    patch.price = price;
  }
  if (shop !== undefined) {
    if (shop !== null && typeof shop !== "string") {
      return NextResponse.json({ error: "shop must be string or null" }, { status: 400 });
    }
    patch.shop = shop;
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("items")
    .upsert(patch, { onConflict: "id" })
    .select("id, done, price, shop")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const row = data as ItemRow;
  return NextResponse.json({
    id: row.id,
    done: row.done,
    price: row.price == null ? null : Number(row.price),
    shop: row.shop,
  });
}
