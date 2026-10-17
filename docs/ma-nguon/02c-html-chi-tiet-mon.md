# HTML trang chi tiết món: `pages/product.html`

Tệp nguồn: [`pages/product.html`](../../pages/product.html). Món cụ thể được chọn bằng tham số URL, ví dụ `product.html?id=fried-chicken`.

## Các vùng chính

```html
<nav class="breadcrumb" aria-label="Đường dẫn">
  <a href="../index.html">Trang chủ</a>
  <span>/</span>
  <a href="products.html">Sản phẩm</a>
  <span>/</span>
  <strong id="breadcrumb-name">Chi tiết món</strong>
</nav>
<div id="product-detail">
  <div class="loading-card">Đang tải thông tin món...</div>
</div>
```

Breadcrumb giúp người dùng biết đang ở đâu. `#breadcrumb-name` được JS thay bằng tên sản phẩm; `#product-detail` ban đầu báo đang tải, rồi nhận bộ tùy chỉnh hoặc thông báo không tìm thấy.

Trang không viết sẵn tên, giá và lựa chọn của một món cố định. Thay vào đó, [`product.js`](../../js/pages/product.js) đọc `id` trên URL, tải catalog và dựng nội dung dùng chung với dialog chọn món.

## Các thành phần khác

- Header và footer là cấu trúc chung được lặp trên các trang.
- `.product-promises` là ba cam kết tĩnh, không lấy từ JSON.
- `#toast` là nơi hiện thông báo thêm món.
- CSS chi tiết nằm trong [`product.css`](../../styles/pages/product.css), bộ chọn dùng lại style từ [`cart.css`](../../styles/components/cart.css).

## Khi nào sửa?

Sửa HTML khi muốn thay breadcrumb, cam kết dịch vụ hoặc thêm một vùng giao diện tĩnh. Sửa JSON nếu muốn đổi dữ liệu sản phẩm. Sửa `product.js` nếu muốn đổi cách tìm sản phẩm theo URL hoặc phản ứng khi không tìm thấy.
