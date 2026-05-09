import { NextResponse } from "next/server";
import { signOut } from "@/lib/supabase-server";

export async function POST() {
  await signOut();
  return NextResponse.json({ ok: true });
}
