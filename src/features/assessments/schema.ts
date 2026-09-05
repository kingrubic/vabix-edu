import { z } from "zod";

export const organizationSchema = z.object({
  name: z.string().min(3).max(160),
  industry: z.string().min(2).max(120),
  stage: z.string().min(2).max(80),
  size: z.string().min(1).max(80),
});

export const newAssessmentSchema = z.object({
  organizationId: z.string().uuid(),
  title: z.string().min(4).max(180),
});

export const contextSchema = z.object({
  assessmentId: z.string().uuid(),
  businessUnit: z.string().min(1).max(160),
  industry: z.string().min(1).max(120),
  companyStage: z.string().min(1).max(80),
  companySize: z.string().min(1).max(80),
  scope: z.string().min(1).max(400),
  timeHorizon: z.string().min(1).max(80),
  notes: z.string().max(2000).optional().default(""),
});

export const criterionPatchSchema = z.object({
  assessmentId: z.string().uuid(),
  criterionCode: z.string().min(2),
  primaryScore: z.coerce.number().min(1).max(10),
  secondaryScore: z.union([z.coerce.number().min(1).max(10), z.literal("")]).optional(),
  evidenceNote: z.string().max(4000).optional().default(""),
  evidenceReferences: z.string().max(2000).optional().default(""),
  evaluatorExplanation: z.string().max(4000).optional().default(""),
  reason: z.string().min(3).max(400),
});

export const componentMetaSchema = z.object({
  assessmentId: z.string().uuid(),
  componentCode: z.enum(["M", "T", "U", "A"]),
  requiredLevel: z.coerce.number().min(1).max(10),
  evidenceGrade: z.enum(["D", "C", "B", "A"]),
  narrative: z.string().max(4000).optional().default(""),
  reason: z.string().min(3).max(400),
});

export const activationSchema = z.object({
  assessmentId: z.string().uuid(),
  componentCode: z.enum(["M", "T", "U", "A"]),
  score: z.coerce.number().min(1).max(10),
  rationale: z.string().min(8).max(4000),
  evidenceReferences: z.string().max(2000).optional().default(""),
  scope: z.string().min(2).max(200),
  assessedAt: z.string().min(8),
  reason: z.string().min(3).max(400),
});

export const forceSchema = z.object({
  assessmentId: z.string().uuid(),
  componentCode: z.enum(["M", "T", "U", "A"]),
  direction: z.enum(["POSITIVE", "NEGATIVE", "NEUTRAL"]),
  scope: z.coerce.number().min(1).max(10),
  intensity: z.coerce.number().min(1).max(10),
  duration: z.coerce.number().min(1).max(10),
  bottleneckProximity: z.coerce.number().min(1).max(10),
  evidenceGrade: z.enum(["D", "C", "B", "A"]),
  evidenceNote: z.string().max(4000).optional().default(""),
  reason: z.string().min(3).max(400),
});

export const cfsSchema = z.object({
  assessmentId: z.string().uuid(),
  connectionCode: z.enum(["MT", "MU", "MA", "TU", "TA", "UA"]),
  score: z.coerce.number().min(1).max(10),
  evidence: z.string().min(4).max(4000),
  evidenceStatus: z.enum(["VERIFIED", "HYPOTHESIS"]),
  deviationSignal: z.string().max(400).optional().default(""),
  evaluatorNote: z.string().max(4000).optional().default(""),
  reason: z.string().min(3).max(400),
});

export const evidenceItemSchema = z.object({
  assessmentId: z.string().uuid(),
  title: z.string().min(3).max(180),
  note: z.string().max(4000).optional().default(""),
  linkUrl: z.string().url().optional().or(z.literal("")),
  componentCode: z.enum(["M", "T", "U", "A"]).optional(),
  criterionCode: z.string().optional(),
  kind: z.enum(["NOTE", "LINK", "FILE", "DECISION_RECORD"]),
});

export const statusSchema = z.object({
  assessmentId: z.string().uuid(),
  status: z.enum([
    "DRAFT",
    "DATA_COLLECTION",
    "SELF_ASSESSED",
    "UNDER_REVIEW",
    "CALIBRATION_REQUIRED",
    "LOCKED",
    "IMPROVEMENT",
    "ARCHIVED",
  ]),
  reason: z.string().min(3).max(400),
});

export const commentSchema = z.object({
  assessmentId: z.string().uuid(),
  body: z.string().min(3).max(2000),
});
