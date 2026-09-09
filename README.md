# VABIX — Hệ sinh thái tri thức thực chiến

Website doanh nghiệp trên **Next.js App Router**, TypeScript, brand teal + gold.

## Chạy local

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Kiểm tra

```bash
npm run lint
npm run typecheck
npm run build
```

## Kiến trúc thông tin (3T)

- `/` Trang chủ
- `/ve-vabix` Sứ mệnh, khát vọng 2031, cam kết, 5 giá trị
- `/giai-phap` Tổng quan 3T
- `/giai-phap/dao-tao-huan-luyen` Training & Coaching
- `/giai-phap/tu-van-chuyen-doi` Transformation (+ 12 dịch vụ)
- `/giai-phap/trustworking` Trustworking
- `/chuong-trinh` Catalog đào tạo
- `/mo-hinh-phuong-phap` BizCar, 3W, B2A, BABOSO, KORA, KLASS, MyBizCar
- `/san-pham-tri-thuc` Sách, cẩm nang, biểu mẫu, học liệu
- `/nhan-luc-mo-nhan-luc-so` Nhân lực mở & nhân lực số

Nội dung: `src/content/`. Liên hệ: `src/lib/siteConfig.ts`. Form: `POST /api/leads` (cần `LEAD_WEBHOOK_URL`).

Xem `CONTENT_APPROVAL.md` cho dữ liệu chưa được Founder duyệt.
