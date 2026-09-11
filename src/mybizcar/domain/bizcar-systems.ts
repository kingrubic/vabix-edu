export const DEVELOPING_COPY =
  "Module đang phát triển. Kiến trúc MyBizCar đã xác định vị trí và chức năng, nhưng bộ tiêu chuẩn chi tiết chưa được số hóa." as const;

export type BizcarSystemId =
  | "engine"
  | "value-wheel"
  | "market-wheel"
  | "people-wheel"
  | "finance-wheel"
  | "oil"
  | "gearbox"
  | "chassis"
  | "shell"
  | "environment"
  | "fuel"
  | "cockpit";

export type BizcarSystemStatus = "active" | "developing";

export type BizcarSystem = {
  id: BizcarSystemId;
  n: string;
  name: string;
  nameEn: string;
  domain: string;
  function: string;
  hover: string;
  status: BizcarSystemStatus;
};

export const BIZCAR_SYSTEMS: readonly BizcarSystem[] = [
  {
    id: "engine",
    n: "01",
    name: "Động cơ doanh nghiệp",
    nameEn: "Business Engine — MTUA",
    domain: "Định hướng cốt lõi",
    function: "Sinh lực vận hành từ Mission, Aspiration, Commitment và Values.",
    hover: "01 — ĐỘNG CƠ DOANH NGHIỆP — MTUA",
    status: "active",
  },
  {
    id: "value-wheel",
    n: "02",
    name: "Bánh xe Giá trị",
    nameEn: "Value Wheel",
    domain: "Định hướng & thị trường",
    function: "Chuyển giá trị khách hàng thành chuyển động thực của doanh nghiệp.",
    hover: "02 — BÁNH XE GIÁ TRỊ",
    status: "developing",
  },
  {
    id: "market-wheel",
    n: "03",
    name: "Bánh xe Thị trường",
    nameEn: "Market Wheel",
    domain: "Định hướng & thị trường",
    function: "Bám mặt đường thị trường — phân khúc, địa bàn, nhịp cầu.",
    hover: "03 — BÁNH XE THỊ TRƯỜNG",
    status: "developing",
  },
  {
    id: "people-wheel",
    n: "04",
    name: "Bánh xe Con người",
    nameEn: "People Wheel",
    domain: "Nguồn lực & vận hành",
    function: "Năng lực đội ngũ và kỷ luật phối hợp trên cùng một trục.",
    hover: "04 — BÁNH XE CON NGƯỜI",
    status: "developing",
  },
  {
    id: "finance-wheel",
    n: "05",
    name: "Bánh xe Tài chính",
    nameEn: "Finance Wheel",
    domain: "Nguồn lực & vận hành",
    function: "Dòng vốn, kỷ luật chi và sức bám của mô hình kinh tế.",
    hover: "05 — BÁNH XE TÀI CHÍNH",
    status: "developing",
  },
  {
    id: "oil",
    n: "06",
    name: "Nhớt BizCar",
    nameEn: "BizCar Oil",
    domain: "Nguồn lực & vận hành",
    function: "Giảm ma sát hệ thống — văn hóa phối hợp và nhịp làm việc.",
    hover: "06 — NHỚT BIZCAR",
    status: "developing",
  },
  {
    id: "gearbox",
    n: "07",
    name: "Hộp số & truyền động",
    nameEn: "Gearbox & Transmission",
    domain: "Nguồn lực & vận hành",
    function: "Biến lực động cơ thành chuyển động phù hợp từng giai đoạn.",
    hover: "07 — HỘP SỐ & TRUYỀN ĐỘNG",
    status: "developing",
  },
  {
    id: "chassis",
    n: "08",
    name: "Khung gầm",
    nameEn: "Chassis System",
    domain: "Nguồn lực & vận hành",
    function: "Kết cấu chịu lực — quy trình, quyền hạn, nhịp quản trị.",
    hover: "08 — KHUNG GẦM",
    status: "developing",
  },
  {
    id: "shell",
    n: "09",
    name: "Vỏ thương hiệu",
    nameEn: "Brand Shell",
    domain: "Định hướng & thị trường",
    function: "Hình ảnh và lời hứa mà thị trường nhìn thấy từ bên ngoài.",
    hover: "09 — VỎ THƯƠNG HIỆU",
    status: "developing",
  },
  {
    id: "environment",
    n: "10",
    name: "Môi trường & mặt đường",
    nameEn: "Environment & Road",
    domain: "Lãnh đạo & bối cảnh",
    function: "Bối cảnh kinh doanh — điều kiện mặt đường mà xe phải bám.",
    hover: "10 — MÔI TRƯỜNG & MẶT ĐƯỜNG",
    status: "developing",
  },
  {
    id: "fuel",
    n: "11",
    name: "Nhiên liệu BizCar",
    nameEn: "BizCar Fuel",
    domain: "Nguồn lực & vận hành",
    function: "Năng lượng đầu vào — động lực, ngân sách ưu tiên, ý chí theo đuổi.",
    hover: "11 — NHIÊN LIỆU BIZCAR",
    status: "developing",
  },
  {
    id: "cockpit",
    n: "12",
    name: "Buồng lái lãnh đạo",
    nameEn: "Leadership Cockpit",
    domain: "Lãnh đạo & tổ chức",
    function: "Ghế lái — tầm nhìn, quyết định và kỷ luật điều khiển hệ thống.",
    hover: "12 — BUỒNG LÁI LÃNH ĐẠO",
    status: "developing",
  },
] as const;

export const BIZCAR_SYSTEM_BY_ID: Record<BizcarSystemId, BizcarSystem> = Object.fromEntries(
  BIZCAR_SYSTEMS.map((s) => [s.id, s]),
) as Record<BizcarSystemId, BizcarSystem>;
