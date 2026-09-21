import { MNEMONIC_DISCLAIMER, DEVELOPMENT_DISCLAIMER } from "@/domain/labels";
import type { ComponentCode } from "@/domain/types";
import type { EngineModel } from "@/scoring/assemble";
import { cfsConnectionCopy, componentLabels } from "@/mybizcar/domain";
import type { ChamberView, ConnectionView, EngineViewModel } from "@/mybizcar/visualization/view-model";

export type EngineViewExtras = {
  narratives?: Partial<Record<ComponentCode, string>>;
  forceNotes?: Partial<Record<ComponentCode, string>>;
  connectionNotes?: Partial<
    Record<
      string,
      {
        note?: string;
        recommendedCheck?: string;
        evidenceStatus?: string;
        deviation?: string;
      }
    >
  >;
};

export function extrasFromBundle(bundle: {
  components: Array<{ componentCode: ComponentCode; narrative: string }>;
  forces: Array<{ componentCode: ComponentCode; evidenceNote: string }>;
  cfs: Array<{
    connectionCode: string;
    evidence: string;
    evidenceStatus: string;
    deviationSignal: string;
    evaluatorNote: string;
  }>;
}): EngineViewExtras {
  const narratives: EngineViewExtras["narratives"] = {};
  const forceNotes: EngineViewExtras["forceNotes"] = {};
  const connectionNotes: EngineViewExtras["connectionNotes"] = {};
  for (const row of bundle.components) narratives[row.componentCode] = row.narrative;
  for (const row of bundle.forces) forceNotes[row.componentCode] = row.evidenceNote;
  for (const row of bundle.cfs) {
    connectionNotes[row.connectionCode] = {
      note: row.evidence || row.evaluatorNote,
      evidenceStatus: row.evidenceStatus,
      deviation: row.deviationSignal,
    };
  }
  return { narratives, forceNotes, connectionNotes };
}

function flowDirFrom(direction: ChamberView["flowDir"] | "POSITIVE" | "NEGATIVE" | "NEUTRAL" | null): ChamberView["flowDir"] {
  if (direction === "POSITIVE" || direction === 1) return 1;
  if (direction === "NEGATIVE" || direction === -1) return -1;
  return 0;
}

export function engineViewFromModel(model: EngineModel, extras: EngineViewExtras = {}): EngineViewModel {
  const chambers: ChamberView[] = model.chambers.map((chamber) => {
    const profile = model.profiles[chamber.code];
    const mds = model.mds[chamber.code];
    const relatedGaps = model.connections
      .filter((row) => row.from === chamber.code || row.to === chamber.code)
      .map((row) => row.gap);
    const gap = relatedGaps.length > 0 ? Math.max(...relatedGaps) : 0.28;
    const force = profile?.force.force ?? null;
    const label = componentLabels[chamber.code];
    const weakest = (profile?.weakestCriteria ?? [])
      .map((item) => `${item.code} ${item.nameVi}: ${item.score}`)
      .join(" · ");
    return {
      code: chamber.code,
      mnemonic: chamber.mnemonic,
      name: label.name,
      size: Math.min(1, Math.max(0.2, (chamber.requiredScale - 0.72) / 0.55)),
      completeness: chamber.completeness,
      opacity: chamber.opacity,
      warning: chamber.warning,
      mdsFinal: chamber.finalMds,
      mdsRaw: chamber.rawMds,
      activation: chamber.activation,
      force,
      forceWhy: profile?.force.explanation ?? [],
      forceEvidenceNote: extras.forceNotes?.[chamber.code] ?? "",
      forceUnsupported: profile?.force.unsupported ?? false,
      evidence: chamber.evidenceGrade,
      weakest,
      why: mds?.explanation ?? [],
      statement: extras.narratives?.[chamber.code] ?? "",
      nextChecks: weakest ? [`Rà soát tiêu chí yếu: ${weakest}.`] : [],
      gap,
      flow: Math.max(0, Math.min(1.2, Math.abs(force ?? 0) / 5)),
      flowDir: flowDirFrom(chamber.forceDirection),
    };
  });

  const connections: ConnectionView[] = model.connections.map((row) => {
    const copy = cfsConnectionCopy[row.code];
    const extra = extras.connectionNotes?.[row.code];
    return {
      code: row.code,
      from: row.from,
      to: row.to,
      score: row.score,
      dashed: row.dashed,
      thickness: 1.2 + ((row.score ?? 0) / 10) * 1.2,
      fitStandard: copy?.fitStandard ?? row.labelVi,
      deviation: extra?.deviation || copy?.deviation || "",
      evidenceStatus: extra?.evidenceStatus ?? (row.dashed ? "HYPOTHESIS" : "VERIFIED"),
      recommendedCheck: extra?.recommendedCheck ?? "",
      note: extra?.note ?? "",
    };
  });

  return {
    mnemonicNote: DEVELOPMENT_DISCLAIMER,
    disclaimer: MNEMONIC_DISCLAIMER,
    chambers,
    connections,
  };
}
