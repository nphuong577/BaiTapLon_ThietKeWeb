# JavaScript core: `js/core/utils.js`

Tệp nguồn: [`utils.js`](../../js/core/utils.js). Đây là nhóm hàm nhỏ, dùng lại ở nhiều trang; nó không biết sản phẩm cụ thể là gì.

## Đường dẫn gốc và bộ đếm toast

```js
const ROOT_URL = new URL("../../", import.meta.url);
let toastTimer;
```

- `import.meta.url` là địa chỉ của file `utils.js`.
- `new URL("../../", ...)` đi ngược từ `js/core/` về thư mục gốc website.
- `toastTimer` giữ mã đồng hồ để lần thông báo mới có thể hủy lần cũ.

## `formatPrice(value)`

```js
export function formatPrice(value) {
  return `${Number(value).toLocaleString("vi-VN")} ₫`;
}
```

Ví dụ `formatPrice(69000)` tạo chữ `69.000 ₫`. `Number()` chuyển đầu vào sang số; `toLocaleString("vi-VN")` áp dụng cách phân nhóm số theo vùng Việt Nam. Hàm chỉ định dạng, không tính giá hoặc xác minh đầu vào.

## `assetUrl(path)`

```js
export const assetUrl = (path) => new URL(path, ROOT_URL).href;
```

Nhận đường dẫn từ gốc dự án như `assets/images/...jpg`, ghép thành URL đầy đủ. Nhờ đó ảnh không bị tìm tương đối từ trang con như `/pages/`.

## `escapeHtml(value)`

```js
export function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  })[character]);
}
```

Hàm đổi năm ký tự có thể làm thay đổi cách hiểu HTML thành dạng hiển thị chữ. Giá trị mặc định là chuỗi rỗng; `String(value)` giúp xử lý cả số hoặc giá trị khác chuỗi. Nên dùng với dữ liệu được chèn vào nội dung HTML; khi chỉ cập nhật văn bản thuần, ưu tiên `textContent`.

## `showToast(message)`

```js
export function showToast(message) {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}
```

1. Tìm phần tử `#toast`; nếu trang không có nó thì kết thúc.
2. Đặt thông báo bằng `textContent` (không diễn giải như HTML).
3. Thêm class `show` để CSS hiện toast.
4. Hủy timer cũ, rồi đặt timer mới để ẩn sau 2.200 mili giây.

## `setupMobileNav()`

```js
export function setupMobileNav() {
  const button = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  button?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
}
```

`?.` gọi `addEventListener` chỉ khi nút tồn tại. Khi bấm, class `open` được bật/tắt; CSS header hiện/ẩn menu theo class này. `String(isOpen)` chuyển boolean thành chữ `"true"`/`"false"` cho thuộc tính trợ năng. Mã giả định nếu có `.nav-toggle` thì `.main-nav` cũng tồn tại.

### Khi nào dùng file này?

- Đổi cách hiển thị giá chung: `formatPrice`.
- Đổi cách dựng URL ảnh: `assetUrl`.
- Hiện thông báo nhỏ: `showToast`.
- Sửa hành vi menu điện thoại: `setupMobileNav`.
- Thêm hàm dùng ở nhiều trang: cân nhắc đặt ở đây nếu đó là tiện ích chung, không chứa logic riêng của giỏ/checkout.
