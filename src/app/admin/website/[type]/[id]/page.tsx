import { notFound } from "next/navigation";
import { requireMenu } from "@/platform/auth/guard";
import { getCmsById } from "@/platform/cms/service";
import { CmsEditor } from "@/platform/cms/CmsEditor";

export default async function CmsEditPage({ params }: { params: Promise<{ type: string; id: string }> }) {
  const { type, id } = await params;
  await requireMenu(`/admin/website/${type}`);
  const doc = getCmsById(id);
  if (!doc) notFound();
  return <CmsEditor doc={doc} />;
}
