import { z } from "zod";

export const actionSchema = z.object({
  assessmentId: z.string().uuid(),
  title: z.string().min(4).max(200),
  stage: z.enum(["MEASURE", "ANALYZE", "IMPROVE", "STANDARDIZE"]),
  componentCode: z.enum(["M", "T", "U", "A"]).optional().or(z.literal("")),
  symptom: z.string().max(2000).optional().default(""),
  causeHypothesis: z.string().max(2000).optional().default(""),
  connectionNote: z.string().max(1000).optional().default(""),
  sideEffect: z.string().max(1000).optional().default(""),
  ownerName: z.string().min(2).max(120),
  scope: z.string().min(2).max(200),
  testPeriod: z.string().min(2).max(80),
  priorityReason: z.string().min(4).max(400),
});

export const experimentSchema = z.object({
  assessmentId: z.string().uuid(),
  title: z.string().min(4).max(200),
  startDate: z.string().min(8),
});

export const experimentDecisionSchema = z.object({
  experimentId: z.string(),
  assessmentId: z.string().uuid(),
  decision: z.enum(["KEEP", "IMPROVE", "STOP"]),
  decisionNote: z.string().min(4).max(2000),
});
