# HTML trang thực đơn: `pages/products.html`

Tệp nguồn: [`pages/products.html`](../../pages/products.html). Logic tìm kiếm và lọc nằm ở [`products.js`](../../js/pages/products.js).

## Thanh công cụ và lưới sản phẩm

```html
<label class="catalog-search">
  <span aria-hidden="true">⌕</span>
  <span class="sr-only">Tìm sản phẩm</span>
  <input id="search-input" type="search"
         placeholder="Tìm tên món, combo..." autocomplete="off" />
</label>
<div class="category-tabs" id="category-tabs"
     role="group" aria-label="Lọc theo danh mục"></div>
<h2 id="catalog-title">Tất cả sản phẩm</h2>
<p id="result-count" aria-live="polite"></p>
<div class="product-grid" id="product-grid">
  <div class="loading-card">Đang tải thực đơn...</div>
</div>
```

- `#search-input` nhận chữ người dùng nhập; `products.js` bắt sự kiện `input`.
- `#category-tabs` ban đầu rỗng để JS tạo nút từ `categories.json`.
- `#product-grid` ban đầu hiện thông báo chờ; sau đó JS thay bằng thẻ món.
- `aria-live="polite"` giúp công nghệ hỗ trợ thông báo số kết quả mới.
- `.sr-only` giấu chữ khỏi giao diện nhưng vẫn cho trình đọc màn hình đọc.

## Dialog chọn món và giỏ

```html
<dialog class="product-dialog" id="product-dialog">
  <button class="icon-close dialog-close" type="button" aria-label="Đóng">×</button>
  <div id="dialog-content"></div>
</dialog>
```

`<dialog>` là hộp thoại native của trình duyệt. JS gọi `showModal()` để mở, `close()` để đóng. `dialog-content` được thay mỗi lần khách chọn món khác. Thẻ HTML này cần giữ nguyên `id` và class vì JS tìm chúng theo đúng tên.

Trang còn có `#cart-drawer`, `#cart-items`, `#cart-subtotal` và `#toast`; chúng được component giỏ và `showToast()` dùng.

## CSS và đường dẫn

Trang này nằm bên trong thư mục `pages/`; vì vậy CSS dùng `../styles/...`, ảnh tĩnh dùng `../assets/...`, còn script là `../js/pages/products.js`. Nếu sao chép cấu trúc sang một trang gốc, các đường dẫn tương đối sẽ khác.

## Khi nào sửa?

- Muốn đổi placeholder tìm kiếm hoặc nội dung tiêu đề mặc định: sửa HTML.
- Muốn đổi cách tìm/lọc: sửa [`products.js`](../../js/pages/products.js).
- Muốn đổi giao diện thanh lọc/lưới: sửa [`products.css`](../../styles/pages/products.css).
- Muốn đổi thẻ món dùng chung: sửa [`product-card.css`](../../styles/components/product-card.css).
