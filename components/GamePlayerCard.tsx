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
    <div className="mt-2 flex flex-col gap-3 rounded-3xl border-2 border-card-border bg-card-bg p-3 shadow-lg animate-pop-in">
      <div
        className="overflow-hidden rounded-2xl border-2 border-border"
        style={{ aspectRatio: "9 / 14", maxHeight: 520 }}
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
          className="rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground"
        >
          🎮 Main Fullscreen
        </a>
        <button
          onClick={handleDownload}
          className="rounded-full border-2 border-border px-4 py-2 text-sm font-bold text-foreground"
        >
          ⬇️ Unduh HTML
        </button>
        <button
          onClick={onNewGame}
          className="rounded-full border-2 border-purple px-4 py-2 text-sm font-bold text-purple"
        >
          ✨ Buat Game Baru
        </button>
      </div>
    </div>
  );
}
