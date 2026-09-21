import type { BizcarSystemId } from "@/mybizcar/domain/bizcar-systems";
import type { ChamberView } from "@/mybizcar/visualization/view-model";
import type { FocusId } from "./component-registry";

export type CameraView = FocusId;

export type InspectorTarget =
  | { type: "overview" }
  | { type: "system"; id: BizcarSystemId }
  | { type: "chamber"; code: ChamberView["code"] }
  | { type: "connection"; code: string };
