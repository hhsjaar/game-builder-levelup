import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;

  const { data: game, error } = await supabaseServer
    .from("generated_games")
    .select("html_content")
    .eq("id", gameId)
    .maybeSingle();

  if (error || !game) {
    return new NextResponse("Game tidak ditemukan.", { status: 404 });
  }

  return new NextResponse(game.html_content, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
