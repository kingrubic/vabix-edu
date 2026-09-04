# VABIX — Làng kết nối tri thức & kinh doanh

Website doanh nghiệp của **Công ty Cổ phần VABIX**. VABIX đồng hành cùng doanh nhân và doanh nghiệp nâng cao năng lực quản trị, thiết kế hệ thống vận hành và mở rộng mạng lưới hợp tác thông qua tri thức thực chiến.

> **Kết tri thức. Nối giá trị.**

Site sản xuất: [vabix.vn](https://vabix.vn) · Cổng đào tạo: [vabix.edu.vn](https://vabix.edu.vn)

## Dự án này làm gì

Đây là website corporate mới, thay thế nền tảng ShopXanh cũ. Thông tin công ty được tái cấu trúc theo kiến trúc thông tin mới, đồng thời giữ các URL cũ qua redirect.

Hai trụ cột nội dung:

| Trụ cột | Trang chính | Gồm |
| --- | --- | --- |
| Kết nối tri thức | `/giai-phap` | Tư vấn chiến lược, đào tạo doanh nhân, huấn luyện doanh nghiệp, thiết kế & vận hành |
| Kết nối kinh doanh | `/giai-phap` | Kết nối doanh nghiệp, xúc tiến thương mại |

Các mô hình độc quyền được trình bày tại `/mo-hinh-phuong-phap`: **BizCar**, **BMDO**, **B2A**, **BABOSO**, **KORA**, **KLASS**.

## Công nghệ

- [Next.js 15](https://nextjs.org/) App Router
- React 19, TypeScript
- Tailwind CSS 4
- Font [Be Vietnam Pro](https://fonts.google.com/specimen/Be+Vietnam+Pro)

Nội dung (chuyên gia, bài viết, case study, sự kiện, giải pháp, mô hình) nằm trong `src/content/` — không dùng CMS. Liên hệ, mạng xã hội và cổng cư dân tập trung tại `src/lib/siteConfig.ts`.

## Chạy local

Yêu cầu: Node.js 20+.

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

### Lệnh khác

| Lệnh | Mục đích |
| --- | --- |
| `npm run lint` | ESLint |
| `npm run typecheck` | Kiểm tra TypeScript |
| `npm run build` | Build production |
| `npm start` | Chạy bản đã build |

## Cấu trúc thư mục

```
src/
  app/            # App Router: trang, sitemap, robots, API
  components/     # Layout, form, card, UI
  content/        # Dữ liệu nội dung (TypeScript)
  lib/            # Cấu hình site, SEO, lead
public/           # Logo, ảnh tĩnh
```

Các nhóm trang chính:

- `/ve-vabix` — giới thiệu, tầm nhìn, sứ mệnh, hành trình
- `/giai-phap` — sáu giải pháp theo hai trụ cột
- `/mo-hinh-phuong-phap` — BizCar và các khung phương pháp
- `/mang-luoi` — chuyên gia, đối tác, làng ngành, nhà cung cấp
- `/tri-thuc` — bài viết, case study, cẩm nang, sách
- `/su-kien`, `/ket-noi`, `/lien-he`, `/cong-cu-dan`

Redirect URL ShopXanh cũ nằm trong `src/content/redirects.ts`.

## Form tư vấn

Form lead gọi `POST /api/leads`. Khi có webhook, set biến môi trường:

```bash
LEAD_WEBHOOK_URL=https://...
```

Nếu chưa cấu hình, API trả lỗi trung thực (`NOT_CONFIGURED`) — giao diện không giả thành công. Form có honeypot và kiểm tra thời gian gửi để lọc spam.

## Tài liệu nguồn

Thư mục gốc còn hồ sơ năng lực 2026, logo và slide giảng viên. Site cũ chạy ShopXanh (marketplace). Dự án này giữ chức năng cư dân / làng ngành / nhà cung cấp / cẩm nang / sách / bộ sưu tập qua IA mới.

## Liên hệ

- Hotline: 0919 171 976
- Email: [info@vabix.vn](mailto:info@vabix.vn)
- Văn phòng: Tầng 2, Toà nhà Thanh Long, 456 Xô Viết Nghệ Tĩnh, Phường Thạnh Mỹ Tây, TP. Hồ Chí Minh
- Facebook: [VabixVietnam](https://www.facebook.com/VabixVietnam)
