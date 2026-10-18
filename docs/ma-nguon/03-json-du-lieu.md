# JSON: dữ liệu website

## 3. JSON: dữ liệu website

JSON là định dạng văn bản để lưu dữ liệu có cấu trúc. Trong dự án, JSON **không chứa mã chạy**; JS đọc JSON rồi dựng giao diện.

### Danh sách các tệp JSON

| Tệp | Nội dung | JS đọc ở đâu |
|---|---|---|
| [`data/categories.json`](../../data/categories.json) | Danh sách và tên danh mục thực đơn | `loadCatalog()` |
| [`data/products/chicken.json`](../../data/products/chicken.json) | Các món gà rán | `loadCatalog()` |
| [`data/products/rice-noodle.json`](../../data/products/rice-noodle.json) | Cơm và mì Ý | `loadCatalog()` |
| [`data/products/burger.json`](../../data/products/burger.json) | Burger | `loadCatalog()` |
| [`data/products/combo.json`](../../data/products/combo.json) | Combo | `loadCatalog()` |
| [`data/products/side.json`](../../data/products/side.json) | Món phụ | `loadCatalog()` |
| [`data/products/dessert.json`](../../data/products/dessert.json) | Tráng miệng | `loadCatalog()` |
| [`data/products/drink.json`](../../data/products/drink.json) | Thức uống | `loadCatalog()` |
| [`data/site.json`](../../data/site.json) | Tên/tagline thương hiệu và banner trang chủ | `loadSiteData()` |
| [`data/promotions.json`](../../data/promotions.json) | Carousel khuyến mãi và thời gian tự chạy | `loadPromotions()` |
| [`data/discounts.json`](../../data/discounts.json) | Mức giảm theo giá trị đơn hàng | `loadDiscountRules()` |

Hướng dẫn thao tác dữ liệu từng bước có tại [`quan-ly-du-lieu.md`](../quan-ly-du-lieu.md). Tài liệu này giải thích thêm cách dữ liệu được dùng trong mã nguồn.

### Quy tắc cú pháp JSON

| Viết đúng | Ý nghĩa |
|---|---|
| `"name": "Gà rán"` | Chuỗi chữ nằm trong dấu ngoặc kép |
| `"price": 69000` | Số tiền là số, không có dấu ngoặc kép và không có dấu phân cách hàng nghìn |
| `true` | Giá trị đúng/sai viết thường, không đặt trong dấu ngoặc kép |
| `"maxOrder": null` | Không có giá trị/không giới hạn trên |
| `{"id":"chicken","name":"Gà"}` | Một object có các trường |
| `[{"id":"a"},{"id":"b"}]` | Một danh sách (array) chứa nhiều object |

- Các trường trong cùng object phải ngăn bằng dấu phẩy.
- Giữa hai phần tử của danh sách phải có dấu phẩy.
- Phần tử cuối cùng **không** có dấu phẩy theo sau.
- Tên trường và chuỗi đều phải dùng dấu ngoặc kép `"..."`, không dùng nháy đơn.
- JSON không hỗ trợ chú thích `//` hoặc `/* ... */`.

### Cấu trúc một sản phẩm

Mỗi file danh mục có dạng `{ "products": [...] }`. Mỗi phần tử trong `products` là một món:

| Trường | Bắt buộc? | Dùng làm gì? | Lưu ý |
|---|---:|---|---|
| `id` | Có | Mã ổn định dùng để tìm món, tạo URL và nhận diện trong giỏ | Duy nhất; nên viết thường, không dấu, cách từ bằng `-` |
| `name` | Có | Tên món hiển thị | Chữ có dấu được phép |
| `price` | Có | Giá cơ bản, đơn vị đồng | Viết số nguyên, ví dụ `69000` |
| `image` | Có | Đường dẫn ảnh tính từ thư mục gốc dự án | Ví dụ `assets/images/.../fried-chicken.jpg` |
| `description` | Có | Mô tả ngắn | Hiển thị ở thẻ món và phần chi tiết |
| `tag` | Có | Nhãn như “Bán chạy”, “Món mới” | Hiển thị trên ảnh thẻ |
| `options.size` | Có | Các lựa chọn phần/size và giá cộng thêm | Có ít nhất một lựa chọn; lựa chọn đầu tiên được chọn mặc định |
| `options.spice` | Với món có thể chọn độ cay | Các mức độ cay | Không khai báo cho `drink` và `dessert` |
| `options.drink` | Có | Lựa chọn nước kèm và giá cộng thêm | Có ít nhất một lựa chọn; món không kèm nước dùng `none` với giá cộng 0 |

Danh mục của món được xác định bằng tên file. Ví dụ, món trong `chicken.json` tự thuộc danh mục `chicken`.

Các lựa chọn `size` và `drink` là object có `id`, `name`, `extraPrice`. `spice` là danh sách chuỗi. Giá tùy chọn được cộng vào giá gốc:

```text
giá một phần = price + size.extraPrice + drink.extraPrice
tổng dòng giỏ = giá một phần × quantity
```

`category.id` vừa là mã lọc, vừa được dùng để tạo đường dẫn `data/products/<id>.json`. Không tạo file cho danh mục đặc biệt `all`.

### Cấu trúc các JSON khác

| JSON | Các trường | Tác dụng |
|---|---|---|
| `categories.json` | `categories`: danh sách `{ id, name }` | `id` dùng trong URL/lọc và để tìm file sản phẩm; thứ tự danh sách là thứ tự nút lọc |
| `site.json` | `brand.name`, `brand.tagline`, `banners[]` | Mỗi banner có `image` và `alt`; `alt` mô tả ảnh cho trình đọc màn hình |
| `promotions.json` | `autoplayMs`, `promotions[]` | Mỗi khuyến mãi có `id`, `label`, `title`, `description`, `buttonText`, `link`, `image`, `theme` |
| `discounts.json` | `rules[]` | Mỗi luật có `id`, `minOrder`, `maxOrder`, `discountPercent`, `maxDiscount` |

Quy tắc giảm giá được xét theo thứ tự trong mảng. Với một luật phù hợp, số tiền giảm là phần trăm của tạm tính nhưng không vượt `maxDiscount`. `maxOrder: null` nghĩa là không có mức trần. Mức giảm được tính trên tiền món; phí giao hàng được cộng sau đó. Mốc phí giao hàng hiện nằm trong JS: đơn dưới 250.000 ₫ chịu phí 25.000 ₫, còn đơn từ 250.000 ₫ được miễn phí.

---


### 9.1. `data/categories.json`: danh sách danh mục

Ví dụ cấu trúc đang dùng:

```json
{
  "categories": [
    { "id": "all", "name": "Tất cả" },
    { "id": "chicken", "name": "Gà rán" },
    { "id": "rice-noodle", "name": "Cơm & Mì Ý" }
  ]
}
```

Giải thích:

- `{ ... }` là một object; `categories` là tên trường.
- `[ ... ]` là một danh sách. Mỗi `{ "id", "name" }` bên trong là một danh mục.
- `id` là mã máy dùng để tìm file JSON, lọc món và tạo URL. Ví dụ `chicken` nghĩa là bộ nạp sẽ tìm `data/products/chicken.json`.
- `name` là chữ người dùng nhìn thấy trên nút lọc.
- `all` là mục đặc biệt “Tất cả”, không cần file `all.json`; `loadCatalog()` bỏ qua mục này khi tìm dữ liệu sản phẩm.
- Muốn đổi tên hiển thị thì sửa `name`. Muốn thêm danh mục mới thì phải đồng thời thêm file món trùng `id`.

### 9.2. `data/products/chicken.json`: một món và các lựa chọn

Đây là ví dụ rút gọn dựa theo món gà hiện có:

```json
{
  "products": [
    {
      "id": "fried-chicken",
      "name": "Gà rán giòn vui vẻ",
      "price": 69000,
      "image": "assets/images/NguyenThiThuyDuong_251230832/fried-chicken.jpg",
      "description": "Gà tẩm ướp đậm đà, vỏ giòn rụm và thịt mềm mọng.",
      "tag": "Bán chạy",
      "options": {
        "size": [
          { "id": "regular", "name": "1 miếng", "extraPrice": 0 },
          { "id": "large", "name": "2 miếng", "extraPrice": 33000 }
        ],
        "spice": ["Không cay", "Cay vừa", "Cay nhiều"],
        "drink": [
          { "id": "none", "name": "Không chọn", "extraPrice": 0 },
          { "id": "cola", "name": "Cola vừa", "extraPrice": 10000 }
        ]
      }
    }
  ]
}
```

Đi theo dữ liệu từ trên xuống:

1. `products` là danh sách món trong file; có thể đặt nhiều object món trong cùng danh sách.
2. `id` giúp tìm món chi tiết qua URL. Không nên đổi mã đã được tham chiếu bởi khuyến mãi hoặc dữ liệu giỏ cũ.
3. `price` là giá cơ bản 69.000 đồng. Số tiền không viết dấu chấm để JSON và phép tính hiểu đúng.
4. `image` là đường dẫn tương đối từ thư mục gốc website; không phải đường dẫn đầy đủ trên máy tính của bạn.
5. `options.size` cho biết khách chọn phần thường hoặc phần lớn. Chọn phần lớn cộng thêm 33.000 đồng.
6. `options.spice` là các nhãn độ cay. Chúng không làm đổi giá trong mã hiện tại.
7. `options.drink` cho biết các lựa chọn nước và tiền cộng thêm.
8. `extraPrice: 0` nghĩa là không cộng tiền. Phần chọn đầu tiên trong mỗi nhóm mặc định được chọn.

Khi chọn gà 2 miếng và cola, phép tính trong bộ tùy chỉnh là:

```text
69.000 + 33.000 + 10.000 = 112.000 đồng một phần
```

Sau đó nhân với số lượng. Bản thân JSON chỉ khai báo giá; công thức cộng và nhân được viết trong `product-customizer.js`.

### 9.3. `data/site.json`, `data/promotions.json`, `data/discounts.json`

Ví dụ banner:

```json
{
  "brand": { "name": "FARMY", "tagline": "Giòn vui mỗi ngày" },
  "banners": [
    {
      "image": "assets/images/MaiPhuongDung_251230824/best1.png",
      "alt": "Ưu đãi combo tại FARMY"
    }
  ]
}
```

- `banners` là danh sách ảnh đầu trang; thêm một object để thêm banner.
- `alt` là mô tả bằng chữ, trình đọc màn hình có thể đọc thay cho hình ảnh.
- `renderSlider()` trong `home.js` tạo thẻ `<img>` từ các trường này.

Ví dụ một khuyến mãi:

```json
{
  "id": "family-saving",
  "label": "Combo gia đình",
  "title": "Càng đông càng vui",
  "description": "Combo gà rán, mì Ý và nước ngọt.",
  "buttonText": "Xem combo",
  "link": "pages/products.html?category=combo",
  "image": "assets/images/NguyenThiThuyDuong_251230832/family-combo.jpg",
  "theme": "yellow"
}
```

- `link` quyết định nút dẫn tới đâu; đường dẫn category và mã sản phẩm phải còn tồn tại.
- `theme` được CSS đọc từ `data-theme`; hiện CSS có kiểu `yellow`, `peach`, `cream`, `red`.
- Thời gian chuyển carousel nằm ở `autoplayMs`, đơn vị mili giây: 5000 là 5 giây; 0 tắt tự chạy.

Ví dụ luật giảm giá:

```json
{
  "id": "tier-250",
  "minOrder": 250000,
  "maxOrder": 399999,
  "discountPercent": 10,
  "maxDiscount": 30000
}
```

Với tạm tính 300.000 đồng, 10% bằng 30.000 đồng, đúng bằng trần nên được giảm 30.000 đồng. Với tạm tính 390.000 đồng cùng luật này, 10% là 39.000 đồng nhưng trần chỉ 30.000 nên chỉ giảm 30.000. Các luật cần xếp tăng dần và không để khoảng giá chồng nhau.
