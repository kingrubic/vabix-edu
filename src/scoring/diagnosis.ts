import type { CfsCode, ComponentCode, EvidenceGrade } from "@/domain/types";
import type { CfsResult } from "./cfs";
import type { ForceResult } from "./force";

export type ComponentProfile = {
  code: ComponentCode;
  rawMds: number | null;
  finalMds: number | null;
  activation: number | null;
  force: ForceResult;
  evidenceGrade: EvidenceGrade | null;
  weakestCriteria: { code: string; nameVi: string; score: number; critical: boolean }[];
  criticalLocks: string[];
};

export type DiagnosisFinding = {
  id: string;
  title: string;
  body: string;
  support: string[];
  severity: "info" | "watch" | "risk";
};

function scoreOf(profile: ComponentProfile): number | null {
  return profile.rawMds;
}

export function diagnoseEngine(
  profiles: Record<ComponentCode, ComponentProfile>,
  cfs: CfsResult,
  connectionScores: { code: CfsCode; score: number | null }[],
): DiagnosisFinding[] {
  const findings: DiagnosisFinding[] = [];
  const byCfs = Object.fromEntries(connectionScores.map((item) => [item.code, item.score])) as Record<
    CfsCode,
    number | null
  >;

  const m = profiles.M;
  const t = profiles.T;
  const u = profiles.U;
  const a = profiles.A;

  if ((scoreOf(m) ?? 0) >= 7 && (scoreOf(t) ?? 10) <= 5) {
    findings.push({
      id: "m-strong-t-unclear",
      title: "Sứ mệnh tương đối rõ / Khát vọng chưa rõ",
      body: "Cấu kiện Mission có chất lượng thiết kế cao hơn Aspiration. Doanh nghiệp có thể biết mình tồn tại vì điều gì nhưng chưa khóa trạng thái đích.",
      support: [
        `M MDS thô ${m.rawMds ?? "—"} · T MDS thô ${t.rawMds ?? "—"}`,
        ...t.weakestCriteria.map((item) => `${item.code} ${item.nameVi}: ${item.score}`),
      ],
      severity: "watch",
    });
  }

  if ((scoreOf(t) ?? 0) >= 7 && (scoreOf(u) ?? 10) <= 5) {
    findings.push({
      id: "t-high-u-low",
      title: "Khát vọng cao / Cam kết thấp",
      body: "Đích được thiết kế khá rõ nhưng cấu kiện Commitment chưa theo kịp — rủi ro tuyên bố đích mà chưa khóa nguồn lực.",
      support: [
        `T MDS thô ${t.rawMds ?? "—"} · U MDS thô ${u.rawMds ?? "—"}`,
        ...u.weakestCriteria.map((item) => `${item.code} ${item.nameVi}: ${item.score}`),
      ],
      severity: "risk",
    });
  }

  if ((scoreOf(u) ?? 0) >= 7 && (scoreOf(a) ?? 10) <= 5) {
    findings.push({
      id: "u-high-a-weak",
      title: "Cam kết mạnh / Giá trị neo yếu",
      body: "Nhịp thực thi và nguồn lực có thể đang chạy trong khi Anchored Values chưa đủ sức giữ hành vi và giới hạn.",
      support: [
        `U MDS thô ${u.rawMds ?? "—"} · A MDS thô ${a.rawMds ?? "—"}`,
        ...a.weakestCriteria.map((item) => `${item.code} ${item.nameVi}: ${item.score}`),
      ],
      severity: "risk",
    });
  }

  if ((scoreOf(a) ?? 0) >= 7 && (scoreOf(m) ?? 10) <= 5) {
    findings.push({
      id: "a-attractive-m-weak",
      title: "Giá trị hấp dẫn / Sứ mệnh yếu",
      body: "Giá trị có thể đang được nói đến nhiều hơn lý do tồn tại. Nguy cơ neo hành vi vào khẩu hiệu thay vì sứ mệnh.",
      support: [`A MDS thô ${a.rawMds ?? "—"} · M MDS thô ${m.rawMds ?? "—"}`],
      severity: "watch",
    });
  }

  if ((scoreOf(t) ?? 0) >= 7 && (byCfs.TU ?? 10) <= 4) {
    findings.push({
      id: "t-high-tu-low",
      title: "Aspiration rõ nhưng liên kết TU yếu",
      body: "Đích tương đối rõ nhưng mức cam kết nguồn lực/quyền quyết định chưa khớp với Aspiration.",
      support: [`T MDS thô ${t.rawMds ?? "—"}`, `CFS TU = ${byCfs.TU ?? "Chưa đủ dữ liệu"}`],
      severity: "risk",
    });
  }

  if ((scoreOf(m) ?? 0) >= 7 && (m.activation ?? 10) <= 3) {
    findings.push({
      id: "m-high-activation-low",
      title: "Mission thiết kế tốt nhưng kích hoạt thấp",
      body: "Mission được thiết kế khá chuẩn nhưng mới được sử dụng hạn chế trong quyết định.",
      support: [
        `M MDS thô ${m.rawMds ?? "—"} · Mức kích hoạt ${m.activation ?? "Chưa đủ dữ liệu"}`,
        "MDS không phải bằng chứng đã triển khai thành công.",
      ],
      severity: "watch",
    });
  }

  if ((scoreOf(u) ?? 0) >= 6 && (u.force.force ?? 0) <= -4) {
    findings.push({
      id: "u-high-negative-force",
      title: "Cam kết mạnh đi kèm lực nghịch",
      body: "Cam kết mạnh nhưng có dấu hiệu đang khóa doanh nghiệp vào một phương án bất lợi.",
      support: [
        `U MDS thô ${u.rawMds ?? "—"} · Lực ${u.force.force ?? "—"}`,
        ...u.force.explanation,
      ],
      severity: "risk",
    });
  }

  if (cfs.weakestCode && (cfs.weakest ?? 10) < 4) {
    findings.push({
      id: "weakest-cfs",
      title: `Liên kết yếu nhất: ${cfs.weakestCode}`,
      body: "Khe hở cấu phần đang giới hạn mức khớp của động cơ. Hình học 3D phải để hở khớp — không được làm dữ liệu chưa chắc trông như đã khớp.",
      support: cfs.explanation,
      severity: "risk",
    });
  }

  for (const profile of Object.values(profiles)) {
    if (profile.criticalLocks.length > 0) {
      findings.push({
        id: `lock-${profile.code}`,
        title: `Điểm khóa cấu kiện ${profile.code}`,
        body: "Tiêu chí tới hạn thấp đang khóa trần MDS. Không che khóa này bằng màu xanh hay điểm tổng.",
        support: profile.criticalLocks,
        severity: "risk",
      });
    }
  }

  if (findings.length === 0) {
    findings.push({
      id: "insufficient-pattern",
      title: "Chưa đủ tín hiệu để chẩn đoán mẫu hình",
      body: "Hệ thống không bịa mẫu chẩn đoán khi chưa có tương phản rõ trên tiêu chí, liên kết hoặc lực.",
      support: ["Chưa đủ dữ liệu để kết luận mẫu hình động cơ."],
      severity: "info",
    });
  }

  return findings;
}

export function priorityQuestions(findings: DiagnosisFinding[]): string[] {
  const questions: string[] = [];
  if (findings.some((item) => item.id === "m-high-activation-low")) {
    questions.push("Mission đang xuất hiện ở quyết định nào trong 30 ngày gần nhất — và quyết định nào hoàn toàn không dùng đến nó?");
  }
  if (findings.some((item) => item.id === "t-high-tu-low")) {
    questions.push("Nguồn lực và quyền quyết định nào phải được khóa để Aspiration không còn là tuyên bố?");
  }
  if (findings.some((item) => item.id === "u-high-negative-force")) {
    questions.push("Cam kết hiện tại đang bảo vệ phương án nào — và phương án đó có đang làm giảm khả năng thích ứng?");
  }
  if (questions.length < 3) {
    questions.push("Bằng chứng nào đủ sức chịu phản biện độc lập cho cấu kiện đang được nói là mạnh?");
  }
  if (questions.length < 3) {
    questions.push("Nếu chỉ được can thiệp một điểm khóa trong 30 ngày, điểm nào vừa tới hạn vừa khả thi về nguồn lực?");
  }
  return questions.slice(0, 3);
}
