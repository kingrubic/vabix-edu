import Link from "next/link";
import Image from "next/image";
import type { Expert } from "@/content/types";
import type { CaseStudy } from "@/content/types";
import type { EventItem } from "@/content/types";
import type { Article } from "@/content/types";
import { ArrowIcon } from "@/components/ui/Misc";

export function ExpertCard({ expert }: { expert: Expert }) {
  return (
    <Link
      href={`/mang-luoi/chuyen-gia/${expert.slug}`}
      className="group block border border-vabix-deep-teal/10 bg-white p-5 transition-colors hover:border-vabix-gold"
    >
      <div className="relative mx-auto aspect-square w-28 overflow-hidden rounded-full bg-vabix-deep-teal">
        <Image src={expert.portrait} alt={expert.name} fill className="object-cover object-top" sizes="112px" />
      </div>
      <h3 className="mt-4 text-center text-base font-semibold text-vabix-deep-teal">{expert.name}</h3>
      <p className="mt-1 text-center text-sm text-vabix-muted">{expert.title}</p>
      <p className="mt-2 text-center text-xs tracking-wide text-vabix-gold">{expert.expertise.slice(0, 2).join(" · ")}</p>
    </Link>
  );
}

export function CaseStudyCard({ item }: { item: CaseStudy }) {
  return (
    <article className="flex h-full flex-col border border-vabix-deep-teal/10 bg-white">
      <div className="relative aspect-[16/10] overflow-hidden bg-vabix-deep-teal">
        <Image src={item.coverImage} alt={`${item.organization} — ${item.industry}`} fill className="object-cover opacity-80" sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="eyebrow">{item.organization}</p>
        <h3 className="mt-2 text-lg font-semibold text-vabix-deep-teal">{item.industry}</h3>
        <p className="mt-3 line-clamp-3 text-sm text-vabix-muted">{item.challenge}</p>
        <p className="mt-3 text-sm text-vabix-ink">
          <span className="font-semibold">Kết quả: </span>
          {item.results}
        </p>
        <Link href={`/tri-thuc/case-study/${item.slug}`} className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-vabix-deep-teal">
          Xem case study <ArrowIcon />
        </Link>
      </div>
    </article>
  );
}

export function EventCard({ event }: { event: EventItem }) {
  const date = new Date(event.startDate);
  const dateLabel = date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
  const statusLabel = event.status === "upcoming" ? "Sắp diễn ra" : event.status === "ongoing" ? "Đang diễn ra" : "Đã diễn ra";
  return (
    <article className="flex h-full flex-col border border-vabix-deep-teal/10 bg-white">
      <div className="relative aspect-[16/10] bg-vabix-teal">
        <Image src={event.image} alt="" fill className="object-cover opacity-70" sizes="(max-width: 768px) 100vw, 33vw" />
        <p className="absolute left-4 top-4 bg-vabix-deep-teal px-2 py-1 text-xs font-semibold tracking-wide text-white uppercase">
          {statusLabel}
        </p>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-sm text-vabix-gold">{dateLabel}</p>
        <p className="eyebrow mt-2">{event.category}</p>
        <h3 className="mt-2 text-lg font-semibold text-vabix-deep-teal">{event.title}</h3>
        <p className="mt-2 text-sm text-vabix-muted">{event.location}</p>
        <div className="mt-auto flex gap-3 pt-4">
          <Link href={`/su-kien/${event.slug}`} className="text-sm font-semibold text-vabix-deep-teal">
            Chi tiết
          </Link>
          {event.status !== "completed" && event.registrationUrl ? (
            <Link href={event.registrationUrl} className="text-sm font-semibold text-vabix-gold">
              Đăng ký
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function ArticleCard({ article }: { article: Article }) {
  return (
    <article className="flex h-full flex-col border border-vabix-deep-teal/10 bg-white">
      <div className="relative aspect-[16/10] bg-vabix-ivory">
        <Image src={article.coverImage} alt="" fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="eyebrow">{article.categoryLabel}</p>
        <h3 className="mt-2 text-lg font-semibold text-vabix-deep-teal">
          <Link href={`/tri-thuc/${article.slug}`}>{article.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm text-vabix-muted">{article.excerpt}</p>
      </div>
    </article>
  );
}

export function PartnerLogo({ name, caption }: { name: string; caption?: string }) {
  return (
    <div className="flex min-h-[88px] items-center justify-center border border-vabix-deep-teal/10 bg-white px-4 py-5 grayscale">
      <div className="text-center">
        <p className="text-sm font-bold tracking-[0.12em] text-vabix-deep-teal uppercase">{name}</p>
        {caption ? <p className="mt-1 text-[11px] text-vabix-muted">{caption}</p> : null}
      </div>
    </div>
  );
}

export function MetricCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-t border-vabix-gold/40 pt-5">
      <p className="text-3xl font-semibold text-vabix-gold sm:text-4xl">{value}</p>
      <p className="mt-2 text-sm text-white/80">{label}</p>
    </div>
  );
}

export function SolutionCard({
  number,
  title,
  summary,
  href,
}: {
  number: string;
  title: string;
  summary: string;
  href: string;
}) {
  return (
    <Link href={href} className="group flex h-full flex-col border border-vabix-deep-teal/10 bg-white p-6 hover:border-vabix-gold">
      <span className="text-sm font-semibold tracking-widest text-vabix-gold">{number}</span>
      <h3 className="mt-3 text-lg font-semibold text-vabix-deep-teal">{title}</h3>
      <p className="mt-3 flex-1 text-sm text-vabix-muted">{summary}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-vabix-deep-teal">
        Tìm hiểu thêm <ArrowIcon />
      </span>
    </Link>
  );
}
