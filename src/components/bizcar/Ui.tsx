import type { AssessmentStatus, EvidenceGrade } from "@/domain/types";
import { EVIDENCE_LABELS, STATUS_LABELS } from "@/domain/labels";

export function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`bizcar-panel p-5 ${className}`}>{children}</section>;
}

export function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="bizcar-label">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-white/50">{hint}</span> : null}
    </label>
  );
}

export function StatusBadge({ status }: { status: AssessmentStatus }) {
  return (
    <span className="inline-flex min-h-8 items-center border border-vabix-gold/30 px-2 text-xs tracking-wide text-vabix-gold">
      {STATUS_LABELS[status]}
    </span>
  );
}

export function EvidenceBadge({ grade }: { grade: EvidenceGrade | null }) {
  if (!grade) return <span className="text-xs text-white/50">Thiếu bằng chứng</span>;
  return (
    <span className="inline-flex min-h-8 items-center border border-white/20 px-2 text-xs text-white/80">
      {EVIDENCE_LABELS[grade].name}
      {grade === "D" ? " · Điểm tạm tính" : ""}
    </span>
  );
}

export function ScoreBox({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number | null | undefined;
  hint?: string;
}) {
  return (
    <div className="border border-white/10 p-3">
      <p className="bizcar-label">{label}</p>
      <p className="text-2xl font-semibold text-white">{value ?? "Chưa đủ dữ liệu"}</p>
      {hint ? <p className="mt-1 text-xs text-white/50">{hint}</p> : null}
    </div>
  );
}

export function DemoMark({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <span className="border border-cyan-300/40 bg-cyan-300/10 px-2 py-1 text-[11px] tracking-widest text-cyan-100">
      DEMO
    </span>
  );
}

export function PrimaryButton({
  children,
  disabled,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="inline-flex min-h-11 items-center justify-center bg-vabix-gold px-5 font-semibold text-vabix-deep-teal disabled:opacity-50"
    >
      {children}
    </button>
  );
}
