# IMPLEMENTATION PLAN — VABIX.edu.vn reconciliation

Ngày: 2026-09-16  
Nguồn nội dung: master prompt (không tìm thấy `Fix website vabix.docx` trong repo hoặc workspace).  
Cách làm: reconcile trên stack hiện có — không dựng site mới, không đổi framework, không reset database.

## Audit tóm tắt

| Lớp | Hiện trạng | Quyết định |
|---|---|---|
| Framework | Next.js 15 App Router, React 19, TypeScript, Tailwind 4 | Giữ |
| Data | Convex (IAM/auth) + SQLite `data/vabix-platform.sqlite` (CMS/LMS/leads/tasks) | Giữ; migration an toàn |
| Public content | File `src/content/*` overlay CMS `cms_documents` | Giữ overlay; refresh seed `version=1` |
| Auth / role | Admin / Mod / User + Permission Groups, backend `assertCan` | Giữ; không đổi model |
| LMS | Course → version → module → lesson → class / enrollment / quiz / assignment / 3W / certificate | Giữ; không tách LMS thành site riêng |
| MyBizCar 3D | `/bizcar/*`, store riêng | Không đụng logic đánh giá |
| URL đang index | `/chuong-trinh`, `/giai-phap/*`, `/mo-hinh-phuong-phap/kora`, `/tri-thuc` | Canonical mới + 301 |

## IA canonical (public)

| Mới | Cũ (301) |
|---|---|
| `/dao-tao` | `/giai-phap/dao-tao-huan-luyen`, `/chuong-trinh` |
| `/dao-tao/[slug]` | `/chuong-trinh/[slug]` |
| `/tu-van-chuyen-doi` | `/giai-phap/tu-van-chuyen-doi` |
| `/trustworking` | `/giai-phap/trustworking` |
| `/mo-hinh-phuong-phap/karot` | `/mo-hinh-phuong-phap/kora` |
| `/goc-chia-se` | listing bài viết (trước đây `/tri-thuc`) |
| `/tri-thuc` | Hệ sinh thái tri thức (sách, cẩm nang, học liệu, nhân lực) |
| `/sach`, `/cam-nang` | alias `/tri-thuc/sach`, `/tri-thuc/cam-nang` |

`/tri-thuc/[slug]` bài viết giữ để SEO; `/goc-chia-se/[slug]` alias.  
`/giai-phap` giữ như trang 3T phụ, không còn trên nav chính.

## Nội dung cần reconcile

1. Brand/hero/mission/aspiration/commitment/core values — version mới, giữ terminology **khả lực**.
2. Homepage 12 section (positioning, không dump toàn bộ About).
3. Training chia 3 nhóm A/B/C; BMDO landing ưu tiên; MBM không phải thạc sĩ.
4. KAROT thay KORA; BABOSO = BA / BO / SO; thêm APPLIER, MAIS, DGH; KLASS không bịa acronym.
5. Gỡ claim BABOSO–VNPT và số liệu chưa kiểm chứng (15 năm, hơn 60 lãnh đạo, hàng trăm founder) khỏi copy công bố.
6. Trustworking disclaimer; Transformation 12 dịch vụ giữ.

## CMS / LMS / quyền

- CMS đã phủ pages, nav, programs, models, articles, events, leads, LMS, tasks, IAM.
- Bổ sung: form trường (không bắt editor sửa JSON thường ngày); seed refresh file-seed v1; inquiry types/status; UTM + consent newsletter tách riêng.
- LMS / Admin / Mod / User: giữ middleware hiện có; không hard-reset nhóm quyền.

## Rủi ro không làm

- Không xóa MyBizCar, mạng lưới cư dân, case study (chỉ diễn đạt lại claim).
- Không destructive DROP.
- Không invent 6 tựa sách Amazon, chữ cái KAROT/KLASS, hay số liệu mới.

## QA

Đã chạy 2026-09-16:

- `npm test` — 24 pass (KORA→KAROT, BABOSO BA/BO/SO, MBM không phải thạc sĩ, permissions Admin/Mod/User).
- `npm run typecheck` / `lint` / `build` — pass (261 pages).
- HTTP local port 3088 — các route canonical 200; `/mo-hinh-phuong-phap/kora` 308 → KAROT; consent không pre-check.
- Browser MCP không reach localhost — viewport 375/390/430/768/1024/1280/1440 cần duyệt tay tại `/vabix` (local) hoặc `/` (production).

Chi tiết: `CHANGELOG_VABIX.md`.
