import { LoginScreen } from "@/platform/ui/LoginScreen";
import { bootPlatform } from "@/platform/boot";
import { getPlatformActor } from "@/platform/auth/session";
import { homePath } from "@/platform/permissions/evaluate";
import { redirect } from "next/navigation";
import { createMetadata } from "@/lib/seo";

export const metadata = {
  ...createMetadata({ title: "Đăng nhập", description: "Đăng nhập nền tảng VABIX.", path: "/dang-nhap" }),
  robots: { index: false, follow: false },
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  await bootPlatform();
  const actor = await getPlatformActor();
  if (actor) redirect(homePath(actor));
  const { next } = await searchParams;
  return <LoginScreen next={next} />;
}
