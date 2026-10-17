# CSS theo từng trang: `styles/pages/`

Mỗi stylesheet dưới đây chỉ nên chứa các quy tắc đặc thù cho trang tương ứng. Quy tắc dùng chung nên để trong `base/` hoặc `components/`.

| File | Các khu vực được tạo kiểu |
|---|---|
| [`home.css`](../../styles/pages/home.css) | Hero/banner, cam kết dịch vụ, preview danh mục, carousel khuyến mãi, giới thiệu |
| [`products.css`](../../styles/pages/products.css) | Banner thực đơn, thanh tìm kiếm, nút danh mục và số kết quả |
| [`product.css`](../../styles/pages/product.css) | Breadcrumb, khung chi tiết, ảnh, bộ chọn và lời hứa dịch vụ |
| [`auth.css`](../../styles/pages/auth.css) | Hai cột ảnh/form, tab, form đăng ký và hiệu ứng chuyển |
| [`checkout.css`](../../styles/pages/checkout.css) | Form nhận hàng, thẻ thanh toán, tổng đơn, trạng thái thành công |

## Ví dụ: hai cột trang đặt hàng

```css
.checkout-layout {
  display: grid;
  grid-template-columns: minmax(0, 1.15fr) minmax(340px, .85fr);
  gap: 28px;
}
@media (max-width: 850px) {
  .checkout-layout { grid-template-columns: 1fr; }
}
```

Trên màn lớn, form chiếm khoảng 1,15 phần và bảng đơn 0,85 phần; cột bảng không nhỏ hơn 340 px. Khi màn hình hẹp hơn 850 px, chuyển thành một cột để nội dung không bị ép.

## Ví dụ: trạng thái thành công và `hidden`

HTML dùng thuộc tính `hidden` ban đầu. JS bỏ thuộc tính này khi đơn được tạo; CSS có thể tinh chỉnh phần tử success nhưng không cần lặp lại cách ẩn/hiện trong nhiều selector.

## Tìm nơi cần sửa

1. Xác định trang gặp vấn đề.
2. Mở stylesheet cùng tên.
3. Tìm class hoặc ID của phần tử trong HTML.
4. Xem selector đó có bị quy tắc `base/` hoặc `components/` ghi đè không.
5. Kiểm tra media query của chính file đó ở kích thước tương ứng.

Breakpoint của các trang không hoàn toàn đồng nhất: ví dụ `products.css` dùng 800/540 px, trang thanh toán dùng 850/560 px, còn header có breakpoint riêng. Đây là cấu hình hiện tại, không phải lỗi tự động; khi đổi cần xem trước ở các kích thước thực tế.
