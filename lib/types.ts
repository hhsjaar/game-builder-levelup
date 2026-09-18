export type GameMode = "basic" | "interactive";

export type ConversationStatus =
  | "collecting"
  | "generating"
  | "completed"
  | "error";

export type MessageRole = "assistant" | "user";

export type MessageType = "text" | "options" | "summary" | "game_result";

export interface MessageRecord {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  message_type: MessageType;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface ConversationRecord {
  id: string;
  client_id: string;
  mode: GameMode | null;
  title: string | null;
  status: ConversationStatus;
  flow_state: FlowState;
  created_at: string;
  updated_at: string;
}

export interface GeneratedGameRecord {
  id: string;
  conversation_id: string;
  spec: GameSpec;
  html_content: string;
  created_at: string;
}

/** One step in the wizard. `field` is where the answer is stored in GameSpec. */
export type StepId =
  | "mode"
  | "gameTypes"
  | "interactiveConcept"
  | "themes"
  | "ages"
  | "difficulty"
  | "features"
  | "gameName"
  | "colorTheme"
  | "designNotes"
  | "specialInstructions"
  | "done";

export type SelectMode = "single" | "multi";

export interface StepOption {
  value: string;
  label: string;
  /** Decorative emoji shown next to the label in the UI — kept separate from
   * `label` so prompt text sent to Claude stays plain. */
  emoji?: string;
}

export interface StepDefinition {
  id: StepId;
  prompt: string;
  selectMode: SelectMode;
  options: StepOption[];
  allowCustom: boolean;
  optional: boolean;
  /** Free-text input instead of option picker (e.g. Nama Game). */
  freeText?: boolean;
}

/** Answers collected so far, keyed by field name. Values are string arrays for
 * multi/single select steps (single-select still stored as a 1-length array),
 * plain strings for free-text steps. */
export interface FlowAnswers {
  mode?: GameMode;
  gameTypes?: string[];
  interactiveConcept?: string;
  themes?: string[];
  ages?: string[];
  difficulty?: string;
  features?: string[];
  gameName?: string;
  colorTheme?: string;
  designNotes?: string;
  specialInstructions?: string;
}

export interface FlowState {
  currentStep: StepId;
  answers: FlowAnswers;
}

/** Fully resolved spec, ready to hand to the prompt builder. */
export interface GameSpec extends Required<Omit<FlowAnswers, "interactiveConcept" | "designNotes" | "specialInstructions">> {
  mode: GameMode;
  interactiveConcept?: string;
  designNotes?: string;
  specialInstructions?: string;
}
