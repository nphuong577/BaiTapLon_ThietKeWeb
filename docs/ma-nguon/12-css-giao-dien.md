# CSS: giao diện và responsive

## 5. CSS: giao diện và responsive

CSS quyết định **trang trông như thế nào**: màu, chữ, khoảng cách, lưới, hiệu ứng và cách bố trí theo kích thước màn hình. CSS không nên dùng để thay đổi nội dung hay tính giá.

### Các file CSS

| Tệp | Phạm vi | Nên sửa khi muốn |
|---|---|---|
| [`styles/base/variables.css`](../../styles/base/variables.css) | Biến màu, bóng đổ, bo góc trong `:root` | Đổi màu/diện mạo thương hiệu nhất quán |
| [`styles/base/global.css`](../../styles/base/global.css) | Quy tắc chung, nút, form, toast, bố cục trang con, giảm chuyển động | Thay đổi kiểu mặc định được nhiều trang dùng |
| [`styles/components/header.css`](../../styles/components/header.css) | Đầu trang, logo, điều hướng, biểu tượng giỏ, menu điện thoại | Sửa thanh đầu trang |
| [`styles/components/footer.css`](../../styles/components/footer.css) | Chân trang, liên hệ, liên kết, giờ mở cửa | Sửa phần cuối trang |
| [`styles/components/product-card.css`](../../styles/components/product-card.css) | Thẻ sản phẩm và lưới món | Chỉnh ảnh, nút, giá hoặc số cột |
| [`styles/components/cart.css`](../../styles/components/cart.css) | Ngăn giỏ, từng dòng món, hộp thoại chọn món và lựa chọn size | Chỉnh giao diện giỏ hoặc bộ chọn món |
| [`styles/pages/home.css`](../../styles/pages/home.css) | Banner, dịch vụ, món xem trước, carousel khuyến mãi, giới thiệu | Chỉnh trang chủ |
| [`styles/pages/products.css`](../../styles/pages/products.css) | Banner thực đơn, tìm kiếm, bộ lọc, thông tin kết quả | Chỉnh trang danh sách món |
| [`styles/pages/product.css`](../../styles/pages/product.css) | Breadcrumb, chi tiết món, lời hứa dịch vụ, trạng thái không tìm thấy | Chỉnh trang chi tiết món |
| [`styles/pages/auth.css`](../../styles/pages/auth.css) | Khung đăng nhập/đăng ký, tab, thông báo và tài khoản | Chỉnh giao diện tài khoản |
| [`styles/pages/checkout.css`](../../styles/pages/checkout.css) | Form giao hàng, lựa chọn thanh toán, bảng tổng đơn, xác nhận | Chỉnh trang đặt hàng |

Mỗi HTML nạp `variables.css` và `global.css` trước, sau đó nạp CSS thành phần/trang cần dùng. Thứ tự này quan trọng: CSS nạp sau có thể ghi đè một số quy tắc nạp trước.

### Những khái niệm CSS đang dùng

| Khái niệm | Ví dụ trong dự án | Giải thích |
|---|---|---|
| Biến CSS | `var(--red)`, `var(--radius)` | Đặt giá trị dùng lại, giúp đổi theme một chỗ |
| Class selector | `.product-card` | Áp dụng kiểu cho mọi phần tử có class đó |
| ID selector | `#product-detail` | Áp dụng kiểu cho phần tử có ID đó |
| CSS Grid | `display: grid` | Sắp xếp dạng hàng/cột; hợp với lưới sản phẩm và bố cục trang |
| Flexbox | `display: flex` | Sắp xếp thành hàng/cột linh hoạt; hợp với header, nút, thanh giá |
| Media query | `@media (max-width: 820px)` | Thay đổi bố cục khi màn hình nhỏ hơn một ngưỡng |
| Pseudo-class | `:hover`, `:focus`, `:checked` | Kiểu khi rê chuột, bàn phím chọn, radio được chọn |
| `clamp()` | `font-size: clamp(...)` | Cho kích thước co giãn trong giới hạn nhỏ nhất/lớn nhất |
| `var(--...)` | `background: var(--cream)` | Lấy màu/giá trị từ biến đã khai báo |

Các breakpoint đang dùng không hoàn toàn giống nhau ở mọi trang: header/thẻ món thường 1100, 820 và 540 px; trang chủ có 1050, 820; đăng nhập/đặt hàng dùng khoảng 850/560; footer dùng 760/480. Khi sửa responsive, xem đúng CSS của trang/thành phần thay vì giả định chỉ có một ngưỡng toàn website.

### Cách sửa CSS ít rủi ro

1. Xác định thành phần và trang bị ảnh hưởng.
2. Ưu tiên chỉnh biến trong `variables.css` nếu thay đổi là màu/bo góc dùng chung.
3. Nếu chỉ một trang bị ảnh hưởng, sửa trong `styles/pages/` của trang đó.
4. Nếu thành phần dùng nhiều trang, sửa trong `styles/components/`.
5. Kiểm tra ít nhất màn hình rộng và hẹp; tránh dùng selector quá rộng như `button` nếu chỉ muốn đổi một nút.

---


### 9.16. CSS: ví dụ đọc quy tắc và biến

Ví dụ biến theme:

```css
:root {
  --red: #e31837;
  --yellow: #ffc72c;
  --cream: #fff8e8;
  --radius: 22px;
}
```

`:root` là vùng gốc để các biến có thể dùng toàn website. Dấu `--` khai báo biến; dùng `var(--red)` ở nơi khác. Nếu đổi `--red`, mọi quy tắc tham chiếu biến đó sẽ đổi theo.

Ví dụ thẻ món responsive:

```css
.product-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}

@media (max-width: 820px) {
  .product-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 540px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
}
```

- `.product-grid` chọn phần tử có class tương ứng.
- `display: grid` bật bố cục lưới.
- `repeat(4, ...)` tạo bốn cột; `1fr` chia đều phần không gian.
- `gap` tạo khoảng cách giữa các thẻ.
- Khi màn hình rộng tối đa 820 px, đổi còn hai cột; tối đa 540 px thì còn một cột.

Ví dụ trạng thái được chọn:

```css
.option-pill input:checked + span {
  border-color: var(--red);
  background: #fff0f2;
  color: var(--red);
  font-weight: 700;
}
```

Selector `:checked + span` chọn phần `<span>` đứng ngay sau radio đang được chọn. Đây là lý do nhãn lựa chọn đổi màu khi khách chọn một size/nước.

