import Link from "next/link";
import { MNEMONIC_DISCLAIMER, DEVELOPMENT_DISCLAIMER, COMPONENT_LABELS } from "@/domain/labels";
import { Logo } from "@/components/brand/Logo";
import { bizcarPath } from "@/lib/bizcarPaths";

export function EngineLanding() {
  return (
    <div className="bizcar-shell">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <Logo variant="light" className="h-10" />
        <p className="eyebrow mt-10">MyBizCar 3D · không gian tách khỏi website VABIX</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight sm:text-6xl">
          MyBizCar 3D
          <span className="mt-3 block text-vabix-gold">Động cơ doanh nghiệp MTUA</span>
        </h1>
        <p className="measure mt-6 text-lg text-white/75">
          Hệ thống đo lường và hình dung quản trị. Người dùng nhập bằng chứng và dữ liệu đánh giá; hệ thống tính hồ sơ đo lường và hiện một Động cơ doanh nghiệp 3D theo cấu hình MTUA.
        </p>
        <p className="mt-4 max-w-3xl text-sm text-amber-100/80">{MNEMONIC_DISCLAIMER}</p>
        <p className="mt-2 text-sm text-white/50">{DEVELOPMENT_DISCLAIMER}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={bizcarPath.engine} className="inline-flex min-h-11 items-center bg-vabix-gold px-5 font-semibold text-vabix-deep-teal">
            Mở động cơ 3D
          </Link>
          <Link href={bizcarPath.login} className="inline-flex min-h-11 items-center border border-white/30 px-5 text-white">
            Vào không gian làm việc
          </Link>
        </div>
        <p className="mt-6 text-xs text-white/40">Đường local: /bizcar · /bizcar/engine · /bizcar/login</p>
        <div className="mt-14 grid gap-4 md:grid-cols-4">
          {Object.entries(COMPONENT_LABELS).map(([code, meta]) => (
            <article key={code} className="bizcar-panel p-5">
              <p className="eyebrow">
                {code} · {meta.mnemonic}
              </p>
              <h2 className="mt-2 text-xl font-semibold">{meta.vi}</h2>
              <p className="mt-2 text-sm text-white/60">{meta.en}</p>
            </article>
          ))}
        </div>
        <section className="mt-14 grid gap-4 md:grid-cols-5">
          {[
            ["MDS", "Chất lượng thiết kế"],
            ["Kích hoạt", "Mức đi vào quyết định"],
            ["CFS", "Khớp cấu phần"],
            ["Lực", "Lực quan sát được"],
            ["Bằng chứng", "Độ tin cậy"],
          ].map(([title, body]) => (
            <article key={title} className="border border-white/10 p-4">
              <p className="font-semibold text-vabix-gold">{title}</p>
              <p className="mt-2 text-sm text-white/65">{body}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
