import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";

export function CTASection({
  title,
  description,
  primary = { label: "Đặt lịch trao đổi", href: "/ket-noi#tu-van" },
  secondary = { label: "Liên hệ VABIX", href: "/lien-he" },
}: {
  title: string;
  description: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="relative overflow-hidden bg-vabix-deep-teal py-20 text-white">
      <div className="pointer-events-none absolute inset-0 opacity-40" aria-hidden>
        <div className="absolute -right-24 top-10 h-80 w-80 rounded-full border border-vabix-gold/30" />
        <div className="absolute -right-8 top-24 h-52 w-52 rounded-full border border-white/10" />
      </div>
      <Container className="relative">
        <h2 className="max-w-3xl text-balance text-3xl font-semibold leading-tight sm:text-4xl">{title}</h2>
        <p className="measure mt-4 text-white/80">{description}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={primary.href} variant="gold">
            {primary.label}
          </Button>
          <Button href={secondary.href} variant="outline" className="border-white/40 text-white">
            {secondary.label}
          </Button>
        </div>
      </Container>
    </section>
  );
}
