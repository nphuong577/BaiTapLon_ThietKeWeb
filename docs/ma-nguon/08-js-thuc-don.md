# JavaScript trang thực đơn

#### [`js/pages/products.js`](../../js/pages/products.js) — thực đơn

| Hàm | Tác dụng |
|---|---|
| `normalize(value)` | Bỏ dấu tiếng Việt và chuyển về chữ thường để tìm kiếm dễ hơn |
| `filteredProducts()` | Kết hợp bộ lọc danh mục và nội dung tìm kiếm tên/mô tả |
| `renderProducts()` | Vẽ các thẻ món, số kết quả, tiêu đề danh mục hoặc trạng thái không tìm thấy |
| `renderTabs()` | Tạo nút lọc từ danh mục; khi chọn, cập nhật URL và vẽ lại thực đơn |
| `openCustomizer(productId)` | Tìm món theo mã, tạo hộp tùy chỉnh và mở dialog |
| `init()` | Gắn menu, giỏ, dialog và ô tìm kiếm; tải catalog; kiểm tra danh mục trên URL hợp lệ rồi dựng trang |

Chọn danh mục cập nhật query string `?category=...` bằng `history.replaceState()`. Khi tải trang, trạng thái lọc ban đầu được đọc từ URL.


### 9.11. `js/pages/products.js`: tìm, lọc và chọn món

```js
const state = {
  products: [],
  categories: [],
  category: new URLSearchParams(location.search).get("category") || "all",
  search: ""
};
```

`URLSearchParams` đọc tham số sau dấu `?`. Ví dụ `?category=combo` sẽ mở thực đơn ở danh mục combo. Nếu URL không có category thì dùng `all`. `search` ban đầu rỗng.

```js
function normalize(value) {
  return value.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("vi");
}

function filteredProducts() {
  const query = normalize(state.search.trim());
  return state.products.filter((product) =>
    (state.category === "all" || product.category === state.category) &&
    (!query || normalize(`${product.name} ${product.description}`).includes(query))
  );
}
```

- `trim()` bỏ khoảng trắng đầu/cuối.
- `normalize("NFD")` tách dấu khỏi chữ; biểu thức chính quy xóa các dấu kết hợp.
- Chuyển chữ thường để tìm không phân biệt hoa/thường.
- `.filter()` giữ món thuộc danh mục đang chọn và có tên hoặc mô tả chứa từ khóa.

`renderProducts()` gọi `filteredProducts()`, sau đó vẽ thẻ hoặc trạng thái trống. Hàm cũng cập nhật số kết quả, tiêu đề category và gắn sự kiện cho mỗi nút `[data-order-id]`. Do nội dung được tạo mới mỗi lần tìm/lọc, sự kiện nút cũng phải gắn lại sau khi render.

```js
function renderProducts() {
  const products = filteredProducts();
  grid.innerHTML = products.length
    ? products.map((product) => productCard(product, "")).join("")
    : `<div class="empty-state">
         <strong>Không tìm thấy sản phẩm phù hợp.</strong>
         <p>Hãy thử từ khóa hoặc danh mục khác.</p>
       </div>`;
  document.querySelector("#result-count").textContent =
    `${products.length} sản phẩm`;
  document.querySelector("#catalog-title").textContent =
    state.categories.find((category) => category.id === state.category)?.name
    || "Tất cả sản phẩm";
  grid.querySelectorAll("[data-order-id]").forEach((button) =>
    button.addEventListener("click", () =>
      openCustomizer(button.dataset.orderId)));
}
```

`productCard(product, "")` dùng tiền tố rỗng vì trang hiện tại đã ở thư mục `pages/`. Nếu dùng tiền tố `"pages/"` ở đây, trình duyệt sẽ tìm nhầm `pages/pages/product.html`.

`renderTabs()` tạo nút từ danh sách category. Khi bấm nút, nó cập nhật `state.category`, sửa query string bằng `history.replaceState()` (không tải lại trang), rồi gọi lại `renderTabs()` và `renderProducts()` để giao diện đồng bộ.

```js
function renderTabs() {
  tabs.innerHTML = state.categories.map((category) =>
    `<button type="button"
      class="${category.id === state.category ? "active" : ""}"
      data-category="${category.id}">${category.name}</button>`
  ).join("");

  tabs.querySelectorAll("button").forEach((button) =>
    button.addEventListener("click", () => {
      state.category = button.dataset.category;
      const url = new URL(location.href);
      if (state.category === "all") url.searchParams.delete("category");
      else url.searchParams.set("category", state.category);
      history.replaceState({}, "", url);
      renderTabs();
      renderProducts();
    }));
}
```

`new URL(location.href)` tạo bản URL có thể chỉnh sửa. `searchParams.set()` ghi category mới; `delete()` bỏ tham số khi trở về “Tất cả”. `replaceState()` thay URL hiện tại mà không tải lại hoặc thêm một mục mới vào lịch sử Back/Forward.

```js
function openCustomizer(productId) {
  const product = state.products.find((item) => item.id === productId);
  if (!product) return;
  document.querySelector("#dialog-content").innerHTML =
    customizerMarkup(product);
  bindCustomizer(dialog, product, () => dialog.close());
  dialog.showModal();
}
```

Tìm món trong catalog đang có, tạo nội dung hộp thoại, kết nối các nút bằng `bindCustomizer()`, rồi mở `<dialog>`. Callback đóng hộp thoại sau khi thêm món.

`init()` gắn sự kiện cho menu, giỏ, nút đóng, bấm ra ngoài dialog và ô tìm kiếm. Sau khi tải catalog, hàm xác thực category từ URL; nếu mã không hợp lệ sẽ dùng `all`. Nếu tải dữ liệu lỗi, trang hiển thị thông báo thay cho lưới món.

```js
async function init() {
  setupMobileNav();
  setupCartDrawer();
  dialog.querySelector(".dialog-close")
    .addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
  document.querySelector("#search-input").addEventListener("input", (event) => {
    state.search = event.target.value;
    renderProducts();
  });

  try {
    const catalog = await loadCatalog();
    state.products = catalog.products;
    state.categories = catalog.categories;
    if (!state.categories.some((category) => category.id === state.category)) {
      state.category = "all";
    }
    renderTabs();
    renderProducts();
  } catch (error) {
    grid.innerHTML = `<div class="empty-state">
      <strong>Không tải được dữ liệu.</strong>
      <p>Hãy chạy website qua local server.</p>
    </div>`;
    console.error(error);
  }
}
```

`event.target === dialog` chỉ đóng khi bấm đúng vùng nền của dialog, không đóng khi bấm nội dung bên trong. Mỗi lần nhập, `state.search` được đổi và kết quả vẽ lại ngay. `some()` kiểm tra URL có mã category hợp lệ hay không. `catch` ghi lỗi kỹ thuật vào Console và hiện lời nhắc dễ hiểu cho khách.
