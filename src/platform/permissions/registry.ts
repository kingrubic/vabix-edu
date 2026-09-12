export const PLATFORM_ROLES = ["admin", "mod", "user"] as const;
export type PlatformRole = (typeof PLATFORM_ROLES)[number];

export const PERMISSION_ACTIONS = [
  "view",
  "create",
  "update",
  "soft_delete",
  "export",
  "approve",
  "assign",
  "grade",
  "issue_certificate",
] as const;
export type PermissionAction = (typeof PERMISSION_ACTIONS)[number];

export const DATA_SCOPES = ["self", "assigned", "department", "all"] as const;
export type DataScope = (typeof DATA_SCOPES)[number];

export const WORKSPACES = ["admin", "teaching", "learning", "work", "account"] as const;
export type Workspace = (typeof WORKSPACES)[number];

export type MenuNode = {
  code: string;
  label: string;
  path?: string;
  workspace: Workspace;
  adminOnly?: boolean;
  actions?: PermissionAction[];
  children?: MenuNode[];
};

const CMS_ACTIONS: PermissionAction[] = ["view", "create", "update", "soft_delete", "approve"];
const LMS_ADMIN_ACTIONS: PermissionAction[] = ["view", "create", "update", "soft_delete", "assign", "export"];
const GRADE_ACTIONS: PermissionAction[] = ["view", "grade", "export"];
const TASK_ACTIONS: PermissionAction[] = ["view", "create", "update", "assign", "soft_delete"];
const INQUIRY_ACTIONS: PermissionAction[] = ["view", "update", "assign", "export"];

export const MENU_TREE: MenuNode[] = [
  {
    code: "dashboard",
    label: "Tổng quan",
    path: "/admin",
    workspace: "admin",
    actions: ["view"],
  },
  {
    code: "website",
    label: "Website",
    workspace: "admin",
    children: [
      { code: "website.pages", label: "Trang và khối nội dung", path: "/admin/website/trang", workspace: "admin", actions: CMS_ACTIONS },
      { code: "website.nav", label: "Menu / footer", path: "/admin/website/menu", workspace: "admin", actions: CMS_ACTIONS },
      { code: "website.solutions", label: "Giải pháp 3T", path: "/admin/website/giai-phap", workspace: "admin", actions: CMS_ACTIONS },
      { code: "website.programs", label: "Chương trình", path: "/admin/website/chuong-trinh", workspace: "admin", actions: CMS_ACTIONS },
      { code: "website.models", label: "Mô hình / phương pháp", path: "/admin/website/mo-hinh", workspace: "admin", actions: CMS_ACTIONS },
      { code: "website.experts", label: "Chuyên gia", path: "/admin/website/chuyen-gia", workspace: "admin", actions: CMS_ACTIONS },
      { code: "website.partners", label: "Đối tác / làng ngành", path: "/admin/website/doi-tac", workspace: "admin", actions: CMS_ACTIONS },
      { code: "website.articles", label: "Bài viết / case study", path: "/admin/website/bai-viet", workspace: "admin", actions: CMS_ACTIONS },
      { code: "website.events", label: "Sự kiện", path: "/admin/website/su-kien", workspace: "admin", actions: CMS_ACTIONS },
      { code: "website.products", label: "Sản phẩm tri thức", path: "/admin/website/san-pham", workspace: "admin", actions: CMS_ACTIONS },
      { code: "website.workforce", label: "Nhân lực mở / nhân lực số", path: "/admin/website/nhan-luc", workspace: "admin", actions: CMS_ACTIONS },
      { code: "website.library", label: "Thư viện", path: "/admin/website/thu-vien", workspace: "admin", actions: CMS_ACTIONS },
      { code: "website.seo", label: "SEO / chuyển hướng", path: "/admin/website/seo", workspace: "admin", actions: CMS_ACTIONS },
    ],
  },
  {
    code: "lms",
    label: "Đào tạo và LMS",
    workspace: "admin",
    children: [
      { code: "lms.courses", label: "Khóa học và giáo trình", path: "/admin/dao-tao/khoa-hoc", workspace: "admin", actions: LMS_ADMIN_ACTIONS },
      { code: "lms.classes", label: "Lớp học", path: "/admin/dao-tao/lop", workspace: "admin", actions: LMS_ADMIN_ACTIONS },
      { code: "lms.schedules", label: "Lịch / buổi học", path: "/admin/dao-tao/lich", workspace: "admin", actions: ["view", "create", "update", "assign"] },
      { code: "lms.learners", label: "Học viên / ghi danh", path: "/admin/dao-tao/hoc-vien", workspace: "admin", actions: ["view", "create", "update", "assign", "export"] },
      { code: "lms.staffing", label: "Phân công giảng dạy", path: "/admin/dao-tao/phan-cong", workspace: "admin", actions: ["view", "assign"] },
      { code: "lms.lessons", label: "Bài học / học liệu", path: "/admin/dao-tao/bai-hoc", workspace: "admin", actions: ["view", "create", "update", "soft_delete"] },
      { code: "lms.assignments", label: "Bài tập / bài nộp", path: "/admin/dao-tao/bai-tap", workspace: "admin", actions: GRADE_ACTIONS.concat(["create", "update"]) },
      { code: "lms.quizzes", label: "Kiểm tra / ngân hàng câu hỏi", path: "/admin/dao-tao/kiem-tra", workspace: "admin", actions: ["view", "create", "update", "grade"] },
      { code: "lms.attendance", label: "Điểm danh", path: "/admin/dao-tao/diem-danh", workspace: "admin", actions: ["view", "update", "export"] },
      { code: "lms.results", label: "Kết quả / đánh giá 3W", path: "/admin/dao-tao/ket-qua", workspace: "admin", actions: GRADE_ACTIONS },
      { code: "lms.certificates", label: "Chứng nhận", path: "/admin/dao-tao/chung-nhan", workspace: "admin", actions: ["view", "approve", "issue_certificate", "export"] },
      { code: "lms.reports", label: "Báo cáo học tập", path: "/admin/dao-tao/bao-cao", workspace: "admin", actions: ["view", "export"] },
    ],
  },
  {
    code: "connect",
    label: "Kết nối",
    workspace: "admin",
    children: [
      { code: "connect.programs", label: "Đăng ký chương trình", path: "/admin/ket-noi/chuong-trinh", workspace: "admin", actions: INQUIRY_ACTIONS },
      { code: "connect.events", label: "Đăng ký sự kiện", path: "/admin/ket-noi/su-kien", workspace: "admin", actions: INQUIRY_ACTIONS },
      { code: "connect.consult", label: "Yêu cầu tư vấn", path: "/admin/ket-noi/tu-van", workspace: "admin", actions: INQUIRY_ACTIONS },
      { code: "connect.trustworking", label: "Hợp tác / Trustworking", path: "/admin/ket-noi/trustworking", workspace: "admin", actions: INQUIRY_ACTIONS },
    ],
  },
  {
    code: "work",
    label: "Công việc",
    workspace: "admin",
    children: [
      { code: "work.mine", label: "Của tôi", path: "/admin/cong-viec/cua-toi", workspace: "admin", actions: ["view", "update"] },
      { code: "work.created", label: "Tôi đã giao", path: "/admin/cong-viec/da-giao", workspace: "admin", actions: TASK_ACTIONS },
      { code: "work.all", label: "Tất cả theo phạm vi", path: "/admin/cong-viec", workspace: "admin", actions: TASK_ACTIONS },
    ],
  },
  {
    code: "system",
    label: "Hệ thống",
    workspace: "admin",
    adminOnly: true,
    children: [
      { code: "system.accounts", label: "Tài khoản", path: "/admin/he-thong/tai-khoan", workspace: "admin", adminOnly: true, actions: ["view", "create", "update", "soft_delete", "assign"] },
      { code: "system.departments", label: "Phòng ban", path: "/admin/he-thong/phong-ban", workspace: "admin", adminOnly: true, actions: ["view", "create", "update", "soft_delete"] },
      { code: "system.groups", label: "Nhóm quyền", path: "/admin/he-thong/nhom-quyen", workspace: "admin", adminOnly: true, actions: ["view", "create", "update", "soft_delete"] },
      { code: "system.settings", label: "Cài đặt", path: "/admin/he-thong/cai-dat", workspace: "admin", adminOnly: true, actions: ["view", "update"] },
      { code: "system.audit", label: "Nhật ký quản trị / bảo mật", path: "/admin/he-thong/nhat-ky", workspace: "admin", adminOnly: true, actions: ["view", "export"] },
    ],
  },
  {
    code: "learning",
    label: "Học tập",
    workspace: "learning",
    children: [
      { code: "learning.home", label: "Tổng quan học tập", path: "/hoc-tap", workspace: "learning", actions: ["view"] },
      { code: "learning.classes", label: "Lớp của tôi", path: "/hoc-tap/lop", workspace: "learning", actions: ["view"] },
      { code: "learning.schedule", label: "Lịch học", path: "/hoc-tap/lich", workspace: "learning", actions: ["view"] },
      { code: "learning.assignments", label: "Bài tập", path: "/hoc-tap/bai-tap", workspace: "learning", actions: ["view", "create"] },
      { code: "learning.results", label: "Kết quả", path: "/hoc-tap/ket-qua", workspace: "learning", actions: ["view"] },
    ],
  },
  {
    code: "teaching",
    label: "Giảng dạy",
    workspace: "teaching",
    children: [
      { code: "teaching.home", label: "Tổng quan giảng dạy", path: "/giang-day", workspace: "teaching", actions: ["view"] },
      { code: "teaching.classes", label: "Lớp phụ trách", path: "/giang-day/lop", workspace: "teaching", actions: ["view", "update"] },
      { code: "teaching.schedule", label: "Lịch giảng dạy", path: "/giang-day/lich", workspace: "teaching", actions: ["view"] },
      { code: "teaching.materials", label: "Học liệu được phép", path: "/giang-day/hoc-lieu", workspace: "teaching", actions: ["view", "create", "update"] },
      { code: "teaching.grading", label: "Bài cần chấm", path: "/giang-day/cham-bai", workspace: "teaching", actions: ["view", "grade"] },
      { code: "teaching.attendance", label: "Kết quả / điểm danh", path: "/giang-day/diem-danh", workspace: "teaching", actions: ["view", "update", "grade"] },
      { code: "teaching.discussions", label: "Thảo luận / thông báo lớp", path: "/giang-day/thong-bao", workspace: "teaching", actions: ["view", "create", "update"] },
    ],
  },
  {
    code: "work.user",
    label: "Làm việc",
    workspace: "work",
    children: [
      { code: "work.user.mine", label: "Công việc của tôi", path: "/lam-viec", workspace: "work", actions: ["view", "update"] },
      { code: "work.user.created", label: "Tôi đã giao", path: "/lam-viec/da-giao", workspace: "work", actions: TASK_ACTIONS },
    ],
  },
  {
    code: "account",
    label: "Tài khoản",
    path: "/tai-khoan",
    workspace: "account",
    actions: ["view", "update"],
  },
];

export const SCOPE_RANK: Record<DataScope, number> = {
  self: 1,
  assigned: 2,
  department: 3,
  all: 4,
};

export type FlatMenu = {
  code: string;
  label: string;
  path?: string;
  workspace: Workspace;
  adminOnly: boolean;
  actions: PermissionAction[];
  parentCode: string | null;
  depth: number;
};

export function flattenMenus(
  nodes: MenuNode[] = MENU_TREE,
  parent: string | null = null,
  depth = 0,
  parentAdminOnly = false,
): FlatMenu[] {
  const out: FlatMenu[] = [];
  for (const node of nodes) {
    const adminOnly = Boolean(node.adminOnly || parentAdminOnly || node.code.startsWith("system."));
    out.push({
      code: node.code,
      label: node.label,
      path: node.path,
      workspace: node.workspace,
      adminOnly,
      actions: node.actions ?? [],
      parentCode: parent,
      depth,
    });
    if (node.children?.length) {
      out.push(...flattenMenus(node.children, node.code, depth + 1, adminOnly));
    }
  }
  return out;
}

const FLAT = flattenMenus();
const BY_CODE = new Map(FLAT.map((item) => [item.code, item]));

export function allMenus() {
  return FLAT;
}

export function findMenu(code: string) {
  return BY_CODE.get(code) ?? null;
}

export function menusByPath(pathname: string) {
  const exact = FLAT.filter((item) => item.path === pathname);
  if (exact.length) return exact;
  return FLAT.filter((item) => item.path && item.path !== "/admin" && pathname.startsWith(`${item.path}/`));
}

export function childMenus(code: string) {
  return FLAT.filter((item) => item.parentCode === code);
}

export function isAdminOnlyMenu(code: string) {
  let current: string | null = code;
  while (current) {
    const node = BY_CODE.get(current);
    if (!node) return false;
    if (node.adminOnly || current.startsWith("system.")) return true;
    current = node.parentCode;
  }
  return false;
}

export function actionAllowedOnMenu(code: string, action: PermissionAction) {
  const menu = BY_CODE.get(code);
  if (!menu) return false;
  return menu.actions.includes(action);
}

export const SAMPLE_GROUPS: {
  code: string;
  name: string;
  description: string;
  grants: { menu: string; action: PermissionAction; scope: DataScope }[];
}[] = [
  {
    code: "content_editor",
    name: "Biên tập nội dung",
    description: "Soạn, sửa và gửi duyệt nội dung website. Không quản trị tài khoản.",
    grants: CMS_ACTIONS.flatMap((action) =>
      FLAT.filter((item) => item.code.startsWith("website.") && item.actions.includes(action)).map((item) => ({
        menu: item.code,
        action,
        scope: "all" as const,
      })),
    ),
  },
  {
    code: "training_coordinator",
    name: "Điều phối đào tạo",
    description: "Quản lý khóa, lớp, ghi danh, lịch và báo cáo đào tạo.",
    grants: FLAT.filter((item) => item.code.startsWith("lms.")).flatMap((item) =>
      item.actions.map((action) => ({ menu: item.code, action, scope: "all" as const })),
    ),
  },
  {
    code: "instructor",
    name: "Giảng viên",
    description: "Giảng dạy các lớp được phân công: lịch, chấm bài, điểm danh, thông báo.",
    grants: FLAT.filter((item) => item.workspace === "teaching").flatMap((item) =>
      item.actions.map((action) => ({ menu: item.code, action, scope: "assigned" as const })),
    ),
  },
  {
    code: "learner",
    name: "Học viên",
    description: "Truy cập lớp đã ghi danh, nộp bài và xem kết quả đã công bố.",
    grants: FLAT.filter((item) => item.workspace === "learning").flatMap((item) =>
      item.actions.map((action) => ({ menu: item.code, action, scope: "assigned" as const })),
    ),
  },
  {
    code: "admissions",
    name: "Tư vấn / tuyển sinh",
    description: "Tiếp nhận đăng ký, tư vấn và Trustworking.",
    grants: FLAT.filter((item) => item.code.startsWith("connect.")).flatMap((item) =>
      item.actions.map((action) => ({ menu: item.code, action, scope: "all" as const })),
    ),
  },
  {
    code: "internal_staff",
    name: "Nhân sự nội bộ",
    description: "Tạo và theo dõi công việc trong phạm vi được cấp.",
    grants: FLAT.filter((item) => item.code.startsWith("work.")).flatMap((item) =>
      item.actions.map((action) => ({ menu: item.code, action, scope: "department" as const })),
    ),
  },
];

export const PUBLIC_CMS_FIELDS: Record<string, string[]> = {
  page: ["slug", "title", "payload.hero", "payload.blocks", "payload.faq", "seo"],
  program: ["slug", "title", "shortTitle", "group", "audience", "audienceList", "problem", "objectives", "topics", "topicCategories", "methodology", "deliverables", "outcomes", "duration", "durationNote", "format", "certificate", "faculty", "featured", "relatedPrograms", "relatedModels", "seoDescription"],
  solution: ["slug", "title", "shortTitle", "pillar", "summary", "whoFor", "painPoints", "outcomes", "scope", "process", "deliverables", "methodologies", "faqs"],
  methodology: ["slug", "name", "shortName", "eyebrow", "headline", "summary", "description", "whoFor", "outcomes", "process", "related"],
  expert: ["slug", "name", "title", "organizationRole", "expertise", "shortBio", "fullBio", "portrait", "linkedin", "featured", "programs"],
  article: ["slug", "title", "excerpt", "content", "category", "categoryLabel", "coverImage", "author", "publishedAt", "featured"],
  case_study: ["slug", "organization", "industry", "challenge", "solution", "methodologies", "implementation", "results", "coverImage", "context", "lesson", "featured"],
  event: ["slug", "title", "category", "excerpt", "content", "image", "startDate", "endDate", "location", "registrationUrl", "status", "featured"],
  knowledge_product: ["slug", "category", "title", "summary", "status"],
  policy: ["slug", "title", "body", "version"],
};

export function pickAllowlisted(type: string, record: Record<string, unknown>) {
  const fields = PUBLIC_CMS_FIELDS[type];
  if (!fields) {
    const { internal_notes, internalNotes, origin, created_by, updated_by, ...rest } = record;
    void internal_notes;
    void internalNotes;
    void origin;
    void created_by;
    void updated_by;
    return rest;
  }
  const out: Record<string, unknown> = {};
  for (const field of fields) {
    if (field.startsWith("payload.")) {
      const key = field.slice("payload.".length);
      const payload = (record.payload ?? record) as Record<string, unknown>;
      if (payload && key in payload) {
        out[key] = payload[key];
      }
    } else if (field in record) {
      out[field] = record[field];
    } else if (record.payload && typeof record.payload === "object" && field in (record.payload as object)) {
      out[field] = (record.payload as Record<string, unknown>)[field];
    }
  }
  return out;
}
