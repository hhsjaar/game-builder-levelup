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
    <div className="ms-[34px] flex flex-col gap-2.5 rounded-2xl border border-card-border bg-card-bg px-4 py-3 text-sm text-muted">
      <div key={index} className="flex animate-pop-in items-center gap-2.5">
        <span className="text-lg">{STEPS[index].emoji}</span>
        <span>{STEPS[index].text}</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-background-alt">
        <div className="shimmer h-full w-full rounded-full" />
      </div>
    </div>
  );
}
