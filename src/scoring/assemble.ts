import type { ComponentCode, EvidenceGrade } from "@/domain/types";
import type { loadAssessmentBundle } from "@/db/repo";
import { COMPONENT_CODES } from "@/domain/types";
import { chamberVisual, connectionVisual, type ChamberVisual, type ConnectionVisual } from "@/visualization/encoding";
import { computeCfs, type CfsResult } from "./cfs";
import { diagnoseEngine, priorityQuestions, type ComponentProfile, type DiagnosisFinding } from "./diagnosis";
import { computeForce } from "./force";
import { rankMaisPriorities } from "./mais";
import { computeMds, type CriterionScoreInput, type MdsBreakdown } from "./mds";
import { readActivation } from "./activation";

type Bundle = NonNullable<Awaited<ReturnType<typeof loadAssessmentBundle>>>;

export type EngineModel = {
  profiles: Record<ComponentCode, ComponentProfile>;
  mds: Record<ComponentCode, MdsBreakdown>;
  cfs: CfsResult;
  chambers: ChamberVisual[];
  connections: ConnectionVisual[];
  findings: DiagnosisFinding[];
  questions: string[];
  priorities: ReturnType<typeof rankMaisPriorities>;
  calibrationRequired: boolean;
  threeWeakestCriteria: { code: string; nameVi: string; score: number; component: ComponentCode }[];
  evidenceGaps: string[];
  criticalLocks: string[];
  forceRisks: string[];
};

export function assembleEngine(bundle: Bundle): EngineModel {
  const thresholds = bundle.standard?.thresholds;
  if (!thresholds || !bundle.standard) {
    throw new Error("Thiếu phiên bản chuẩn gắn với đánh giá.");
  }

  const mds = {} as Record<ComponentCode, MdsBreakdown>;
  const profiles = {} as Record<ComponentCode, ComponentProfile>;
  const chambers: ChamberVisual[] = [];
  const evidenceGaps: string[] = [];
  const criticalLocks: string[] = [];
  const forceRisks: string[] = [];
  let calibrationRequired = false;
  const threeWeakestCriteria: EngineModel["threeWeakestCriteria"] = [];

  for (const code of COMPONENT_CODES) {
    const criteria = bundle.standard.criteria.filter((item) => item.componentCode === code);
    const inputs: CriterionScoreInput[] = criteria.map((criterion) => {
      const score = bundle.scores.find((item) => item.criterionId === criterion.id);
      return {
        criterionId: criterion.id,
        criterionCode: criterion.code,
        nameVi: criterion.nameVi,
        weight: criterion.weight,
        critical: criterion.critical,
        primaryScore: score?.primaryScore ?? null,
        secondaryScore: score?.secondaryScore ?? null,
        evidenceNote: score?.evidenceNote ?? "",
        calibrationStatus: score?.calibrationStatus ?? "NONE",
      };
    });
    const component = bundle.components.find((item) => item.componentCode === code);
    const breakdown = computeMds(inputs, component?.evidenceGrade ?? null, thresholds);
    mds[code] = breakdown;
    calibrationRequired = calibrationRequired || breakdown.calibrationRequired;
    evidenceGaps.push(...breakdown.missingEvidence.map((item) => `${code}/${item}`));
    if (breakdown.appliedCriticalCap) {
      criticalLocks.push(
        `${code}: trần khóa tới hạn ${breakdown.criticalCap} (MDS thô ${breakdown.rawMds})`,
      );
    }
    const forceRow = bundle.forces.find((item) => item.componentCode === code);
    const force = computeForce({
      direction: forceRow?.direction ?? null,
      scope: forceRow?.scope ?? null,
      intensity: forceRow?.intensity ?? null,
      duration: forceRow?.duration ?? null,
      bottleneckProximity: forceRow?.bottleneckProximity ?? null,
      evidenceGrade: forceRow?.evidenceGrade ?? null,
    });
    if (force.force != null && force.force < 0) {
      forceRisks.push(`${code}: lực ${force.force} (${force.direction})`);
    }
    const activation = readActivation(
      bundle.activations.find((item) => item.componentCode === code) ?? {
        score: null,
        rationale: "",
        evidenceReferences: "",
        assessedAt: null,
        scope: "",
      },
    );
    const profile: ComponentProfile = {
      code,
      rawMds: breakdown.rawMds,
      finalMds: breakdown.finalMds,
      activation: activation.score,
      force,
      evidenceGrade: component?.evidenceGrade ?? null,
      weakestCriteria: breakdown.weakestCriteria,
      criticalLocks: breakdown.appliedCriticalCap
        ? [`${code} bị trần khóa tới hạn ${breakdown.criticalCap}`]
        : [],
    };
    profiles[code] = profile;
    threeWeakestCriteria.push(
      ...breakdown.weakestCriteria.map((item) => ({ ...item, component: code })),
    );
    chambers.push(
      chamberVisual({
        code,
        requiredLevel: component?.requiredLevel ?? 7,
        rawMds: breakdown.rawMds,
        finalMds: breakdown.finalMds,
        activation: activation.score,
        evidenceGrade: component?.evidenceGrade ?? null,
        forceDirection: force.direction,
        forceMagnitude: force.magnitude ?? 0,
        warning: breakdown.appliedCriticalCap || (force.force != null && force.force <= -4),
      }),
    );
  }

  const overallEvidence: EvidenceGrade | null = (() => {
    const grades = bundle.components.map((item) => item.evidenceGrade).filter(Boolean) as EvidenceGrade[];
    if (grades.includes("D")) return "D";
    if (grades.includes("C")) return "C";
    if (grades.includes("B")) return "B";
    if (grades.includes("A")) return "A";
    return null;
  })();

  const cfs = computeCfs(
    bundle.cfs.map((item) => ({
      connectionCode: item.connectionCode,
      score: item.score,
      evidenceStatus: item.evidenceStatus,
      evidence: item.evidence,
    })),
    bundle.standard.connections,
    thresholds,
    overallEvidence,
  );

  const connections = bundle.standard.connections.map((connection) => {
    const row = bundle.cfs.find((item) => item.connectionCode === connection.code);
    return connectionVisual({
      code: connection.code,
      score: row?.score ?? null,
      hypothesis: row?.evidenceStatus !== "VERIFIED",
      critical: connection.critical,
    });
  });

  const findings = diagnoseEngine(
    profiles,
    cfs,
    bundle.cfs.map((item) => ({ code: item.connectionCode, score: item.score })),
  );
  const questions = priorityQuestions(findings);
  const priorities = rankMaisPriorities(profiles, cfs);

  threeWeakestCriteria.sort((a, b) => a.score - b.score);

  return {
    profiles,
    mds,
    cfs,
    chambers,
    connections,
    findings,
    questions,
    priorities,
    calibrationRequired,
    threeWeakestCriteria: threeWeakestCriteria.slice(0, 3),
    evidenceGaps,
    criticalLocks,
    forceRisks,
  };
}
