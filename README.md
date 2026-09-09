# VABIX — Làng kết nối tri thức & kinh doanh

Website doanh nghiệp mới của VABIX, xây trên **Next.js App Router**, TypeScript và hệ thống thiết kế teal + gold.

## Chạy local

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) — trên local `/` là **MyBizCar**. Website VABIX xem tại [http://localhost:3000/vabix](http://localhost:3000/vabix).

## Lệnh kiểm tra

```bash
npm run lint
npm run typecheck
npm run build
```

## Cấu trúc nội dung

- Liên hệ, mạng xã hội, cổng cư dân: `src/lib/siteConfig.ts`
- Chuyên gia, bài viết, case study, sự kiện, giải pháp, mô hình: `src/content/`
- Form lead gọi `POST /api/leads`. Khi chưa có backend, set `LEAD_WEBHOOK_URL` hoặc form sẽ trả lỗi trung thực (không giả success).

## Ghi chú audit

Thư mục gốc ban đầu **không có codebase website** — chỉ có hồ sơ năng lực 2026, logo và slide. Site cũ tại https://vabix.vn/ chạy nền tảng ShopXanh (marketplace). Dự án này tái cấu trúc thông tin, giữ chức năng cư dân / làng ngành / nhà cung cấp / cẩm nang / sách / bộ sưu tập qua IA mới và redirect URL cũ.

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

Tài khoản DEMO (email / vai trò — mật khẩu không lưu trong mã nguồn):

- `ceo@demo.vabix.edu.vn` — COMPANY_ADMIN
- `coach@vabix.edu.vn` — COACH_EVALUATOR
- `admin@vabix.edu.vn` — SUPER_ADMIN
- `academic@vabix.edu.vn` — ACADEMIC_ADMIN
- `member@demo.vabix.edu.vn` — COMPANY_MEMBER
- `viewer@demo.vabix.edu.vn` — VIEWER

Khi chưa có `DATABASE_URL`, ứng dụng dùng kho JSON cục bộ `data/bizcar-store.json`. File đã có thì được tải nguyên trạng. Lần seed đầu tiên (chưa có file) bắt buộc `BIZCAR_DEMO_SEED_PASSWORD` — xem `.env.example`; thiếu biến này thì seed thất bại, không tạo mật khẩu mặc định.

### Biến môi trường

Xem `.env.example`. Bắt buộc trên production: `AUTH_SECRET`.

### Gắn domain bizcar.vabix.edu.vn

1. Trỏ DNS về cùng deployment Next.js.
2. Đặt `BIZCAR_HOST=bizcar.vabix.edu.vn`.
3. Middleware rewrite `/` → `/bizcar` và `/engine` → `/bizcar/engine`.
4. Bật HTTPS và đặt `AUTH_SECRET` đủ dài.
5. Khi có Supabase/PostgreSQL: chạy `prisma/migrations/0001_init_rls.sql` rồi đặt `DATABASE_URL` (adapter Prisma sẽ được nối vào `src/db` — hiện MVP dùng file store + schema sẵn).

Chu kỳ Nạp–Nén–Nổ–Neo là cấu trúc ghi nhớ BMDO, không phải mô tả quan hệ nhân quả cơ học.
Phiên bản phát triển phục vụ hiệu chỉnh và kiểm chứng thực địa.
