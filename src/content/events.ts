import type { EventItem } from "./types";

export const events: EventItem[] = [
  {
    id: "ev-bmdo-sihub",
    slug: "khai-giang-bmdo-sihub",
    title: "Khai giảng BMDO tại SIHUB: Xưởng thiết kế vận hành cho doanh nghiệp Việt",
    category: "Chương trình",
    excerpt:
      "Mở xưởng thiết kế vận hành BMDO cùng SIHUB, giúp lãnh đạo SME và startup phác thảo hệ thống vận hành thực chiến.",
    content:
      "Chương trình BMDO tại SIHUB được thiết kế như một xưởng làm việc: học viên nhìn doanh nghiệp qua khung BizCar, nhận diện điểm nghẽn và thiết kế lại năng lực vận hành. Đây không phải lớp lý thuyết mà là không gian facilitation — câu hỏi, tình huống, công cụ, giải pháp cho chính doanh nghiệp.",
    image: "/images/covers/sihub.jpg",
    startDate: "2026-09-15",
    location: "SIHUB, TP. Hồ Chí Minh",
    registrationUrl: "/ket-noi#chuong-trinh",
    status: "upcoming",
    featured: true,
  },
  {
    id: "ev-ket-noi",
    slug: "su-kien-ket-noi-doanh-nghiep",
    title: "Sự kiện kết nối doanh nghiệp VABIX",
    category: "Kết nối",
    excerpt:
      "Gặp gỡ chuyên gia, đối tác và doanh nghiệp trong mạng lưới VABIX để tạo cơ hội hợp tác có chiều sâu.",
    content:
      "Sự kiện kết nối được tổ chức thường xuyên nhằm mang lại giá trị cho khách hàng, đối tác và cư dân trong Làng. Nội dung gồm giới thiệu năng lực, trao đổi hợp tác và kết nối cung – cầu theo ngành.",
    image: "/images/covers/office.jpg",
    startDate: "2026-10-08",
    location: "Toà nhà Thanh Long, TP. Hồ Chí Minh",
    registrationUrl: "/ket-noi#su-kien",
    status: "upcoming",
    featured: true,
  },
  {
    id: "ev-workshop-ceo",
    slug: "workshop-chua-lanh-nang-luong-ceo-bmdo-01",
    title: "Workshop chữa lành và năng lượng dành cho CEO – Khóa BMDO 01",
    category: "Workshop",
    excerpt: "Không gian dành cho CEO khóa BMDO 01, kết hợp năng lượng lãnh đạo và hành trình thiết kế vận hành.",
    content:
      "Workshop được tổ chức trong khuôn khổ khóa BMDO 01, dành cho nhóm CEO đồng hành cùng VABIX. Chương trình kết hợp không gian chia sẻ với định hướng năng lực lãnh đạo bền vững.",
    image: "/images/covers/experts.jpg",
    startDate: "2025-06-12",
    location: "TP. Hồ Chí Minh",
    status: "completed",
    featured: false,
  },
  {
    id: "ev-launch",
    slug: "le-ra-mat-nen-tang-vabix",
    title: "Lễ ra mắt nền tảng VABIX",
    category: "Sự kiện",
    excerpt: "Ra mắt nền tảng Làng kết nối VABIX — không gian số cho cư dân, nhà cung cấp và khách hàng.",
    content:
      "Lễ ra mắt đánh dấu việc vận hành nền tảng kết nối phục vụ bốn nhân tố: khách hàng, nhà cung cấp, cư dân kết nối và đội ngũ VABIX.",
    image: "/images/covers/office.jpg",
    startDate: "2025-01-22",
    location: "TP. Hồ Chí Minh",
    status: "completed",
    featured: false,
  },
  {
    id: "ev-resident",
    slug: "dao-tao-cu-dan-ket-noi",
    title: "Đào tạo cư dân kết nối",
    category: "Đào tạo",
    excerpt: "Chương trình bắt buộc giúp cư dân hoàn thiện tháp năng lực KLASS trước khi kết nối chuyên nghiệp.",
    content:
      "Đào tạo cư dân kết nối gồm các chuyên đề văn hóa Làng, kỹ năng giao tiếp, chăm sóc khách hàng, B2A, KLASS và công cụ AI — điều kiện để trở thành Cư dân Kết nối Chuyên nghiệp.",
    image: "/images/covers/sihub.jpg",
    startDate: "2025-03-20",
    location: "Trực tuyến & TP. Hồ Chí Minh",
    status: "completed",
    featured: false,
  },
  {
    id: "ev-apartment",
    slug: "ket-noi-khach-hang-chung-cu",
    title: "Kết nối với khách hàng chung cư",
    category: "Kết nối",
    excerpt: "Chương trình kết nối cung – cầu dành cho cộng đồng cư dân và doanh nghiệp phục vụ đời sống đô thị.",
    content:
      "Sự kiện kết nối doanh nghiệp với khách hàng tại các khu chung cư, thuộc hoạt động Trustworking của VABIX.",
    image: "/images/covers/vnpt.jpg",
    startDate: "2025-04-18",
    location: "TP. Hồ Chí Minh",
    status: "completed",
    featured: false,
  },
];

export function getEvent(slug: string) {
  return events.find((e) => e.slug === slug);
}

export function upcomingEvents() {
  const rank = { upcoming: 0, ongoing: 1, completed: 2 };
  return [...events].sort((a, b) => {
    if (rank[a.status] !== rank[b.status]) return rank[a.status] - rank[b.status];
    return a.startDate.localeCompare(b.startDate);
  });
}
