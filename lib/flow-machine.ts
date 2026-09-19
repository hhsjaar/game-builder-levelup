import {
  GAME_TYPES,
  THEMES,
  AGE_BRACKETS,
  DIFFICULTIES,
  FEATURES,
  COLOR_THEMES,
  IDEA_SUGGESTIONS,
  INTERACTIVE_CONCEPTS,
  INTERACTIVE_CONCEPT_MECHANICS,
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
} from "./types";

const IDEA_BASIC_PREFIX = "basic:";
const IDEA_INTERACTIVE_PREFIX = "interactive:";
const IDEA_EXPLORE_BASIC = "explore:basic";
const IDEA_EXPLORE_INTERACTIVE = "explore:interactive";

/** True for a predefined interactive concept (has hand-written mechanics in
 * game-taxonomy.ts) — false for anything the user typed themselves. Used to
 * decide whether the curriculum theme picker makes sense: a predefined
 * concept is a generic wrapper that needs a subject plugged in, but a
 * custom idea ("platformer ala Mario...") already carries its own premise
 * and forcing an unrelated SD/TK theme list onto it doesn't fit. */
function isKnownInteractiveConcept(value: string): boolean {
  return value in INTERACTIVE_CONCEPT_MECHANICS;
}

const BASIC_ORDER: StepId[] = [
  "idea",
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
  "idea",
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
    case "idea":
      return {
        id: "idea",
        selectMode: "single",
        allowCustom: false,
        optional: false,
        freeTextWithOptions: true,
        freeTextPlaceholder: 'Ceritakan ide bebasmu... (mis. "platformer ala Mario yang mengajarkan perkalian")',
        prompt: "👋 Halo! Mau bikin game edukasi apa hari ini? Ketik ide bebasmu, atau pilih salah satu contoh di bawah.",
        options: IDEA_SUGGESTIONS,
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

  if (step === "idea") {
    return submitIdeaAnswer(state, value);
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

  let nextStepId: StepId;
  if (step === "interactiveConcept" && typeof normalized === "string" && !isKnownInteractiveConcept(normalized)) {
    // Custom/free-typed concept: what it teaches is either already implied
    // by the concept itself or left to Claude's judgment — skip the
    // curriculum theme picker built for the predefined concepts.
    nextStepId = "ages";
  } else {
    const mode = nextAnswers.mode;
    const order = getStepOrder(mode);
    const idx = order.indexOf(step);
    nextStepId = order[idx + 1] ?? "done";
  }

  return {
    ok: true,
    state: { currentStep: nextStepId, answers: nextAnswers },
    summary: summarizeAnswer(step, nextAnswers),
  };
}

/** The opening step is a single quick-pick/free-text answer that can set
 * `mode` plus `gameTypes` or `interactiveConcept` in one go, and skips
 * straight past whichever downstream steps it already answered — see the
 * four branches below. */
function submitIdeaAnswer(state: FlowState, rawValue: string[] | string): SubmitResult {
  const value = (Array.isArray(rawValue) ? rawValue.join(" ") : rawValue).trim();
  if (!value) {
    return { ok: false, error: "Ceritakan idemu, atau pilih salah satu contoh di atas." };
  }

  let nextAnswers: FlowAnswers = { ...state.answers };
  let nextStepId: StepId;

  if (value === IDEA_EXPLORE_BASIC) {
    nextAnswers = { ...nextAnswers, mode: "basic" };
    nextStepId = "gameTypes";
  } else if (value === IDEA_EXPLORE_INTERACTIVE) {
    nextAnswers = { ...nextAnswers, mode: "interactive" };
    nextStepId = "interactiveConcept";
  } else if (value.startsWith(IDEA_BASIC_PREFIX)) {
    const gameType = value.slice(IDEA_BASIC_PREFIX.length);
    nextAnswers = { ...nextAnswers, mode: "basic", gameTypes: [gameType] };
    nextStepId = "themes";
  } else if (value.startsWith(IDEA_INTERACTIVE_PREFIX)) {
    const concept = value.slice(IDEA_INTERACTIVE_PREFIX.length);
    nextAnswers = { ...nextAnswers, mode: "interactive", interactiveConcept: concept };
    nextStepId = "themes";
  } else {
    // Free-typed idea, e.g. "platformer ala Mario yang mengajarkan
    // perkalian" — this IS the concept, bespoke and self-contained. No
    // forced curriculum-theme step: whatever it should teach is either
    // already in that sentence or left to the concept itself.
    nextAnswers = { ...nextAnswers, mode: "interactive", interactiveConcept: value };
    nextStepId = "ages";
  }

  return {
    ok: true,
    state: { currentStep: nextStepId, answers: nextAnswers },
    summary: summarizeIdeaAnswer(value, nextAnswers),
  };
}

function summarizeIdeaAnswer(value: string, answers: FlowAnswers): string {
  if (value === IDEA_EXPLORE_BASIC) return "🧩 Game Basic — pilih jenis sendiri";
  if (value === IDEA_EXPLORE_INTERACTIVE) return "🎮 Game Interaktif — pilih konsep sendiri";
  if (value.startsWith(IDEA_BASIC_PREFIX)) {
    return `🧩 Ide: ${labelFor(GAME_TYPES, answers.gameTypes?.[0] ?? "")}`;
  }
  if (value.startsWith(IDEA_INTERACTIVE_PREFIX)) {
    return `🎮 Ide: ${labelFor(INTERACTIVE_CONCEPTS, answers.interactiveConcept ?? "")}`;
  }
  return `💡 Ide: ${value}`;
}

function summarizeAnswer(stepId: StepId, answers: FlowAnswers): string {
  switch (stepId) {
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
  currentStep: "idea",
  answers: {},
};
