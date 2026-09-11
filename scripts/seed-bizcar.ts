import { existsSync, readFileSync } from "fs";
import { resolve } from "path";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  for (const raw of readFileSync(path, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq < 1) continue;
    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvLocal();

async function main() {
  const { loadStore } = await import("../src/db/store");
  const { verifyPassword } = await import("../src/security/auth");
  const store = await loadStore();
  const password = process.env.BIZCAR_DEMO_SEED_PASSWORD ?? "";
  const logins = [];
  for (const user of store.users) {
    logins.push({
      email: user.email,
      name: user.name,
      passwordOk: await verifyPassword(password, user.passwordHash),
    });
  }
  console.log(
    JSON.stringify(
      {
        backend: "convex",
        users: logins,
        organizations: store.organizations.map((org) => ({ name: org.name, slug: org.slug })),
        assessments: store.assessments.map((assessment) => ({
          title: assessment.title,
          status: assessment.status,
        })),
        evidence: store.evidenceItems.length,
        comments: store.comments.length,
        actions: store.improvementActions.length,
      },
      null,
      2,
    ),
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
