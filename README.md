# VABIX — Hệ sinh thái tri thức thực chiến

Website doanh nghiệp trên **Next.js App Router**, TypeScript, brand teal + gold.

## Chạy local

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) — trên local `/` là **MyBizCar**. Website VABIX xem tại [http://localhost:3000/vabix](http://localhost:3000/vabix).

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

---

## MyBizCar 3D — Động cơ doanh nghiệp MTUA

Ứng dụng đo lường và hình dung quản trị, domain mục tiêu: https://bizcar.vabix.edu.vn

### Chạy local

```bash
npm install
npm run dev
```

Trên local và preview, `/` mở MyBizCar (không mở website VABIX). Production `vabix.edu.vn` vẫn giữ `/` là trang doanh nghiệp.

- Giới thiệu MyBizCar: http://localhost:3000 hoặc http://localhost:3000/bizcar
- Động cơ 3D: http://localhost:3000/bizcar/engine
- Đăng nhập: http://localhost:3000/bizcar/login
- Dashboard: http://localhost:3000/bizcar/dashboard
- Website VABIX (local): http://localhost:3000/vabix

Trên domain `bizcar.vabix.edu.vn` (khi có DNS), middleware map `/` → `/bizcar` và `/engine` → `/bizcar/engine`.

Tài khoản DEMO (mật khẩu chung `DemoVabix2026!`):

- `ceo@demo.vabix.edu.vn` — COMPANY_ADMIN
- `coach@demo.vabix.edu.vn` — COACH_EVALUATOR
- `academic@demo.vabix.edu.vn` — ACADEMIC_ADMIN
- `admin@demo.vabix.edu.vn` — SUPER_ADMIN
- `member@demo.vabix.edu.vn` — COMPANY_MEMBER
- `viewer@demo.vabix.edu.vn` — VIEWER

MyBizCar lưu trên Convex. Lần seed đầu (kho users trống) cần `NEXT_PUBLIC_CONVEX_URL` và `BIZCAR_DEMO_SEED_PASSWORD` — xem `.env.example`.

### Biến môi trường

Xem `.env.example`. Bắt buộc trên production: `AUTH_SECRET`.

### Gắn domain bizcar.vabix.edu.vn

1. Trỏ DNS về cùng deployment Next.js.
2. Đặt `BIZCAR_HOST=bizcar.vabix.edu.vn`.
3. Middleware rewrite `/` → `/bizcar` và `/engine` → `/bizcar/engine`.
4. Bật HTTPS và đặt `AUTH_SECRET` đủ dài.
5. Convex: `npm run dev` (hoặc `npx convex dev`) rồi đặt `NEXT_PUBLIC_CONVEX_URL`.

Chu kỳ Nạp–Nén–Nổ–Neo là cấu trúc ghi nhớ BMDO, không phải mô tả quan hệ nhân quả cơ học.
Phiên bản phát triển phục vụ hiệu chỉnh và kiểm chứng thực địa.
