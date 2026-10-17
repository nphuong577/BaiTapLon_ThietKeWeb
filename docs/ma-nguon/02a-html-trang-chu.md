# HTML trang chủ: `index.html`

Tệp nguồn: [`index.html`](../../index.html). Trang chủ viết sẵn các vùng nội dung chính; JavaScript tải dữ liệu và điền các vùng trống.

## Đầu trang và menu

```html
<a class="brand" href="index.html" aria-label="FARMY - Trang chủ">
  <img src="assets/images/BuiThiNgocPhuong_251230944/header_image/page_logo.png" alt="" />
  <span>FARMY<small>Giòn vui mỗi ngày</small></span>
</a>
<button class="nav-toggle" type="button" aria-label="Mở menu" aria-expanded="false">☰</button>
<nav class="main-nav" aria-label="Điều hướng chính">
  <a href="index.html" aria-current="page">Trang chủ</a>
  <a href="pages/products.html">Sản phẩm</a>
  <a href="#offers">Khuyến mãi</a>
  <a href="#about">Về FARMY</a>
</nav>
```

- `href="index.html"` đưa về trang chủ; `href="#offers"` cuộn đến phần có `id="offers"` trong chính trang này.
- `aria-current="page"` đánh dấu trang hiện tại; CSS dùng nó để gạch chân mục menu.
- Nút `.nav-toggle` được [`setupMobileNav()`](04c-js-utils.md) bật/tắt trên màn nhỏ.
- Logo có `alt=""` vì tên thương hiệu đã được đặt thành chữ ngay cạnh ảnh, tránh bị đọc lặp.

## Banner và vùng món

```html
<div class="slider" id="hero-slider">
  <div class="slider-track" id="slider-track">
    <div class="loading-card">Đang tải ưu đãi...</div>
  </div>
  <button class="slider-arrow prev" type="button" aria-label="Ảnh trước">‹</button>
  <button class="slider-arrow next" type="button" aria-label="Ảnh tiếp theo">›</button>
  <div class="slider-dots" id="slider-dots" aria-label="Chọn ảnh quảng cáo"></div>
</div>
```

`slider-track` và `slider-dots` ban đầu có nội dung chờ; [`home.js`](07-js-trang-chu.md) thay chúng bằng ảnh/chấm từ `site.json`. Các `id` phải khớp `querySelector()` trong JS; nếu đổi tên ở đây, phải sửa selector ở đó.

Các vùng `#category-previews`, `#promotion-carousel` và `#promotion-dots` cũng là điểm đổ dữ liệu. Cam kết dịch vụ và phần giới thiệu được viết trực tiếp trong HTML vì hiện chúng không tải từ JSON.

## Giỏ trượt

```html
<div class="drawer-backdrop" id="drawer-backdrop" hidden></div>
<aside class="cart-drawer" id="cart-drawer" aria-label="Giỏ hàng" aria-hidden="true">
  <div class="cart-items" id="cart-items"></div>
  <strong id="cart-subtotal">0 ₫</strong>
  <a href="pages/checkout.html">Tiến hành đặt hàng</a>
</aside>
```

`hidden` giấu nền mờ lúc đầu; `aria-hidden="true"` thông báo rằng ngăn giỏ đang đóng. JS trong [`cart.js`](06-js-components-gio-hang.md) đổi trạng thái, điền các dòng món và tổng tiền. Biểu tượng giỏ dùng `data-cart-count`; có thể đặt thuộc tính này ở nhiều nơi để tất cả cùng hiện một số lượng.

## Nạp CSS và JS

Trang nạp CSS nền trước, sau đó CSS thành phần/trang. Cuối `<body>` có:

```html
<script type="module" src="js/pages/home.js"></script>
```

`type="module"` cho phép dùng `import`/`export`. Đường dẫn không có `../` vì `index.html` nằm ngay ở gốc dự án. Trang con dùng đường dẫn đi lùi một thư mục.

## Khi nào sửa file này?

Sửa `index.html` nếu muốn thay chữ giới thiệu, liên kết, cấu trúc phần trang hoặc thêm một vùng đích để JS điền. Sửa `data/site.json` nếu muốn thay ảnh banner; sửa `data/promotions.json` nếu muốn thay nội dung các slide khuyến mãi.
