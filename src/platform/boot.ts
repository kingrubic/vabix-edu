import { getDb } from "@/platform/db/client";
import { bootstrapAdminFromEnv, ensureSampleGroups } from "@/platform/iam/service";
import { seedCmsFromFiles } from "@/platform/cms/seed";
import { ensureCertificateTemplate } from "@/platform/lms/certificates";
import { isPlatformConvexConfigured } from "@/platform/convex/client";

type GlobalBoot = typeof globalThis & { __vabixPlatformBoot?: Promise<void> };

export async function bootPlatform() {
  const g = globalThis as GlobalBoot;
  if (!g.__vabixPlatformBoot) {
    g.__vabixPlatformBoot = (async () => {
      getDb();
      seedCmsFromFiles();
      ensureCertificateTemplate();
      if (isPlatformConvexConfigured()) {
        await ensureSampleGroups();
        await bootstrapAdminFromEnv();
      } else {
        console.warn("[platform] Convex is not configured; /dang-nhap IAM stays offline until CONVEX_URL + PLATFORM_CONVEX_SECRET are set.");
      }
    })();
  }
  await g.__vabixPlatformBoot;
}
