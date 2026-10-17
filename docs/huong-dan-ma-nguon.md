# Cẩm nang mã nguồn FARMY

Bộ tài liệu này được chia nhỏ theo chủ đề để người mới có thể đọc từng phần. Các đoạn code và giải thích dựa trên mã hiện có trong dự án.

> Đây là website front-end minh họa. Tài khoản, giỏ và đơn chỉ lưu trong trình duyệt; không dùng mật khẩu hoặc dữ liệu thanh toán thật.

## Đọc theo nhu cầu

| Tôi muốn... | Mở tài liệu |
|---|---|
| Hiểu cấu trúc thư mục, luồng từ HTML đến dữ liệu | [01 — Tổng quan và bản đồ dự án](ma-nguon/01-tong-quan.md) |
| Hiểu khái niệm HTML dùng chung | [02 — HTML: từng trang và thành phần](ma-nguon/02-html-cac-trang.md) |
| Xem riêng HTML của trang chủ, thực đơn, chi tiết món, tài khoản hoặc đặt hàng | [Các hướng dẫn HTML theo trang](#html-theo-từng-trang) |
| Thêm/sửa món, banner, khuyến mãi, giảm giá trong JSON | [03 — JSON: dữ liệu website](ma-nguon/03-json-du-lieu.md) |
| Hiểu tải JSON | [04a — `data-loader.js`](ma-nguon/04a-js-data-loader.md) |
| Hiểu localStorage | [04b — `storage.js`](ma-nguon/04b-js-storage.md) |
| Hiểu tiện ích dùng chung | [04c — `utils.js`](ma-nguon/04c-js-utils.md) |
| Hiểu thẻ sản phẩm | [05a — `product-card.js`](ma-nguon/05a-js-product-card.md) |
| Hiểu tùy chỉnh món | [05b — `product-customizer.js`](ma-nguon/05b-js-product-customizer.md) |
| Hiểu thêm/xóa món, số lượng, tổng tiền và ngăn giỏ | [06 — Component giỏ hàng](ma-nguon/06-js-components-gio-hang.md) |
| Hiểu banner, món xem trước và carousel ở trang chủ | [07 — JavaScript trang chủ](ma-nguon/07-js-trang-chu.md) |
| Hiểu tìm kiếm, lọc danh mục và chọn món | [08 — JavaScript trang thực đơn](ma-nguon/08-js-thuc-don.md) |
| Hiểu URL chi tiết món và bộ chọn món | [09 — JavaScript chi tiết món](ma-nguon/09-js-chi-tiet-mon.md) |
| Hiểu đăng ký, đăng nhập, đăng xuất và kiểm tra form | [10 — JavaScript tài khoản](ma-nguon/10-js-tai-khoan.md) |
| Hiểu kiểm tra đơn, phí giao, giảm giá và tạo đơn demo | [11 — JavaScript đặt hàng](ma-nguon/11-js-dat-hang.md) |
| Hiểu khái niệm CSS dùng chung | [12 — CSS giao diện](ma-nguon/12-css-giao-dien.md) |
| Xem riêng CSS nền, thành phần hoặc từng trang | [Các hướng dẫn CSS theo nhóm](#css-theo-nhóm-tệp) |
| Làm thao tác phổ biến, tìm lỗi hoặc cân nhắc cách khác | [13 — Thao tác và lỗi thường gặp](ma-nguon/13-thao-tac-va-loi.md) |
| Tra cứu hàm nào nằm trong file nào | [14 — Danh mục hàm](ma-nguon/14-danh-muc-ham.md) |

## Mỗi module JavaScript có tài liệu riêng

- Core: [`data-loader.js`](ma-nguon/04a-js-data-loader.md), [`storage.js`](ma-nguon/04b-js-storage.md), [`utils.js`](ma-nguon/04c-js-utils.md).
- Components: [`product-card.js`](ma-nguon/05a-js-product-card.md), [`product-customizer.js`](ma-nguon/05b-js-product-customizer.md), [`cart.js`](ma-nguon/06-js-components-gio-hang.md).
- Trang: [trang chủ](ma-nguon/07-js-trang-chu.md), [thực đơn](ma-nguon/08-js-thuc-don.md), [chi tiết món](ma-nguon/09-js-chi-tiet-mon.md), [tài khoản](ma-nguon/10-js-tai-khoan.md), [đặt hàng](ma-nguon/11-js-dat-hang.md).

## HTML theo từng trang

- [Trang chủ `index.html`](ma-nguon/02a-html-trang-chu.md)
- [Thực đơn `pages/products.html`](ma-nguon/02b-html-trang-thuc-don.md)
- [Chi tiết món `pages/product.html`](ma-nguon/02c-html-chi-tiet-mon.md)
- [Tài khoản `pages/auth.html`](ma-nguon/02d-html-tai-khoan.md)
- [Đặt hàng `pages/checkout.html`](ma-nguon/02e-html-dat-hang.md)

## CSS theo nhóm tệp

- [CSS nền: variables và global](ma-nguon/12a-css-nen.md)
- [CSS thành phần: header, footer, card, cart](ma-nguon/12b-css-thanh-phan.md)
- [CSS theo trang: home, products, product, auth, checkout](ma-nguon/12c-css-trang.md)

## Lộ trình đọc đề xuất

1. Đọc [Tổng quan](ma-nguon/01-tong-quan.md) để biết phần nào chịu trách nhiệm cho việc gì.
2. Đọc [JSON](ma-nguon/03-json-du-lieu.md) nếu chủ yếu muốn thay món, giá và ảnh.
3. Đọc [HTML](ma-nguon/02-html-cac-trang.md) và [CSS](ma-nguon/12-css-giao-dien.md) nếu muốn đổi nội dung hoặc giao diện.
4. Đọc tài liệu JavaScript theo chức năng bạn cần thay đổi.
5. Trước khi dùng thông tin thật, đọc phần giới hạn trong [Thao tác và lỗi](ma-nguon/13-thao-tac-va-loi.md).

Tài liệu cũ về thao tác dữ liệu vẫn hữu ích: [Hướng dẫn quản lý dữ liệu](quan-ly-du-lieu.md). Nội dung dự án và các ưu tiên hoàn thiện: [Kế hoạch hoàn thiện](ke-hoach-hoan-thien.md).