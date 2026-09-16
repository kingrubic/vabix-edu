import { ProgramDetail, programMetadata, programStaticParams } from "@/components/templates/ProgramDetail";

export function generateStaticParams() {
  return programStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return programMetadata(slug);
}

export default async function DaoTaoProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProgramDetail slug={slug} />;
}
