# HTML trang tài khoản: `pages/auth.html`

Tệp nguồn: [`pages/auth.html`](../../pages/auth.html). Các biểu mẫu và vùng trạng thái tài khoản được điều khiển bởi [`auth.js`](../../js/pages/auth.js).

## Chuyển giữa đăng nhập và đăng ký

```html
<div class="auth-tabs" role="tablist">
  <button class="active" type="button" role="tab" data-auth-tab="login">Đăng nhập</button>
  <button type="button" role="tab" data-auth-tab="register">Đăng ký</button>
</div>
<p class="auth-feedback" id="auth-feedback" aria-live="polite"></p>
<div class="auth-form-stage" id="auth-form-stage">
  <!-- Hai form đăng nhập và đăng ký nằm trong vùng này -->
</div>
```

- `data-auth-tab` là mã để JS biết người dùng muốn mở form nào.
- `role="tablist"` và `role="tab"` mô tả ý nghĩa điều khiển cho công nghệ hỗ trợ.
- `#auth-feedback` hiện thông báo chung như “Đăng ký thành công”.
- JS bật class `active` và đổi `aria-hidden`; CSS quyết định form nào nhìn thấy.

## Mẫu trường nhập

```html
<div class="form-field">
  <label for="login-email">Email</label>
  <input id="login-email" name="email" type="email" autocomplete="email" />
  <p class="field-error" data-error-for="login-email"></p>
</div>
```

`id` nối label và input; `name` giúp `FormData` lấy giá trị; `type="email"` gợi ý bàn phím/kiểm tra cơ bản của trình duyệt; `autocomplete` hỗ trợ tự điền; `data-error-for` xác định chỗ hiện lỗi. Các form dùng `novalidate` để JS chủ động hiển thị thông báo riêng.

Đăng ký có các trường `name`, `email`, `phone`, `password`, `confirm`; phần trợ giúp mật khẩu có `id="password-hint"` và được liên kết bằng `aria-describedby`.

## Trạng thái đã đăng nhập

```html
<div id="account-view" hidden>
  <h2 id="account-name"></h2>
  <p id="account-email"></p>
  <button id="logout-button" type="button">Đăng xuất</button>
</div>
```

Khi có phiên, JS ẩn form và hiện vùng này; tên/email được gán bằng `textContent`. Nút đăng xuất xóa phiên demo trong localStorage.

**Lỗi cần biết:** JS hiện tìm `.notice` và đặt thuộc tính `.hidden`, nhưng HTML này không khai báo phần tử có class đó. Selector trả về `null`, có thể gây `TypeError` trong lúc khởi tạo tài khoản. Hãy thêm vùng `.notice` tương ứng hoặc sửa JS có kiểm tra phần tử trước khi dùng.

> Bản demo lưu mật khẩu dạng có thể đọc trong localStorage. Không nhập tài khoản hay mật khẩu thật.
