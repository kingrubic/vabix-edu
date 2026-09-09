import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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
    "Trustworking",
    "đào tạo CEO",
    "tư vấn chuyển đổi doanh nghiệp",
    "huấn luyện doanh nghiệp",
    "3W",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={beVietnam.variable} data-scroll-behavior="smooth">
      <body className="min-h-screen antialiased">
        <JsonLd data={organizationJsonLd()} />
        <a
          href="#noi-dung"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-vabix-gold focus:px-3 focus:py-2 focus:text-vabix-deep-teal"
        >
          Bỏ qua điều hướng
        </a>
        <Header />
        <main id="noi-dung">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
