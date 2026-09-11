import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { ConditionalChrome } from "@/components/layout/ConditionalChrome";
import { ConvexClientProvider } from "@/components/providers/ConvexClientProvider";
import { JsonLd } from "@/components/ui/Misc";
import { createMetadata, organizationJsonLd } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  ...createMetadata({
    title: "VABIX — Kết tri thức. Nối giá trị.",
    description: siteConfig.description,
    path: "/",
  }),
  metadataBase: new URL(siteConfig.website),
  keywords: [
    "VABIX",
    "BizCar",
    "BMDO",
    "MBM",
    "B2A",
    "MyBizCar",
    "MTUA",
    "Trustworking",
    "đào tạo CEO",
    "tư vấn chuyển đổi doanh nghiệp",
    "huấn luyện doanh nghiệp",
    "3W",
  ],
};

export const revalidate = 0;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={beVietnam.variable} data-scroll-behavior="smooth">
      <body className="min-h-screen antialiased">
        <script
          dangerouslySetInnerHTML={{
            __html:
              '(function(){try{if("serviceWorker" in navigator){navigator.serviceWorker.getRegistrations().then(function(r){r.forEach(function(x){x.unregister()})});}var u=new URL(location.href);if(u.searchParams.has("_cv")){u.searchParams.delete("_cv");var q=u.searchParams.toString();history.replaceState(null,"",u.pathname+(q?("?"+q):"")+u.hash);}}catch(e){}})();',
          }}
        />
        <JsonLd data={organizationJsonLd()} />
        <a
          href="#noi-dung"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-vabix-gold focus:px-3 focus:py-2 focus:text-vabix-deep-teal"
        >
          Bỏ qua điều hướng
        </a>
        <ConvexClientProvider>
          <ConditionalChrome>{children}</ConditionalChrome>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
