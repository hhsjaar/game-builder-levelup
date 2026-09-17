import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { getStepDefinition, INITIAL_FLOW_STATE } from "@/lib/flow-machine";
import { errorMessage } from "@/lib/error-message";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const clientId = typeof body.clientId === "string" ? body.clientId.trim() : "";

    if (!clientId) {
      return NextResponse.json({ error: "clientId wajib diisi." }, { status: 400 });
    }

    const { data: conversation, error: convError } = await supabaseServer
      .from("conversations")
      .insert({
        client_id: clientId,
        mode: null,
        status: "collecting",
        flow_state: INITIAL_FLOW_STATE,
      })
      .select()
      .single();

    if (convError || !conversation) {
      throw convError ?? new Error("Gagal membuat percakapan baru.");
    }

    const firstStepDef = getStepDefinition(INITIAL_FLOW_STATE.currentStep);

    const { data: message, error: msgError } = await supabaseServer
      .from("messages")
      .insert({
        conversation_id: conversation.id,
        role: "assistant",
        content: firstStepDef.prompt,
        message_type: "options",
        metadata: { step: firstStepDef },
      })
      .select()
      .single();

    if (msgError || !message) {
      throw msgError ?? new Error("Gagal membuat pesan pembuka.");
    }

    return NextResponse.json({ conversation, messages: [message] });
  } catch (error) {
    console.error("Create conversation error:", error);
    return NextResponse.json(
      { error: errorMessage(error, "Gagal membuat percakapan baru.") },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const clientId = req.nextUrl.searchParams.get("clientId")?.trim();

    if (!clientId) {
      return NextResponse.json({ error: "clientId wajib diisi." }, { status: 400 });
    }

    const { data, error } = await supabaseServer
      .from("conversations")
      .select("id, mode, title, status, created_at, updated_at")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ conversations: data ?? [] });
  } catch (error) {
    console.error("List conversations error:", error);
    return NextResponse.json(
      { error: errorMessage(error, "Gagal mengambil riwayat percakapan.") },
      { status: 500 }
    );
  }
}
