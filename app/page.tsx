"use client";

import { useCallback, useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import ChatPanel from "@/components/ChatPanel";
import { getOrCreateClientId } from "@/lib/client-id";
import { getActiveTheme, setTheme, type Theme } from "@/lib/theme";
import type { ConversationRecord, MessageRecord } from "@/lib/types";

interface GameInfo {
  id: string;
  html_content: string;
}

export default function HomePage() {
  const [clientId] = useState(() => getOrCreateClientId());
  const [conversations, setConversations] = useState<ConversationRecord[]>([]);
  const [loadingSidebar, setLoadingSidebar] = useState(true);
  const [activeConversation, setActiveConversation] = useState<ConversationRecord | null>(null);
  const [messages, setMessages] = useState<MessageRecord[]>([]);
  const [game, setGame] = useState<GameInfo | null>(null);
  const [loadingThread, setLoadingThread] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Always starts as "light" to match the server-rendered HTML exactly (SSR
  // can't read localStorage/matchMedia) — the inline script in layout.tsx
  // already paints the correct theme before this ever shows. Synced to the
  // real value right after mount below, avoiding a hydration mismatch.
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    // One-time sync with the DOM/localStorage theme set by the blocking
    // init script — a legitimate read-external-state-on-mount effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setThemeState(getActiveTheme());
  }, []);

  const handleToggleTheme = useCallback(() => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setThemeState(next);
  }, [theme]);

  const refreshSidebar = useCallback(async (id: string) => {
    setLoadingSidebar(true);
    try {
      const res = await fetch(`/api/conversations?clientId=${encodeURIComponent(id)}`);
      const data = await res.json();
      setConversations(data.conversations ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSidebar(false);
    }
  }, []);

  useEffect(() => {
    if (!clientId) return;
    // Initial data fetch on mount — a legitimate effect use case (see
    // react.dev/learn/you-might-not-need-an-effect#fetching-data).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshSidebar(clientId);
  }, [clientId, refreshSidebar]);

  const handleNewChat = useCallback(async () => {
    if (!clientId) return;
    setLoadingThread(true);
    setGlobalError(null);
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setActiveConversation(data.conversation);
      setMessages(data.messages);
      setGame(null);
      setConversations((prev) => [data.conversation, ...prev]);
      setSidebarOpen(false);
    } catch (err) {
      console.error(err);
      setGlobalError(err instanceof Error ? err.message : "Gagal membuat chat baru.");
    } finally {
      setLoadingThread(false);
    }
  }, [clientId]);

  const handleSelectConversation = useCallback(
    async (id: string) => {
      if (!clientId) return;
      setLoadingThread(true);
      setGlobalError(null);
      try {
        const res = await fetch(`/api/conversations/${id}?clientId=${encodeURIComponent(clientId)}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setActiveConversation(data.conversation);
        setMessages(data.messages);
        setGame(data.game ?? null);
        setSidebarOpen(false);
      } catch (err) {
        console.error(err);
        setGlobalError(err instanceof Error ? err.message : "Gagal membuka percakapan.");
      } finally {
        setLoadingThread(false);
      }
    },
    [clientId]
  );

  const handleConversationChange = useCallback((next: ConversationRecord) => {
    setActiveConversation(next);
    setConversations((prev) => {
      const idx = prev.findIndex((c) => c.id === next.id);
      if (idx === -1) return [next, ...prev];
      const copy = [...prev];
      copy[idx] = next;
      return copy;
    });
  }, []);

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      {globalError && (
        <div className="flex items-center justify-between gap-3 border-b border-danger/30 bg-danger/8 px-4 py-2 text-sm font-medium text-danger">
          <span>{globalError}</span>
          <button onClick={() => setGlobalError(null)} className="shrink-0 underline">
            Tutup
          </button>
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          conversations={conversations}
          activeId={activeConversation?.id ?? null}
          onSelect={handleSelectConversation}
          onNewChat={handleNewChat}
          loading={loadingSidebar}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          theme={theme}
          onToggleTheme={handleToggleTheme}
        />
        <ChatPanel
          clientId={clientId}
          conversation={activeConversation}
          messages={messages}
          game={game}
          onMessagesChange={setMessages}
          onConversationChange={handleConversationChange}
          onGameReady={setGame}
          onNewGame={handleNewChat}
          onOpenSidebar={() => setSidebarOpen(true)}
          loadingThread={loadingThread}
        />
      </div>
    </div>
  );
}
