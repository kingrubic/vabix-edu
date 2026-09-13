import fs from "node:fs";
import path from "node:path";

export const PLATFORM_JSONL_DIR = path.join(process.cwd(), "data/backups/platform-to-convex");

export const JSONL_FILES = {
  users: "users.jsonl",
  permission_groups: "permission_groups.jsonl",
  permission_group_grants: "permission_group_grants.jsonl",
  permission_group_members: "permission_group_members.jsonl",
  auth_sessions: "auth_sessions.jsonl",
  auth_tokens: "auth_tokens.jsonl",
  audit_logs: "audit_logs.jsonl",
} as const;

export function readJsonl(filePath: string): Record<string, unknown>[] {
  if (!fs.existsSync(filePath)) return [];
  return fs
    .readFileSync(filePath, "utf8")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      try {
        return JSON.parse(line) as Record<string, unknown>;
      } catch {
        throw new Error(`Invalid JSONL at ${filePath}:${index + 1}`);
      }
    });
}

export function writeJsonl(filePath: string, rows: Record<string, unknown>[]) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, rows.map((row) => JSON.stringify(row)).join("\n") + (rows.length ? "\n" : ""));
}

export function boolish(value: unknown) {
  return value === true || value === 1 || value === "1";
}

export function str(value: unknown, fallback = "") {
  if (value == null) return fallback;
  return String(value);
}

export function strOrNull(value: unknown) {
  if (value == null || value === "") return null;
  return String(value);
}

export function mapUser(row: Record<string, unknown>) {
  return {
    platformId: str(row.id || row.platformId),
    email: str(row.email),
    name: str(row.name),
    passwordHash: strOrNull(row.password_hash ?? row.passwordHash),
    avatarFileId: strOrNull(row.avatar_file_id ?? row.avatarFileId),
    role: str(row.role, "user") as "admin" | "mod" | "user",
    departmentId: strOrNull(row.department_id ?? row.departmentId),
    status: str(row.status, "pending") as "pending" | "active" | "locked" | "archived",
    lastLoginAt: strOrNull(row.last_login_at ?? row.lastLoginAt),
    createdAt: str(row.created_at ?? row.createdAt, new Date().toISOString()),
    updatedAt: str(row.updated_at ?? row.updatedAt, new Date().toISOString()),
    createdBy: strOrNull(row.created_by ?? row.createdBy),
    updatedBy: strOrNull(row.updated_by ?? row.updatedBy),
    archivedAt: strOrNull(row.archived_at ?? row.archivedAt),
    isSeed: boolish(row.is_seed ?? row.isSeed),
  };
}

export function mapGroup(row: Record<string, unknown>) {
  return {
    platformId: str(row.id || row.platformId),
    code: str(row.code),
    name: str(row.name),
    description: str(row.description),
    status: str(row.status, "active") as "active" | "archived",
    isSeed: boolish(row.is_seed ?? row.isSeed),
    createdAt: str(row.created_at ?? row.createdAt, new Date().toISOString()),
    updatedAt: str(row.updated_at ?? row.updatedAt, new Date().toISOString()),
    createdBy: strOrNull(row.created_by ?? row.createdBy),
    updatedBy: strOrNull(row.updated_by ?? row.updatedBy),
    archivedAt: strOrNull(row.archived_at ?? row.archivedAt),
  };
}

export function mapGrant(row: Record<string, unknown>) {
  return {
    platformId: str(row.id || row.platformId),
    groupId: str(row.group_id ?? row.groupId),
    menuCode: str(row.menu_code ?? row.menuCode),
    action: str(row.action),
    scope: str(row.scope),
  };
}

export function mapMember(row: Record<string, unknown>) {
  return {
    groupId: str(row.group_id ?? row.groupId),
    userId: str(row.user_id ?? row.userId),
    createdAt: str(row.created_at ?? row.createdAt, new Date().toISOString()),
    createdBy: strOrNull(row.created_by ?? row.createdBy),
  };
}

export function mapSession(row: Record<string, unknown>) {
  return {
    platformId: str(row.id || row.platformId),
    userId: str(row.user_id ?? row.userId),
    expiresAt: str(row.expires_at ?? row.expiresAt),
    revokedAt: strOrNull(row.revoked_at ?? row.revokedAt),
    userAgent: strOrNull(row.user_agent ?? row.userAgent),
    createdAt: str(row.created_at ?? row.createdAt, new Date().toISOString()),
  };
}

export function mapToken(row: Record<string, unknown>) {
  return {
    platformId: str(row.id || row.platformId),
    userId: str(row.user_id ?? row.userId),
    purpose: str(row.purpose) as "activation" | "reset",
    tokenHash: str(row.token_hash ?? row.tokenHash),
    expiresAt: str(row.expires_at ?? row.expiresAt),
    usedAt: strOrNull(row.used_at ?? row.usedAt),
    createdAt: str(row.created_at ?? row.createdAt, new Date().toISOString()),
    createdBy: strOrNull(row.created_by ?? row.createdBy),
  };
}

export function mapAudit(row: Record<string, unknown>) {
  const metadata = row.metadata;
  return {
    platformId: str(row.id || row.platformId),
    actorUserId: strOrNull(row.actor_user_id ?? row.actorUserId),
    action: str(row.action),
    entityType: str(row.entity_type ?? row.entityType),
    entityId: strOrNull(row.entity_id ?? row.entityId),
    summary: str(row.summary),
    metadata: typeof metadata === "string" ? metadata : JSON.stringify(metadata ?? {}),
    ip: strOrNull(row.ip),
    createdAt: str(row.created_at ?? row.createdAt, new Date().toISOString()),
  };
}

export function loadPlatformBackup(dir = PLATFORM_JSONL_DIR) {
  return {
    users: readJsonl(path.join(dir, JSONL_FILES.users)).map(mapUser),
    groups: readJsonl(path.join(dir, JSONL_FILES.permission_groups)).map(mapGroup),
    grants: readJsonl(path.join(dir, JSONL_FILES.permission_group_grants)).map(mapGrant),
    members: readJsonl(path.join(dir, JSONL_FILES.permission_group_members)).map(mapMember),
    sessions: readJsonl(path.join(dir, JSONL_FILES.auth_sessions)).map(mapSession),
    tokens: readJsonl(path.join(dir, JSONL_FILES.auth_tokens)).map(mapToken),
    auditLogs: readJsonl(path.join(dir, JSONL_FILES.audit_logs)).map(mapAudit),
  };
}
