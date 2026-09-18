"use client";

import type { ConversationRecord } from "@/lib/types";
import type { Theme } from "@/lib/theme";

interface SidebarProps {
  conversations: ConversationRecord[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  loading?: boolean;
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  onToggleTheme: () => void;
}

const STATUS_META: Record<string, { label: string; emoji: string }> = {
  collecting: { label: "Sedang diisi", emoji: "✍️" },
  generating: { label: "Membuat game...", emoji: "🪄" },
  completed: { label: "Selesai", emoji: "✅" },
  error: { label: "Gagal", emoji: "⚠️" },
};

export default function Sidebar({
  conversations,
  activeId,
  onSelect,
  onNewChat,
  loading,
  isOpen,
  onClose,
  theme,
  onToggleTheme,
}: SidebarProps) {
  return (
    <>
      {isOpen && (
        <button
          aria-label="Tutup menu"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-full w-[85vw] max-w-72 shrink-0 flex-col gap-3 bg-sidebar-bg p-4 shadow-2xl transition-transform duration-300 ease-out md:static md:z-auto md:w-72 md:max-w-none md:translate-x-0 md:border-r-2 md:border-card-border md:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="animate-wiggle text-2xl">🎮</span>
            <h1 className="font-display text-lg font-extrabold text-foreground">
              Game Prompt Studio
            </h1>
          </div>
          <button
            onClick={onToggleTheme}
            aria-label="Ganti tema"
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-border bg-card-bg text-base transition active:scale-90"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>

        <button
          onClick={onNewChat}
          className="min-h-12 rounded-2xl bg-primary text-sm font-extrabold text-primary-foreground shadow-md shadow-primary/30 transition active:scale-95"
        >
          ✨ Chat Baru
        </button>

        <div className="flex-1 overflow-y-auto">
          {loading && <p className="px-2 text-xs text-muted">Memuat riwayat... ⏳</p>}
          {!loading && conversations.length === 0 && (
            <p className="px-2 text-xs text-muted">Belum ada riwayat obrolan. 💬</p>
          )}
          <ul className="flex flex-col gap-1.5">
            {conversations.map((c) => {
              const meta = STATUS_META[c.status] ?? { label: c.status, emoji: "•" };
              return (
                <li key={c.id}>
                  <button
                    onClick={() => onSelect(c.id)}
                    className={`w-full rounded-2xl px-3 py-2.5 text-left text-sm transition ${
                      c.id === activeId
                        ? "border-2 border-primary bg-primary/10 font-bold"
                        : "border-2 border-transparent hover:bg-foreground/5"
                    }`}
                  >
                    <p className="truncate">{c.title || "🎲 Game baru (belum diberi nama)"}</p>
                    <p className="text-xs text-muted">
                      {meta.emoji} {meta.label}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </>
  );
}
