import type {
  CriterionAnchor,
  StandardCfsConnection,
  StandardComponent,
  StandardCriterion,
  StandardThresholds,
  StandardVersion,
} from "@/domain/types";
import { CFS_WEIGHT_DISCLAIMER, DEVELOPMENT_DISCLAIMER, MNEMONIC_DISCLAIMER } from "@/domain/labels";

export const STANDARD_VERSION_ID = "00000000-0000-4000-8000-000000000020";

export const standardVersion: StandardVersion = {
  id: STANDARD_VERSION_ID,
  code: "BMDO-MDS-01-MTUA",
  name: "BMDO MDS 01 MTUA",
  version: "0.1",
  status: "DEVELOPMENT",
  effectiveDate: "2026-09-01",
  approvalNote: "Chưa phê duyệt học thuật — phiên bản phát triển.",
  changeReason: "Khởi tạo seed MVP.",
  impactNote: "Mọi đánh giá dùng phiên bản này phải mang nhãn phát triển.",
  developmentDisclaimer: DEVELOPMENT_DISCLAIMER,
  createdAt: "2026-09-01T00:00:00.000Z",
  updatedAt: "2026-09-01T00:00:00.000Z",
  createdBy: "00000000-0000-4000-8000-000000000001",
};

export const standardComponents: StandardComponent[] = [
  {
    id: "std-comp-m",
    standardVersionId: STANDARD_VERSION_ID,
    code: "M",
    nameEn: "Meaningful Mission",
    nameVi: "Sứ mệnh có ý nghĩa",
    mnemonic: "NẠP",
    mnemonicMeaning: "Nạp",
    requiredLevelDefault: 8,
    sortOrder: 1,
  },
  {
    id: "std-comp-t",
    standardVersionId: STANDARD_VERSION_ID,
    code: "T",
    nameEn: "Targeted Aspiration",
    nameVi: "Khát vọng có đích",
    mnemonic: "NÉN",
    mnemonicMeaning: "Nén",
    requiredLevelDefault: 9,
    sortOrder: 2,
  },
  {
    id: "std-comp-u",
    standardVersionId: STANDARD_VERSION_ID,
    code: "U",
    nameEn: "Unwavering Commitment",
    nameVi: "Cam kết không lay chuyển",
    mnemonic: "NỔ",
    mnemonicMeaning: "Nổ",
    requiredLevelDefault: 8,
    sortOrder: 3,
  },
  {
    id: "std-comp-a",
    standardVersionId: STANDARD_VERSION_ID,
    code: "A",
    nameEn: "Anchored Values",
    nameVi: "Giá trị được neo",
    mnemonic: "NEO",
    mnemonicMeaning: "Neo",
    requiredLevelDefault: 7,
    sortOrder: 4,
  },
];

type CriterionSeed = {
  code: string;
  nameVi: string;
  weight: number;
  critical?: boolean;
  anchors: Record<1 | 3 | 5 | 7 | 9 | 10, string>;
};

const M: CriterionSeed[] = [
  {
    code: "M1",
    nameVi: "Lý do tồn tại rõ",
    weight: 20,
    critical: true,
    anchors: {
      1: "Không nêu được lý do tồn tại ngoài việc 'làm ra tiền' hoặc tồn tại vì thói quen.",
      3: "Có câu sứ mệnh nhưng thay thế được bằng khẩu hiệu chung của ngành.",
      5: "Nêu được lý do tồn tại, còn lẫn với sản phẩm hoặc mục tiêu ngắn hạn.",
      7: "Lý do tồn tại đủ rõ để loại một số cơ hội không thuộc sứ mệnh.",
      9: "Lý do tồn tại được dùng khi từ chối việc lớn và giải thích cho tổ chức.",
      10: "Lý do tồn tại nhất quán, chịu được phản biện và dẫn dắt lựa chọn khó.",
    },
  },
  {
    code: "M2",
    nameVi: "Đối tượng và kết quả",
    weight: 15,
    anchors: {
      1: "Không xác định đối tượng phục vụ và kết quả cần tạo ra.",
      3: "Đối tượng chung chung, kết quả không kiểm chứng được.",
      5: "Có đối tượng và kết quả nhưng còn rộng, dễ đổi theo chiến dịch.",
      7: "Đối tượng và kết quả đủ cụ thể để phân bổ ưu tiên.",
      9: "Đối tượng/kết quả được kiểm tra lại theo bằng chứng thực địa.",
      10: "Đối tượng và kết quả ổn định, phân biệt được với đối thủ và dự án con.",
    },
  },
  {
    code: "M3",
    nameVi: "Logic tạo giá trị",
    weight: 20,
    critical: true,
    anchors: {
      1: "Không giải thích được giá trị được tạo ra bằng cách nào.",
      3: "Logic giá trị là danh sách hoạt động, chưa có mối liên hệ.",
      5: "Có chuỗi giá trị sơ bộ, còn thiếu giả định then chốt.",
      7: "Giải thích được cách nguồn lực biến thành giá trị cho đối tượng.",
      9: "Logic giá trị được dùng khi thiết kế dịch vụ/sản phẩm và đối tác.",
      10: "Logic giá trị chịu được thử thách và chỉ ra điểm tạo/mất giá trị.",
    },
  },
  {
    code: "M4",
    nameVi: "Tính xác thực",
    weight: 15,
    anchors: {
      1: "Sứ mệnh mang tính trang trí, mâu thuẫn với việc đang làm.",
      3: "Có văn bản sứ mệnh nhưng lãnh đạo không nhắc khi quyết định.",
      5: "Một phần hoạt động khớp sứ mệnh, phần còn lại đi theo cơ hội ngắn.",
      7: "Phần lớn lựa chọn lớn có thể truy về sứ mệnh.",
      9: "Có bằng chứng từ chối việc hấp dẫn vì không khớp sứ mệnh.",
      10: "Sứ mệnh và hành vi tổ chức khớp cả khi chịu áp lực doanh thu.",
    },
  },
  {
    code: "M5",
    nameVi: "Khả năng dẫn hướng",
    weight: 20,
    critical: true,
    anchors: {
      1: "Sứ mệnh không giúp chọn việc nào làm trước.",
      3: "Chỉ dùng để truyền thông, không dẫn dắt ưu tiên.",
      5: "Dẫn được hướng lớn, chưa đủ để cắt dự án.",
      7: "Dùng được để xếp hạng sáng kiến và ngân sách.",
      9: "Dẫn được quyết định nhân sự, đối tác và phạm vi thị trường.",
      10: "Là tiêu chí thường trực khi xung đột ưu tiên xảy ra.",
    },
  },
  {
    code: "M6",
    nameVi: "Khả năng được hiểu",
    weight: 10,
    anchors: {
      1: "Không ai ngoài người viết nhắc lại đúng ý.",
      3: "Nhóm lãnh đạo hiểu khác nhau về cùng một câu.",
      5: "Cấp quản lý hiểu ý chính, tuyến dưới nhắc slogan.",
      7: "Đa số cán bộ then chốt giải thích được bằng lời của mình.",
      9: "Đối tác then chốt hiểu phạm vi sứ mệnh tương đối đúng.",
      10: "Sứ mệnh được hiểu nhất quán qua các tầng và tình huống.",
    },
  },
];

const T: CriterionSeed[] = [
  {
    code: "T1",
    nameVi: "Trạng thái đích",
    weight: 20,
    critical: true,
    anchors: {
      1: "Không mô tả được trạng thái thành công.",
      3: "Đích là mong muốn chung ('lớn mạnh', 'top ngành').",
      5: "Có mô tả đích nhưng còn nhiều phiên bản song song.",
      7: "Trạng thái đích đủ cụ thể để nhận ra khi đến nơi.",
      9: "Đích được chia sẻ và dùng khi loại phương án.",
      10: "Trạng thái đích rõ, ổn định trong kỳ định hướng, chịu phản biện.",
    },
  },
  {
    code: "T2",
    nameVi: "Thước đo và thời hạn",
    weight: 20,
    critical: true,
    anchors: {
      1: "Không có thước đo hay thời hạn.",
      3: "Có KPI rời, không gắn trạng thái đích.",
      5: "Có chỉ số và mốc thời gian, còn dễ đổi mỗi quý.",
      7: "Thước đo chính và thời hạn đủ để kiểm tra tiến độ.",
      9: "Thước đo được rà soát độc lập, không chỉ là báo cáo đẹp.",
      10: "Thước đo/thời hạn dẫn được điều chỉnh nguồn lực giữa kỳ.",
    },
  },
  {
    code: "T3",
    nameVi: "Trọng tâm và đánh đổi",
    weight: 15,
    critical: true,
    anchors: {
      1: "Muốn tất cả, không chịu đánh đổi.",
      3: "Danh sách ưu tiên dài, không có cái bị loại.",
      5: "Có trọng tâm nhưng vẫn giữ hầu hết việc cũ.",
      7: "Nêu được việc sẽ không làm trong kỳ.",
      9: "Đánh đổi được thi hành trong ngân sách và lịch lãnh đạo.",
      10: "Đánh đổi được bảo vệ khi xuất hiện cơ hội lệch trọng tâm.",
    },
  },
  {
    code: "T4",
    nameVi: "Liên kết với Mission",
    weight: 15,
    anchors: {
      1: "Đích không liên quan sứ mệnh.",
      3: "Gắn sứ mệnh như câu mở đầu, không có logic.",
      5: "Một phần đích bám sứ mệnh, một phần theo phong trào.",
      7: "Giải thích được vì sao đích này là cách sống sứ mệnh trong kỳ.",
      9: "Khi sứ mệnh và đích căng thẳng, có quyết định tường minh.",
      10: "Aspiration là phiên bản đo được của Mission trong chân trời đã chọn.",
    },
  },
  {
    code: "T5",
    nameVi: "Độ thách thức khả thi",
    weight: 15,
    anchors: {
      1: "Đích hoặc không tưởng hoặc quá dễ đến mức không đổi hành vi.",
      3: "Thách thức trên giấy, không có giả định nguồn lực.",
      5: "Có căng nhưng chưa kiểm tra ràng buộc then chốt.",
      7: "Mức căng được đối chiếu với năng lực và thời hạn.",
      9: "Có kịch bản nếu giả định then chốt gãy.",
      10: "Đủ khó để buộc học hỏi, đủ thật để chịu trách nhiệm.",
    },
  },
  {
    code: "T6",
    nameVi: "Khả năng phân rã",
    weight: 15,
    anchors: {
      1: "Đích không tách được thành việc của từng khối.",
      3: "Phân rã thành khẩu hiệu phòng ban.",
      5: "Có mục tiêu con, còn chồng chéo và lỗ hổng.",
      7: "Phân rã được tới chủ sở hữu và mốc kiểm tra.",
      9: "Các mục tiêu con không phá hủy lẫn nhau.",
      10: "Phân rã thành hệ thống ưu tiên có thể điều phối hàng tuần.",
    },
  },
];

const U: CriterionSeed[] = [
  {
    code: "U1",
    nameVi: "Chủ sở hữu rõ",
    weight: 15,
    critical: true,
    anchors: {
      1: "Không ai chịu trách nhiệm cho cam kết then chốt.",
      3: "Chủ sở hữu trên giấy, quyền thực tế ở chỗ khác.",
      5: "Có chủ sở hữu cho một phần, các việc lớn vẫn 'của tập thể'.",
      7: "Mỗi cam kết then chốt có một chủ sở hữu gọi được tên.",
      9: "Chủ sở hữu có đủ quyền để dừng/đổi việc liên quan.",
      10: "Chủ sở hữu chịu trách nhiệm công khai và không thể ủy thác danh nghĩa.",
    },
  },
  {
    code: "U2",
    nameVi: "Nguồn lực được khóa",
    weight: 20,
    critical: true,
    anchors: {
      1: "Cam kết không có ngân sách, người hoặc thời gian.",
      3: "Nguồn lực 'sẽ bố trí sau'.",
      5: "Có phân bổ sơ bộ, dễ bị lấy lại khi việc khác nóng.",
      7: "Người–tiền–thời gian then chốt được giữ cho cam kết.",
      9: "Có cơ chế bảo vệ nguồn lực khỏi bị rút giữa chừng.",
      10: "Nguồn lực khóa đủ để cam kết không còn là ý định.",
    },
  },
  {
    code: "U3",
    nameVi: "Nhất quán trong lựa chọn",
    weight: 15,
    anchors: {
      1: "Quyết định tuần này phủ nhận tuần trước.",
      3: "Cam kết đổi theo cuộc họp gần nhất.",
      5: "Nhất quán ở tuyên bố, chưa nhất quán ở việc nói không.",
      7: "Các lựa chọn lớn không tự triệt tiêu.",
      9: "Có nhật ký quyết định cho thấy nhất quán có chủ đích.",
      10: "Nhất quán cả khi chi phí cơ hội hiện rõ.",
    },
  },
  {
    code: "U4",
    nameVi: "Nhịp thực thi",
    weight: 15,
    anchors: {
      1: "Không có nhịp xem xét cam kết.",
      3: "Họp nhiều nhưng không khóa việc.",
      5: "Có nhịp, còn mang tính báo cáo.",
      7: "Nhịp quản trị buộc được quyết định tiếp theo.",
      9: "Nhịp đủ dày để phát hiện lệch sớm.",
      10: "Nhịp thực thi là thói quen tổ chức, không phụ thuộc một người.",
    },
  },
  {
    code: "U5",
    nameVi: "Trách nhiệm giải trình",
    weight: 15,
    anchors: {
      1: "Không có hậu quả khi cam kết trượt.",
      3: "Giải trình mang tính biện hộ.",
      5: "Có báo cáo, chưa có đối chất.",
      7: "Chủ sở hữu phải giải thích lệch và phương án sửa.",
      9: "Giải trình có bằng chứng và người phản biện.",
      10: "Giải trình dẫn tới điều chỉnh quyền và nguồn lực.",
    },
  },
  {
    code: "U6",
    nameVi: "Kiên định thích ứng",
    weight: 20,
    critical: true,
    anchors: {
      1: "Hoặc bỏ cuộc sớm, hoặc bám kế hoạch chết.",
      3: "Thích ứng = đổi hướng theo tin mới nhất.",
      5: "Có điều chỉnh nhưng không rõ nguyên tắc giữ/bỏ.",
      7: "Giữ hướng đích, đổi cách làm khi bằng chứng đòi hỏi.",
      9: "Có ngưỡng bằng chứng để đổi phương án mà không mất kỷ luật.",
      10: "Kiên định mục tiêu và linh hoạt phương tiện được thực hành có chủ đích.",
    },
  },
];

const A: CriterionSeed[] = [
  {
    code: "A1",
    nameVi: "Ý nghĩa phân biệt",
    weight: 15,
    anchors: {
      1: "Giá trị là từ ngữ có thể dán cho mọi công ty.",
      3: "Có bộ giá trị, không giúp phân biệt lựa chọn.",
      5: "Một vài giá trị có ý, phần còn lại trang trí.",
      7: "Giá trị chỉ ra việc 'chúng ta không làm'.",
      9: "Đối tác/ứng viên nhận ra sự khác biệt qua hành vi, không qua poster.",
      10: "Giá trị tạo ra bản sắc quyết định có thể quan sát.",
    },
  },
  {
    code: "A2",
    nameVi: "Hành vi quan sát",
    weight: 20,
    critical: true,
    anchors: {
      1: "Không nêu hành vi cụ thể.",
      3: "Hành vi chung chung ('tôn trọng', 'sáng tạo').",
      5: "Có ví dụ, chưa thành kỳ vọng thường nhật.",
      7: "Mỗi giá trị then chốt có hành vi quan sát được.",
      9: "Hành vi được dùng khi tuyển, đánh giá và khen/chê.",
      10: "Hành vi lặp lại ở nhiều tình huống, kể cả khi bất tiện.",
    },
  },
  {
    code: "A3",
    nameVi: "Quy tắc quyết định",
    weight: 20,
    critical: true,
    anchors: {
      1: "Giá trị không xuất hiện khi quyết định khó.",
      3: "Được nhắc sau khi quyết định đã xong.",
      5: "Có quy tắc mềm, dễ bị trừ trường hợp.",
      7: "Có quy tắc 'nếu–thì' cho xung đột thường gặp.",
      9: "Quy tắc được dùng thật trong họp quyết định.",
      10: "Quy tắc giá trị thắng lợi ích ngắn khi hai bên đối đầu.",
    },
  },
  {
    code: "A4",
    nameVi: "Lãnh đạo nêu chuẩn",
    weight: 15,
    anchors: {
      1: "Lãnh đạo làm ngược giá trị đã công bố.",
      3: "Nêu chuẩn trên sân khấu, nới chuẩn trong phòng kín.",
      5: "Một số lãnh đạo nêu chuẩn, không đồng bộ.",
      7: "Lãnh đạo then chốt bị quan sát là đang sống giá trị.",
      9: "Có tình huống lãnh đạo chịu thiệt để giữ chuẩn.",
      10: "Chuẩn được nêu và giữ xuyên tầng lãnh đạo.",
    },
  },
  {
    code: "A5",
    nameVi: "Cơ chế củng cố",
    weight: 15,
    anchors: {
      1: "Không có khen/chê gắn giá trị.",
      3: "Củng cố ngẫu nhiên, theo cảm tính.",
      5: "Có khen tượng trưng, hệ thống thưởng vẫn theo số ngắn hạn.",
      7: "Nhân sự và ghi nhận có tiêu chí hành vi.",
      9: "Cơ chế củng cố đủ mạnh để làm lệch hành vi cũ.",
      10: "Hệ thống củng cố và giá trị không mâu thuẫn.",
    },
  },
  {
    code: "A6",
    nameVi: "Giới hạn và xử lý lệch",
    weight: 15,
    critical: true,
    anchors: {
      1: "Không có giới hạn. Lệch không được xử lý.",
      3: "Giới hạn trên giấy, vi phạm được bỏ qua nếu có thành tích.",
      5: "Xử lý từng vụ, chưa có nguyên tắc.",
      7: "Có ngưỡng lệch và quy trình xử lý.",
      9: "Xử lý lệch không phụ thuộc quan hệ cá nhân.",
      10: "Giới hạn được thi hành cả với người có quyền lực cao.",
    },
  },
];

function explode(component: "M" | "T" | "U" | "A", rows: CriterionSeed[]): {
  criteria: StandardCriterion[];
  anchors: CriterionAnchor[];
} {
  const criteria: StandardCriterion[] = [];
  const anchors: CriterionAnchor[] = [];
  rows.forEach((row, index) => {
    const criterionId = `std-crit-${row.code.toLowerCase()}`;
    criteria.push({
      id: criterionId,
      standardVersionId: STANDARD_VERSION_ID,
      componentCode: component,
      code: row.code,
      nameVi: row.nameVi,
      weight: row.weight,
      critical: Boolean(row.critical),
      sortOrder: index + 1,
    });
    ([1, 3, 5, 7, 9, 10] as const).forEach((score) => {
      anchors.push({
        id: `${criterionId}-a${score}`,
        criterionId,
        score,
        descriptionVi: row.anchors[score],
      });
    });
  });
  return { criteria, anchors };
}

const m = explode("M", M);
const t = explode("T", T);
const u = explode("U", U);
const a = explode("A", A);

export const standardCriteria: StandardCriterion[] = [...m.criteria, ...t.criteria, ...u.criteria, ...a.criteria];
export const criterionAnchors: CriterionAnchor[] = [...m.anchors, ...t.anchors, ...u.anchors, ...a.anchors];

export const standardCfsConnections: StandardCfsConnection[] = [
  {
    id: "std-cfs-mt",
    standardVersionId: STANDARD_VERSION_ID,
    code: "MT",
    from: "M",
    to: "T",
    nameVi: "Sứ mệnh → Khát vọng",
    weight: 1,
    critical: true,
    weightAssumptionNote: CFS_WEIGHT_DISCLAIMER,
  },
  {
    id: "std-cfs-mu",
    standardVersionId: STANDARD_VERSION_ID,
    code: "MU",
    from: "M",
    to: "U",
    nameVi: "Sứ mệnh → Cam kết",
    weight: 1,
    critical: false,
    weightAssumptionNote: CFS_WEIGHT_DISCLAIMER,
  },
  {
    id: "std-cfs-ma",
    standardVersionId: STANDARD_VERSION_ID,
    code: "MA",
    from: "M",
    to: "A",
    nameVi: "Sứ mệnh → Giá trị",
    weight: 1,
    critical: true,
    weightAssumptionNote: CFS_WEIGHT_DISCLAIMER,
  },
  {
    id: "std-cfs-tu",
    standardVersionId: STANDARD_VERSION_ID,
    code: "TU",
    from: "T",
    to: "U",
    nameVi: "Khát vọng → Cam kết",
    weight: 1,
    critical: true,
    weightAssumptionNote: CFS_WEIGHT_DISCLAIMER,
  },
  {
    id: "std-cfs-ta",
    standardVersionId: STANDARD_VERSION_ID,
    code: "TA",
    from: "T",
    to: "A",
    nameVi: "Khát vọng → Giá trị",
    weight: 1,
    critical: false,
    weightAssumptionNote: CFS_WEIGHT_DISCLAIMER,
  },
  {
    id: "std-cfs-ua",
    standardVersionId: STANDARD_VERSION_ID,
    code: "UA",
    from: "U",
    to: "A",
    nameVi: "Cam kết → Giá trị",
    weight: 1,
    critical: true,
    weightAssumptionNote: CFS_WEIGHT_DISCLAIMER,
  },
];

export const standardThresholds: StandardThresholds = {
  id: "std-th-01",
  standardVersionId: STANDARD_VERSION_ID,
  calibrationScoreDelta: 1.5,
  criticalScoreCap2: 4,
  criticalScoreCap4: 6,
  evidenceCapD: 5,
  evidenceCapC: 7,
  cfsCriticalConnectionFloor: 4,
  cfsCriticalCap: 5.9,
  cfsFormulaNote:
    "CFS phiên bản 0.1: 0.70 × trung bình có trọng số + 0.30 × liên kết yếu nhất. Trọng số từng liên kết lấy từ CSDL chuẩn — seed MVP = 1.",
  activationFormulaNote:
    "Chuẩn hiện hành chưa ban hành công thức Activation tự động. Trường rubric Activation có thể cấu hình trong Standards Admin.",
  visualMappingNote:
    "SIZE=required level; COMPLETENESS=MDS thiết kế; GAP=CFS; FLOW=Force; WARNING=rủi ro; CLARITY=bằng chứng. Không mã hóa MDS bằng xanh/đỏ.",
};

export const MNEMONIC_NOTE = MNEMONIC_DISCLAIMER;
