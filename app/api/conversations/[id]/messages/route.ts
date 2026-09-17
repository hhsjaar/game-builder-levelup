import { NextRequest, NextResponse } from "next/server";
import { supabaseServer, hasReachedGenerationLimit, GENERATIONS_PER_DAY_LIMIT } from "@/lib/supabase-server";
import { getStepDefinition, submitAnswer, toGameSpec } from "@/lib/flow-machine";
import { buildGamePrompt } from "@/lib/prompt-template";
import { generateGameHtml } from "@/lib/anthropic";
import { errorMessage } from "@/lib/error-message";
import type { ConversationRecord } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const clientId = typeof body.clientId === "string" ? body.clientId.trim() : "";
    const value: string[] | string = body.value ?? [];

    if (!clientId) {
      return NextResponse.json({ error: "clientId wajib diisi." }, { status: 400 });
    }

    const { data: conversationRow, error: convError } = await supabaseServer
      .from("conversations")
      .select("*")
      .eq("id", id)
      .single();

    if (convError || !conversationRow) {
      return NextResponse.json({ error: "Percakapan tidak ditemukan." }, { status: 404 });
    }
    const conversation = conversationRow as ConversationRecord;

    if (conversation.client_id !== clientId) {
      return NextResponse.json({ error: "Percakapan tidak ditemukan." }, { status: 404 });
    }
    if (conversation.status !== "collecting") {
      return NextResponse.json(
        { error: "Percakapan ini sudah selesai. Buat chat baru untuk membuat game lagi." },
        { status: 400 }
      );
    }

    const result = submitAnswer(conversation.flow_state, value);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const { data: userMessage, error: userMsgError } = await supabaseServer
      .from("messages")
      .insert({
        conversation_id: id,
        role: "user",
        content: result.summary,
        message_type: "summary",
      })
      .select()
      .single();
    if (userMsgError) throw userMsgError;

    const newMode = result.state.answers.mode ?? conversation.mode;

    if (result.state.currentStep !== "done") {
      const nextDef = getStepDefinition(result.state.currentStep);

      const { data: updatedConversation, error: updateError } = await supabaseServer
        .from("conversations")
        .update({
          mode: newMode,
          flow_state: result.state,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .select()
        .single();
      if (updateError) throw updateError;

      const { data: assistantMessage, error: assistantMsgError } = await supabaseServer
        .from("messages")
        .insert({
          conversation_id: id,
          role: "assistant",
          content: nextDef.prompt,
          message_type: nextDef.options.length > 0 || nextDef.freeText ? "options" : "text",
          metadata: { step: nextDef },
        })
        .select()
        .single();
      if (assistantMsgError) throw assistantMsgError;

      return NextResponse.json({
        conversation: updatedConversation,
        messages: [userMessage, assistantMessage],
      });
    }

    // Final step answered — generate the game now.
    const spec = toGameSpec(result.state.answers);

    if (await hasReachedGenerationLimit(clientId)) {
      await supabaseServer
        .from("conversations")
        .update({ status: "error", mode: newMode, flow_state: result.state })
        .eq("id", id);

      const limitMessage = `Batas ${GENERATIONS_PER_DAY_LIMIT} game per 24 jam untuk browser ini sudah tercapai. Coba lagi nanti ya.`;
      await supabaseServer.from("messages").insert({
        conversation_id: id,
        role: "assistant",
        content: limitMessage,
        message_type: "text",
      });

      return NextResponse.json({ error: limitMessage }, { status: 429 });
    }

    await supabaseServer
      .from("conversations")
      .update({
        status: "generating",
        mode: newMode,
        title: spec.gameName,
        flow_state: result.state,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    try {
      const prompt = buildGamePrompt(spec);
      const html = await generateGameHtml(prompt);

      const { data: game, error: gameError } = await supabaseServer
        .from("generated_games")
        .insert({ conversation_id: id, spec, html_content: html })
        .select("id, created_at")
        .single();
      if (gameError) throw gameError;

      const { data: completedConversation, error: completeError } = await supabaseServer
        .from("conversations")
        .update({ status: "completed", updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (completeError) throw completeError;

      const { data: gameMessage, error: gameMsgError } = await supabaseServer
        .from("messages")
        .insert({
          conversation_id: id,
          role: "assistant",
          content: `Game "${spec.gameName}" sudah siap dimainkan!`,
          message_type: "game_result",
          metadata: { gameId: game.id },
        })
        .select()
        .single();
      if (gameMsgError) throw gameMsgError;

      return NextResponse.json({
        conversation: completedConversation,
        messages: [userMessage, gameMessage],
        game: { id: game.id, html_content: html },
      });
    } catch (genError) {
      console.error("Game generation error:", genError);

      await supabaseServer
        .from("conversations")
        .update({ status: "error", updated_at: new Date().toISOString() })
        .eq("id", id);

      const errorText = errorMessage(
        genError,
        "Terjadi kesalahan saat membuat game. Silakan buat chat baru untuk mencoba lagi."
      );

      await supabaseServer.from("messages").insert({
        conversation_id: id,
        role: "assistant",
        content: errorText,
        message_type: "text",
      });

      return NextResponse.json({ error: errorText }, { status: 500 });
    }
  } catch (error) {
    console.error("Submit message error:", error);
    return NextResponse.json(
      { error: errorMessage(error, "Gagal memproses jawaban.") },
      { status: 500 }
    );
  }
}
