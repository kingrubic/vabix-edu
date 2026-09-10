import type { StoreShape, StandardVersion } from "@/domain/types";
import { getStore } from "@/db/store";

export function listStandardVersions(store?: StoreShape): StandardVersion[] {
  const source = store ?? getStore();
  return source.standardVersions.slice().sort((a, b) => a.version.localeCompare(b.version));
}

export function getStandardBundle(standardVersionId: string, store?: StoreShape) {
  const source = store ?? getStore();
  const version = source.standardVersions.find((item) => item.id === standardVersionId);
  if (!version) return null;
  const criteria = source.standardCriteria.filter((item) => item.standardVersionId === standardVersionId);
  const criterionIds = new Set(criteria.map((item) => item.id));
  return {
    version,
    components: source.standardComponents.filter((item) => item.standardVersionId === standardVersionId),
    criteria,
    anchors: source.criterionAnchors.filter((item) => criterionIds.has(item.criterionId)),
    connections: source.standardCfsConnections.filter((item) => item.standardVersionId === standardVersionId),
    thresholds: source.standardThresholds.find((item) => item.standardVersionId === standardVersionId) ?? null,
  };
}
