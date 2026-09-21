import { cfsConnectionCopy, componentLabels } from "@/mybizcar/domain";
import type { ChamberView, EngineViewModel } from "@/mybizcar/visualization/view-model";

function chamber(code: ChamberView["code"]): ChamberView {
  const label = componentLabels[code];
  return {
    code,
    mnemonic: label.mnemonic,
    name: label.name,
    size: 0.7,
    completeness: 0.62,
    opacity: 0.72,
    warning: false,
    mdsFinal: 6.2,
    mdsRaw: 6.4,
    activation: 5,
    force: 1,
    forceWhy: [],
    forceEvidenceNote: "",
    forceUnsupported: false,
    evidence: "C",
    weakest: "",
    why: [],
    statement: "",
    nextChecks: [],
    gap: 0.28,
    flow: 0.2,
    flowDir: 1,
  };
}

/** Read-only DEMO engine view when no assessment bundle is available. */
export function getDemoEngineView(): EngineViewModel {
  return {
    mnemonicNote: "Phiên bản phát triển phục vụ hiệu chỉnh và kiểm chứng thực địa.",
    disclaimer: "Chu kỳ Nạp–Nén–Nổ–Neo là cấu trúc ghi nhớ BMDO, không phải mô tả quan hệ nhân quả cơ học.",
    chambers: [chamber("M"), chamber("T"), chamber("U"), chamber("A")],
    connections: Object.values(cfsConnectionCopy).map((row) => ({
      ...row,
      score: 6,
      dashed: true,
      thickness: 1.4,
      evidenceStatus: "HYPOTHESIS",
      recommendedCheck: "",
      note: "",
    })),
  };
}
