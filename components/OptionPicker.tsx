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
      <div className="mt-1 flex animate-slide-up flex-col gap-2.5 ps-[34px]">
        <textarea
          className="w-full rounded-xl border border-border bg-card-bg p-3.5 text-base outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 sm:text-sm"
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
            className="min-h-10 flex-1 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover active:scale-[0.98] disabled:opacity-40 sm:flex-none"
          >
            Lanjut
          </button>
          {definition.optional && (
            <button
              onClick={() => onSubmit("")}
              disabled={disabled}
              className="min-h-10 rounded-xl border border-border px-5 text-sm font-medium text-muted transition hover:bg-foreground/5 active:scale-[0.98]"
            >
              Lewati
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-1 flex animate-slide-up flex-col gap-3 ps-[34px]">
      <div className="flex flex-wrap gap-2">
        {definition.options.map((opt) => {
          const active = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() => toggleOption(opt.value)}
              disabled={disabled}
              className={`min-h-10 rounded-full border px-4 py-2 text-sm font-medium transition-all active:scale-[0.97] ${
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card-bg text-foreground hover:border-primary/50 hover:bg-primary/5"
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
            className={`min-h-10 rounded-full border px-4 py-2 text-sm font-medium transition-all active:scale-[0.97] ${
              customOn
                ? "border-purple bg-purple text-white"
                : "border-border bg-card-bg text-foreground hover:border-purple/50 hover:bg-purple/5"
            } disabled:opacity-40`}
          >
            {CUSTOM_OPTION_EMOJI} {CUSTOM_OPTION_LABEL}
          </button>
        )}
      </div>

      {customOn && (
        <input
          type="text"
          className="w-full rounded-full border border-purple bg-card-bg px-4 py-2.5 text-base outline-none transition focus:ring-4 focus:ring-purple/15 sm:text-sm"
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
          className="min-h-10 flex-1 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-hover active:scale-[0.98] disabled:opacity-40 sm:flex-none"
        >
          Lanjut
        </button>
        {definition.optional && (
          <button
            onClick={handleSkip}
            disabled={disabled}
            className="min-h-10 rounded-xl border border-border px-5 text-sm font-medium text-muted transition hover:bg-foreground/5 active:scale-[0.98]"
          >
            Lewati
          </button>
        )}
      </div>
    </div>
  );
}
