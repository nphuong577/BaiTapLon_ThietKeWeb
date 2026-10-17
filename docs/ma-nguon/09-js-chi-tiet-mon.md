# JavaScript trang chi tiết món

#### [`js/pages/product.js`](../../js/pages/product.js) — chi tiết món

| Hàm | Tác dụng |
|---|---|
| `init()` | Đọc mã `id` từ URL, thiết lập menu và số giỏ, tìm món, cập nhật tiêu đề/đường dẫn và gắn bộ tùy chỉnh; nếu mã sai hoặc tải lỗi thì hiện thông báo phù hợp |

Ví dụ đường dẫn: `pages/product.html?id=chicken-burger`. Trang này dùng lại `customizerMarkup()` và `bindCustomizer()`.


### 9.12. `js/pages/product.js`: chi tiết theo `id` trên URL

```js
const container = document.querySelector("#product-detail");
const productId = new URLSearchParams(location.search).get("id");
```

Trang đọc phần sau `?id=`. Ví dụ `product.html?id=couple-combo` thì `productId` là `"couple-combo"`.

`init()` gọi `findProduct(productId)`. Nếu không có mã hoặc không tìm thấy món, hàm điền thông báo và dừng bằng `return`. Nếu có món:

1. Đổi tiêu đề tab bằng `document.title`.
2. Đổi tên trên breadcrumb bằng `textContent`.
3. Tạo bộ tùy chỉnh bằng `customizerMarkup(product)`.
4. Gắn hành vi bằng `bindCustomizer(container, product)`.

Toàn bộ thao tác tải nằm trong `try/catch`. Khi tải lỗi, trang hiện thông báo local server và ghi lỗi thật vào Console.

