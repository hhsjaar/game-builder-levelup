"use client";

import { useEffect, useRef, useState } from "react";
import ChatBubble from "./ChatBubble";
import OptionPicker from "./OptionPicker";
import GamePlayerCard from "./GamePlayerCard";
import LoadingGameAnimation from "./LoadingGameAnimation";
import type { ConversationRecord, MessageRecord, StepDefinition } from "@/lib/types";

interface GameInfo {
  id: string;
  html_content: string;
}

interface ChatPanelProps {
  clientId: string;
  conversation: ConversationRecord | null;
  messages: MessageRecord[];
  game: GameInfo | null;
  onMessagesChange: (messages: MessageRecord[]) => void;
  onConversationChange: (conversation: ConversationRecord) => void;
  onGameReady: (game: GameInfo) => void;
  onNewGame: () => void;
  loadingThread: boolean;
}

export default function ChatPanel({
  clientId,
  conversation,
  messages,
  game,
  onMessagesChange,
  onConversationChange,
  onGameReady,
  onNewGame,
  loadingThread,
}: ChatPanelProps) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, submitting]);

  async function handleSubmit(value: string[] | string) {
    if (!conversation) return;
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch(`/api/conversations/${conversation.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId, value }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Terjadi kesalahan.");
      }
      onMessagesChange([...messages, ...data.messages]);
      onConversationChange(data.conversation);
      if (data.game) {
        onGameReady(data.game);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!conversation) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
        <span className="animate-float-soft text-6xl">🧸🎲🖍️</span>
        <h2 className="font-display text-2xl font-extrabold text-foreground">
          Yuk buat game edukasi pertamamu!
        </h2>
        <p className="max-w-sm text-sm text-muted">
          Klik &quot;+ Chat Baru&quot; di samping untuk mulai mengobrol dan bikin game seru.
        </p>
      </div>
    );
  }

  const lastMessage = messages[messages.length - 1];
  const lastStep = lastMessage?.metadata?.step as StepDefinition | undefined;
  const canAnswer =
    conversation.status === "collecting" &&
    lastMessage?.role === "assistant" &&
    lastMessage?.message_type === "options" &&
    !!lastStep &&
    !submitting;
  const isGenerating = submitting && lastStep?.id === "specialInstructions";

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-6">
        {loadingThread && <p className="text-center text-sm text-muted">Memuat obrolan...</p>}
        {messages.map((m) => {
          const gameId = (m.metadata as { gameId?: string } | undefined)?.gameId;
          return (
            <div key={m.id}>
              <ChatBubble message={m} />
              {m.message_type === "game_result" && game && gameId === game.id && (
                <GamePlayerCard
                  gameId={game.id}
                  html={game.html_content}
                  gameName={conversation.title ?? undefined}
                  onNewGame={onNewGame}
                />
              )}
            </div>
          );
        })}

        {canAnswer && (
          <OptionPicker definition={lastStep!} onSubmit={handleSubmit} disabled={submitting} />
        )}

        {isGenerating && <LoadingGameAnimation />}
        {submitting && !isGenerating && (
          <div className="flex justify-start">
            <div className="rounded-3xl border-2 border-card-border bg-card-bg px-4 py-3 text-sm text-muted">
              mengetik...
            </div>
          </div>
        )}
        {error && (
          <div className="rounded-2xl border-2 border-danger bg-danger/10 px-4 py-3 text-sm font-bold text-danger">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
