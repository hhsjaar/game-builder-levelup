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
        className={`fixed inset-y-0 left-0 z-40 flex h-full w-[85vw] max-w-72 shrink-0 flex-col gap-4 bg-sidebar-bg p-3 transition-transform duration-300 ease-out md:static md:z-auto md:w-72 md:max-w-none md:translate-x-0 md:border-r md:border-card-border ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-1 pt-1">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-base">
              🎮
            </span>
            <h1 className="font-display text-[15px] font-bold tracking-tight text-foreground">
              Game Prompt Studio
            </h1>
          </div>
          <button
            onClick={onToggleTheme}
            aria-label="Ganti tema"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-foreground/5 hover:text-foreground"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </div>

        <button
          onClick={onNewChat}
          className="flex min-h-10 items-center justify-center gap-1.5 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover active:scale-[0.98]"
        >
          <span aria-hidden>+</span> Chat Baru
        </button>

        <div className="flex-1 overflow-y-auto">
          {loading && <p className="px-2 text-xs text-muted">Memuat riwayat...</p>}
          {!loading && conversations.length === 0 && (
            <p className="px-2 text-xs text-muted">Belum ada riwayat obrolan.</p>
          )}
          <ul className="flex flex-col gap-0.5">
            {conversations.map((c) => {
              const meta = STATUS_META[c.status] ?? { label: c.status, emoji: "•" };
              const active = c.id === activeId;
              return (
                <li key={c.id}>
                  <button
                    onClick={() => onSelect(c.id)}
                    className={`relative w-full rounded-lg py-2.5 pl-3 pr-2.5 text-left text-sm transition ${
                      active ? "bg-primary/8 font-medium text-foreground" : "text-foreground/85 hover:bg-foreground/5"
                    }`}
                  >
                    {active && (
                      <span className="absolute inset-y-2 left-0 w-[3px] rounded-full bg-primary" aria-hidden />
                    )}
                    <p className="truncate">{c.title || "Game baru (belum diberi nama)"}</p>
                    <p className="mt-0.5 text-xs text-muted">
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
