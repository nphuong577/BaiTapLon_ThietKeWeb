# Kế hoạch hoàn thiện website FARMY

## Những phần đã hoàn thành trong bản front-end

1. Chuyển `index.html` thành landing page giới thiệu; mỗi danh mục chỉ tải tối đa hai món mẫu. Danh sách đầy đủ nằm tại `pages/products.html`.
2. Tách dữ liệu sản phẩm theo category và render giao diện bằng JavaScript.
3. Tìm kiếm không phân biệt dấu, lọc danh mục, slider tự chuyển và responsive.
4. Trang chi tiết món với size, độ cay, thức uống, số lượng và giá cập nhật theo lựa chọn.
5. Giỏ hàng localStorage: gộp lựa chọn trùng, tăng/giảm, xóa và tính tổng.
6. Đăng ký/đăng nhập demo bằng localStorage; validate Regex email, điện thoại và mật khẩu mạnh. Mật khẩu được lưu trực tiếp theo yêu cầu đơn giản hóa bản demo, không dùng cho production.
7. Trang đặt hàng: thông tin giao, hình thức thanh toán demo, mức đơn tối thiểu, phí giao và lưu lịch sử đơn.

## Giai đoạn tiếp theo đề xuất

### Ưu tiên 1 — hoàn thiện nội dung

- Bổ sung ít nhất 4-6 sản phẩm cho mỗi nhóm `drink`, `side`, `burger`.
- Chuẩn hóa tên món, thành phần, giá và ảnh theo hướng dẫn dữ liệu.
- Tạo trang khuyến mãi riêng từ JSON thay cho section ngắn ở trang chủ.
- Mở rộng phần giới thiệu: câu chuyện thương hiệu, tiêu chuẩn nguyên liệu, danh sách cửa hàng demo.

### Ưu tiên 2 — trải nghiệm đặt hàng

- Thêm món kèm (sốt, khoai, tráng miệng) và gợi ý mua kèm theo sản phẩm.
- Thêm mã giảm giá từ `data/promotions.json` và quy tắc thời gian/giá trị tối thiểu.
- Tạo trang lịch sử đơn cho tài khoản local, cho phép đặt lại đơn.
- Bổ sung trạng thái đơn mô phỏng: đã nhận → đang chuẩn bị → đang giao → hoàn thành.

### Ưu tiên 3 — nếu chuyển sang hệ thống thật

- Chuyển tài khoản, mật khẩu, giỏ và đơn hàng sang backend/database. localStorage không phù hợp để bảo mật hoặc đồng bộ nhiều thiết bị.
- Băm mật khẩu bằng Argon2/bcrypt ở server, dùng session cookie `HttpOnly`, chống CSRF và rate limit đăng nhập.
- Tích hợp bản đồ/địa chỉ thật, tồn kho theo cửa hàng và cổng thanh toán ở môi trường sandbox trước.
- Viết test cho quy tắc giá, khuyến mãi, thanh toán và quyền truy cập.

## Ghi chú tham khảo Jollibee

Luồng được học hỏi ở mức khái niệm: menu theo nhóm, cấu hình món/combo, chọn nước hoặc nâng size, giá trị đơn giao tối thiểu và bước kiểm tra đơn. Màu sắc, nội dung, tên FARMY và mã nguồn được giữ độc lập; không sao chép HTML, CSS hoặc hình ảnh từ website tham khảo.
