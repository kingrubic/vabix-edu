import { notFound } from "next/navigation";
import { getMethodology, methodologies, bizCarBlocks } from "@/content/methodologies";
import { MethodologyTemplate } from "@/components/templates/MethodologyTemplate";
import { featuredExperts } from "@/content/experts";
import { caseStudies } from "@/content/caseStudies";
import { ExpertCard, CaseStudyCard } from "@/components/cards/Cards";
import { SectionHeading } from "@/components/ui/Section";
import { createMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return methodologies.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = getMethodology(slug);
  if (!m) return {};
  return createMetadata({ title: m.name, description: m.summary, path: `/mo-hinh-phuong-phap/${m.slug}` });
}

export default async function MethodPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const m = getMethodology(slug);
  if (!m) notFound();

  const extra =
    slug === "bizcar" ? (
      <div className="space-y-12">
        <section>
          <SectionHeading title="Vì sao BizCar tồn tại" />
          <p className="measure mt-4 text-vabix-muted">
            Khi bức tranh tổng thể chưa rõ, đổi mới dễ manh mún. BizCar cho lãnh đạo một cách nhìn doanh nghiệp như chiếc xe thống nhất — biết bánh nào đang trượt trước khi đổi bánh.
          </p>
        </section>
        <section>
          <SectionHeading title="Ẩn dụ chiếc xe" />
          <p className="measure mt-4 text-vabix-muted">
            Động cơ là định hướng chiến lược. Các bánh xe là thị trường, giá trị, nhân lực, tài lực. Hộp số và truyền dẫn là vận hành. Thân vỏ là thương hiệu. Khung gầm là tổ chức. Bánh lái và tài xế là lãnh đạo — điều hành. Nhớt là văn hóa. Nhiên liệu là nguồn lực lõi. Đường sá là môi trường kinh doanh.
          </p>
        </section>
        <section>
          <SectionHeading title="12 khối chức năng — ba nhóm lớn" />
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {bizCarBlocks.map((g) => (
              <article key={g.groupId} className="border border-vabix-deep-teal/10 p-5">
                <h3 className="font-semibold text-vabix-deep-teal">{g.group}</h3>
                <ul className="mt-4 space-y-2 text-sm">
                  {g.items.map((i) => (
                    <li key={i.n}>
                      <span className="text-vabix-gold">{i.n}</span> {i.name}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
        <section>
          <SectionHeading title="Chẩn đoán như thế nào" />
          <p className="measure mt-4 text-vabix-muted">
            Mỗi khối có điểm đo. Lãnh đạo và đội ngũ cùng nhận diện cấu phần yếu, chọn thứ tự ưu tiên, rồi thiết kế lại — thay vì chữa cháy cục bộ.
          </p>
        </section>
        <section>
          <SectionHeading title="Chương trình BMDO" />
          <p className="measure mt-4 text-vabix-muted">
            BMDO là xưởng thiết kế vận hành trên nền BizCar. Học viên mang dữ liệu thật và ra về với phiên bản thiết kế của chính doanh nghiệp.
          </p>
        </section>
        <section className="bg-vabix-ivory p-6">
          <SectionHeading title="Case study" />
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {caseStudies.slice(0, 2).map((c) => (
              <CaseStudyCard key={c.id} item={c} />
            ))}
          </div>
        </section>
        <section>
          <SectionHeading title="Đội ngũ" />
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {featuredExperts.slice(0, 3).map((e) => (
              <ExpertCard key={e.id} expert={e} />
            ))}
          </div>
        </section>
        <section>
          <SectionHeading title="Câu hỏi thường gặp" />
          <details className="mt-4 border p-4">
            <summary className="cursor-pointer font-semibold text-vabix-deep-teal">BizCar là gì?</summary>
            <p className="mt-2 text-sm text-vabix-muted">{m.summary}</p>
          </details>
          <details className="mt-3 border p-4">
            <summary className="cursor-pointer font-semibold text-vabix-deep-teal">BizCar có phải chỉ dành cho doanh nghiệp lớn?</summary>
            <p className="mt-2 text-sm text-vabix-muted">Không. SME và startup dùng BizCar như ngôn ngữ chung để ưu tiên đúng chỗ khi nguồn lực hữu hạn.</p>
          </details>
        </section>
      </div>
    ) : undefined;

  return <MethodologyTemplate method={m} extra={extra} />;
}
