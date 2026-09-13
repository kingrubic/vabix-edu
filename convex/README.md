# VABIX platform Convex module

This folder defines **namespaced** platform auth/IAM tables only:

- `platformUsers`
- `platformAuthSessions`
- `platformAuthTokens`
- `platformPermissionGroups`
- `platformPermissionGroupMembers`
- `platformPermissionGroupGrants`
- `platformAuditLogs`

It does **not** declare MyBizCar tables (`users`, organizations, assessments, …).

## Do not overwrite MyBizCar

Production deployment `prod:accomplished-rabbit-409`
(`https://accomplished-rabbit-409.convex.cloud`) already has MyBizCar data,
including a `users` table.

- Never add a table named `users` here.
- Do **not** run `npx convex deploy` from this repo against that production
  deployment until this schema is **merged** into the existing MyBizCar Convex
  project. Deploying this file alone would drop undeclared tables.
- After merge, `npx convex deploy` is additive: new `platform*` tables only.

## Env

Set on the Convex deployment (dashboard or `npx convex env set`):

```
PLATFORM_CONVEX_SECRET=<long random string>
```

The Next.js server and the Mac Mini migrate script send the same value as
`adminKey` on every query/mutation. Password hashes stay bcrypt; verification
happens in Next.js, not in Convex.
