export const ROLES = [
  "SUPER_ADMIN",
  "ACADEMIC_ADMIN",
  "COACH_EVALUATOR",
  "COMPANY_ADMIN",
  "COMPANY_MEMBER",
  "VIEWER",
] as const;

export type Role = (typeof ROLES)[number];

export const ASSESSMENT_STATUSES = [
  "DRAFT",
  "DATA_COLLECTION",
  "SELF_ASSESSED",
  "UNDER_REVIEW",
  "CALIBRATION_REQUIRED",
  "LOCKED",
  "IMPROVEMENT",
  "ARCHIVED",
] as const;

export type AssessmentStatus = (typeof ASSESSMENT_STATUSES)[number];

export const COMPONENT_CODES = ["M", "T", "U", "A"] as const;
export type ComponentCode = (typeof COMPONENT_CODES)[number];

export const EVIDENCE_GRADES = ["D", "C", "B", "A"] as const;
export type EvidenceGrade = (typeof EVIDENCE_GRADES)[number];

export const FORCE_DIRECTIONS = ["POSITIVE", "NEGATIVE", "NEUTRAL"] as const;
export type ForceDirection = (typeof FORCE_DIRECTIONS)[number];

export const CFS_CODES = ["MT", "MU", "MA", "TU", "TA", "UA"] as const;
export type CfsCode = (typeof CFS_CODES)[number];

export const CRITICAL_CFS_CODES: CfsCode[] = ["MT", "MA", "TU", "UA"];

export const EVIDENCE_STATUSES = ["VERIFIED", "HYPOTHESIS"] as const;
export type EvidenceStatus = (typeof EVIDENCE_STATUSES)[number];

export const CALIBRATION_STATUSES = ["NONE", "PENDING", "RESOLVED"] as const;
export type CalibrationStatus = (typeof CALIBRATION_STATUSES)[number];

export const EXPERIMENT_DECISIONS = ["KEEP", "IMPROVE", "STOP"] as const;
export type ExperimentDecision = (typeof EXPERIMENT_DECISIONS)[number];

export const STANDARD_STATUSES = ["DEVELOPMENT", "APPROVED", "DEPRECATED"] as const;
export type StandardStatus = (typeof STANDARD_STATUSES)[number];

export const MAIS_STAGES = ["MEASURE", "ANALYZE", "IMPROVE", "STANDARDIZE"] as const;
export type MaisStage = (typeof MAIS_STAGES)[number];

export type User = {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  isDemo: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type Organization = {
  id: string;
  name: string;
  slug: string;
  industry: string;
  stage: string;
  size: string;
  isDemo: boolean;
  confidentialityNote: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type OrganizationMember = {
  id: string;
  organizationId: string;
  userId: string;
  role: Role;
  createdAt: string;
  createdBy: string;
};

export type StandardVersion = {
  id: string;
  code: string;
  name: string;
  version: string;
  status: StandardStatus;
  effectiveDate: string;
  approvalNote: string;
  changeReason: string;
  impactNote: string;
  developmentDisclaimer: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type StandardComponent = {
  id: string;
  standardVersionId: string;
  code: ComponentCode;
  nameEn: string;
  nameVi: string;
  mnemonic: string;
  mnemonicMeaning: string;
  requiredLevelDefault: number;
  sortOrder: number;
};

export type StandardCriterion = {
  id: string;
  standardVersionId: string;
  componentCode: ComponentCode;
  code: string;
  nameVi: string;
  weight: number;
  critical: boolean;
  sortOrder: number;
};

export type CriterionAnchor = {
  id: string;
  criterionId: string;
  score: 1 | 3 | 5 | 7 | 9 | 10;
  descriptionVi: string;
};

export type StandardCfsConnection = {
  id: string;
  standardVersionId: string;
  code: CfsCode;
  from: ComponentCode;
  to: ComponentCode;
  nameVi: string;
  weight: number;
  critical: boolean;
  weightAssumptionNote: string;
};

export type StandardThresholds = {
  id: string;
  standardVersionId: string;
  calibrationScoreDelta: number;
  criticalScoreCap2: number;
  criticalScoreCap4: number;
  evidenceCapD: number;
  evidenceCapC: number;
  cfsCriticalConnectionFloor: number;
  cfsCriticalCap: number;
  cfsFormulaNote: string;
  activationFormulaNote: string;
  visualMappingNote: string;
};

export type Assessment = {
  id: string;
  organizationId: string;
  parentAssessmentId: string | null;
  revisionNumber: number;
  title: string;
  status: AssessmentStatus;
  standardVersionId: string;
  primaryEvaluatorId: string;
  secondaryEvaluatorId: string | null;
  assessmentDate: string;
  nextReviewDate: string | null;
  isDemo: boolean;
  lockedAt: string | null;
  lockedBy: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type AssessmentContext = {
  id: string;
  assessmentId: string;
  businessUnit: string;
  industry: string;
  companyStage: string;
  companySize: string;
  scope: string;
  timeHorizon: string;
  notes: string;
  updatedAt: string;
};

export type ComponentAssessment = {
  id: string;
  assessmentId: string;
  componentCode: ComponentCode;
  requiredLevel: number;
  evidenceGrade: EvidenceGrade | null;
  narrative: string;
  updatedAt: string;
};

export type CriterionScore = {
  id: string;
  assessmentId: string;
  criterionId: string;
  criterionCode: string;
  primaryScore: number | null;
  secondaryScore: number | null;
  evidenceNote: string;
  evidenceReferences: string;
  evaluatorExplanation: string;
  calibrationStatus: CalibrationStatus;
  updatedAt: string;
  updatedBy: string;
};

export type ActivationAssessment = {
  id: string;
  assessmentId: string;
  componentCode: ComponentCode;
  score: number | null;
  rationale: string;
  evidenceReferences: string;
  assessedAt: string | null;
  scope: string;
  updatedAt: string;
  updatedBy: string;
};

export type ForceAssessment = {
  id: string;
  assessmentId: string;
  componentCode: ComponentCode;
  direction: ForceDirection | null;
  scope: number | null;
  intensity: number | null;
  duration: number | null;
  bottleneckProximity: number | null;
  evidenceGrade: EvidenceGrade | null;
  evidenceNote: string;
  updatedAt: string;
  updatedBy: string;
};

export type CfsConnectionScore = {
  id: string;
  assessmentId: string;
  connectionCode: CfsCode;
  score: number | null;
  evidence: string;
  evidenceStatus: EvidenceStatus;
  deviationSignal: string;
  evaluatorNote: string;
  updatedAt: string;
  updatedBy: string;
};

export type EvidenceItem = {
  id: string;
  assessmentId: string;
  componentCode: ComponentCode | null;
  criterionCode: string | null;
  connectionCode: CfsCode | null;
  title: string;
  note: string;
  linkUrl: string | null;
  storageKey: string | null;
  mimeType: string | null;
  fileName: string | null;
  fileSize: number | null;
  kind: "NOTE" | "LINK" | "FILE" | "DECISION_RECORD";
  createdAt: string;
  createdBy: string;
};

export type AssessmentSnapshot = {
  id: string;
  assessmentId: string;
  kind: "LOCK" | "BASELINE" | "REASSESS";
  payloadJson: string;
  createdAt: string;
  createdBy: string;
};

export type ImprovementExperiment = {
  id: string;
  assessmentId: string;
  title: string;
  baselineLockedAt: string | null;
  startDate: string | null;
  decision: ExperimentDecision | null;
  decisionNote: string;
  compareAssessmentId: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type ImprovementAction = {
  id: string;
  assessmentId: string;
  experimentId: string | null;
  stage: MaisStage;
  componentCode: ComponentCode | null;
  title: string;
  symptom: string;
  causeHypothesis: string;
  connectionNote: string;
  sideEffect: string;
  ownerUserId: string | null;
  ownerName: string;
  scope: string;
  testPeriod: string;
  mechanism: string;
  evidence: string;
  reviewDate: string | null;
  priorityScore: number;
  priorityReason: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
};

export type Comment = {
  id: string;
  assessmentId: string;
  body: string;
  createdAt: string;
  createdBy: string;
};

export type AuditLog = {
  id: string;
  actorUserId: string;
  organizationId: string | null;
  assessmentId: string | null;
  action: string;
  entityType: string;
  entityId: string;
  oldValue: string | null;
  newValue: string | null;
  reason: string | null;
  standardVersionId: string | null;
  ip: string | null;
  createdAt: string;
};

export type SharePermission = {
  id: string;
  assessmentId: string;
  userId: string;
  canEdit: boolean;
  createdAt: string;
  createdBy: string;
};

export type RevokedSession = {
  id: string;
  jti: string;
  userId: string;
  revokedAt: string;
};

export type StoreShape = {
  users: User[];
  organizations: Organization[];
  organizationMembers: OrganizationMember[];
  standardVersions: StandardVersion[];
  standardComponents: StandardComponent[];
  standardCriteria: StandardCriterion[];
  criterionAnchors: CriterionAnchor[];
  standardCfsConnections: StandardCfsConnection[];
  standardThresholds: StandardThresholds[];
  assessments: Assessment[];
  assessmentContexts: AssessmentContext[];
  componentAssessments: ComponentAssessment[];
  criterionScores: CriterionScore[];
  activationAssessments: ActivationAssessment[];
  forceAssessments: ForceAssessment[];
  cfsConnectionScores: CfsConnectionScore[];
  evidenceItems: EvidenceItem[];
  assessmentSnapshots: AssessmentSnapshot[];
  improvementExperiments: ImprovementExperiment[];
  improvementActions: ImprovementAction[];
  comments: Comment[];
  auditLogs: AuditLog[];
  sharePermissions: SharePermission[];
  revokedSessions: RevokedSession[];
};
