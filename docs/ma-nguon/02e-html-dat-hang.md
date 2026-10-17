# HTML trang đặt hàng: `pages/checkout.html`

Tệp nguồn: [`pages/checkout.html`](../../pages/checkout.html). Logic tính tiền và đặt đơn nằm ở [`checkout.js`](../../js/pages/checkout.js).

## Form thông tin nhận hàng

```html
<form class="checkout-form" id="checkout-form" novalidate>
  <div class="form-field">
    <label for="customer-name">Họ và tên</label>
    <input id="customer-name" name="name" autocomplete="name" />
    <p class="field-error" data-error-for="customer-name"></p>
  </div>
  <button id="place-order" type="submit">Xác nhận đặt hàng</button>
</form>
```

- `id="checkout-form"` để JS gắn sự kiện `submit`.
- `name="name"` là khóa mà `FormData` trả về.
- `novalidate` tắt popup kiểm tra mặc định của trình duyệt để JS hiện lỗi nhất quán.
- `data-error-for` nối trường với vùng báo lỗi.
- `type="submit"` gửi form; JS gọi `preventDefault()` rồi tự kiểm tra.

Các trường khác là số điện thoại, email, địa chỉ, thời gian giao, ghi chú và phương thức thanh toán. Nếu sửa `name`, phải sửa cả chỗ đọc `values.<tên>` trong JS.

## Bảng tóm tắt đơn

Các ID `checkout-items`, `checkout-subtotal`, `discount-amount`, `discount-message`, `delivery-fee`, `order-total` là các đích mà `checkout.js` cập nhật. Không đổi các ID này nếu chưa cập nhật selector tương ứng.

Thông tin tài khoản được điền vào `#customer-name`, `#customer-phone`, `#customer-email`. Thông tin chuyển khoản trong HTML chỉ là ví dụ; trang ghi rõ không chuyển tiền thật.

## Trạng thái thành công

```html
<section class="order-success" id="order-success" hidden>
  <h2>Đặt hàng thành công!</h2>
  <p>Mã đơn: <strong id="order-code"></strong></p>
</section>
```

Lúc đầu vùng này bị ẩn. Khi lưu đơn demo xong, JS bỏ `hidden` và chèn mã đơn vào `#order-code`.

CSS trang: [`checkout.css`](../../styles/pages/checkout.css). Component hiển thị các dòng giỏ dùng [`cart.css`](../../styles/components/cart.css).
