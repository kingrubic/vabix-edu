import type { MdsBreakdown } from "@/scoring/mds";
import { Panel } from "./Ui";

export function WhyScore({ mds }: { mds: MdsBreakdown }) {
  return (
    <Panel>
      <h2 className="text-lg font-semibold">Vì sao điểm này?</h2>
      <p className="mt-2 text-sm text-white/60">
        Logic tính toán luôn được mở. MDS mô tả chất lượng thiết kế — không chứng minh cấu kiện đã triển khai thành công.
      </p>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="bizcar-label">MDS thô</dt>
          <dd>{mds.rawMds ?? "Chưa đủ dữ liệu"}</dd>
        </div>
        <div>
          <dt className="bizcar-label">Trần khóa tới hạn</dt>
          <dd>{mds.appliedCriticalCap ? mds.criticalCap : "Không áp"}</dd>
        </div>
        <div>
          <dt className="bizcar-label">Trần bằng chứng</dt>
          <dd>{mds.appliedEvidenceCap ? mds.evidenceCap : "Không áp"}</dd>
        </div>
        <div>
          <dt className="bizcar-label">MDS cuối</dt>
          <dd>
            {mds.finalMds ?? "Chưa đủ dữ liệu"}
            {mds.provisional ? " · Điểm tạm tính" : ""}
          </dd>
        </div>
      </dl>
      <ul className="mt-4 space-y-2 text-sm text-white/75">
        {mds.explanation.map((line) => (
          <li key={line}>• {line}</li>
        ))}
      </ul>
      {mds.calibrationRequired ? <p className="mt-4 text-amber-200">Cần hiệu chuẩn</p> : null}
      {mds.weakestCriteria.length > 0 ? (
        <div className="mt-4">
          <p className="bizcar-label">Ba tiêu chí yếu nhất</p>
          <ul className="mt-2 text-sm">
            {mds.weakestCriteria.map((item) => (
              <li key={item.code}>
                {item.code} {item.nameVi}: {item.score}
                {item.critical ? " · tới hạn" : ""}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {mds.missingEvidence.length > 0 ? (
        <p className="mt-3 text-sm text-amber-100">Thiếu bằng chứng: {mds.missingEvidence.join(", ")}</p>
      ) : null}
    </Panel>
  );
}
