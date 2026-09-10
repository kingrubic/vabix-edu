import { headers } from "next/headers";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { isBizcarHost, isBizcarPath } from "@/security/routes";

export async function ConditionalChrome({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "";
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const bizcar = isBizcarHost(host) || isBizcarPath(pathname);

  if (bizcar) {
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
