import type { Actor, Grant } from "@/platform/permissions/evaluate";
import type { PlatformRole } from "@/platform/permissions/registry";
import type { PlatformClaims } from "./jwt";

export type PlatformUserRow = {
  id: string;
  email: string;
  name: string;
  password_hash: string | null;
  avatar_file_id: string | null;
  role: PlatformRole;
  department_id: string | null;
  status: "pending" | "active" | "locked" | "archived";
  last_login_at: string | null;
  is_seed: number;
  must_change_password?: boolean;
};

export type PlatformActor = Actor & {
  email: string;
  name: string;
  avatarFileId: string | null;
  isSeed: boolean;
  mustChangePassword: boolean;
  claims: PlatformClaims;
};

export type { Grant, PlatformClaims };
