import { NextResponse } from "next/server";
import { signIn } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return NextResponse.json({ error: "Email e senha obrigatórios" }, { status: 400 });
  }

  const { error } = await signIn(body.email, body.password);
  if (error) {
    return NextResponse.json({ error: "Email ou senha incorretos" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
