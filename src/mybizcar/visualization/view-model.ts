export type ChamberView = {
  code: "M" | "T" | "U" | "A";
  mnemonic: string;
  name: string;
  size: number;
  completeness: number;
  opacity: number;
  warning: boolean;
  mdsFinal: number | null;
  mdsRaw: number | null;
  activation: number | null;
  force: number | null;
  forceWhy: string[];
  forceEvidenceNote: string;
  forceUnsupported: boolean;
  evidence: string | null;
  weakest: string;
  why: string[];
  statement: string;
  nextChecks: string[];
  gap: number;
  flow: number;
  flowDir: 1 | -1 | 0;
};

export type ConnectionView = {
  code: string;
  from: "M" | "T" | "U" | "A";
  to: "M" | "T" | "U" | "A";
  score: number | null;
  dashed: boolean;
  thickness: number;
  fitStandard: string;
  deviation: string;
  evidenceStatus: string;
  recommendedCheck: string;
  note: string;
};

export type EngineViewModel = {
  mnemonicNote: string;
  disclaimer: string;
  chambers: ChamberView[];
  connections: ConnectionView[];
};
