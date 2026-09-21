const CLICK_PX = 8;

export function pointerDeltaSq(a: { clientX: number; clientY: number }, b: { clientX: number; clientY: number }) {
  const dx = a.clientX - b.clientX;
  const dy = a.clientY - b.clientY;
  return dx * dx + dy * dy;
}

export function isClickGesture(start: { clientX: number; clientY: number }, end: { clientX: number; clientY: number }) {
  return pointerDeltaSq(start, end) < CLICK_PX * CLICK_PX;
}
