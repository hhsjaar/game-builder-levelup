import {
  GAME_TYPES,
  THEMES,
  AGE_BRACKETS,
  DIFFICULTIES,
  FEATURES,
  COLOR_THEMES,
  INTERACTIVE_CONCEPTS,
  labelFor,
  labelsFor,
} from "./game-taxonomy";
import type {
  FlowAnswers,
  FlowState,
  GameMode,
  GameSpec,
  StepDefinition,
  StepId,
  StepOption,
} from "./types";

const MODE_OPTIONS: StepOption[] = [
  { value: "basic", label: "Game Basic", emoji: "🧩" },
  { value: "interactive", label: "Game Interaktif", emoji: "🕹️" },
];

const BASIC_ORDER: StepId[] = [
  "mode",
  "gameTypes",
  "themes",
  "ages",
  "difficulty",
  "features",
  "gameName",
  "colorTheme",
  "designNotes",
  "specialInstructions",
  "done",
];

const INTERACTIVE_ORDER: StepId[] = [
  "mode",
  "interactiveConcept",
  "themes",
  "ages",
  "difficulty",
  "features",
  "gameName",
  "colorTheme",
  "designNotes",
  "specialInstructions",
  "done",
];

export function getStepOrder(mode?: GameMode): StepId[] {
  return mode === "interactive" ? INTERACTIVE_ORDER : BASIC_ORDER;
}

export function getStepDefinition(stepId: StepId): StepDefinition {
  switch (stepId) {
    case "mode":
      return {
        id: "mode",
        selectMode: "single",
        allowCustom: false,
        optional: false,
        prompt: "👋 Halo! Yuk buat game edukasi seru. Mau bikin apa hari ini?",
        options: MODE_OPTIONS,
      };
    case "gameTypes":
      return {
        id: "gameTypes",
        selectMode: "multi",
        allowCustom: true,
        optional: false,
        prompt: "🎮 Jenis game apa yang kamu mau? Boleh pilih lebih dari satu.",
        options: GAME_TYPES,
      };
    case "interactiveConcept":
      return {
        id: "interactiveConcept",
        selectMode: "single",
        allowCustom: true,
        optional: false,
        prompt: "🕹️ Pilih satu konsep game interaktif yang paling cocok:",
        options: INTERACTIVE_CONCEPTS,
      };
    case "themes":
      return {
        id: "themes",
        selectMode: "multi",
        allowCustom: true,
        optional: false,
        prompt: "📚 Materi atau tema apa yang mau diajarkan? Boleh pilih lebih dari satu.",
        options: THEMES,
      };
    case "ages":
      return {
        id: "ages",
        selectMode: "multi",
        allowCustom: true,
        optional: false,
        prompt: "🎂 Untuk usia berapa game ini? Boleh pilih lebih dari satu rentang.",
        options: AGE_BRACKETS,
      };
    case "difficulty":
      return {
        id: "difficulty",
        selectMode: "single",
        allowCustom: true,
        optional: false,
        prompt: "🎯 Seberapa menantang tingkat kesulitannya?",
        options: DIFFICULTIES,
      };
    case "features":
      return {
        id: "features",
        selectMode: "multi",
        allowCustom: true,
        optional: false,
        prompt: "⭐ Fitur tambahan apa saja yang kamu mau? Boleh pilih lebih dari satu.",
        options: FEATURES,
      };
    case "gameName":
      return {
        id: "gameName",
        selectMode: "single",
        allowCustom: false,
        optional: false,
        freeText: true,
        prompt: "🏷️ Siapa nama brand/game ini?",
        options: [],
      };
    case "colorTheme":
      return {
        id: "colorTheme",
        selectMode: "single",
        allowCustom: true,
        optional: false,
        prompt: "🎨 Tema warna apa yang kamu suka?",
        options: COLOR_THEMES,
      };
    case "designNotes":
      return {
        id: "designNotes",
        selectMode: "single",
        allowCustom: false,
        optional: true,
        freeText: true,
        prompt: "📝 Ada catatan desain khusus? (opsional, boleh dilewati)",
        options: [],
      };
    case "specialInstructions":
      return {
        id: "specialInstructions",
        selectMode: "single",
        allowCustom: false,
        optional: true,
        freeText: true,
        prompt: "📌 Ada instruksi khusus lain sebelum game dibuat? (opsional, boleh dilewati)",
        options: [],
      };
    case "done":
      return {
        id: "done",
        selectMode: "single",
        allowCustom: false,
        optional: true,
        prompt: "Siap! Sedang meracik game-nya...",
        options: [],
      };
  }
}

function fieldForStep(stepId: StepId): keyof FlowAnswers | null {
  switch (stepId) {
    case "mode":
      return "mode";
    case "gameTypes":
      return "gameTypes";
    case "interactiveConcept":
      return "interactiveConcept";
    case "themes":
      return "themes";
    case "ages":
      return "ages";
    case "difficulty":
      return "difficulty";
    case "features":
      return "features";
    case "gameName":
      return "gameName";
    case "colorTheme":
      return "colorTheme";
    case "designNotes":
      return "designNotes";
    case "specialInstructions":
      return "specialInstructions";
    default:
      return null;
  }
}

export type SubmitResult =
  | { ok: true; state: FlowState; summary: string }
  | { ok: false; error: string };

/** Validates + applies one step's answer, advancing the flow. Runs identically
 * on client (for optimistic UI) and server (source of truth). */
export function submitAnswer(state: FlowState, value: string[] | string): SubmitResult {
  const step = state.currentStep;
  if (step === "done") {
    return { ok: false, error: "Alur sudah selesai." };
  }

  const def = getStepDefinition(step);
  const field = fieldForStep(step);

  let normalized: string[] | string;
  if (def.freeText) {
    const text = (Array.isArray(value) ? value.join(" ") : value).trim();
    if (!text && !def.optional) {
      return { ok: false, error: "Jawaban ini wajib diisi." };
    }
    normalized = text;
  } else if (def.selectMode === "multi") {
    const arr = (Array.isArray(value) ? value : value ? [value] : []).filter(
      (v) => v.trim().length > 0
    );
    if (arr.length === 0 && !def.optional) {
      return { ok: false, error: "Pilih minimal satu opsi." };
    }
    normalized = arr;
  } else {
    const single = (Array.isArray(value) ? value[0] : value) ?? "";
    if (!single.trim() && !def.optional) {
      return { ok: false, error: "Pilih salah satu opsi." };
    }
    normalized = single;
  }

  const nextAnswers: FlowAnswers = { ...state.answers };
  if (field) {
    (nextAnswers as Record<string, unknown>)[field] = normalized;
  }

  const mode = nextAnswers.mode;
  const order = getStepOrder(mode);
  const idx = order.indexOf(step);
  const nextStepId = order[idx + 1] ?? "done";

  return {
    ok: true,
    state: { currentStep: nextStepId, answers: nextAnswers },
    summary: summarizeAnswer(step, nextAnswers),
  };
}

function summarizeAnswer(stepId: StepId, answers: FlowAnswers): string {
  switch (stepId) {
    case "mode":
      return answers.mode === "interactive" ? "🕹️ Game Interaktif" : "🧩 Game Basic";
    case "gameTypes":
      return `🎮 Jenis Game: ${labelsFor(GAME_TYPES, answers.gameTypes ?? [])}`;
    case "interactiveConcept":
      return `🕹️ Konsep: ${labelFor(INTERACTIVE_CONCEPTS, answers.interactiveConcept ?? "")}`;
    case "themes":
      return `📚 Materi/Tema: ${labelsFor(THEMES, answers.themes ?? [])}`;
    case "ages":
      return `🎂 Usia: ${labelsFor(AGE_BRACKETS, answers.ages ?? [])}`;
    case "difficulty":
      return `🎯 Tingkat Kesulitan: ${labelFor(DIFFICULTIES, answers.difficulty ?? "")}`;
    case "features":
      return `⭐ Fitur Tambahan: ${labelsFor(FEATURES, answers.features ?? [])}`;
    case "gameName":
      return `🏷️ Nama Game: ${answers.gameName ?? ""}`;
    case "colorTheme":
      return `🎨 Tema Warna: ${labelFor(COLOR_THEMES, answers.colorTheme ?? "")}`;
    case "designNotes":
      return answers.designNotes
        ? `📝 Catatan Desain: ${answers.designNotes}`
        : "📝 Catatan Desain: (dilewati)";
    case "specialInstructions":
      return answers.specialInstructions
        ? `📌 Instruksi Khusus: ${answers.specialInstructions}`
        : "📌 Instruksi Khusus: (dilewati)";
    default:
      return "";
  }
}

export function isFlowComplete(state: FlowState): boolean {
  return state.currentStep === "done";
}

export function toGameSpec(answers: FlowAnswers): GameSpec {
  return {
    mode: answers.mode ?? "basic",
    gameTypes: answers.gameTypes ?? [],
    interactiveConcept: answers.interactiveConcept,
    themes: answers.themes ?? [],
    ages: answers.ages ?? [],
    difficulty: answers.difficulty ?? "sedang",
    features: answers.features ?? [],
    gameName: answers.gameName ?? "Game Edukasi",
    colorTheme: answers.colorTheme ?? "pelangi",
    designNotes: answers.designNotes ?? "",
    specialInstructions: answers.specialInstructions ?? "",
  };
}

export const INITIAL_FLOW_STATE: FlowState = {
  currentStep: "mode",
  answers: {},
};
