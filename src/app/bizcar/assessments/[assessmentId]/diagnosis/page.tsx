import { loadAssessmentPage } from "@/features/assessments/load";
import { AssessmentFrame } from "@/components/bizcar/AssessmentFrame";
import { Panel, ScoreBox } from "@/components/bizcar/Ui";
import { COMPONENT_CODES } from "@/domain/types";

export const metadata = { title: "Chẩn đoán — MyBizCar", robots: { index: false, follow: false } };

export default async function DiagnosisPage({ params }: { params: Promise<{ assessmentId: string }> }) {
  const { assessmentId } = await params;
  const { user, bundle, model } = await loadAssessmentPage(assessmentId);
  return (
    <AssessmentFrame user={user} assessment={bundle.assessment} organization={bundle.organization!} current="diagnosis">
      <h1 className="text-3xl font-semibold">Ảnh chụp sức khỏe động cơ</h1>
      <p className="mt-2 text-white/60">Không có một điểm tổng cho cả công ty. Năm chiều được giữ tách biệt.</p>
      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {COMPONENT_CODES.map((code) => (
          <Panel key={code}>
            <p className="eyebrow">{code}</p>
            <ScoreBox label="MDS" value={model.mds[code].finalMds} hint={`Thô ${model.mds[code].rawMds ?? "—"}`} />
            <p className="mt-2 text-sm">Kích hoạt: {model.profiles[code].activation ?? "Chưa đủ dữ liệu"}</p>
            <p className="text-sm">Lực: {model.profiles[code].force.force ?? "Chưa đủ dữ liệu"}</p>
            <p className="text-sm">Bằng chứng: {model.profiles[code].evidenceGrade ?? "Thiếu bằng chứng"}</p>
          </Panel>
        ))}
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <ScoreBox label="CFS" value={model.cfs.cfs} hint={model.cfs.band} />
        <ScoreBox label="Liên kết yếu nhất" value={model.cfs.weakestCode ? `${model.cfs.weakestCode} = ${model.cfs.weakest}` : "Chưa đủ dữ liệu"} />
      </div>
      <Panel className="mt-4">
        <h2 className="text-xl font-semibold">Điểm khóa</h2>
        <ul className="mt-3 text-sm text-white/70">
          {(model.criticalLocks.length ? model.criticalLocks : ["Không có khóa tới hạn đang cắt điểm."]).map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </Panel>
      <Panel>
        <h2 className="text-xl font-semibold">Khoảng trống bằng chứng</h2>
        <ul className="mt-3 text-sm text-white/70">
          {(model.evidenceGaps.length ? model.evidenceGaps : ["Không có tiêu chí đã chấm mà thiếu ghi chú bằng chứng."]).map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </Panel>
      <Panel>
        <h2 className="text-xl font-semibold">Rủi ro lực</h2>
        <ul className="mt-3 text-sm text-white/70">
          {(model.forceRisks.length ? model.forceRisks : ["Không quan sát lực nghịch đáng kể."]).map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </Panel>
      <Panel>
        <h2 className="text-xl font-semibold">Chẩn đoán có truy vết</h2>
        <div className="mt-4 space-y-4">
          {model.findings.map((finding) => (
            <article key={finding.id} className="border border-white/10 p-4">
              <p className="text-xs uppercase tracking-wide text-vabix-gold">{finding.severity}</p>
              <h3 className="mt-1 text-lg font-semibold">{finding.title}</h3>
              <p className="mt-2 text-white/75">{finding.body}</p>
              <ul className="mt-3 text-sm text-white/55">
                {finding.support.map((line) => (
                  <li key={line}>• {line}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Panel>
      <Panel>
        <h2 className="text-xl font-semibold">Ba câu hỏi ưu tiên</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-white/80">
          {model.questions.map((question) => (
            <li key={question}>{question}</li>
          ))}
        </ol>
      </Panel>
    </AssessmentFrame>
  );
}
