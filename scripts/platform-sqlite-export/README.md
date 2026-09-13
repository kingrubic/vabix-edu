# SQLite export placeholder

Dump platform IAM tables from `data/vabix-platform.sqlite` to JSONL so the
Convex migrate script can import them on the Mac Mini.

```bash
npx tsx scripts/platform-sqlite-export/export.ts
```

Expected files in `data/backups/platform-to-convex/` (gitignored):

| File | Expected rows (Mac Mini snapshot) |
|---|---|
| `users.jsonl` | 3 |
| `permission_groups.jsonl` | 6 |
| `permission_group_grants.jsonl` | 169 |
| `permission_group_members.jsonl` | (if present) |
| `auth_sessions.jsonl` | 2 |
| `auth_tokens.jsonl` | 4 |
| `audit_logs.jsonl` | 14 |

Each line is one SQLite row as JSON. `password_hash` stays the bcrypt string
exactly — do not re-hash, do not commit the JSONL.
