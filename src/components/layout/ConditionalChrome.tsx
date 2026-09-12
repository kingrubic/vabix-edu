import { headers } from "next/headers";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { isBizcarHost, isBizcarPath } from "@/security/routes";
import { isPlatformProtectedPath, isPlatformPublicPath } from "@/platform/auth/jwt";

export async function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "";
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const bizcar = isBizcarHost(host) || isBizcarPath(pathname);
  const platform = isPlatformProtectedPath(pathname) || isPlatformPublicPath(pathname);

  if (bizcar || platform) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main id="noi-dung">{children}</main>
      <Footer />
    </>
  );
}
