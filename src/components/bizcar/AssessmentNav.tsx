import Link from "next/link";

const STEPS = [
  { href: "context", label: "Ngữ cảnh" },
  { href: "mission", label: "M · Nạp" },
  { href: "aspiration", label: "T · Nén" },
  { href: "commitment", label: "U · Nổ" },
  { href: "values", label: "A · Neo" },
  { href: "evidence", label: "Bằng chứng" },
  { href: "cfs", label: "CFS" },
  { href: "activation-force", label: "Kích hoạt & Lực" },
  { href: "engine", label: "Động cơ 3D" },
  { href: "diagnosis", label: "Chẩn đoán" },
  { href: "mais", label: "MAIS" },
  { href: "report", label: "Báo cáo" },
] as const;

export function AssessmentNav({ assessmentId, current }: { assessmentId: string; current: string }) {
  return (
    <nav className="flex gap-2 overflow-x-auto pb-2" aria-label="Các bước đánh giá">
      {STEPS.map((step) => {
        const active = current === step.href;
        return (
          <Link
            key={step.href}
            href={`/bizcar/assessments/${assessmentId}/${step.href}`}
            className={`inline-flex min-h-11 shrink-0 items-center border px-3 text-sm ${
              active ? "border-vabix-gold bg-vabix-gold/15 text-vabix-gold" : "border-white/10 text-white/70"
            }`}
          >
            {step.label}
          </Link>
        );
      })}
    </nav>
  );
}
