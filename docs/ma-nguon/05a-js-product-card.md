# JavaScript component: product-card.js

#### [`js/components/product-card.js`](../../js/components/product-card.js)

| Hàm | Đầu vào → kết quả | Tác dụng |
|---|---|---|
| `productCard(product, pagePrefix = "pages/", showOrder = true)` | Món, tiền tố đường dẫn trang, kiểu nút → HTML dạng chuỗi | Tạo thẻ món có ảnh, tag, tên, mô tả và giá. Nút “Chọn món” có `data-order-id`; nếu `showOrder` tắt, hiện liên kết xem chi tiết |

`pagePrefix` cần đúng với nơi gọi: trang chủ nằm ở thư mục gốc nên dùng `"pages/"`; trang danh sách nằm trong `pages/` nên dùng `""`.


### 9.7. `js/components/product-card.js`: tạo thẻ món

```js
export function productCard(product, pagePrefix = "pages/", showOrder = true) {
  return `
    <article class="product-card">
      <a class="product-image-wrap" href="${pagePrefix}product.html?id=${encodeURIComponent(product.id)}">
        <img src="${assetUrl(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy" />
        <span class="tag">${escapeHtml(product.tag)}</span>
      </a>
      <div class="product-body">
        <h3><a href="${pagePrefix}product.html?id=${encodeURIComponent(product.id)}">${escapeHtml(product.name)}</a></h3>
        <p>${escapeHtml(product.description)}</p>
        <div class="product-footer">
          <strong class="price">${formatPrice(product.price)}</strong>
          ${showOrder
            ? `<button class="order-button" type="button" data-order-id="${escapeHtml(product.id)}">Chọn món</button>`
            : `<a class="order-button" href="${pagePrefix}product.html?id=${encodeURIComponent(product.id)}">Xem chi tiết</a>`}
        </div>
      </div>
    </article>`;
}
```

- `product` là object món từ JSON.
- `pagePrefix` giúp cùng một hàm tạo link đúng từ trang gốc (`pages/`) hoặc trang con (`""`).
- `encodeURIComponent(product.id)` mã hóa mã món để an toàn khi đặt trong URL.
- `assetUrl`, `escapeHtml`, `formatPrice` xử lý lần lượt đường dẫn ảnh, chữ và giá.
- `loading="lazy"` đề nghị trình duyệt chỉ tải ảnh khi gần xuất hiện, giúp trang danh sách nhẹ hơn.
- Khi `showOrder` đúng, tạo nút có `data-order-id`; `products.js` tìm nút này để mở hộp chọn món.
- Khi sai, tạo link xem trang chi tiết thay vì nút thêm món nhanh.

