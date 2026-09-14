import { redirect } from "next/navigation";
import { bootPlatform } from "@/platform/boot";
import { getPlatformActor } from "@/platform/auth/session";
import { homePath } from "@/platform/permissions/evaluate";
import { createMetadata } from "@/lib/seo";
import { ChangePasswordForm } from "./ChangePasswordForm";

export const metadata = {
  ...createMetadata({
    title: "Đổi mật khẩu",
    description: "Đặt mật khẩu mới sau lần đăng nhập đầu tiên.",
    path: "/doi-mat-khau",
  }),
  robots: { index: false, follow: false },
};

export default async function ChangePasswordPage() {
  await bootPlatform();
  const actor = await getPlatformActor();
  if (!actor) redirect("/dang-nhap");
  if (!actor.mustChangePassword) redirect(homePath(actor));
  return <ChangePasswordForm name={actor.name} />;
}
