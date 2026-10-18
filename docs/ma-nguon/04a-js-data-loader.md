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

`loadCatalog()` tải các file sản phẩm của từng `category.id` (bỏ `all`) song song rồi ghép sản phẩm lại theo thứ tự danh mục. Nếu thêm danh mục mới, cần thêm JSON đúng tên vào `data/products/`.


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
  const files = await Promise.all(
    productCategories.map(async (category) => ({
      categoryId: category.id,
      products: (await getJson(`products/${category.id}.json`)).products
    }))
  );

  const products = [];
  for (const file of files) {
    for (const product of file.products) {
      products.push({ ...product, category: file.categoryId });
    }
  }

  return { categories, products };
}
```

- Lấy danh sách danh mục và bỏ mục đặc biệt `all`, vì mục này không có file sản phẩm.
- `Promise.all(...)` tải các file danh mục song song để trang không phải chờ từng file lần lượt.
- `categoryId` ghi nhớ danh mục của mỗi file. Vì vậy, không cần lặp trường `category` trong từng món JSON.
- Hai vòng `for` ghép các món lại với nhau. Khi đưa món vào danh sách, mã danh mục được thêm vào để các trang hiện có tiếp tục hoạt động như trước.
- Kết quả trả về có danh sách danh mục và toàn bộ món.

Tìm một sản phẩm:

```js
export async function findProduct(productId) {
  const catalog = await loadCatalog();
  return catalog.products.find((product) => product.id === productId) || null;
}
```

`.find(...)` trả món đầu tiên có `id` trùng. Nếu không có kết quả thì trả `null`; trang chi tiết dùng trường hợp này để hiện “Không tìm thấy món”. Cách hiện tại tải toàn catalog rồi mới tìm; với thực đơn rất lớn có thể cân nhắc API tìm theo mã hoặc file index riêng.
