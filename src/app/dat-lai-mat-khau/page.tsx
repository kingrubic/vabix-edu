import { ResetForm } from "./ResetForm";

export default async function ResetPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string; activate?: string }>;
}) {
  const params = await searchParams;
  return <ResetForm token={params.token ?? ""} activate={params.activate === "1"} />;
}
