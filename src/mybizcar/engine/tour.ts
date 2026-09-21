import type { FocusId } from "./component-registry";
import type { InspectorTarget } from "./vehicle-types";
import type { IllustrationState } from "@/mybizcar/visualization/illustration";

export type TourStep = {
  title: string;
  body3d: string;
  body2d: string;
  select: InspectorTarget;
  exploded: boolean;
  xray: boolean;
  scenario: boolean;
  compare: "before" | "after";
};

export const TOUR: TourStep[] = [
  {
    title: "Tổng thể doanh nghiệp",
    body3d: "Toàn xe nguyên vẹn — dữ liệu minh họa. Xoay nhẹ để thấy thân xe và bốn bánh.",
    body2d: "Toàn xe trên sơ đồ 2D — dữ liệu minh họa. Chế độ 2D không xoay được mô hình 3D.",
    select: { type: "overview" },
    exploded: false,
    xray: false,
    scenario: false,
    compare: "after",
  },
  {
    title: "Động cơ MTUA",
    body3d: "Lớp mô phỏng quản trị Mission, Aspiration, Commitment và Values. Đọc dữ liệu minh họa trên từng cấu kiện.",
    body2d: "Sơ đồ 2D Động cơ doanh nghiệp — dữ liệu minh họa. Chế độ 2D không xoay được mô hình 3D.",
    select: { type: "system", id: "engine" },
    exploded: false,
    xray: true,
    scenario: false,
    compare: "after",
  },
  {
    title: "Bốn bánh xe",
    body3d: "Toàn xe và bốn bánh: Giá trị, Thị trường, Con người, Tài chính — dữ liệu minh họa.",
    body2d: "Sơ đồ 2D bốn bánh — dữ liệu minh họa. Chế độ 2D không xoay được mô hình 3D.",
    select: { type: "overview" },
    exploded: false,
    xray: false,
    scenario: false,
    compare: "after",
  },
  {
    title: "Thử thay đổi một bánh",
    body3d: "Kịch bản minh họa: chỉnh mức căng lốp. Hồ sơ gốc không bị ghi.",
    body2d: "Kịch bản minh họa trên sơ đồ 2D. Hồ sơ gốc không bị ghi. Chế độ 2D không xoay được mô hình 3D.",
    select: { type: "system", id: "finance-wheel" },
    exploded: false,
    xray: false,
    scenario: true,
    compare: "after",
  },
  {
    title: "Trước / sau và ý nghĩa",
    body3d: "Chuyển Trước–Sau với cùng góc nhìn. Bảng bên cạnh dùng dữ liệu minh họa, không phải kết quả đánh giá.",
    body2d: "So sánh Trước–Sau trên sơ đồ 2D với dữ liệu minh họa. Chế độ 2D không xoay được mô hình 3D.",
    select: { type: "system", id: "finance-wheel" },
    exploded: false,
    xray: false,
    scenario: true,
    compare: "after",
  },
];

export type TourView = {
  selected: InspectorTarget;
  focus: FocusId;
  exploded: boolean;
  xray: boolean;
  labels: false;
  mode: "profile" | "scenario";
  compare: "before" | "after";
  scenario: IllustrationState | null;
};

function focusOf(select: InspectorTarget): FocusId {
  if (select.type === "chamber" || select.type === "connection") return "engine";
  if (select.type === "system") return select.id;
  return "whole";
}

function illustrationScenario(): IllustrationState {
  return {
    tensions: {
      "value-wheel": 50,
      "market-wheel": 50,
      "people-wheel": 50,
      "finance-wheel": 18,
    },
    load: 40,
    roughness: 0,
    rhythm: 40,
    steer: 0,
  };
}

export function tourViewForStep(index: number): TourView {
  const step = TOUR[index];
  return {
    selected: step.select,
    focus: focusOf(step.select),
    exploded: step.exploded,
    xray: step.xray,
    labels: false,
    mode: step.scenario ? "scenario" : "profile",
    compare: step.compare,
    scenario: step.scenario ? illustrationScenario() : null,
  };
}

export function tourBody(index: number, threeD: boolean): { title: string; body: string } {
  const step = TOUR[index];
  return { title: step.title, body: threeD ? step.body3d : step.body2d };
}

export type TourBackup = {
  mode: "profile" | "scenario";
  scenario: IllustrationState;
  selected: InspectorTarget;
  focus: FocusId;
  xray: boolean;
  exploded: boolean;
  labels: boolean;
  compare: "before" | "after";
  linked: boolean;
  showForce: boolean;
  connections: boolean;
  playing: boolean;
  autoFocus: boolean;
};
