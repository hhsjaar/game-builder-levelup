import Anthropic from "@anthropic-ai/sdk";

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn("WARNING: ANTHROPIC_API_KEY is not set in environment variables!");
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "",
});

const MODEL = process.env.GAME_GEN_MODEL || "claude-opus-5";

/** Sends the assembled game prompt to Claude and returns the raw HTML document
 * text, ready to store/render. Streams internally (per Anthropic SDK guidance)
 * so a large response doesn't hit platform/HTTP timeouts. */
export async function generateGameHtml(systemPrompt: string, userPrompt: string): Promise<string> {
  const stream = anthropic.messages.stream({
    model: MODEL,
    // Generous ceiling so a rich, longer HTML/CSS/JS output never runs out of
    // room — this is a safety net, not a target; unused budget costs nothing.
    max_tokens: 48000,
    thinking: { type: "adaptive" },
    // "medium" — measured "high" against this task and adaptive thinking
    // spent a huge, unpredictable share of the token budget reasoning before
    // writing any HTML, twice producing a silently truncated document that
    // still looked like a "successful" (non-empty) response, and once taking
    // 7m46s end to end (unusable, and well past our own maxDuration budget).
    // "medium" plus the explicit self-check instruction in the prompt is the
    // reliable option — keep it unless future measurement says otherwise.
    output_config: { effort: "medium" },
    // SYSTEM_PROMPT (lib/prompt-template.ts) is byte-identical on every
    // generation — it holds the persona/design/engineering rules, none of
    // which depend on the user's spec. Marking it ephemeral-cacheable means
    // Claude only pays full input-token price for those ~1.5k tokens once
    // per 5-minute window instead of on every single game generated.
    system: [{ type: "text", text: systemPrompt, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: userPrompt }],
  });

  const response = await stream.finalMessage();

  if (response.stop_reason === "refusal") {
    throw new Error(
      "Claude menolak membuat game ini (kemungkinan ada bagian instruksi yang melanggar kebijakan). Coba ubah tema atau instruksi khusus."
    );
  }

  const textBlock = response.content.find(
    (block): block is Anthropic.TextBlock => block.type === "text"
  );

  if (!textBlock || !textBlock.text.trim()) {
    if (response.stop_reason === "max_tokens") {
      throw new Error(
        "Game terlalu kompleks untuk dibuat sekali jalan (kehabisan batas token sebelum selesai). Coba kurangi jumlah fitur tambahan/jenis game yang dipilih, atau coba lagi."
      );
    }
    throw new Error("Claude tidak mengembalikan konten HTML.");
  }

  const html = stripCodeFences(textBlock.text);

  // Defense in depth: a truncated response (hit max_tokens mid-document) can
  // still leave a non-empty but broken text block — catch that explicitly
  // instead of silently saving a corrupted game.
  if (!/<\/html\s*>\s*$/i.test(html)) {
    throw new Error(
      "Game yang dihasilkan tampak terpotong (tidak lengkap). Coba kurangi jumlah fitur tambahan/jenis game yang dipilih, atau coba lagi."
    );
  }

  return html;
}

function stripCodeFences(text: string): string {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```(?:html)?\s*([\s\S]*?)\s*```$/i);
  return fenceMatch ? fenceMatch[1].trim() : trimmed;
}
