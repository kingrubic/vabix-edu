import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";

export { api };

export function getConvexUrl() {
  return process.env.NEXT_PUBLIC_CONVEX_URL?.trim() || "";
}

export function getConvexHttpClient() {
  const url = getConvexUrl();
  if (!url) return null;
  return new ConvexHttpClient(url);
}
