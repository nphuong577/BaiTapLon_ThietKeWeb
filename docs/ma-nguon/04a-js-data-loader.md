# JavaScript core: data-loader.js

#### [`js/core/data-loader.js`](../../js/core/data-loader.js) — tải các JSON

| Hàm | Đầu vào → kết quả | Dùng lúc nào |
|---|---|---|
| `getJson(path)` | Đường dẫn tương đối trong `data/` → nội dung JSON | Hàm nội bộ dùng chung; báo lỗi nếu máy chủ trả về trạng thái không thành công |
| `loadSiteData()` | Không có → dữ liệu `site.json` | Trang chủ cần banner/nhãn hiệu |
| `loadPromotions()` | Không có → dữ liệu `promotions.json` | Trang chủ cần carousel khuyến mãi |
| `loadDiscountRules()` | Không có → mảng `rules` | Trang đặt hàng cần tính mức giảm |
| `loadCatalog()` | Không có → `{ categories, products }` | Thực đơn và trang chủ cần danh mục/món |
| `findProduct(productId)` | Mã món → món tìm được hoặc `null` | Trang chi tiết cần lấy dữ liệu cho một mã món |

`loadCatalog()` lấy từng file sản phẩm theo `category.id` (bỏ `all`) rồi ghép tất cả sản phẩm lại. Nếu thêm danh mục mới, cần thêm JSON đúng tên vào `data/products/`.


### 9.4. `js/core/data-loader.js`: tải JSON và gom catalog

```js
const DATA_ROOT = new URL("../../data/", import.meta.url);

async function getJson(path) {
  const response = await fetch(new URL(path, DATA_ROOT));
  if (!response.ok) throw new Error(`Không thể tải ${path} (${response.status})`);
  return response.json();
}
```

- `import.meta.url` là địa chỉ của chính module; từ đó tạo `DATA_ROOT` trỏ về thư mục `data/`. Cách này không phụ thuộc vào trang nào đang gọi hàm.
- `async` cho biết hàm làm việc bất đồng bộ: trình duyệt cần thời gian tải file.
- `fetch(...)` yêu cầu trình duyệt lấy file qua HTTP.
- `response.ok` kiểm tra máy chủ có trả kết quả thành công không. Nếu không, `throw new Error(...)` báo lỗi cho hàm gọi xử lý.
- `response.json()` đọc phần thân phản hồi và chuyển JSON thành object/list JS.

Các hàm tải từng loại dữ liệu:

```js
export async function loadSiteData() {
  return getJson("site.json");
}

export async function loadPromotions() {
  return getJson("promotions.json");
}

export async function loadDiscountRules() {
  const data = await getJson("discounts.json");
  return data.rules;
}
```

- `export` cho phép các tệp khác dùng hàm qua `import`.
- `await` đợi tải xong trước khi đọc `data.rules`.
- Hai hàm đầu trả nguyên object JSON; hàm giảm giá chỉ trả riêng danh sách `rules`.

Gom sản phẩm từ các file danh mục:

```js
export async function loadCatalog() {
  const { categories } = await getJson("categories.json");
  const productCategories = categories.filter((category) => category.id !== "all");
  const products = [];

  for (const category of productCategories) {
    const data = await getJson(`products/${category.id}.json`);
    products.push(...data.products);
  }

  return { categories, products };
}
```

- `const { categories } = ...` lấy trường `categories` từ object JSON.
- `.filter(...)` tạo danh sách mới, bỏ danh mục đặc biệt `all`.
- `for ... of` lần lượt đi qua từng danh mục.
- Template string `` `products/${category.id}.json` `` tạo tên file, ví dụ `products/chicken.json`.
- `products.push(...data.products)` ghép từng món vào danh sách chung. Dấu `...` trải các phần tử trong mảng, không đưa nguyên mảng thành một phần tử lồng.
- Kết quả trả về có cả danh sách danh mục lẫn toàn bộ món.

Tìm một sản phẩm:

```js
export async function findProduct(productId) {
  const catalog = await loadCatalog();
  return catalog.products.find((product) => product.id === productId) || null;
}
```

`.find(...)` trả món đầu tiên có `id` trùng. Nếu không có kết quả thì trả `null`; trang chi tiết dùng trường hợp này để hiện “Không tìm thấy món”. Cách hiện tại tải toàn catalog rồi mới tìm; với thực đơn rất lớn có thể cân nhắc API tìm theo mã hoặc file index riêng.

