import { Container } from "@/components/ui/Section";
import { homeReviewsEn } from "@/i18n/homeEn";
import type { Locale } from "@/i18n/locale";

const reviewsVi = {
  eyebrow: "Lời từ lớp học",
  title: "Tiếng nói từ doanh nghiệp đã đồng hành cùng VABIX",
  lead: "Vài lời từ những doanh chủ đã ngồi học và ở lại cùng Làng VABIX.",
  items: [
    {
      id: "hue-helen",
      initials: "HH",
      name: "Huê Helen",
      role: "Doanh nhân · Làng VABIX",
      quote:
        "Ban đầu nghe Thầy Thành chia sẻ về BizCar, tôi rất tò mò — nhưng năm mươi buổi nghe thì dài. Chỉ sau sáu buổi, mọi thứ vỡ oà. Mỗi buổi là một cú chạm sâu: nhìn lại chính mình, soi lại doanh nghiệp, và thấy rõ điều mình thật sự đang tìm. BizCar không chỉ dạy kiến thức. Nó giúp hiểu, thay đổi, và lớn lên.",
    },
    {
      id: "ivydo-do-nhi",
      initials: "IN",
      name: "Ivydo Do Nhi",
      role: "Doanh nghiệp · khóa MYBIZCAR",
      quote:
        "Sáu buổi ngắn với Thầy Nguyễn Chí Thành và thầy cô Làng VABIX đã khiến tôi nhìn lại những vấp của lần khởi nghiệp trước, và tìm lại la bàn cho chính mình. Mỗi buổi là bài học thực tế, chạm đúng nỗi đau người làm chủ nào cũng từng trải. Năng lượng của thầy cô và các anh chị CEO lan ấm cả lớp — đủ để muốn tái khởi nghiệp vững hơn.",
    },
    {
      id: "binh-valenta",
      initials: "BV",
      name: "Bình Valenta",
      role: "Doanh nghiệp Valenta",
      quote:
        "Ngày đầu vào lớp, mình bất ngờ khi Valenta được đưa vào giáo trình như một case study sống. Gần bốn tháng học — tuần đầu mình từng muốn cử trợ lý đi thay, vì bận và sợ không theo nổi. Các bạn ấy nói kiến thức này người lãnh đạo phải trực tiếp mang về. Muốn đội ngũ học, mình phải làm gương trước. Quay lại lớp, giá trị vượt cả điều đã mong.",
    },
    {
      id: "binh-valenta-phan-van-truong",
      initials: "BV",
      name: "Bình Valenta",
      role: "Cùng buổi với GS Phan Văn Trường",
      quote:
        "Đi học VABIX, mình được nghe Giáo sư Phan Văn Trường chia sẻ từ trái tim. Ông là chuyên gia đàm phán quốc tế, cố vấn thương mại cho Chính phủ Pháp, được trao Bắc Đẩu Bội Tinh — và ở tuổi bảy mươi chín vẫn muốn cống hiến cho đất nước. Buổi học ấy để lại không chỉ kiến thức quản trị, mà tấm gương của một công dân yêu nước.",
    },
  ],
};

export function HomeReviews({ locale = "vi" }: { locale?: Locale }) {
  const copy = locale === "en" ? homeReviewsEn : reviewsVi;

  return (
    <section className="vabix-reviews" id="khach-hang" aria-labelledby="khach-hang-title">
      <Container>
        <header className="vabix-reviews-head">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h2 id="khach-hang-title">{copy.title}</h2>
          <p className="vabix-reviews-lead">{copy.lead}</p>
        </header>
        <div className="vabix-reviews-grid">
          {copy.items.map((item) => (
            <figure key={item.id} className="vabix-review">
              <span className="vabix-review-mark" aria-hidden="true">
                “
              </span>
              <blockquote>
                <p>{item.quote}</p>
              </blockquote>
              <figcaption className="vabix-review-by">
                <span className="vabix-review-initials" aria-hidden="true">
                  {item.initials}
                </span>
                <span className="vabix-review-who">
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
