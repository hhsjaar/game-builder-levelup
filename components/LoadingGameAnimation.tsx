"use client";

import { useEffect, useState } from "react";

const STEPS = [
  { emoji: "🎨", text: "Merancang maskot lucu..." },
  { emoji: "🧩", text: "Menyusun soal-soal seru..." },
  { emoji: "🌈", text: "Menata warna dan animasi..." },
  { emoji: "🏆", text: "Menyiapkan sistem skor..." },
  { emoji: "✨", text: "Merapikan sentuhan terakhir..." },
];

export default function LoadingGameAnimation() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % STEPS.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex animate-pop-in flex-col gap-2 rounded-3xl border-2 border-card-border bg-card-bg px-4 py-3 text-sm font-bold text-muted">
      <div className="flex items-center gap-3">
        <span className="animate-spin-slow text-2xl">{STEPS[index].emoji}</span>
        <span>{STEPS[index].text}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div className="shimmer h-full w-full rounded-full" />
      </div>
    </div>
  );
}
