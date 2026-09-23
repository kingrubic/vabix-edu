import Image from "next/image";
import { founderLetter } from "@/content/brand";
import { Container } from "@/components/ui/Section";
import { siteConfig } from "@/lib/siteConfig";
import { createMetadata } from "@/lib/seo";
import { paths } from "@/lib/paths";

export const metadata = createMetadata({
  title: "Thông điệp từ nhà sáng lập",
  description:
    "Thông điệp của Nguyễn Chí Thành, nhà sáng lập VABIX: kiến tạo nội lực, mở rộng kết nối và phát triển bền vững trên nền tảng tri thức và niềm tin.",
  path: paths.founderMessage,
  type: "article",
});

export default function FounderMessagePage() {
  return (
    <article className="vabix-letter">
      <Container>
        <header className="vabix-letter-head">
          <Image
            src="/images/portraits/nguyen-chi-thanh.jpg"
            alt=""
            width={96}
            height={120}
            unoptimized
            className="vabix-letter-portrait"
          />
          <div>
            <p className="eyebrow">Thông điệp từ nhà sáng lập</p>
            <h1>Kiến tạo nội lực, mở rộng kết nối, phát triển bền vững</h1>
            <p className="vabix-letter-byline">
              {siteConfig.founder.name}
              <span>Nhà sáng lập VABIX</span>
            </p>
          </div>
        </header>
        <div className="vabix-letter-body">
          <p className="vabix-letter-salute">{founderLetter.salutation}</p>
          {founderLetter.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <p className="vabix-letter-motto">{founderLetter.motto}</p>
          <p className="vabix-letter-close">{founderLetter.closing}</p>
          <p className="vabix-letter-sign">
            {siteConfig.founder.name}
            <span>Nhà sáng lập VABIX</span>
          </p>
        </div>
      </Container>
    </article>
  );
}
