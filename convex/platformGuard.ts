import { ConvexError, v } from "convex/values";

export function assertPlatformAdmin(adminKey: string) {
  const expected = process.env.PLATFORM_CONVEX_SECRET;
  if (!expected) {
    throw new ConvexError("PLATFORM_CONVEX_SECRET is not configured on Convex.");
  }
  if (adminKey !== expected) {
    throw new ConvexError("Unauthorized platform admin call.");
  }
}

export const adminKeyArg = {
  adminKey: v.string(),
};

export const roleValidator = v.union(v.literal("admin"), v.literal("mod"), v.literal("user"));
export const userStatusValidator = v.union(
  v.literal("pending"),
  v.literal("active"),
  v.literal("locked"),
  v.literal("archived"),
);
export const groupStatusValidator = v.union(v.literal("active"), v.literal("archived"));
export const tokenPurposeValidator = v.union(v.literal("activation"), v.literal("reset"));

export const userFields = {
  platformId: v.string(),
  email: v.string(),
  name: v.string(),
  passwordHash: v.union(v.string(), v.null()),
  avatarFileId: v.union(v.string(), v.null()),
  role: roleValidator,
  departmentId: v.union(v.string(), v.null()),
  status: userStatusValidator,
  lastLoginAt: v.union(v.string(), v.null()),
  createdAt: v.string(),
  updatedAt: v.string(),
  createdBy: v.union(v.string(), v.null()),
  updatedBy: v.union(v.string(), v.null()),
  archivedAt: v.union(v.string(), v.null()),
  isSeed: v.boolean(),
};

export type PlatformUserDoc = {
  platformId: string;
  email: string;
  emailLower: string;
  name: string;
  passwordHash: string | null;
  avatarFileId: string | null;
  role: "admin" | "mod" | "user";
  departmentId: string | null;
  status: "pending" | "active" | "locked" | "archived";
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  archivedAt: string | null;
  isSeed: boolean;
};

export function toUserRow(doc: PlatformUserDoc) {
  return {
    id: doc.platformId,
    email: doc.email,
    name: doc.name,
    password_hash: doc.passwordHash,
    avatar_file_id: doc.avatarFileId,
    role: doc.role,
    department_id: doc.departmentId,
    status: doc.status,
    last_login_at: doc.lastLoginAt,
    created_at: doc.createdAt,
    updated_at: doc.updatedAt,
    created_by: doc.createdBy,
    updated_by: doc.updatedBy,
    archived_at: doc.archivedAt,
    is_seed: doc.isSeed ? 1 : 0,
  };
}
