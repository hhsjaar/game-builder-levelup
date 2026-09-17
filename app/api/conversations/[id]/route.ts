import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { errorMessage } from "@/lib/error-message";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const clientId = req.nextUrl.searchParams.get("clientId")?.trim();

    if (!clientId) {
      return NextResponse.json({ error: "clientId wajib diisi." }, { status: 400 });
    }

    const { data: conversation, error: convError } = await supabaseServer
      .from("conversations")
      .select("*")
      .eq("id", id)
      .single();

    if (convError || !conversation) {
      return NextResponse.json({ error: "Percakapan tidak ditemukan." }, { status: 404 });
    }

    if (conversation.client_id !== clientId) {
      return NextResponse.json({ error: "Percakapan tidak ditemukan." }, { status: 404 });
    }

    const { data: messages, error: msgError } = await supabaseServer
      .from("messages")
      .select("*")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true });

    if (msgError) throw msgError;

    let game = null;
    if (conversation.status === "completed") {
      const { data: gameRow, error: gameError } = await supabaseServer
        .from("generated_games")
        .select("id, html_content, created_at")
        .eq("conversation_id", id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (gameError) throw gameError;
      game = gameRow;
    }

    return NextResponse.json({ conversation, messages: messages ?? [], game });
  } catch (error) {
    console.error("Get conversation error:", error);
    return NextResponse.json(
      { error: errorMessage(error, "Gagal mengambil percakapan.") },
      { status: 500 }
    );
  }
}
