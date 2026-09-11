import { componentLabels } from "@/mybizcar/domain";
import type { ChamberView, ConnectionView, EngineViewModel } from "@/mybizcar/visualization/view-model";

const CONNECTIONS: Array<Pick<ConnectionView, "code" | "from" | "to" | "fitStandard" | "deviation">> = [
  {
    code: "MT",
    from: "M",
    to: "T",
    fitStandard: "Khát vọng là một bước tiến có ý nghĩa đối với Mission",
    deviation: "Tạo tăng trưởng nhưng không phục vụ lý do tồn tại",
  },
  {
    code: "MU",
    from: "M",
    to: "U",
    fitStandard: "Cam kết thể hiện mức ưu tiên tương xứng với Mission",
    deviation: "Mission quan trọng trên lời nói nhưng thiếu nguồn lực",
  },
  {
    code: "MA",
    from: "M",
    to: "A",
    fitStandard: "Values bảo vệ cách Mission được thực hiện",
    deviation: "Tạo giá trị cho một bên bằng cách gây hại trái tuyên bố",
  },
  {
    code: "TU",
    from: "T",
    to: "U",
    fitStandard: "Nguồn lực, quyền quyết định và nhịp thực thi đủ cho Aspiration",
    deviation: "Đích cao nhưng cam kết thấp",
  },
  {
    code: "TA",
    from: "T",
    to: "A",
    fitStandard: "Đích đến và cách đo không khuyến khích hành vi trái Values",
    deviation: "Chỉ tiêu tạo động cơ che giấu hoặc bán sai",
  },
  {
    code: "UA",
    from: "U",
    to: "A",
    fitStandard: "Cam kết nguồn lực không phá vỡ Values",
    deviation: "Ép tiến độ bằng cách bỏ qua nguyên tắc",
  },
];

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

/** Read-only DEMO engine view for the public /bizcar landing. */
export function getDemoEngineView(): EngineViewModel {
  return {
    mnemonicNote: "Phiên bản phát triển phục vụ hiệu chỉnh và kiểm chứng thực địa.",
    disclaimer: "Chu kỳ Nạp–Nén–Nổ–Neo là cấu trúc ghi nhớ BMDO, không phải mô tả quan hệ nhân quả cơ học.",
    chambers: [chamber("M"), chamber("T"), chamber("U"), chamber("A")],
    connections: CONNECTIONS.map((row) => ({
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
