import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "vabix-platform.sqlite");
const BACKUP_DIR = path.join(DATA_DIR, "backups");
const MIGRATIONS_DIR = path.join(process.cwd(), "src/platform/db/migrations");

type GlobalDb = typeof globalThis & {
  __vabixPlatformDb?: Database.Database;
  __vabixPlatformMigrated?: boolean;
};

function ensureDirs() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  fs.mkdirSync(path.join(DATA_DIR, "uploads"), { recursive: true });
}

function backupIfExists() {
  if (!fs.existsSync(DB_PATH)) return;
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  const dest = path.join(BACKUP_DIR, `vabix-platform-${stamp}.sqlite`);
  fs.copyFileSync(DB_PATH, dest);
}

function appliedIds(db: Database.Database): Set<string> {
  db.exec(`CREATE TABLE IF NOT EXISTS schema_migrations (id TEXT PRIMARY KEY, applied_at TEXT NOT NULL)`);
  const rows = db.prepare("SELECT id FROM schema_migrations").all() as { id: string }[];
  return new Set(rows.map((row) => row.id));
}

function migrate(db: Database.Database) {
  const files = fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((name) => name.endsWith(".sql"))
    .sort();
  const done = appliedIds(db);
  const pending = files.filter((name) => !done.has(name.replace(/\.sql$/, "")));
  if (!pending.length) return;

  backupIfExists();
  const apply = db.transaction(() => {
    for (const file of pending) {
      const id = file.replace(/\.sql$/, "");
      const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf8");
      db.exec(sql);
      db.prepare("INSERT OR IGNORE INTO schema_migrations (id, applied_at) VALUES (?, ?)").run(
        id,
        new Date().toISOString(),
      );
    }
  });
  apply();
}

export function sqlitePath() {
  return DB_PATH;
}

export function getDb(): Database.Database {
  const g = globalThis as GlobalDb;
  if (!g.__vabixPlatformDb) {
    ensureDirs();
    const db = new Database(DB_PATH);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    db.pragma("busy_timeout = 5000");
    g.__vabixPlatformDb = db;
  }
  if (!g.__vabixPlatformMigrated) {
    migrate(g.__vabixPlatformDb);
    g.__vabixPlatformMigrated = true;
  }
  return g.__vabixPlatformDb;
}

export function tx<T>(fn: (db: Database.Database) => T): T {
  const db = getDb();
  return db.transaction(fn)(db);
}

export function nowIso() {
  return new Date().toISOString();
}

export function newId() {
  return crypto.randomUUID();
}
