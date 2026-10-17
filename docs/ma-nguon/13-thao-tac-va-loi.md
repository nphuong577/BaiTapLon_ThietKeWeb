# Thao tác thường gặp, kiểm tra lỗi và phương án khác

## 6. Các thao tác thường gặp

### Thêm một món mới

1. Chọn file phù hợp trong `data/products/`.
2. Thêm món vào mảng `products`, dùng `id` duy nhất và giữ đủ các trường theo bảng ở trên.
3. Đặt ảnh trong `assets/images/` và ghi đường dẫn tương đối từ thư mục gốc vào `image`.
4. Kiểm tra `category` trùng mã danh mục và `options` có cấu trúc hợp lệ.
5. Nếu muốn dùng món trong khuyến mãi, cập nhật link ở `data/promotions.json`.
6. Mở trang thực đơn và trang chi tiết để thử món, tùy chỉnh, thêm giỏ và kiểm tra giá.

### Thêm danh mục mới

1. Thêm `{ "id": "new-category", "name": "Tên danh mục" }` vào `data/categories.json`.
2. Tạo `data/products/new-category.json` với `{ "products": [] }`.
3. Thêm sản phẩm có `"category": "new-category"` vào file đó.
4. Đảm bảo mã trong JSON và tên file khớp chính xác, kể cả dấu gạch nối.

### Đổi giá hoặc lựa chọn size/nước

- Giá cơ bản: sửa `price`.
- Giá cộng thêm theo lựa chọn: sửa `extraPrice` trong `options.size` hoặc `options.drink`.
- Kiểm tra giá trong bộ tùy chỉnh, giỏ hàng và tổng thanh toán. Không ghi `"69.000"` vào JSON; phải ghi `69000`.

### Đổi màu trên toàn website

Thử đổi biến tương ứng trong `styles/base/variables.css`, ví dụ `--red` hoặc `--yellow`. Một số màu đang được ghi trực tiếp trong CSS, nên kiểm tra các trang khác sau khi đổi để tìm màu không dùng biến.

### Thêm một phần tử có tương tác

1. Thêm phần tử vào HTML với `id` hoặc `data-*` ổn định.
2. Trong JS trang/module tương ứng, tìm phần tử qua `document.querySelector(...)`.
3. Gắn listener như `addEventListener("click", ...)` hoặc `addEventListener("input", ...)`.
4. Cập nhật giao diện qua `textContent`, thuộc tính hoặc class.
5. Nếu cần, thêm style trong CSS phù hợp.

### Chạy và kiểm tra website

Website gọi `fetch()` để lấy JSON; vì vậy cần chạy qua máy chủ cục bộ, không nên mở HTML trực tiếp bằng `file://`.

```text
python -m http.server 8080
```

Chạy lệnh tại thư mục gốc `Farmy`, sau đó mở `http://localhost:8080/`. Nếu máy không nhận lệnh `python`, có thể dùng một máy chủ tĩnh khác (ví dụ Live Server trong VS Code). Sau khi sửa, kiểm tra trang chủ, thực đơn, chi tiết món, giỏ, đăng nhập và đặt hàng; mở Console trình duyệt nếu dữ liệu không tải.

---

## 7. Kiểm tra lỗi và giới hạn cần biết

| Triệu chứng | Nguyên nhân thường gặp | Cách kiểm tra |
|---|---|---|
| Trang hiện “Không tải được dữ liệu” | Mở bằng `file://`, đường dẫn sai hoặc JSON lỗi | Chạy local server; xem tab Network/Console; kiểm tra URL JSON |
| Ảnh bị trống | Sai chữ hoa/thường hoặc đường dẫn `image` sai | Thử mở đường dẫn ảnh trực tiếp từ gốc website |
| Món không xuất hiện trong danh mục | `category` không khớp `categories.json`, hoặc món đặt nhầm file | So sánh mã danh mục và tên file |
| Nút đặt món không làm gì | `id`/`data-*` trong HTML bị đổi hoặc JS không nạp | Kiểm tra Console và các selector trong JS |
| Giá lựa chọn sai | `extraPrice` sai kiểu hoặc quên cộng tiền nâng cấp | Xác nhận trường là số và kiểm tra tổng trong giỏ |
| Có dữ liệu cũ sau khi sửa | `localStorage` vẫn giữ giỏ/tài khoản/đơn từ lần trước | Dùng DevTools → Application → Local Storage để xóa dữ liệu demo |
| Trang đăng nhập có thể hoạt động nhưng không an toàn | Tài khoản được lưu ở trình duyệt, mật khẩu hiện lưu dạng chữ thường | Chỉ dùng cho demo; không dùng dữ liệu/mật khẩu thật |

**Vấn đề hiện có ở trang đăng nhập:** `auth.js` tìm một phần tử có class `.notice`, nhưng `pages/auth.html` hiện không có phần tử như vậy. Vì vậy, khi `showAccount()` chạy, trình duyệt có thể ghi `TypeError` vào Console và không hoàn tất cập nhật giao diện tài khoản. Muốn sửa, cần thêm phần tử `.notice` phù hợp vào HTML hoặc sửa JS để chỉ cập nhật nó khi phần tử tồn tại.

### Những giới hạn bảo mật và vận hành

- `localStorage` có thể được người dùng xem/sửa/xóa; dữ liệu không đồng bộ giữa thiết bị và không được gửi về cửa hàng.
- Bản demo lưu mật khẩu trực tiếp trong trình duyệt. Không nhập mật khẩu thật hoặc dùng chức năng này cho dịch vụ thực tế.
- Kiểm tra dữ liệu ở trình duyệt chỉ giúp trải nghiệm; hệ thống thật phải kiểm tra lại trên máy chủ.
- Giá, giảm giá, trạng thái thanh toán và đơn hàng đều có thể bị người dùng sửa trong trình duyệt. Không dùng chúng làm dữ liệu giao dịch thật.
- Thông tin ngân hàng trong trang thanh toán được ghi rõ là mô phỏng, không thực hiện chuyển tiền.
- `escapeHtml()` được dùng để mã hóa một số văn bản động trước khi chèn vào HTML dạng chuỗi; khi thêm nơi render dữ liệu mới, không chèn nội dung người dùng trực tiếp vào `innerHTML`.

---

## 8. Nếu muốn dùng cách làm khác

| Nhu cầu | Cách dự án hiện làm | Lựa chọn khác | Khi nào cân nhắc lựa chọn khác |
|---|---|---|---|
| Dựng giao diện | HTML viết sẵn và JS cập nhật DOM | React, Vue, Svelte hoặc thư viện component | Khi trang có nhiều trạng thái giao diện và thành phần tương tác phức tạp |
| Lưu danh mục/món | File JSON tĩnh | API + cơ sở dữ liệu hoặc CMS | Khi người quản trị cần sửa nội dung qua màn quản trị, dữ liệu đổi thường xuyên hoặc nhiều người cùng làm |
| Lưu giỏ và đơn | `localStorage` | API phía máy chủ + cơ sở dữ liệu | Khi cần đồng bộ thiết bị, theo dõi đơn thật, tồn kho hoặc quản lý khách hàng |
| Xác thực tài khoản | Kiểm tra trong JS và lưu localStorage | Đăng nhập phía máy chủ, cookie phiên bảo mật/OAuth | Bắt buộc nếu xử lý tài khoản hoặc dữ liệu cá nhân thật |
| Tạo giao diện thẻ món | Hàm trả về chuỗi HTML | DOM API, template `<template>`, hoặc component framework | Khi mẫu HTML lớn, cần kiểu an toàn hơn hoặc muốn giao diện được quản lý theo component |
| Tạo kiểu | CSS thuần theo thành phần/trang | Sass, CSS Modules, Tailwind hoặc design system | Sass hữu ích khi có nhiều quy tắc lặp; utility framework hữu ích nếu nhóm đã thống nhất quy trình |
| Chạy website khi phát triển | Máy chủ tĩnh cục bộ | Vite hoặc công cụ build tương tự | Khi cần tự tải lại trang, đóng gói, tối ưu ảnh/tệp hoặc thêm thư viện |

Không có lựa chọn nào luôn tốt hơn. Với website nhỏ, ít trang và ít tương tác, HTML/CSS/JS thuần dễ học, dễ triển khai và không cần bước build. Khi yêu cầu tăng lên (tài khoản thật, thanh toán, nhiều nội dung, quản trị), thay đổi kiến trúc nên được làm đồng bộ thay vì chỉ đổi một tệp riêng lẻ.

---


### 9.17. Bảng toàn bộ hàm và hành vi theo tệp
