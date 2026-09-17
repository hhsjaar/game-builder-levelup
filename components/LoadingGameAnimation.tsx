"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Merancang maskot lucu...",
  "Menyusun soal-soal seru...",
  "Menata warna dan animasi...",
  "Menyiapkan sistem skor...",
  "Merapikan sentuhan terakhir...",
];

export default function LoadingGameAnimation() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex animate-pop-in items-center gap-3 rounded-3xl border-2 border-card-border bg-card-bg px-4 py-3 text-sm font-bold text-muted">
      <span className="animate-bounce-soft text-2xl">🪄</span>
      <span>{MESSAGES[index]}</span>
    </div>
  );
}
