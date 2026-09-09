# CONTENT_APPROVAL.md — Dữ liệu cần Founder xác nhận

Nguồn chuẩn định vị trong đợt này: nội dung Founder Nguyễn Chí Thành (sứ mệnh, khát vọng 2031, cam kết, 5 giá trị, 3T, 3W, danh mục chương trình và 12 dịch vụ tư vấn).

Website / hồ sơ hiện có được giữ làm nguồn tham khảo. **Các mục dưới đây không được tự công bố như sự thật đã kiểm chứng** cho đến khi Founder duyệt.

## 1. Số liệu định lượng (đã ẩn khỏi homepage public)

| Claim cũ | Trạng thái |
|---|---|
| 20+ năm nghiên cứu & triển khai | Chưa phân biệt Founder / đội ngũ / pháp nhân VABIX (thành lập 2025). **Đã ẩn.** |
| 100+ chương trình đào tạo | Chưa có nguồn đếm. **Đã ẩn.** |
| 1.000+ học viên | Chưa có nguồn đếm. **Đã ẩn.** |
| 100+ doanh nghiệp đồng hành | Chưa có phạm vi (tư vấn / đào tạo / sự kiện). **Đã ẩn.** |
| Hội thảo SIHUB “hơn 60 lãnh đạo” | Nằm trong case study. Cần xác nhận. |
| “Hàng trăm founder và quản lý” (case SIHUB) | Cần xác nhận hoặc diễn đạt lại. |
| “Hơn 15 năm đồng hành cùng VNPT” | Thành tích Founder / đội ngũ hay pháp nhân? Cần xác nhận. |

Homepage hiện dùng tín hiệu định tính: pháp nhân, MST, 3T, 12 khối BizCar.

## 2. Đối tác / logo / lời chứng thực

Tên VNPT, ASL Logistics, MB, SUSPRO, SIHUB, CSED được giữ vì đã có trên website / hồ sơ. **Không được hiểu là hợp đồng hiện tại, khách hàng độc quyền, hay được phép dùng logo không giới hạn.**

Testimonials (Anh Thuyền / T&M, Anh Tỵ / Lê Gia, Chị Vân / V.E.V) **không đưa lên homepage**. Cần xác nhận quyền công bố trước khi dùng làm bằng chứng.

## 3. Sự kiện và lịch

Các sự kiện trong CMS file (`src/content/events.ts`) được giữ nguyên, gồm:

- Khai giảng BMDO tại SIHUB — `2026-09-15` (status upcoming)
- Sự kiện kết nối doanh nghiệp — `2026-10-08` (status upcoming)

**Không tạo lịch khai giảng mới.** Cần xác nhận ngày, địa điểm, trạng thái đăng ký trước khi chạy truyền thông.

## 4. Pháp nhân và liên hệ (đang dùng, cần xác nhận đồng nhất)

Nguồn: `src/lib/siteConfig.ts`

- Công ty Cổ phần VABIX · MST 0318798694
- Địa chỉ: Tầng 2, Toà nhà Thanh Long, 456 Xô Viết Nghệ Tĩnh, Phường Thạnh Mỹ Tây, TP. Hồ Chí Minh
- Hotline 0919 171 976 · Văn phòng 028 3716 1616 · Tư vấn 0889 659 966
- Email info@vabix.vn · support@vabix.vn
- Founder: Nguyễn Chí Thành — Nhà sáng lập · Chủ tịch HĐQT kiêm Tổng Giám đốc
- Website canonical hiện tại: `https://vabix.vn` (edu: `https://vabix.edu.vn`)

Các tài liệu lịch sử có thông tin liên hệ lệch — không hardcode nơi khác.

## 5. Chuyên gia

Hồ sơ trong `src/content/experts.ts` được giữ (ảnh, tên, chức danh hiện có). Cần rà từng học vị / chức danh (TS., ThS., NCS., Chủ tịch Hội Chất lượng TP.HCM, v.v.) trước khi dùng trong brochure.

## 6. Sản phẩm tri thức

- Sách B2A và BizCar: giữ trang mô tả, **không mở giá / ISBN / file tải**.
- Bộ biểu mẫu quản trị và học liệu số: trang “chưa mở truy cập công khai”.
- Không bật thanh toán.

## 7. Di sản nội dung cũ

| Nội dung cũ | Cách xử lý |
|---|---|
| Hai trụ cột Kết nối tri thức / Kết nối kinh doanh | Giữ như triết lý; 3T là cấu trúc dịch vụ. |
| Sáu chữ vàng | Chuyển mục “Di sản văn hóa” trên /ve-vabix. Cần xác nhận còn dùng chính thức không. |
| AI-First như trụ cột | Không nâng thành trụ cột thứ tư. AI nằm trong đào tạo, tư vấn và nhân lực số. |
| Chương trình AI-First Enterprise / BizCar Lab (network.programs) | Không đưa vào catalog 17 khóa; chờ đối chiếu tên chính thức. |
| Cư dân kết nối, chứng nhận nhà cung cấp, thành viên trả phí | Giữ route cổng cư dân; không tự tạo cơ chế phí / escrow / chứng nhận mới. |

## 8. MyBizCar 3D

Logic đánh giá, chỉ số, dữ liệu demo và quyền truy cập **không đổi trong đợt này**. Trang `/mo-hinh-phuong-phap/mybizcar` chỉ trình bày vai trò công cụ. Engine 3D nếu nằm nhánh khác cần merge riêng.

## 9. Form / webhook

`POST /api/leads` chỉ thành công khi `LEAD_WEBHOOK_URL` đã cấu hình. UI không giả success. Cần gán kênh tiếp nhận thật (email / CRM / sheet) trước go-live.

## 10. CMS

Hiện tại: **file-based CMS** (`src/content/*`) — phù hợp stack Next.js hiện có, không tạo hệ thống quản trị thứ hai.

Mô hình đã tách: brand, pillars, programs, consulting, trustworking, threeW, knowledge products, experts, events, articles, case studies, leads.

Khi triển khai CMS headless (Sanity / Payload / Directus), map 1-1 các type trong `src/content/types.ts`. Cần: draft/publish, featured, SEO, ảnh + alt, phân quyền, tiếng Việt.
