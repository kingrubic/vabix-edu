import { ComponentStep } from "@/components/bizcar/ComponentStep";

export const metadata = { title: "Values — MyBizCar", robots: { index: false, follow: false } };

export default async function Page({ params }: { params: Promise<{ assessmentId: string }> }) {
  const { assessmentId } = await params;
  return <ComponentStep assessmentId={assessmentId} code="A" current="values" />;
}
