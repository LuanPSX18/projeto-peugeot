import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { getSessionUser } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const formData = await request.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "Form inválido" }, { status: 400 });

  const file = formData.get("file");
  if (!(file instanceof Blob) || file.size === 0) {
    return NextResponse.json({ error: "Arquivo inválido" }, { status: 400 });
  }

  const ext = file instanceof File ? (file.name.split(".").pop() ?? "jpg") : "jpg";
  const path = `${user.id}/${Date.now()}.${ext}`;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage
    .from("receipts")
    .upload(path, file, { contentType: file.type || "image/jpeg" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ path });
}
