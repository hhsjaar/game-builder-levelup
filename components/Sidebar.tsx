"use client";

import type { ConversationRecord } from "@/lib/types";

interface SidebarProps {
  conversations: ConversationRecord[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  loading?: boolean;
}

const STATUS_LABEL: Record<string, string> = {
  collecting: "Sedang diisi",
  generating: "Membuat game...",
  completed: "Selesai",
  error: "Gagal",
};

export default function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  loading,
}: SidebarProps) {
  return (
    <aside className="flex h-full w-72 shrink-0 flex-col gap-3 border-r-2 border-card-border bg-card-bg/60 p-4">
      <div className="flex items-center gap-2 px-1">
        <span className="text-2xl">🎮</span>
        <h1 className="font-display text-lg font-extrabold text-foreground">
          Game Prompt Studio
        </h1>
      </div>

      <button
        onClick={onNewChat}
        className="rounded-2xl bg-primary py-3 text-sm font-extrabold text-primary-foreground shadow-md transition hover:brightness-105"
      >
        + Chat Baru
      </button>

      <div className="flex-1 overflow-y-auto">
        {loading && <p className="px-2 text-xs text-muted">Memuat riwayat...</p>}
        {!loading && conversations.length === 0 && (
          <p className="px-2 text-xs text-muted">Belum ada riwayat obrolan.</p>
        )}
        <ul className="flex flex-col gap-1.5">
          {conversations.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => onSelect(c.id)}
                className={`w-full rounded-2xl px-3 py-2.5 text-left text-sm transition ${
                  c.id === activeId
                    ? "border-2 border-primary bg-primary/15 font-bold"
                    : "border-2 border-transparent hover:bg-black/5"
                }`}
              >
                <p className="truncate">{c.title || "Game baru (belum diberi nama)"}</p>
                <p className="text-xs text-muted">{STATUS_LABEL[c.status] ?? c.status}</p>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
