export type SeedPlatformUser = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "mod" | "user";
  status: "pending" | "active" | "locked" | "archived";
  /** bcrypt hash from SQLite. Never re-hash. Filled from users.jsonl when present. */
  passwordHash: string | null;
};

/**
 * Identity rows exported from Mac Mini SQLite. Password hashes are preserved
 * exactly when `data/backups/platform-to-convex/users.jsonl` is present.
 */
export const SEED_PLATFORM_USERS: SeedPlatformUser[] = [
  {
    id: "7fe72859-f3ed-435b-8271-e24be7950e9c",
    email: "vutrananh97@gmail.com",
    name: "Trần Anh Vũ - Admin",
    role: "admin",
    status: "active",
    passwordHash: null,
  },
  {
    id: "93b3e4e6-6dda-43c3-b922-fee34009f516",
    email: "thuyvabix@gmail.com",
    name: "Thanh Thuỳ Vabix",
    role: "admin",
    status: "pending",
    passwordHash: null,
  },
  {
    id: "78ee0001-f8d6-4f01-a1ef-cdeebd106137",
    email: "vutrananh.marketing@gmail.com",
    name: "Trần Anh Vũ",
    role: "user",
    status: "pending",
    passwordHash: null,
  },
];

export function seedUserToConvexPayload(user: SeedPlatformUser, at = new Date().toISOString()) {
  return {
    platformId: user.id,
    email: user.email,
    name: user.name,
    passwordHash: user.passwordHash,
    avatarFileId: null as string | null,
    role: user.role,
    departmentId: null as string | null,
    status: user.status,
    lastLoginAt: null as string | null,
    createdAt: at,
    updatedAt: at,
    createdBy: null as string | null,
    updatedBy: null as string | null,
    archivedAt: null as string | null,
    isSeed: false,
  };
}

export function mergeSeedUsers(fromJsonl: Array<Partial<SeedPlatformUser> & { id?: string; email?: string }>) {
  const byId = new Map(SEED_PLATFORM_USERS.map((user) => [user.id, { ...user }]));
  for (const row of fromJsonl) {
    const id = row.id;
    if (!id) continue;
    const current = byId.get(id) ?? {
      id,
      email: row.email ?? "",
      name: row.name ?? "",
      role: (row.role as SeedPlatformUser["role"]) ?? "user",
      status: (row.status as SeedPlatformUser["status"]) ?? "pending",
      passwordHash: null,
    };
    byId.set(id, {
      ...current,
      email: row.email ?? current.email,
      name: row.name ?? current.name,
      role: (row.role as SeedPlatformUser["role"]) ?? current.role,
      status: (row.status as SeedPlatformUser["status"]) ?? current.status,
      passwordHash: row.passwordHash === undefined ? current.passwordHash : row.passwordHash,
    });
  }
  return [...byId.values()];
}
