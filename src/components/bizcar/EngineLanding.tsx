import Link from "next/link";
import { componentLabels, legendItems } from "@/mybizcar/domain";
import { DevelopmentBanner } from "@/components/bizcar/PublicChrome";
import { EngineExperience } from "@/mybizcar/engine/EngineExperience";
import { getDemoEngineView } from "@/mybizcar/demo-view";
import { bizcarPath } from "@/lib/bizcarPaths";
import type { CurrentUser } from "@/security/session";

export function EngineLanding({ user }: { user: CurrentUser | null }) {
  const model = getDemoEngineView();
  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <p className="text-xs tracking-[0.2em] text-[#B79A63] uppercase">VABIX · BMDO · The BizCar</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-[#163D38] sm:text-5xl">MyBizCar 3D</h1>
          <p className="mt-5 max-w-2xl text-[#626D68]">
            Mô phỏng quản trị doanh nghiệp trên sedan MyBizCar — BMDO / MTUA. Dữ liệu minh họa.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={user ? bizcarPath.dashboard : bizcarPath.login}
              className="inline-flex min-h-11 items-center bg-[#163c3e] px-5 font-semibold text-[#F6F5F1]"
            >
              {user ? "Vào workspace" : "Đăng nhập workspace"}
            </Link>
            <a href="#dong-co-3d" className="inline-flex min-h-11 items-center border border-[#DDE3DE] px-5 text-[#163D38]">
              Xem MyBizCar 3D DEMO
            </a>
          </div>
        </div>
        <div className="border border-[#DDE3DE] bg-white p-6">
          <p className="text-xs tracking-[0.16em] text-[#B79A63] uppercase">Bốn cấu kiện</p>
          <ul className="mt-4 space-y-3">
            {(["M", "T", "U", "A"] as const).map((code) => (
              <li key={code} className="flex gap-3 border-b border-[#DDE3DE] pb-3 last:border-b-0 last:pb-0">
                <span className="w-12 font-semibold text-[#B79A63]">{componentLabels[code].mnemonic}</span>
                <span>
                  <strong className="text-[#163D38]">
                    {code} — {componentLabels[code].name}
                  </strong>
                  <span className="mt-1 block text-sm text-[#626D68]">{componentLabels[code].question}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <DevelopmentBanner />
      <section id="dong-co-3d" className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex min-h-8 items-center border border-[#B79A63]/40 bg-[#B79A63]/10 px-2 text-[11px] tracking-[0.12em] text-[#B79A63] uppercase">
            DEMO — DỮ LIỆU MINH HỌA
          </span>
        </div>
        <EngineExperience model={model} />
      </section>
      <section className="grid gap-4 md:grid-cols-5">
        {[
          ["MDS", "Chất lượng thiết kế 1–10. Không chứng minh đã triển khai."],
          ["Mức kích hoạt", "Mức đi vào quyết định / nguồn lực / hành vi / nhịp quản trị. Không tự chấm."],
          ["CFS", "Độ khớp sáu mối nối cấu phần."],
          ["Lực tác động", "Ảnh hưởng quan sát được, -10 đến +10."],
          ["Cấp bằng chứng", "D / C / B / A — độ tin cậy, không phải điểm đẹp."],
        ].map(([title, body]) => (
          <article key={title} className="border border-[#DDE3DE] bg-white p-4">
            <h2 className="font-semibold text-[#163D38]">{title}</h2>
            <p className="mt-2 text-sm text-[#626D68]">{body}</p>
          </article>
        ))}
      </section>
      <section>
        <h2 className="text-lg font-semibold text-[#163D38]">Ánh xạ hình ảnh Động cơ 3D</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {legendItems.map((item) => (
            <div key={item.key} className="border border-[#DDE3DE] bg-white p-3 text-sm">
              <p className="tracking-[0.12em] text-[#B79A63] uppercase">{item.title}</p>
              <p className="mt-1 text-[#626D68]">{item.meaning}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
