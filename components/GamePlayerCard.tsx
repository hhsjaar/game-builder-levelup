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
    <div className="mt-2 flex animate-pop-in flex-col gap-3 rounded-3xl border-2 border-card-border bg-card-bg p-3 shadow-lg">
      <p className="flex items-center gap-1.5 text-sm font-extrabold text-foreground">
        <span className="animate-wiggle text-lg">🎉</span> Game kamu siap dimainkan!
      </p>
      <div
        className="overflow-hidden rounded-2xl border-2 border-border bg-background-alt"
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
      <div className="flex flex-wrap gap-2">
        <a
          href={`/play/${gameId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="min-h-11 flex-1 rounded-full bg-primary px-4 py-2 text-center text-sm font-bold text-primary-foreground shadow-sm shadow-primary/30 transition active:scale-95 sm:flex-none"
        >
          🎮 Main Fullscreen
        </a>
        <button
          onClick={handleDownload}
          className="min-h-11 rounded-full border-2 border-border px-4 py-2 text-sm font-bold text-foreground transition active:scale-95"
        >
          ⬇️ Unduh HTML
        </button>
        <button
          onClick={onNewGame}
          className="min-h-11 rounded-full border-2 border-purple px-4 py-2 text-sm font-bold text-purple transition active:scale-95"
        >
          ✨ Buat Game Baru
        </button>
      </div>
    </div>
  );
}
