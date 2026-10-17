# HTML: từng trang và thành phần

## 2. HTML: các trang và thành phần

HTML quyết định **trên trang có những thành phần nào**. Ví dụ: tiêu đề, ảnh, nút, ô nhập, danh sách. HTML không tự tải món hay tính tổng tiền; các việc đó do JavaScript phụ trách.

| Tệp | Vai trò và nội dung chính | JavaScript điều khiển |
|---|---|---|
| [`index.html`](../../index.html) | Trang chủ: banner trượt, cam kết dịch vụ, món xem trước, khuyến mãi, giới thiệu, giỏ dạng ngăn kéo | [`home.js`](../../js/pages/home.js) |
| [`pages/products.html`](../../pages/products.html) | Toàn bộ thực đơn: tìm kiếm, nút lọc danh mục, lưới món, hộp tùy chỉnh món và giỏ | [`products.js`](../../js/pages/products.js) |
| [`pages/product.html`](../../pages/product.html) | Chi tiết một món; mã món được truyền qua URL như `?id=fried-chicken` | [`product.js`](../../js/pages/product.js) |
| [`pages/auth.html`](../../pages/auth.html) | Biểu mẫu đăng nhập/đăng ký và khu vực tài khoản đã đăng nhập | [`auth.js`](../../js/pages/auth.js) |
| [`pages/checkout.html`](../../pages/checkout.html) | Thông tin giao hàng, phương thức thanh toán demo, tóm tắt giá và thông báo đặt hàng | [`checkout.js`](../../js/pages/checkout.js) |

### Cấu trúc HTML thường gặp

| Thành phần | Công dụng trong dự án |
|---|---|
| `<head>` | Khai báo mã tiếng Việt, tiêu đề tab trình duyệt, icon và các tệp CSS |
| `<header>` | Logo, điều hướng, nút tài khoản/giỏ |
| `<main>` | Nội dung chính của trang |
| `<section>` | Nhóm nội dung có chủ đề riêng, ví dụ khuyến mãi hoặc danh mục món |
| `<form>` | Nhóm trường nhập có thể gửi/kiểm tra, dùng cho đăng ký và đặt hàng |
| `<label for="...">` | Tên dễ hiểu của trường nhập; `for` cần khớp `id` của input |
| `<button type="button">` | Nút hành động không gửi form |
| `<button type="submit">` | Nút gửi form |
| `<footer>` | Thông tin liên hệ và liên kết ở cuối trang |
| `<dialog>` | Hộp thoại chọn món trên trang thực đơn |

### Các thuộc tính HTML có ý nghĩa với JS

JS thường tìm các phần tử thông qua `id`, class hoặc thuộc tính `data-*`. Vì vậy, khi sửa `id` hay `data-*`, phải tìm và cập nhật cả JS tương ứng.

| Cách đánh dấu | Ví dụ | Dùng để |
|---|---|---|
| `id` | `id="product-grid"` | Đánh dấu một phần tử cụ thể để JS tìm và cập nhật |
| `class` | `class="cart-drawer"` | Nhóm phần tử để CSS tạo kiểu; đôi khi JS cũng tìm theo class |
| `data-*` | `data-cart-count`, `data-category` | Gắn thông tin/hook cho JS mà không phải dùng nội dung chữ để nhận diện |
| `aria-label`, `aria-live` | `aria-live="polite"` | Giúp công nghệ hỗ trợ đọc được nhãn hoặc thông báo mới |
| `hidden` | `hidden` | Ẩn phần tử theo trạng thái; JS có thể bật/tắt |
| `href` | `pages/product.html?id=...` | Đường dẫn tới trang hoặc tới một sản phẩm cụ thể |

**Khi sửa HTML:** giữ nguyên các `id` và `data-*` mà JS dùng, kiểm tra đường dẫn tương đối (trang ở thư mục `pages/` cần đường dẫn `../...` để quay về thư mục gốc), và giữ đúng cặp thẻ mở/đóng.

---


### 9.15. HTML: trang cung cấp “điểm móc” cho JS

Ví dụ phần trang thực đơn:

```html
<input id="search-input" type="search" />
<div id="category-tabs"></div>
<div id="product-grid"></div>
<dialog id="product-dialog">
  <button class="icon-close dialog-close" type="button">×</button>
  <div id="dialog-content"></div>
</dialog>
<script type="module" src="../js/pages/products.js"></script>
```

- `id="search-input"` được JS dùng để lắng nghe nhập từ khóa.
- `category-tabs` là nơi JS dựng các nút danh mục.
- `product-grid` là nơi JS dựng thẻ sản phẩm.
- `dialog` là hộp chọn món; `dialog-content` được thay nội dung theo món đang chọn.
- `<script type="module">` tải đúng logic cho trang. Đường dẫn `../` cần thiết vì HTML nằm trong `pages/`.

Ví dụ trường biểu mẫu:

```html
<label for="customer-phone">Số điện thoại</label>
<input id="customer-phone" name="phone" autocomplete="tel" />
<p class="field-error" data-error-for="customer-phone"></p>
```

`for` liên kết nhãn với input có cùng `id`. `name` là tên mà `FormData` đọc. `data-error-for` cho JS biết vùng nào nhận lỗi của trường này. Nếu đổi `id`, hãy cập nhật cả label, vùng lỗi và selector JS.

