import { Breadcrumb } from "@/components/ui/Misc";
import { Container } from "@/components/ui/Section";
import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  dark = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs: { name: string; href?: string }[];
  dark?: boolean;
}) {
  return (
    <section className={dark ? "bg-vabix-deep-teal pt-28 text-white sm:pt-32" : "bg-vabix-ivory pt-28 sm:pt-32"}>
      <Container className="py-12 sm:py-16">
        <Breadcrumb items={crumbs} light={dark} />
        {eyebrow ? <p className="eyebrow mt-6">{eyebrow}</p> : null}
        <h1 className={`mt-3 max-w-4xl text-balance text-[32px] font-semibold leading-tight sm:text-5xl ${dark ? "text-white" : "text-vabix-deep-teal"}`}>
          {title}
        </h1>
        {description ? (
          <p className={`measure mt-5 text-base sm:text-lg ${dark ? "text-white/80" : "text-vabix-muted"}`}>{description}</p>
        ) : null}
      </Container>
    </section>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return <div className="space-y-4 text-[17px] leading-relaxed text-vabix-ink [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-vabix-deep-teal [&_p]:max-w-[42rem]">{children}</div>;
}
