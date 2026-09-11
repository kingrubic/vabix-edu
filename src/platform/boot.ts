import { getDb } from "@/platform/db/client";
import { bootstrapAdminFromEnv, ensureSampleGroups } from "@/platform/iam/service";
import { seedCmsFromFiles } from "@/platform/cms/seed";
import { ensureCertificateTemplate } from "@/platform/lms/certificates";

type GlobalBoot = typeof globalThis & { __vabixPlatformBoot?: Promise<void> };

export async function bootPlatform() {
  const g = globalThis as GlobalBoot;
  if (!g.__vabixPlatformBoot) {
    g.__vabixPlatformBoot = (async () => {
      getDb();
      ensureSampleGroups();
      seedCmsFromFiles();
      ensureCertificateTemplate();
      await bootstrapAdminFromEnv();
    })();
  }
  await g.__vabixPlatformBoot;
}
