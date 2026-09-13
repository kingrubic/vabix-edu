/**
 * Dump platform IAM tables from local SQLite to JSONL.
 * Output: data/backups/platform-to-convex/*.jsonl (gitignored).
 */
import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { JSONL_FILES, PLATFORM_JSONL_DIR, writeJsonl } from "../platform-to-convex/jsonl";

const DB_PATH = process.env.PLATFORM_SQLITE_PATH || path.join(process.cwd(), "data/vabix-platform.sqlite");

const TABLES: Array<{ file: string; sql: string }> = [
  { file: JSONL_FILES.users, sql: "SELECT * FROM users" },
  { file: JSONL_FILES.permission_groups, sql: "SELECT * FROM permission_groups" },
  { file: JSONL_FILES.permission_group_grants, sql: "SELECT * FROM permission_group_grants" },
  { file: JSONL_FILES.permission_group_members, sql: "SELECT * FROM permission_group_members" },
  { file: JSONL_FILES.auth_sessions, sql: "SELECT * FROM auth_sessions" },
  { file: JSONL_FILES.auth_tokens, sql: "SELECT * FROM auth_tokens" },
  { file: JSONL_FILES.audit_logs, sql: "SELECT * FROM audit_logs" },
];

function main() {
  if (!fs.existsSync(DB_PATH)) {
    throw new Error(`SQLite not found at ${DB_PATH}. Set PLATFORM_SQLITE_PATH if needed.`);
  }
  const db = new Database(DB_PATH, { readonly: true });
  fs.mkdirSync(PLATFORM_JSONL_DIR, { recursive: true });
  for (const table of TABLES) {
    const rows = db.prepare(table.sql).all() as Record<string, unknown>[];
    writeJsonl(path.join(PLATFORM_JSONL_DIR, table.file), rows);
    console.log(`${table.file}: ${rows.length} rows`);
  }
  db.close();
  console.log(`Wrote JSONL to ${PLATFORM_JSONL_DIR}`);
}

main();
