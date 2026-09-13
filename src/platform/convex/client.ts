import { ConvexHttpClient } from "convex/browser";
import { anyApi } from "convex/server";

export const PLATFORM_CONVEX_DEPLOYMENT = "prod:accomplished-rabbit-409";
export const PLATFORM_CONVEX_URL_DEFAULT = "https://accomplished-rabbit-409.convex.cloud";

export function platformConvexUrl() {
  return process.env.CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL || PLATFORM_CONVEX_URL_DEFAULT;
}

export function isPlatformConvexConfigured() {
  return Boolean(process.env.PLATFORM_CONVEX_SECRET && (process.env.CONVEX_URL || process.env.NEXT_PUBLIC_CONVEX_URL));
}

export function platformAdminKey() {
  const key = process.env.PLATFORM_CONVEX_SECRET;
  if (!key) {
    throw new Error("PLATFORM_CONVEX_SECRET is required for VABIX platform auth (Convex).");
  }
  return key;
}

export function platformConvex() {
  return new ConvexHttpClient(platformConvexUrl());
}

export const platformApi = anyApi;

export function withAdmin<T extends Record<string, unknown>>(args?: T) {
  return { adminKey: platformAdminKey(), ...(args ?? {}) };
}
