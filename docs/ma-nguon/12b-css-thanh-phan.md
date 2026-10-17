# CSS thành phần: `styles/components/`

Các file trong nhóm này tạo kiểu cho thành phần có thể xuất hiện ở nhiều trang.

| File | Phần giao diện |
|---|---|
| [`header.css`](../../styles/components/header.css) | Logo, menu, nút tài khoản/giỏ, trạng thái menu điện thoại |
| [`footer.css`](../../styles/components/footer.css) | Logo chân trang, liên hệ, liên kết, giờ hoạt động |
| [`product-card.css`](../../styles/components/product-card.css) | Thẻ món, ảnh, nhãn, giá, nút và lưới |
| [`cart.css`](../../styles/components/cart.css) | Giỏ trượt, dòng sản phẩm, dialog chọn món, radio option và số lượng |

## Ví dụ: thẻ sản phẩm

```css
.product-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: var(--radius);
  background: white;
}
.product-image-wrap { aspect-ratio: 1.15; overflow: hidden; }
.product-image-wrap img { width: 100%; height: 100%; object-fit: cover; }
```

Thẻ là flex theo chiều dọc để phần thân lấp khoảng trống; `overflow: hidden` giữ ảnh trong khung bo góc; `aspect-ratio` giữ tỉ lệ ảnh; `object-fit: cover` phủ kín khung dù có thể cắt bớt viền ảnh.

## Ví dụ: lựa chọn được chọn trong dialog

```css
.option-pill input { position: absolute; opacity: 0; }
.option-pill input:checked + span {
  border-color: var(--red);
  background: #fff0f2;
  color: var(--red);
}
```

Radio vẫn tồn tại để người dùng chọn bằng bàn phím/trình đọc màn hình, nhưng được làm trong suốt; phần chữ `span` kế sau radio hiển thị trạng thái chọn. Cấu trúc HTML phải giữ input đứng trước span thì selector `+ span` mới khớp.

## Ví dụ: giỏ trượt

```css
.cart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  transform: translateX(105%);
}
.cart-drawer.open { transform: translateX(0); }
```

Ngăn giỏ được neo vào cửa sổ; ban đầu đẩy ra ngoài màn hình. Khi JS thêm class `open`, nó trượt vào. Không thấy giỏ thường là do thiếu class/JS hoặc phần tử có `id` sai, không nhất thiết do màu CSS.

## Khi sửa

- Chỉnh header/footer sẽ ảnh hưởng nhiều trang dùng cùng class.
- Chỉnh `.product-card` ảnh hưởng cả trang chủ lẫn thực đơn.
- Chỉnh `.cart-drawer` chỉ tác động ngăn giỏ; `.cart-row` còn dùng trong phần tóm tắt thanh toán.
- Media query ở cuối mỗi file điều chỉnh bố cục màn hình hẹp; kiểm tra cả desktop và điện thoại sau khi thay đổi.
