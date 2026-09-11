import type {
  ActivationAssessment,
  Assessment,
  AssessmentContext,
  AuditLog,
  CfsConnectionScore,
  Comment,
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

export const DEMO_ACCOUNTS = [
  {
    email: "ceo@demo.vabix.edu.vn",
    name: "Nguyễn Minh Châu",
    title: "Tổng giám đốc — Cơ khí Hòa Bình",
    roleLabel: "CEO minh họa",
  },
  {
    email: "coach@demo.vabix.edu.vn",
    name: "ThS. Đặng Đức An",
    title: "Coach đánh giá BMDO",
    roleLabel: "Coach đánh giá",
  },
  {
    email: "academic@demo.vabix.edu.vn",
    name: "TS. Lê Hồng Nhung",
    title: "Quản trị học thuật BMDO",
    roleLabel: "Quản trị học thuật",
  },
  {
    email: "admin@demo.vabix.edu.vn",
    name: "Phạm Quốc Huy",
    title: "Quản trị nền tảng VABIX",
    roleLabel: "Quản trị nền tảng",
  },
  {
    email: "member@demo.vabix.edu.vn",
    name: "Hoàng Thị Lan",
    title: "Trưởng khối vận hành",
    roleLabel: "Thành viên",
  },
  {
    email: "viewer@demo.vabix.edu.vn",
    name: "Võ Thanh Tùng",
    title: "Thành viên HĐQT (xem)",
    roleLabel: "Người xem",
  },
] as const;

export const DEMO_ACCOUNT_EMAILS = DEMO_ACCOUNTS.map((account) => account.email);

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
      email: "admin@demo.vabix.edu.vn",
      name: "Phạm Quốc Huy",
      passwordHash,
      isDemo: true,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: IDS.users.academic,
      email: "academic@demo.vabix.edu.vn",
      name: "TS. Lê Hồng Nhung",
      passwordHash,
      isDemo: true,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: IDS.users.coach,
      email: "coach@demo.vabix.edu.vn",
      name: "ThS. Đặng Đức An",
      passwordHash,
      isDemo: true,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: IDS.users.companyAdmin,
      email: "ceo@demo.vabix.edu.vn",
      name: "Nguyễn Minh Châu",
      passwordHash,
      isDemo: true,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: IDS.users.member,
      email: "member@demo.vabix.edu.vn",
      name: "Hoàng Thị Lan",
      passwordHash,
      isDemo: true,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: IDS.users.viewer,
      email: "viewer@demo.vabix.edu.vn",
      name: "Võ Thanh Tùng",
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
      name: "Cơ khí Hòa Bình (minh họa)",
      slug: "co-khi-hoa-binh-demo",
      industry: "Sản xuất thiết bị công nghiệp vừa",
      stage: "Tăng trưởng",
      size: "128 người",
      isDemo: true,
      confidentialityNote:
        "Hồ sơ minh họa của một doanh nghiệp cơ khí miền Bắc — không phải khách hàng thật. Không trộn với dữ liệu vận hành.",
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
    title: "Đánh giá MTUA — Cơ khí Hòa Bình kỳ 2026.1",
    primaryEvaluatorId: IDS.users.coach,
    isDemo: true,
    now,
  });

  created.assessment.status = "UNDER_REVIEW";
  created.assessment.secondaryEvaluatorId = IDS.users.academic;
  created.assessment.nextReviewDate = "2026-10-01";
  created.context.industry = "Sản xuất thiết bị công nghiệp vừa";
  created.context.companyStage = "Tăng trưởng";
  created.context.companySize = "128 người";
  created.context.scope = "Toàn công ty — hệ thống quản trị điều hành và phân bổ CAPEX 18 tháng";
  created.context.timeHorizon = "18 tháng";
  created.context.notes =
    "Hồ sơ minh họa có chủ đích: sứ mệnh thiết kế khá hoàn chỉnh nhưng ít được mở khi duyệt việc; đích 18 tháng rõ; cam kết nguồn lực mạnh đang khóa nhà máy cũ — TU yếu.";

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
      title: "Nghị quyết BĐH 12/2025 — khóa 14 tỷ nhà máy cũ",
      note: "14 tỷ đã khóa cho đại tu dây chuyền phay CNC tại KCN Phú Nghĩa. Tín hiệu cam kết mạnh và lực nghịch với đích xuất khẩu 18 tháng.",
      linkUrl: null,
      storageKey: null,
      mimeType: null,
      fileName: null,
      fileSize: null,
      kind: "DECISION_RECORD",
      createdAt: "2026-08-18T04:20:00.000Z",
      createdBy: IDS.users.coach,
    },
    {
      id: "ev-demo-4",
      assessmentId: IDS.assessment.demo,
      componentCode: "U",
      criterionCode: "U4",
      connectionCode: "TU",
      title: "Biên bản điều hành 15/08/2026",
      note: "Ba dự án mới được duyệt theo tiêu chí công suất nhà máy hiện hữu. Sứ mệnh 'thiết bị chính xác cho khách hàng dài hạn' không được mở trong cuộc họp.",
      linkUrl: null,
      storageKey: null,
      mimeType: null,
      fileName: null,
      fileSize: null,
      kind: "DECISION_RECORD",
      createdAt: "2026-08-20T09:10:00.000Z",
      createdBy: IDS.users.coach,
    },
    {
      id: "ev-demo-5",
      assessmentId: IDS.assessment.demo,
      componentCode: "A",
      criterionCode: "A2",
      connectionCode: "UA",
      title: "Quan sát họp kinh doanh Q2/2026",
      note: "Poster bộ giá trị 'Bền bỉ – Chính xác – Đồng hành' treo ở sảnh. Trong họp, ưu tiên vẫn là doanh số tháng và giữ đơn hàng Q4.",
      linkUrl: null,
      storageKey: null,
      mimeType: null,
      fileName: null,
      fileSize: null,
      kind: "NOTE",
      createdAt: "2026-08-22T02:40:00.000Z",
      createdBy: IDS.users.member,
    },
    {
      id: "ev-demo-6",
      assessmentId: IDS.assessment.demo,
      componentCode: "T",
      criterionCode: "T6",
      connectionCode: "MT",
      title: "OKR khối — phân rã đích xuất khẩu",
      note: "Khối KD có mục tiêu 18 tháng; khối sản xuất vẫn đo theo OEE nhà máy cũ. Phân rã chưa khớp.",
      linkUrl: null,
      storageKey: null,
      mimeType: null,
      fileName: null,
      fileSize: null,
      kind: "NOTE",
      createdAt: "2026-08-25T07:00:00.000Z",
      createdBy: IDS.users.coach,
    },
  ];

  const comments: Comment[] = [
    {
      id: "cmt-demo-1",
      assessmentId: IDS.assessment.demo,
      body: "TU = 3 là điểm hở chủ đích. Aspiration đã rõ, nhưng quyền và ngân sách vẫn bảo vệ nhà máy cũ — không nên ưu tiên sửa MDS của A chỉ vì điểm thiết kế thấp hơn.",
      createdAt: "2026-08-28T03:15:00.000Z",
      createdBy: IDS.users.coach,
    },
    {
      id: "cmt-demo-2",
      assessmentId: IDS.assessment.demo,
      body: "Khối vận hành đang giữ 14 tỷ vì sợ gián đoạn đơn hàng Q4 cho khách Nhật. Nếu nới CAPEX, cần phương án song song 30 ngày chứ không cắt đột ngột.",
      createdAt: "2026-08-29T08:40:00.000Z",
      createdBy: IDS.users.member,
    },
    {
      id: "cmt-demo-3",
      assessmentId: IDS.assessment.demo,
      body: "Đồng ý thử 30 ngày: mở quyền duyệt CAPEX dưới 2 tỷ cho đích xuất khẩu, báo cáo BĐH mỗi thứ Sáu. HĐQT chỉ xem, không can thiệp vận hành thử nghiệm.",
      createdAt: "2026-09-01T02:05:00.000Z",
      createdBy: IDS.users.companyAdmin,
    },
    {
      id: "cmt-demo-4",
      assessmentId: IDS.assessment.demo,
      body: "Hồ sơ đủ để hiệu chỉnh mô hình, chưa đủ để gọi là chứng nhận. Giữ nhãn phát triển BMDO-MDS-01-MTUA 0.1.",
      createdAt: "2026-09-01T06:30:00.000Z",
      createdBy: IDS.users.academic,
    },
  ];

  const followup = createEmptyAssessmentRecords({
    assessmentId: IDS.assessment.followup,
    organizationId: IDS.orgs.demo,
    createdBy: IDS.users.companyAdmin,
    title: "Đánh giá MTUA — kỳ 2026.2 (theo dõi thử nghiệm TU)",
    primaryEvaluatorId: IDS.users.coach,
    isDemo: true,
    now: "2026-09-08T01:00:00.000Z",
  });
  followup.assessment.status = "DRAFT";
  followup.assessment.parentAssessmentId = IDS.assessment.demo;
  followup.assessment.revisionNumber = 2;
  followup.assessment.nextReviewDate = "2026-10-04";
  followup.context.industry = created.context.industry;
  followup.context.companyStage = created.context.companyStage;
  followup.context.companySize = created.context.companySize;
  followup.context.scope = "Theo dõi 30 ngày nới khớp TU — so với baseline 2026.1";
  followup.context.timeHorizon = "18 tháng";
  followup.context.notes = "Bản nháp. Chưa chấm điểm. Dùng sau khi thử nghiệm MAIS kết thúc.";

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
    ownerName: "Nguyễn Minh Châu — Tổng giám đốc",
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
  store.assessments = [created.assessment, followup.assessment];
  store.assessmentContexts = [created.context, followup.context];
  store.componentAssessments = [...created.components, ...followup.components];
  store.criterionScores = [...created.scores, ...followup.scores];
  store.activationAssessments = [...created.activations, ...followup.activations];
  store.forceAssessments = [...created.forces, ...followup.forces];
  store.cfsConnectionScores = [...created.cfs, ...followup.cfs];
  store.evidenceItems = evidenceItems;
  store.improvementExperiments = [experiment];
  store.improvementActions = [action];
  store.comments = comments;
  store.sharePermissions = [
    {
      id: "share-demo-viewer",
      assessmentId: IDS.assessment.demo,
      userId: IDS.users.viewer,
      canEdit: false,
      createdAt: "2026-08-27T04:00:00.000Z",
      createdBy: IDS.users.companyAdmin,
    },
  ];
  const auditLogs: AuditLog[] = [
    {
      id: "aud-seed",
      actorUserId: IDS.users.superAdmin,
      organizationId: IDS.orgs.demo,
      assessmentId: IDS.assessment.demo,
      action: "SEED_DEMO",
      entityType: "organization",
      entityId: IDS.orgs.demo,
      oldValue: null,
      newValue: "Cơ khí Hòa Bình (minh họa) seeded",
      reason: "Khởi tạo dữ liệu minh họa trên Convex",
      standardVersionId: STANDARD_VERSION_ID,
      ip: null,
      createdAt: "2026-08-15T01:00:00.000Z",
    },
    {
      id: "aud-create-assessment",
      actorUserId: IDS.users.coach,
      organizationId: IDS.orgs.demo,
      assessmentId: IDS.assessment.demo,
      action: "CREATE_ASSESSMENT",
      entityType: "assessment",
      entityId: IDS.assessment.demo,
      oldValue: null,
      newValue: "UNDER_REVIEW",
      reason: "Mở kỳ đánh giá 2026.1",
      standardVersionId: STANDARD_VERSION_ID,
      ip: null,
      createdAt: "2026-08-18T03:00:00.000Z",
    },
    {
      id: "aud-share-viewer",
      actorUserId: IDS.users.companyAdmin,
      organizationId: IDS.orgs.demo,
      assessmentId: IDS.assessment.demo,
      action: "SHARE_ASSESSMENT",
      entityType: "sharePermission",
      entityId: "share-demo-viewer",
      oldValue: null,
      newValue: "viewer@demo.vabix.edu.vn canEdit=false",
      reason: "HĐQT theo dõi, không sửa điểm",
      standardVersionId: STANDARD_VERSION_ID,
      ip: null,
      createdAt: "2026-08-27T04:00:00.000Z",
    },
    {
      id: "aud-submit-review",
      actorUserId: IDS.users.coach,
      organizationId: IDS.orgs.demo,
      assessmentId: IDS.assessment.demo,
      action: "SUBMIT_FOR_REVIEW",
      entityType: "assessment",
      entityId: IDS.assessment.demo,
      oldValue: "DATA_COLLECTION",
      newValue: "UNDER_REVIEW",
      reason: "Đủ bằng chứng để hiệu chỉnh TU",
      standardVersionId: STANDARD_VERSION_ID,
      ip: null,
      createdAt: now,
    },
  ];
  store.auditLogs = auditLogs;
  return store;
}
