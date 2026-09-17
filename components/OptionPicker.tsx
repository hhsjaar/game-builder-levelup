"use client";

import { useState } from "react";
import type { StepDefinition } from "@/lib/types";
import { CUSTOM_OPTION_LABEL } from "@/lib/game-taxonomy";

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
      <div className="mt-2 flex flex-col gap-2 animate-pop-in">
        <textarea
          className="w-full rounded-2xl border-2 border-border bg-card-bg p-3 text-sm outline-none focus:border-primary"
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
            className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground disabled:opacity-40"
          >
            Lanjut
          </button>
          {definition.optional && (
            <button
              onClick={() => onSubmit("")}
              disabled={disabled}
              className="rounded-full border-2 border-border px-5 py-2 text-sm font-bold text-muted"
            >
              Lewati
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 flex flex-col gap-3 animate-pop-in">
      <div className="flex flex-wrap gap-2">
        {definition.options.map((opt) => {
          const active = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() => toggleOption(opt.value)}
              disabled={disabled}
              className={`rounded-full border-2 px-4 py-2 text-sm font-bold transition ${
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card-bg text-foreground hover:border-primary"
              } disabled:opacity-40`}
            >
              {opt.label}
            </button>
          );
        })}
        {definition.allowCustom && (
          <button
            onClick={toggleCustom}
            disabled={disabled}
            className={`rounded-full border-2 px-4 py-2 text-sm font-bold transition ${
              customOn
                ? "border-purple bg-purple text-white"
                : "border-border bg-card-bg text-foreground hover:border-purple"
            } disabled:opacity-40`}
          >
            ✏️ {CUSTOM_OPTION_LABEL}
          </button>
        )}
      </div>

      {customOn && (
        <input
          type="text"
          className="w-full rounded-full border-2 border-purple bg-card-bg px-4 py-2 text-sm outline-none"
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
          className="animate-pulse-glow rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground disabled:opacity-40"
        >
          Lanjut
        </button>
        {definition.optional && (
          <button
            onClick={handleSkip}
            disabled={disabled}
            className="rounded-full border-2 border-border px-5 py-2 text-sm font-bold text-muted"
          >
            Lewati
          </button>
        )}
      </div>
    </div>
  );
}
