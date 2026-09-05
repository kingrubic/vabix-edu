import { ACTIVATION_FORMULA_DISCLAIMER } from "@/domain/labels";

export type ActivationInput = {
  score: number | null;
  rationale: string;
  evidenceReferences: string;
  assessedAt: string | null;
  scope: string;
};

export type ActivationResult = {
  score: number | null;
  official: false;
  insufficient: boolean;
  explanation: string[];
};

export function readActivation(input: ActivationInput): ActivationResult {
  if (input.score == null) {
    return {
      score: null,
      official: false,
      insufficient: true,
      explanation: ["Chưa đủ dữ liệu — mức kích hoạt do đánh giá viên nhập, hệ thống không tự tính."],
    };
  }
  return {
    score: input.score,
    official: false,
    insufficient: false,
    explanation: [
      ACTIVATION_FORMULA_DISCLAIMER,
      "Mức kích hoạt mô tả mức độ cấu kiện đi vào quyết định, phân bổ nguồn lực, hành vi và nhịp quản trị.",
      "Không đọc MDS như bằng chứng cấu kiện đã được kích hoạt thành công.",
    ],
  };
}
