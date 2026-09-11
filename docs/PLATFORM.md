# VABIX Platform — bàn giao

Nền tảng quản trị + LMS được thêm vào website Next.js hiện có. MyBizCar 3D giữ nguyên store JSON, session `vabix_bizcar_session` và role SUPER_ADMIN/… riêng.

## Xung đột kiến trúc đã xử lý

- Role MyBizCar (6 vai) **không** trộn với role nền tảng (Admin / Mod / User). Hai hệ thống đăng nhập tách cookie.
- `/admin` trên `vabix.edu.vn` và localhost là quản trị VABIX. `/admin` chỉ rewrite sang MyBizCar trên host `bizcar.vabix.edu.vn`. MyBizCar admin vẫn ở `/bizcar/admin`.
- Form kết nối ghi vào bảng `inquiries` (thành công khi lưu DB). Webhook `LEAD_WEBHOOK_URL` là kênh phụ, không còn chặn tiếp nhận.

## Route đã hoàn thành

| Route | Module |
|---|---|
| `/dang-nhap` `/quen-mat-khau` `/dat-lai-mat-khau` `/thiet-lap` | Auth |
| `/admin` | Dashboard vận hành |
| `/admin/website/*` | CMS |
| `/admin/dao-tao/*` | LMS quản trị |
| `/admin/ket-noi/*` | Đăng ký / tư vấn |
| `/admin/cong-viec*` | Task |
| `/admin/he-thong/*` | Tài khoản, phòng ban, nhóm quyền, cài đặt, nhật ký |
| `/hoc-tap` `/giang-day` `/lam-viec` `/tai-khoan` | Cổng User |
| `/chung-nhan/xac-minh/[token]` | Xác minh công khai |
| `/api/public/cms` `/api/platform/files/[id]` `/api/platform/jobs/notifications` `/api/platform/reports/learning` | API |

Cổng học viên thêm `/hoc-tap/lop/[classId]/kiem-tra/[quizId]`. Giảng viên: `/giang-day/diem-danh`, `/giang-day/cham-bai`.

MyBizCar `/bizcar/*` không đổi.

## Website → CMS

Nội dung file `src/content/*` được seed vào `cms_documents` (origin `file-seed`). Trang công khai đọc overlay (chương trình, mô hình, chuyên gia, bài viết, case study, sự kiện, sản phẩm tri thức, giải pháp, hero trang chủ, sứ mệnh Về VABIX): có bản CMS thì theo trạng thái CMS; chưa có thì dùng file. Ghi chú nội bộ không trả qua API public (`pickAllowlisted`).

## Dữ liệu chính

`users` (role admin/mod/user) → `permission_groups` / grants → `departments`  
`cms_documents` + versions  
`lms_courses` → `lms_course_versions` → modules/lessons  
`lms_classes` → staff / enrollments / schedules / attendance  
`learner_profiles` (khác tài khoản)  
assignments / submissions / grades / eval_3w  
questions / quizzes / attempts  
certificates (snapshot template)  
tasks / inquiries / notifications / files / audit_logs

CSDL: SQLite `data/vabix-platform.sqlite`. Migration `src/platform/db/migrations/0001_init.sql`, backup tự động vào `data/backups/` trước khi apply migration mới.

## Ma trận quyền

- **Admin**: mọi chức năng ứng dụng; vẫn bị validation, nhật ký, bảo vệ Admin cuối, không đọc mật khẩu/secret.
- **Mod**: vận hành CMS/LMS/task/kết nối; **không** tài khoản, phòng ban, nhóm quyền, lời mời, secret.
- **User**: hợp các grant từ nhóm đang hoạt động. Không có nhóm → chỉ `/tai-khoan`. `view:all` + `update:self` **không** thành `update:all`.

Nhóm mẫu (không tự gán tài khoản thật): Biên tập nội dung, Điều phối đào tạo, Giảng viên, Học viên, Tư vấn/tuyển sinh, Nhân sự nội bộ.

## Admin thiết lập

1. Đặt `AUTH_SECRET`. Tuỳ chọn `PLATFORM_BOOTSTRAP_EMAIL` + `PLATFORM_BOOTSTRAP_PASSWORD`, hoặc mở `/thiet-lap` khi chưa có Admin.
2. Tạo phòng ban (có thể trống cho học viên ngoài).
3. Rà nhóm mẫu, chỉnh grant.
4. Mời User, gán nhóm. Không hardcode mật khẩu chung.
5. Nếu email chưa cấu hình (`EMAIL_WEBHOOK_URL`), lời mời báo chưa gửi được — không giả thành công.

## Mở lớp

Tạo khóa → soạn giáo trình trên **bản nháp** → xuất bản phiên bản → tạo lớp gắn version → phân công → tạo hồ sơ học viên (Mod không tạo tài khoản) → ghi danh → đổi trạng thái `active` sau khi Admin liên kết tài khoản. Đăng ký form công khai **không** tự mở học liệu.

## Học viên / giảng viên

- Học viên: `/hoc-tap` — tiếp tục học, lớp ghi danh, xác nhận bài đọc, nộp bài (giữ version), làm kiểm tra (lượt resume, không lộ đáp án trước hạn), xem điểm đã công bố.
- Giảng viên: `/giang-day` — lớp được phân công, điểm danh, 3W, chấm bài (điểm nháp tách công bố).

## Biến môi trường

Xem `.env.example`. Storage: `data/uploads/`. Job thông báo: `POST /api/platform/jobs/notifications` với `Authorization: Bearer $PLATFORM_JOB_SECRET`. Export báo cáo: `GET /api/platform/reports/learning` (cần quyền `lms.reports` / export).

## Kiểm thử

`npm test` — 12 test: integrity site + permission union + completion rules.  
`npm run typecheck`, `npm run lint`, `npm run build` đều thành công trên nhánh phát triển.

Smoke HTTP (production `next start`): `/` `/chuong-trinh/bmdo` `/mo-hinh-phuong-phap/bizcar` `/bizcar` `/bizcar/engine` `/dang-nhap` = 200; `/admin` và `/hoc-tap` = 307 về `/dang-nhap`; API CMS công khai không trả ghi chú nội bộ; `POST /api/leads` thiếu họ tên trả VALIDATION (không báo thành công giả).

## Giới hạn còn lại

- Chữ ký/con dấu chứng nhận: luồng duyệt có, **chưa phát hành** đến khi đơn vị tải asset và bật `certificate_ready`.
- Email chỉ gửi khi có `EMAIL_WEBHOOK_URL`; SMTP_URL được ghi nhận nhưng chưa gắn transporter.
- Trình soạn CMS dùng form trường + JSON payload đã seed (không phải block builder kéo thả đầy đủ).
- Video không có tiến độ provider tin cậy → xác nhận thủ công.
- Không có thanh toán, họp video riêng, AI chấm điểm, webcam chống gian lận.
- Import tài khoản hàng loạt cho Admin chưa có UI CSV (Mod vẫn bị chặn tạo tài khoản). Import hồ sơ học viên CSV trên lớp đã có preview, không tạo tài khoản.
- Thảo luận lớp và Kanban task dùng cùng dữ liệu danh sách; Kanban kéo-thả chưa tách UI riêng.
