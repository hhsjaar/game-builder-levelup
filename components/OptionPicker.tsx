"use client";

import { useState } from "react";
import type { StepDefinition } from "@/lib/types";
import { CUSTOM_OPTION_LABEL, CUSTOM_OPTION_EMOJI } from "@/lib/game-taxonomy";

interface OptionPickerProps {
  definition: StepDefinition;
  onSubmit: (value: string[] | string) => void;
  disabled?: boolean;
}

export default function OptionPicker({ definition, onSubmit, disabled }: OptionPickerProps) {
  const [selected, setSelected] = useState<string[]>([]);
  const [customOn, setCustomOn] = useState(false);
  const [customText, setCustomText] = useState("");
  const [freeText, setFreeText] = useState("");

  const isMulti = definition.selectMode === "multi";

  function toggleOption(value: string) {
    if (disabled) return;
    if (isMulti) {
      setSelected((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
      );
    } else {
      setSelected([value]);
      setCustomOn(false);
    }
  }

  function toggleCustom() {
    if (disabled) return;
    if (isMulti) {
      setCustomOn((prev) => !prev);
    } else {
      setCustomOn(true);
      setSelected([]);
    }
  }

  function handleSubmit() {
    if (disabled) return;

    if (isMulti) {
      const values = [...selected];
      if (customOn && customText.trim()) values.push(customText.trim());
      if (values.length === 0 && !definition.optional) return;
      onSubmit(values);
    } else {
      const value = customOn ? customText.trim() : selected[0] ?? "";
      if (!value && !definition.optional) return;
      onSubmit(value);
    }
  }

  function handleSkip() {
    if (disabled) return;
    onSubmit([]);
  }

  if (definition.freeText) {
    return (
      <div className="mt-2 flex animate-pop-in flex-col gap-2.5">
        <textarea
          className="w-full rounded-2xl border-2 border-border bg-card-bg p-3.5 text-base outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 sm:text-sm"
          rows={2}
          placeholder={definition.optional ? "Opsional, boleh dilewati..." : "Ketik jawabanmu..."}
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          disabled={disabled}
        />
        <div className="flex gap-2">
          <button
            onClick={() => onSubmit(freeText.trim())}
            disabled={disabled || (!freeText.trim() && !definition.optional)}
            className="min-h-12 flex-1 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-sm shadow-primary/30 transition active:scale-95 disabled:opacity-40 sm:flex-none"
          >
            Lanjut 👉
          </button>
          {definition.optional && (
            <button
              onClick={() => onSubmit("")}
              disabled={disabled}
              className="min-h-12 rounded-full border-2 border-border px-5 text-sm font-bold text-muted transition active:scale-95"
            >
              Lewati ⏭️
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 flex animate-pop-in flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {definition.options.map((opt, i) => {
          const active = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() => toggleOption(opt.value)}
              disabled={disabled}
              style={{ animationDelay: `${i * 30}ms` }}
              className={`animate-pop-in min-h-11 rounded-full border-2 px-4 py-2 text-sm font-bold transition-all active:scale-95 ${
                active
                  ? "scale-[1.03] border-primary bg-primary text-primary-foreground shadow-md shadow-primary/30"
                  : "border-border bg-card-bg text-foreground hover:border-primary hover:-translate-y-0.5"
              } disabled:opacity-40`}
            >
              {opt.emoji ? `${opt.emoji} ` : ""}
              {opt.label}
              {active && isMulti ? " ✓" : ""}
            </button>
          );
        })}
        {definition.allowCustom && (
          <button
            onClick={toggleCustom}
            disabled={disabled}
            className={`min-h-11 rounded-full border-2 px-4 py-2 text-sm font-bold transition-all active:scale-95 ${
              customOn
                ? "border-purple bg-purple text-white shadow-md shadow-purple/30"
                : "border-border bg-card-bg text-foreground hover:border-purple hover:-translate-y-0.5"
            } disabled:opacity-40`}
          >
            {CUSTOM_OPTION_EMOJI} {CUSTOM_OPTION_LABEL}
          </button>
        )}
      </div>

      {customOn && (
        <input
          type="text"
          className="w-full rounded-full border-2 border-purple bg-card-bg px-4 py-3 text-base outline-none transition focus:ring-4 focus:ring-purple/15 sm:py-2 sm:text-sm"
          placeholder="Ketik jawabanmu sendiri..."
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          disabled={disabled}
        />
      )}

      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          disabled={disabled}
          className="min-h-12 flex-1 animate-pulse-glow rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground shadow-sm shadow-primary/30 transition active:scale-95 disabled:opacity-40 sm:flex-none"
        >
          Lanjut 👉
        </button>
        {definition.optional && (
          <button
            onClick={handleSkip}
            disabled={disabled}
            className="min-h-12 rounded-full border-2 border-border px-5 text-sm font-bold text-muted transition active:scale-95"
          >
            Lewati ⏭️
          </button>
        )}
      </div>
    </div>
  );
}
