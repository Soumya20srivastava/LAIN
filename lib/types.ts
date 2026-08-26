export type ExplanationStatus =
  | "current"
  | "outdated"
  | "ironic"
  | "offensive"
  | "context-dependent";

export interface UsageExample {
  text: string;
  context: string;
}

export interface Explanation {
  term: string;
  category: string;
  summary: string;
  meaning: string;
  origin: string;
  popularity: string;
  usage: string;
  tone: string;
  status: ExplanationStatus;
  statusNote: string;
  examples: UsageExample[];
  related: string[];
}
