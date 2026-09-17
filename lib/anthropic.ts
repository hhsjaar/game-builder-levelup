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
export async function generateGameHtml(prompt: string): Promise<string> {
  const stream = anthropic.messages.stream({
    model: MODEL,
    max_tokens: 20000,
    thinking: { type: "adaptive" },
    output_config: { effort: "medium" },
    messages: [{ role: "user", content: prompt }],
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
    throw new Error("Claude tidak mengembalikan konten HTML.");
  }

  return stripCodeFences(textBlock.text);
}

function stripCodeFences(text: string): string {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```(?:html)?\s*([\s\S]*?)\s*```$/i);
  return fenceMatch ? fenceMatch[1].trim() : trimmed;
}
