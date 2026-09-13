# Platform SQLite → Convex

Imports VABIX **platform** IAM (not MyBizCar) into namespaced Convex tables.

## On the Mac Mini

1. Export SQLite (see `scripts/platform-sqlite-export/`):

   ```bash
   npx tsx scripts/platform-sqlite-export/export.ts
   ```

   Writes JSONL into `data/backups/platform-to-convex/` (gitignored).

2. Confirm Convex functions are deployed **additively** onto
   `prod:accomplished-rabbit-409`. Do not deploy this repo’s `convex/` folder
   alone — that would drop MyBizCar tables. Merge `platform*` tables first.

3. Set Convex env (once):

   ```bash
   npx convex env set PLATFORM_CONVEX_SECRET '<long random>' --prod
   ```

4. Import (hashes copied as-is, never re-hashed):

   ```bash
   CONVEX_URL=https://accomplished-rabbit-409.convex.cloud \
   PLATFORM_CONVEX_SECRET='<same value>' \
   npx tsx scripts/platform-to-convex/migrate.ts
   ```

`CONVEX_DEPLOY_KEY` is only for deploy/env CLI. Never commit it.

The script always upserts the 3 known platform users. When `users.jsonl` is
present, `password_hash` from SQLite wins.
