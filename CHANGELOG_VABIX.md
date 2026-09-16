# CHANGELOG — VABIX.edu.vn reconciliation (2026-09-16)

Reconcile trên stack hiện có (Next.js 15 + Convex IAM + SQLite CMS/LMS). Không đổi framework, không reset database, không đụng MyBizCar 3D.

Nguồn nội dung: master prompt. Không tìm thấy `Fix website vabix.docx` hay `/docs/Fix website vabix.docx`.

---

## Pages đã sửa / thêm

| Route | Thay đổi |
|---|---|
| `/` (production `vabix.edu.vn`) | Homepage 12 section: hero, 3T, về VABIX, featured training, BMDO, transformation, Trustworking, methods, knowledge, founder (title từ CMS), insights, CTA |
| `/vabix` | Alias homepage (local `/` vẫn rewrite MyBizCar) |
| `/ve-vabix` | Mission, khát vọng 2031, cam kết, 5 giá trị, 3T, founder, hành trình |
| `/dao-tao` | Catalog 3 nhóm: doanh chủ/CEO, quản lý/NV, đào tạo theo yêu cầu |
| `/dao-tao/[slug]` | Template chương trình thống nhất, CMS overlay |
| `/dao-tao/bmdo` | Landing ưu tiên: problem, objectives, curriculum, APPLIER, MyBizCar, measurement, MDS–CFS–MST, 3W, completion, CTA |
| `/dao-tao/mbm` | Clarification: không phải thạc sĩ / văn bằng học vị |
| `/dao-tao/theo-yeu-cau-doanh-nghiep` | Đào tạo theo yêu cầu |
| `/dao-tao/lich` | Lớp / lịch đang mở |
| `/tu-van-chuyen-doi` | 12 nhóm dịch vụ + quy trình 5 bước + form đánh giá |
| `/tu-van-chuyen-doi/[slug]` | Chi tiết dịch vụ CMS |
| `/trustworking` | Quy trình, nguyên tắc, disclaimer sàng lọc, form kết nối |
| `/mo-hinh-phuong-phap` | The BizCar, APPLIER, MAIS, 3W, KAROT, KLASS, BABOSO, DGH |
| `/mo-hinh-phuong-phap/karot` | Thay KORA |
| `/tri-thuc` | Landing hệ sinh thái: sách, cẩm nang, học liệu, nhân lực, dịch vụ hỗ trợ |
| `/sach`, `/cam-nang` | Alias listing |
| `/goc-chia-se` | Hub bài viết / case / sự kiện |
| `/tim-kiem` | Search chương trình, bài viết, sách, mô hình (kèm content type) |
| `/lien-he` | Consent không pre-check; newsletter tách riêng |
| `/mang-luoi/chuyen-gia` | Đội ngũ |
| `error.tsx` / `not-found.tsx` | 500 boundary + 404 có nội dung |

Header: CTA **Cổng học viên** luôn hiện. Footer: 3T, tri thức, liên hệ, quyền riêng tư, điều khoản.

---

## Modules CMS đã thêm / hoàn thiện

Giữ module sẵn có; bổ sung vận hành nội dung:

- **Pages / Homepage sections** — seed `page/home` (headline, supporting, founderTitle) refresh khi `origin=file-seed` và `version=1`
- **Menus / Footer / SEO** — nav canonical; overlay catalog gọi seed trên request công khai
- **Programs** — content model: tagline, audienceGroup, curriculum, methodology, featured, registrationOpen, SEO
- **Frameworks / Models** — KAROT, APPLIER, MAIS, DGH; BABOSO = BA / BO / SO
- **Books / Handbooks** — CMS knowledge products; không invent 6 tựa Amazon
- **Leads** — 10+ inquiry types, UTM, consent, marketingConsent, status New→Archived
- **CmsEditor** — form/component, không bắt editor sửa JSON thường ngày
- **LMS / Tasks / IAM** — giữ Course→Class→Module→Lesson, attendance, assignments, certificates, permission groups

---

## LMS đã hoàn thiện (trong stack hiện có)

Không tách LMS thành site riêng.

- Hierarchy: Program → Course → Class/Cohort → Module → Lesson → Material / Assignment / Assessment
- Cổng học viên: `/hoc-tap` (khóa/lớp, lịch, tiến độ, tài liệu, bài tập, thông báo, chứng nhận)
- Giảng dạy: `/giang-day`
- Admin: `/admin/dao-tao/*` (khóa, lớp, lịch, điểm danh, bài tập, kiểm tra, chứng nhận, học viên)
- BMDO/MyBizCar work products không hardcode vào mọi course type
- Quyền backend: `assertCan` trên CMS/LMS/tasks/IAM, không chỉ ẩn menu

---

## Migrations

| File | Việc làm | An toàn |
|---|---|---|
| `src/platform/db/migrations/0002_karot_rename.sql` | Đổi slug `kora` → `karot` nếu chưa có karot; archive kora còn lại; REPLACE `KORA`/`kora` trong payload | Không DROP; không xóa user/course |

Seed `file-seed` version=1 được UPDATE (không ghi đè bản CMS đã chỉnh, version>1).

---

## Routes mới

- `/dao-tao`, `/dao-tao/[slug]`, `/dao-tao/lich`
- `/tu-van-chuyen-doi`, `/tu-van-chuyen-doi/[slug]`
- `/trustworking`
- `/goc-chia-se`
- `/sach`, `/cam-nang`
- `/tim-kiem`
- `/mo-hinh-phuong-phap/karot`, `/applier`, `/mais`, `/dgh`

---

## Redirects (301 / Next 308 permanent)

| Cũ | Mới |
|---|---|
| `/chuong-trinh` | `/dao-tao` |
| `/chuong-trinh/:slug` | `/dao-tao/:slug` |
| `/giai-phap/dao-tao-huan-luyen` | `/dao-tao` |
| `/giai-phap/tu-van-chuyen-doi` | `/tu-van-chuyen-doi` |
| `/giai-phap/trustworking` | `/trustworking` |
| `/mo-hinh-phuong-phap/kora` | `/mo-hinh-phuong-phap/karot` |
| `/dao-tao/dao-tao-theo-yeu-cau` | `/dao-tao/theo-yeu-cau-doanh-nghiep` |
| `/dao-tao/ung-dung-ai-nang-cao-hieu-suat` | `/dao-tao/ung-dung-ai-hieu-suat` |

Legacy ShopXanh / vabix.vn giữ trong `legacyRedirects`. Bài viết cũ `/tri-thuc/[slug]` giữ; `/goc-chia-se/:slug` → `/tri-thuc/:slug`.

---

## Content governance

- **KORA** → **KAROT** (catalog + migration + redirect). README/code không còn KORA trên public methodology.
- **BABOSO** = BA / BO / SO. Không chữ S = Service. Trang BABOSO không claim VNPT.
- **MBM** = Mastery of the BizCar Model, không phải thạc sĩ.
- **DGH** = khung định hướng Số – Xanh – Hạnh phúc (không gọi Transformation Architecture).
- **KLASS / KAROT**: không bịa acronym từng chữ.
- Giữ terminology **khả lực**.
- Gỡ copy nội bộ trên homepage (“CMS chọn khóa Featured”).
- Soften founder bio (không hard-claim “đồng hành VNPT/SIHUB” trên hồ sơ chuyên gia).
- Case study VNPT/SIHUB/SUSPRO **giữ** vì đã có trong CMS; quote không còn ghi chú biên tập công khai. Số liệu tham dự không hardcode.
- Không publish chat metadata / “Tin nhắn đã được thu hồi”.

---

## Role test cases

| Actor | Kỳ vọng | Cách enforce |
|---|---|---|
| **ADMIN** | Toàn bộ menu/module, users, departments, permission groups, settings, audit | `role === "admin"` → `can()` true |
| **MOD** | Vận hành website/LMS/leads/tasks (gán task cho bất kỳ user); **không** tạo/xóa user, phòng ban, nhóm quyền | `isAdminOnlyMenu` (`system.accounts`, `system.groups`, …) → false. Test: `mod cannot access identity menus` |
| **USER A / B** | Chỉ menu/action của Permission Group; view bắt buộc trước update | `effectiveGrants` + `assertCan` trên service |
| URL trái phép | Không đủ ẩn menu | Page: redirect `/tai-khoan?forbidden=1`. API: HTTP 403 |

Test tự động: `src/platform/permissions/evaluate.test.ts`.

---

## QA đã chạy

| Check | Kết quả |
|---|---|
| `npm test` | 24 pass (governance + permissions + LMS + sitemap) |
| `npm run typecheck` | Pass (trước catalog seed hook) |
| `npm run lint` | Pass (trước vòng QA cuối) |
| `npm run build` | Pass, 261 pages (trước vòng QA cuối) |
| HTTP local `:3088` | 200: `/vabix`, `/ve-vabix`, `/dao-tao`, `/dao-tao/bmdo`, `/dao-tao/mbm`, `/dao-tao/theo-yeu-cau-doanh-nghiep`, `/tu-van-chuyen-doi`, `/trustworking`, `/mo-hinh-phuong-phap`, `/karot`, `/baboso`, `/tri-thuc`, `/sach`, `/cam-nang`, `/goc-chia-se`, `/tim-kiem`, `/lien-he`, `/dang-nhap` |
| Redirect | `/mo-hinh-phuong-phap/kora` → `/karot` (308 permanent) |
| Consent | Checkbox `consent` và `marketingConsent` **không** `checked` |
| MBM HTML | Có “không phải chương trình thạc sĩ” |
| BABOSO HTML | Brand Awareness / Business Opportunity / Sales Order; không VNPT |
| Admin | `/admin` → 307 login |

Browser MCP không kết nối được `localhost`/`127.0.0.1`/`192.168.1.17` (chrome-error). Viewport 375–1440 chưa chụp được trong session này — cần duyệt tay trên `http://localhost:3088/vabix` (local) hoặc production `/`.

---

## Cấu hình thủ công còn lại

1. **Production host** — `vabix.edu.vn` phục vụ homepage VABIX tại `/`. Local/preview: `/` = MyBizCar, website tại `/vabix` (`shouldServeBizcarAtRoot`).
2. **Convex / AUTH_SECRET** — IAM login production; không reset user.
3. **LEAD_WEBHOOK_URL** — form lưu SQLite CMS; webhook email nếu muốn.
4. **CMS version>1** — bản ghi đã sửa tay không bị seed đè. Review KAROT/home nếu editor đã publish bản cũ.
5. **Case VNPT/SIHUB** — đối chiếu hồ sơ trước khi dùng làm claim truyền thông mạnh.
6. **6 sách Amazon** — CMS Books, chưa invent title.
7. **Chứng nhận LMS** — template/certificate assets nếu chưa upload.
8. **Word source** — nếu có `Fix website vabix.docx` sau này, reconcile tiếp theo CONTENT GOVERNANCE (không dump nguyên văn).

---

## Unresolved

- Trang HTML trái phép trả **redirect + message**, không HTTP 403 (API thì 403). Đổi status page cần `forbidden()` experimental — chưa bật.
- Partner logo VNPT trên mạng lưới: dữ liệu sẵn có, không phải claim BABOSO.
- Dev race `Invariant: Expected clientReferenceManifest` trên `/dao-tao/theo-yeu-cau-doanh-nghiep` (Next.js); request sau 200.
- Không có visual QA đa viewport trong browser MCP.
- Không deploy production trong nhiệm vụ này.
