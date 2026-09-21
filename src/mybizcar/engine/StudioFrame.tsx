import { appCopy } from "@/mybizcar/domain";

export function StudioFrame({
  demo = false,
  children,
}: {
  demo?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mybizcar-studio">
      {demo ? (
        <p className="mb-3 inline-flex min-h-8 items-center border border-[#B79A63]/40 bg-[#B79A63]/10 px-2 text-[11px] tracking-[0.12em] text-[#B79A63] uppercase">
          {appCopy.demoLabel}
        </p>
      ) : null}
      {children}
    </div>
  );
}
