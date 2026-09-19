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
  onOpenSidebar: () => void;
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
  onOpenSidebar,
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

  const MobileTopBar = (
    <div className="flex items-center gap-3 border-b border-card-border bg-card-bg/70 px-4 py-3 backdrop-blur-sm md:hidden">
      <button
        onClick={onOpenSidebar}
        aria-label="Buka menu"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-foreground/5"
      >
        ☰
      </button>
      <span className="font-display text-[15px] font-semibold text-foreground">
        {conversation?.title || "Game Prompt Studio"}
      </span>
    </div>
  );

  if (!conversation) {
    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        {MobileTopBar}
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
          <span className="animate-float-soft text-5xl">🎲</span>
          <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
            Yuk buat game edukasi pertamamu
          </h2>
          <p className="max-w-sm text-sm text-muted">
            Ketuk &quot;Chat Baru&quot; untuk mulai mengobrol dan bikin game seru.
          </p>
        </div>
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
      {MobileTopBar}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
        {loadingThread && (
          <p className="text-center text-sm text-muted">Memuat obrolan...</p>
        )}
        {messages.map((m) => {
          const gameId = (m.metadata as { gameId?: string } | undefined)?.gameId;
          return (
            <div key={m.id} className="space-y-2">
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
          <div className="flex animate-pop-in items-center gap-1 ps-[34px]">
            <span className="h-1.5 w-1.5 rounded-full bg-muted typing-dot [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-muted typing-dot [animation-delay:150ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-muted typing-dot [animation-delay:300ms]" />
          </div>
        )}
        {error && (
          <div className="ms-[34px] animate-pop-in rounded-xl border border-danger/30 bg-danger/8 px-4 py-3 text-sm font-medium text-danger">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
