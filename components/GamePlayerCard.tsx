"use client";

interface GamePlayerCardProps {
  gameId: string;
  html: string;
  gameName?: string;
  onNewGame: () => void;
}

export default function GamePlayerCard({ gameId, html, gameName, onNewGame }: GamePlayerCardProps) {
  function handleDownload() {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(gameName || "game").replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-1 flex animate-slide-up flex-col gap-3 ps-[34px]">
      <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
        <span>🎉</span> Game kamu siap dimainkan!
      </p>
      <div
        className="overflow-hidden rounded-2xl border border-card-border bg-card-bg"
        style={{ boxShadow: "var(--card-shadow)" }}
      >
        <div className="flex items-center gap-1.5 border-b border-card-border bg-background-alt px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-danger/60" />
          <span className="h-2 w-2 rounded-full bg-accent/60" />
          <span className="h-2 w-2 rounded-full bg-success/60" />
          <span className="ml-2 truncate text-xs font-medium text-muted">
            {gameName || "Game"}
          </span>
        </div>
        <div
          className="bg-background-alt"
          style={{ aspectRatio: "9 / 14", maxHeight: "min(65vh, 520px)" }}
        >
          <iframe
            key={gameId}
            sandbox="allow-scripts"
            srcDoc={html}
            className="h-full w-full border-0"
            title={gameName ?? "Game"}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <a
          href={`/play/${gameId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex min-h-10 flex-1 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover active:scale-[0.98] sm:flex-none"
        >
          Main Fullscreen
        </a>
        <button
          onClick={handleDownload}
          className="min-h-10 rounded-xl border border-border px-4 text-sm font-medium text-foreground transition hover:bg-foreground/5 active:scale-[0.98]"
        >
          Unduh HTML
        </button>
        <button
          onClick={onNewGame}
          className="min-h-10 rounded-xl border border-border px-4 text-sm font-medium text-foreground transition hover:bg-foreground/5 active:scale-[0.98]"
        >
          Buat Game Baru
        </button>
      </div>
    </div>
  );
}
