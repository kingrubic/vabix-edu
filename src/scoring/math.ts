export function round1(value: number): number {
  return Math.round(value * 10) / 10;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function average(values: number[]): number | null {
  if (values.length === 0) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function weightedMean(items: { value: number; weight: number }[]): number | null {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  if (totalWeight <= 0 || items.length === 0) return null;
  return items.reduce((sum, item) => sum + item.value * item.weight, 0) / totalWeight;
}
