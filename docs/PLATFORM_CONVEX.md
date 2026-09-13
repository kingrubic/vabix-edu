# Platform auth on Convex

`/dang-nhap` (VABIX platform, **not** MyBizCar `/bizcar/login`) authenticates
against Convex using `ConvexHttpClient` on the Next.js server.

JWT cookie `vabix_platform_session` is unchanged. bcrypt hashes stay bcrypt;
Next.js verifies passwords with `bcryptjs` and never re-hashes imported values.

## Tables (namespaced)

| Convex table | Replaces SQLite |
|---|---|
| `platformUsers` | `users` |
| `platformAuthSessions` | `auth_sessions` |
| `platformAuthTokens` | `auth_tokens` |
| `platformPermissionGroups` | `permission_groups` |
| `platformPermissionGroupMembers` | `permission_group_members` |
| `platformPermissionGroupGrants` | `permission_group_grants` |
| `platformAuditLogs` | `audit_logs` |

MyBizCar on `prod:accomplished-rabbit-409` already has a `users` table. This
module must **not** create or write that table.

## Still on SQLite (`data/vabix-platform.sqlite`)

LMS, CMS, departments, tasks, inquiries, files, notifications, app_settings,
learner_profiles, and all `lms_*` / `cms_*` tables. User **ids** in those
tables still match `platformUsers.platformId` (SQLite UUID).

## Env (Next.js)

```
CONVEX_URL=https://accomplished-rabbit-409.convex.cloud
PLATFORM_CONVEX_SECRET=<same value as Convex env>
AUTH_SECRET=<existing JWT secret>
```

`CONVEX_DEPLOY_KEY` is for deploy/migrate CLI only. Never commit secrets.

## Deploy warning

`convex/` in this repo contains **only** `platform*` tables. Running
`npx convex deploy` from here against `prod:accomplished-rabbit-409` without
merging the existing MyBizCar schema would drop MyBizCar tables. Merge first,
then deploy.

Set on Convex: `npx convex env set PLATFORM_CONVEX_SECRET ...`

## Import from Mac Mini

See `scripts/platform-sqlite-export/README.md` and
`scripts/platform-to-convex/README.md`.
