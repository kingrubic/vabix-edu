import type {
  ActivationAssessment,
  Assessment,
  AssessmentContext,
  CfsConnectionScore,
  ComponentAssessment,
  CriterionScore,
  EvidenceItem,
  ForceAssessment,
  ImprovementAction,
  ImprovementExperiment,
  Organization,
  OrganizationMember,
  StoreShape,
  User,
} from "@/domain/types";
import {
  criterionAnchors,
  STANDARD_VERSION_ID,
  standardCfsConnections,
  standardComponents,
  standardCriteria,
  standardThresholds,
  standardVersion,
} from "@/standards/bmdo-mds-01-mtua-0.1";
import { CFS_CODES, COMPONENT_CODES } from "@/domain/types";
import { IDS } from "./ids";

const now = "2026-09-01T08:00:00.000Z";

function emptyStore(): StoreShape {
  return {
    users: [],
    organizations: [],
    organizationMembers: [],
    standardVersions: [],
    standardComponents: [],
    standardCriteria: [],
    criterionAnchors: [],
    standardCfsConnections: [],
    standardThresholds: [],
    assessments: [],
    assessmentContexts: [],
    componentAssessments: [],
    criterionScores: [],
    activationAssessments: [],
    forceAssessments: [],
    cfsConnectionScores: [],
    evidenceItems: [],
    assessmentSnapshots: [],
    improvementExperiments: [],
    improvementActions: [],
    comments: [],
    auditLogs: [],
    sharePermissions: [],
    revokedSessions: [],
  };
}

export function createEmptyAssessmentRecords(input: {
  assessmentId: string;
  organizationId: string;
  createdBy: string;
  title: string;
  primaryEvaluatorId: string;
  isDemo?: boolean;
  now?: string;
}): {
  assessment: Assessment;
  context: AssessmentContext;
  components: ComponentAssessment[];
  scores: CriterionScore[];
  activations: ActivationAssessment[];
  forces: ForceAssessment[];
  cfs: CfsConnectionScore[];
} {
  const stamp = input.now ?? new Date().toISOString();
  const assessment: Assessment = {
    id: input.assessmentId,
    organizationId: input.organizationId,
    parentAssessmentId: null,
    revisionNumber: 1,
    title: input.title,
    status: "DRAFT",
    standardVersionId: STANDARD_VERSION_ID,
    primaryEvaluatorId: input.primaryEvaluatorId,
    secondaryEvaluatorId: null,
    assessmentDate: stamp.slice(0, 10),
    nextReviewDate: null,
    isDemo: Boolean(input.isDemo),
    lockedAt: null,
    lockedBy: null,
    createdAt: stamp,
    updatedAt: stamp,
    createdBy: input.createdBy,
  };
  const context: AssessmentContext = {
    id: `ctx-${input.assessmentId}`,
    assessmentId: input.assessmentId,
    businessUnit: "Toàn công ty",
    industry: "",
    companyStage: "",
    companySize: "",
    scope: "",
    timeHorizon: "12 tháng",
    notes: "",
    updatedAt: stamp,
  };
  const components = COMPONENT_CODES.map((code) => {
    const required = standardComponents.find((item) => item.code === code)?.requiredLevelDefault ?? 7;
    return {
      id: `ca-${input.assessmentId}-${code}`,
      assessmentId: input.assessmentId,
      componentCode: code,
      requiredLevel: required,
      evidenceGrade: null,
      narrative: "",
      updatedAt: stamp,
    } satisfies ComponentAssessment;
  });
  const scores = standardCriteria.map(
    (criterion) =>
      ({
        id: `cs-${input.assessmentId}-${criterion.code}`,
        assessmentId: input.assessmentId,
        criterionId: criterion.id,
        criterionCode: criterion.code,
        primaryScore: null,
        secondaryScore: null,
        evidenceNote: "",
        evidenceReferences: "",
        evaluatorExplanation: "",
        calibrationStatus: "NONE",
        updatedAt: stamp,
        updatedBy: input.createdBy,
      }) satisfies CriterionScore,
  );
  const activations = COMPONENT_CODES.map(
    (code) =>
      ({
        id: `act-${input.assessmentId}-${code}`,
        assessmentId: input.assessmentId,
        componentCode: code,
        score: null,
        rationale: "",
        evidenceReferences: "",
        assessedAt: null,
        scope: "",
        updatedAt: stamp,
        updatedBy: input.createdBy,
      }) satisfies ActivationAssessment,
  );
  const forces = COMPONENT_CODES.map(
    (code) =>
      ({
        id: `frc-${input.assessmentId}-${code}`,
        assessmentId: input.assessmentId,
        componentCode: code,
        direction: null,
        scope: null,
        intensity: null,
        duration: null,
        bottleneckProximity: null,
        evidenceGrade: null,
        evidenceNote: "",
        updatedAt: stamp,
        updatedBy: input.createdBy,
      }) satisfies ForceAssessment,
  );
  const cfs = CFS_CODES.map(
    (code) =>
      ({
        id: `cfs-${input.assessmentId}-${code}`,
        assessmentId: input.assessmentId,
        connectionCode: code,
        score: null,
        evidence: "",
        evidenceStatus: "HYPOTHESIS",
        deviationSignal: "",
        evaluatorNote: "",
        updatedAt: stamp,
        updatedBy: input.createdBy,
      }) satisfies CfsConnectionScore,
  );
  return { assessment, context, components, scores, activations, forces, cfs };
}

export function buildSeedStore(passwordHash: string): StoreShape {
  const store = emptyStore();
  const users: User[] = [
    {
      id: IDS.users.superAdmin,
      email: "admin@vabix.edu.vn",
      name: "Quản trị nền tảng VABIX",
      passwordHash,
      isDemo: true,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: IDS.users.academic,
      email: "academic@vabix.edu.vn",
      name: "Quản trị học thuật BMDO",
      passwordHash,
      isDemo: true,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: IDS.users.coach,
      email: "coach@vabix.edu.vn",
      name: "Huấn luyện viên đánh giá",
      passwordHash,
      isDemo: true,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: IDS.users.companyAdmin,
      email: "ceo@demo.vabix.edu.vn",
      name: "Tổng giám đốc — Công ty minh họa",
      passwordHash,
      isDemo: true,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: IDS.users.member,
      email: "member@demo.vabix.edu.vn",
      name: "Thành viên doanh nghiệp minh họa",
      passwordHash,
      isDemo: true,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: IDS.users.viewer,
      email: "viewer@demo.vabix.edu.vn",
      name: "Người xem được chia sẻ",
      passwordHash,
      isDemo: true,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
  ];

  const organizations: Organization[] = [
    {
      id: IDS.orgs.platform,
      name: "VABIX Platform",
      slug: "vabix-platform",
      industry: "Giáo dục quản trị",
      stage: "Nền tảng",
      size: "Nhóm học thuật",
      isDemo: false,
      confidentialityNote: "Tổ chức vận hành nền tảng — không phải doanh nghiệp khách.",
      createdAt: now,
      updatedAt: now,
      createdBy: IDS.users.superAdmin,
    },
    {
      id: IDS.orgs.demo,
      name: "DEMO COMPANY — DỮ LIỆU MINH HỌA",
      slug: "demo-company",
      industry: "Sản xuất thiết bị công nghiệp vừa",
      stage: "Tăng trưởng",
      size: "120 người",
      isDemo: true,
      confidentialityNote: "Dữ liệu minh họa. Không trộn với doanh nghiệp thật.",
      createdAt: now,
      updatedAt: now,
      createdBy: IDS.users.superAdmin,
    },
  ];

  const organizationMembers: OrganizationMember[] = [
    {
      id: "mem-platform-admin",
      organizationId: IDS.orgs.platform,
      userId: IDS.users.superAdmin,
      role: "SUPER_ADMIN",
      createdAt: now,
      createdBy: IDS.users.superAdmin,
    },
    {
      id: "mem-platform-academic",
      organizationId: IDS.orgs.platform,
      userId: IDS.users.academic,
      role: "ACADEMIC_ADMIN",
      createdAt: now,
      createdBy: IDS.users.superAdmin,
    },
    {
      id: "mem-demo-coach",
      organizationId: IDS.orgs.demo,
      userId: IDS.users.coach,
      role: "COACH_EVALUATOR",
      createdAt: now,
      createdBy: IDS.users.superAdmin,
    },
    {
      id: "mem-demo-ceo",
      organizationId: IDS.orgs.demo,
      userId: IDS.users.companyAdmin,
      role: "COMPANY_ADMIN",
      createdAt: now,
      createdBy: IDS.users.superAdmin,
    },
    {
      id: "mem-demo-member",
      organizationId: IDS.orgs.demo,
      userId: IDS.users.member,
      role: "COMPANY_MEMBER",
      createdAt: now,
      createdBy: IDS.users.companyAdmin,
    },
    {
      id: "mem-demo-viewer",
      organizationId: IDS.orgs.demo,
      userId: IDS.users.viewer,
      role: "VIEWER",
      createdAt: now,
      createdBy: IDS.users.companyAdmin,
    },
  ];

  const created = createEmptyAssessmentRecords({
    assessmentId: IDS.assessment.demo,
    organizationId: IDS.orgs.demo,
    createdBy: IDS.users.coach,
    title: "Đánh giá MTUA minh họa — kỳ 2026.1",
    primaryEvaluatorId: IDS.users.coach,
    isDemo: true,
    now,
  });

  created.assessment.status = "UNDER_REVIEW";
  created.assessment.secondaryEvaluatorId = IDS.users.academic;
  created.assessment.nextReviewDate = "2026-10-01";
  created.context.industry = "Sản xuất thiết bị công nghiệp vừa";
  created.context.companyStage = "Tăng trưởng";
  created.context.companySize = "120 người";
  created.context.scope = "Toàn công ty — hệ thống quản trị điều hành";
  created.context.timeHorizon = "18 tháng";
  created.context.notes =
    "Hồ sơ minh họa có chủ đích: Mission thiết kế cao nhưng kích hoạt thấp; Aspiration rõ; Commitment mạnh kèm lực nghịch; TU yếu.";

  const designScores: Record<string, number> = {};
  for (const code of ["M1", "M2", "M3", "M4", "M5", "M6"]) designScores[code] = 9;
  for (const code of ["T1", "T2", "T3", "T4", "T5", "T6"]) designScores[code] = 8;
  for (const code of ["U1", "U2", "U3", "U4", "U5", "U6"]) designScores[code] = 7;
  for (const code of ["A1", "A2", "A3", "A4", "A5", "A6"]) designScores[code] = 6;

  const evidenceNotes: Record<string, string> = {
    M1: "Có bản sứ mệnh 2025 và bài phát biểu ĐHĐCĐ — chưa thấy trong biên bản quyết định vốn.",
    T1: "OKR 18 tháng đã ban hành, có mốc 2027.",
    U2: "Ngân sách chiến lược đã khóa 14 tỷ — nhưng đang giữ phương án nhà máy cũ.",
    A2: "Bộ giá trị có poster; quan sát họp vẫn ưu tiên doanh số ngắn.",
  };

  created.scores = created.scores.map((row) => ({
    ...row,
    primaryScore: designScores[row.criterionCode] ?? null,
    evidenceNote: evidenceNotes[row.criterionCode] ?? `Ghi chú minh họa cho ${row.criterionCode}.`,
    evaluatorExplanation: "Điểm minh họa phục vụ hiệu chỉnh mô hình — không phải chứng nhận.",
  }));

  const gradeBy: Record<"M" | "T" | "U" | "A", "C" | "B"> = { M: "C", T: "B", U: "B", A: "C" };
  created.components = created.components.map((row) => ({
    ...row,
    evidenceGrade: gradeBy[row.componentCode],
    narrative:
      row.componentCode === "M"
        ? "Thiết kế sứ mệnh khá hoàn chỉnh nhưng ít xuất hiện trong quyết định ngân sách."
        : row.componentCode === "T"
          ? "Đích 18 tháng rõ, đang được dùng trong OKR."
          : row.componentCode === "U"
            ? "Cam kết nguồn lực mạnh, có dấu hiệu khóa vào phương án nhà máy bất lợi."
            : "Giá trị có ngôn ngữ phân biệt vừa phải, hành vi quan sát còn loãng.",
  }));

  const activationBy = { M: 2, T: 8, U: 9, A: 5 } as const;
  created.activations = created.activations.map((row) => ({
    ...row,
    score: activationBy[row.componentCode],
    rationale:
      row.componentCode === "M"
        ? "Sứ mệnh gần như không được mở khi duyệt dự án mới trong 90 ngày qua."
        : "Quan sát trong nhịp quản trị và phân bổ nguồn lực.",
    evidenceReferences: "Biên bản điều hành 2026 Q2–Q3 (minh họa).",
    assessedAt: "2026-09-01",
    scope: "Ban điều hành và trưởng khối",
  }));

  created.forces = created.forces.map((row) => {
    if (row.componentCode === "M") {
      return { ...row, direction: "POSITIVE", scope: 1, intensity: 1, duration: 1, bottleneckProximity: 1, evidenceGrade: "C", evidenceNote: "Lực thuận rất mỏng — chủ yếu tuyên bố." };
    }
    if (row.componentCode === "T") {
      return { ...row, direction: "POSITIVE", scope: 7, intensity: 7, duration: 7, bottleneckProximity: 7, evidenceGrade: "B", evidenceNote: "OKR đang kéo tập trung nguồn lực." };
    }
    if (row.componentCode === "U") {
      return { ...row, direction: "NEGATIVE", scope: 6, intensity: 6, duration: 6, bottleneckProximity: 6, evidenceGrade: "B", evidenceNote: "Cam kết đang khóa công ty vào nhà máy cũ, giảm thích ứng." };
    }
    return { ...row, direction: "POSITIVE", scope: 2, intensity: 2, duration: 2, bottleneckProximity: 2, evidenceGrade: "C", evidenceNote: "Giá trị có lực nhẹ trong truyền thông nội bộ." };
  });

  const cfsSeed: Record<string, { score: number; status: "VERIFIED" | "HYPOTHESIS"; note: string }> = {
    MT: { score: 7, status: "VERIFIED", note: "Đích 18 tháng bám được lý do tồn tại." },
    MU: { score: 5, status: "HYPOTHESIS", note: "Giả thuyết: sứ mệnh ít đi vào cam kết ngân sách." },
    MA: { score: 6, status: "VERIFIED", note: "Giá trị có nhắc sứ mệnh nhưng chưa thành quy tắc." },
    TU: { score: 3, status: "VERIFIED", note: "Điểm hở chủ đích: Aspiration rõ, Commitment nguồn lực/quyền chưa khớp đích mới." },
    TA: { score: 6, status: "HYPOTHESIS", note: "Giả thuyết khớp một phần giữa đích tăng trưởng và giá trị an toàn." },
    UA: { score: 5, status: "VERIFIED", note: "Cam kết mạnh đang có dấu hiệu lệch với giá trị thích ứng." },
  };
  created.cfs = created.cfs.map((row) => ({
    ...row,
    score: cfsSeed[row.connectionCode].score,
    evidenceStatus: cfsSeed[row.connectionCode].status,
    evidence: cfsSeed[row.connectionCode].note,
    deviationSignal: row.connectionCode === "TU" ? "Lệch trọng tâm nguồn lực so với đích" : "",
    evaluatorNote: cfsSeed[row.connectionCode].note,
  }));

  const evidenceItems: EvidenceItem[] = [
    {
      id: "ev-demo-1",
      assessmentId: IDS.assessment.demo,
      componentCode: "M",
      criterionCode: "M1",
      connectionCode: null,
      title: "Bản sứ mệnh 2025",
      note: "Văn bản + bài phát biểu. Chưa có hồ sơ quyết định dùng sứ mệnh để từ chối việc.",
      linkUrl: null,
      storageKey: null,
      mimeType: null,
      fileName: null,
      fileSize: null,
      kind: "NOTE",
      createdAt: now,
      createdBy: IDS.users.coach,
    },
    {
      id: "ev-demo-2",
      assessmentId: IDS.assessment.demo,
      componentCode: "T",
      criterionCode: "T1",
      connectionCode: null,
      title: "OKR 18 tháng",
      note: "Có mốc, có chủ sở hữu từng mục tiêu con.",
      linkUrl: null,
      storageKey: null,
      mimeType: null,
      fileName: null,
      fileSize: null,
      kind: "DECISION_RECORD",
      createdAt: now,
      createdBy: IDS.users.coach,
    },
    {
      id: "ev-demo-3",
      assessmentId: IDS.assessment.demo,
      componentCode: "U",
      criterionCode: "U2",
      connectionCode: "TU",
      title: "Khóa ngân sách nhà máy cũ",
      note: "14 tỷ đã khóa. Đây là tín hiệu cam kết mạnh và lực nghịch đồng thời.",
      linkUrl: null,
      storageKey: null,
      mimeType: null,
      fileName: null,
      fileSize: null,
      kind: "DECISION_RECORD",
      createdAt: now,
      createdBy: IDS.users.coach,
    },
  ];

  const experiment: ImprovementExperiment = {
    id: IDS.experiment.demo,
    assessmentId: IDS.assessment.demo,
    title: "Thử nghiệm 30 ngày — nới khớp TU",
    baselineLockedAt: null,
    startDate: "2026-09-04",
    decision: null,
    decisionNote: "",
    compareAssessmentId: null,
    createdAt: now,
    updatedAt: now,
    createdBy: IDS.users.coach,
  };

  const action: ImprovementAction = {
    id: "actn-demo-1",
    assessmentId: IDS.assessment.demo,
    experimentId: IDS.experiment.demo,
    stage: "ANALYZE",
    componentCode: "U",
    title: "Mở khóa quyền quyết định cho đích 18 tháng",
    symptom: "Aspiration rõ nhưng nguồn lực vẫn bị nhà máy cũ giữ.",
    causeHypothesis: "Commitment đang bảo vệ phương án cũ hơn là đích mới — TU = 3.",
    connectionNote: "TU là liên kết tới hạn yếu.",
    sideEffect: "Nếu nới khóa quá nhanh có thể mất kỷ luật thực thi.",
    ownerUserId: IDS.users.companyAdmin,
    ownerName: "Tổng giám đốc — Công ty minh họa",
    scope: "Ban điều hành + khối sản xuất",
    testPeriod: "30 ngày",
    mechanism: "",
    evidence: "Biên bản điều hành và dòng tiền chiến lược (minh họa).",
    reviewDate: "2026-10-04",
    priorityScore: 86,
    priorityReason: "Khóa CFS TU + lực nghịch U — không chọn chỉ vì MDS thấp nhất (A).",
    createdAt: now,
    updatedAt: now,
    createdBy: IDS.users.coach,
  };

  store.users = users;
  store.organizations = organizations;
  store.organizationMembers = organizationMembers;
  store.standardVersions = [standardVersion];
  store.standardComponents = standardComponents;
  store.standardCriteria = standardCriteria;
  store.criterionAnchors = criterionAnchors;
  store.standardCfsConnections = standardCfsConnections;
  store.standardThresholds = [standardThresholds];
  store.assessments = [created.assessment];
  store.assessmentContexts = [created.context];
  store.componentAssessments = created.components;
  store.criterionScores = created.scores;
  store.activationAssessments = created.activations;
  store.forceAssessments = created.forces;
  store.cfsConnectionScores = created.cfs;
  store.evidenceItems = evidenceItems;
  store.improvementExperiments = [experiment];
  store.improvementActions = [action];
  store.sharePermissions = [
    {
      id: "share-demo-viewer",
      assessmentId: IDS.assessment.demo,
      userId: IDS.users.viewer,
      canEdit: false,
      createdAt: now,
      createdBy: IDS.users.companyAdmin,
    },
  ];
  store.auditLogs = [
    {
      id: "aud-seed",
      actorUserId: IDS.users.superAdmin,
      organizationId: IDS.orgs.demo,
      assessmentId: IDS.assessment.demo,
      action: "SEED_DEMO",
      entityType: "assessment",
      entityId: IDS.assessment.demo,
      oldValue: null,
      newValue: "DEMO COMPANY assessment created",
      reason: "Khởi tạo dữ liệu minh họa",
      standardVersionId: STANDARD_VERSION_ID,
      ip: null,
      createdAt: now,
    },
  ];
  return store;
}
