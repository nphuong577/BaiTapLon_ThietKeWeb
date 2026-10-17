# Hướng dẫn đổi, thêm, sửa và xóa dữ liệu

## 1. Bản đồ các file dữ liệu

| Nội dung | File cần sửa |
| --- | --- |
| Tên category và thứ tự category | `data/categories.json` |
| Sản phẩm | `data/products/<category-id>.json` |
| Khuyến mãi carousel | `data/promotions.json` |
| Mốc giảm giá | `data/discounts.json` |
| Tên thương hiệu và banner lớn đầu trang | `data/site.json` |
| Thông tin chuyển khoản demo | `pages/checkout.html`, khối `id="bank-transfer"` |

Sau khi sửa JSON, nên kiểm tra file bằng lệnh:

```bash
jq . data/ten-file.json
```

Nếu lệnh báo lỗi, thường là do thiếu dấu phẩy, thừa dấu phẩy cuối hoặc thiếu dấu ngoặc.

## 2. Quy tắc chung khi sửa JSON

- Chuỗi phải nằm trong dấu nháy kép: `"Tên món"`.
- Số tiền viết dạng số: `69000`, không viết `"69.000"`.
- Boolean chỉ dùng `true` hoặc `false`, không đặt trong dấu nháy.
- `null` không đặt trong dấu nháy.
- Hai object liền nhau phải có dấu phẩy ở giữa.
- Object cuối cùng trong mảng không có dấu phẩy phía sau.
- `id` không được trùng, nên viết chữ thường, không dấu và nối từ bằng `-`.

## 3. Quản lý category

### Thêm category

1. Mở `data/categories.json`.
2. Thêm object mới vào mảng `categories`:

```json
{ "id": "salad", "name": "Salad" }
```

3. Tạo file `data/products/salad.json`:

```json
{
  "products": []
}
```

Tên file bắt buộc giống `id`. Category `all` là category đặc biệt cho bộ lọc “Tất cả”, không tạo file `all.json`.

### Đổi tên category

Chỉ sửa trường `name` nếu muốn đổi chữ hiển thị. Không cần sửa sản phẩm.

### Đổi `id` category

Nếu đổi `id`, phải thực hiện đủ ba việc: đổi `id` trong `categories.json`, đổi tên file sản phẩm, đổi trường `category` của mọi sản phẩm trong file đó.

### Xóa category

Xóa object trong `categories.json`, sau đó xóa hoặc lưu trữ file sản phẩm tương ứng. Kiểm tra không cò liên kết `?category=<id-cu>` trong HTML hoặc JSON khuyến mãi.

## 4. Quản lý sản phẩm

### Thêm sản phẩm

Mở file category phù hợp trong `data/products/` và thêm object:

```json
{
  "id": "chicken-cheese",
  "name": "Gà rán phô mai",
  "category": "chicken",
  "price": 75000,
  "image": "assets/images/products/chicken-cheese.jpg",
  "description": "Gà rán giòn phủ sốt phô mai béo nhẹ.",
  "tag": "Món mới",
  "featured": false,
  "options": {
    "size": [
      { "id": "regular", "name": "1 miếng", "extraPrice": 0 },
      { "id": "large", "name": "2 miếng", "extraPrice": 35000 }
    ],
    "spice": ["Không cay", "Cay vừa"],
    "drink": [
      { "id": "none", "name": "Không chọn", "extraPrice": 0 },
      { "id": "cola", "name": "Cola vừa", "extraPrice": 10000 }
    ]
  }
}
```

Giải thích trường:

- `id`: dùng trong URL chi tiết sản phẩm và giỏ hàng.
- `name`: tên hiển thị.
- `category`: phải khớp category và tên file.
- `price`: giá gốc chưa gồm phần nâng cấp.
- `image`: đường dẫn từ thư mục gốc dự án.
- `description`: mô tả ngắn.
- `tag`: nhãn trên ảnh sản phẩm.
- `featured`: dữ liệu dự phòng để đánh dấu món nổi bật.
- `options.size`: size và tiền cộng thêm.
- `options.spice`: các mức cay.
- `options.drink`: thức uống và tiền cộng thêm.

Mỗi nhóm `size`, `spice`, `drink` phải có ít nhất một lựa chọn. Nếu món không có độ cay, dùng `"spice": ["Không cay"]`. Nếu không có nước, tạo lựa chọn `none` với `extraPrice: 0`.

### Sửa sản phẩm

- Đổi giá: sửa `price`.
- Đổi tiền nâng size/nước: sửa `extraPrice`.
- Đổi ảnh: chép ảnh mới vào `assets/images/`, rồi sửa `image`.
- Đổi tên/mô tả/nhãn: sửa `name`, `description`, `tag`.
- Chuyển category: chuyển cả object sang file category mới và sửa `category`.

Không nên đổi `id` của sản phẩm đã được dùng trong khuyến mãi. Nếu bắt buộc đổi, tìm và sửa mọi link dạng `product.html?id=<id-cu>`.

### Xóa sản phẩm

Xóa toàn bộ object khỏi mảng `products`, sửa dấu phẩy của object đứng trước/sau, rồi kiểm tra `data/promotions.json` không cò link tới sản phẩm đã xóa.

Trang chủ tự hiển thị tối đa hai sản phẩm đầu tiên của mỗi category. Muốn đổi món xuất hiện trên trang chủ, chỉ cần đổi thứ tự object trong file category.

## 5. Quản lý carousel khuyến mãi

File `data/promotions.json` gồm thời gian tự chuyển và danh sách slide:

```json
{
  "autoplayMs": 5000,
  "promotions": []
}
```

### Đổi thời gian tự chuyển

- `5000`: chuyển sau 5 giây.
- `8000`: chuyển sau 8 giây.
- `0`: tắt tự động chuyển.

Giá trị tính bằng mili-giây. Carousel tự bắt đầu lại sau khi bấm mũi tên hoặc dấu chấm, và tạm dừng khi đưa chuột vào slide.

### Thêm khuyến mãi

```json
{
  "id": "new-promotion",
  "label": "Ưu đãi mới",
  "title": "Tiêu đề khuyến mãi",
  "description": "Mô tả ngắn.",
  "buttonText": "Xem ngay",
  "link": "pages/products.html?category=combo",
  "image": "assets/images/promotions/promotion.jpg",
  "theme": "yellow"
}
```

`theme` nhận một trong bốn giá trị: `yellow`, `peach`, `red`, `cream`. `link` có thể dẫn tới category hoặc sản phẩm chi tiết.

Muốn sửa khuyến mãi, thay nội dung các trường tương ứng. Muốn đổi thứ tự slide, đổi vị trí object trong mảng. Muốn xóa, xóa toàn bộ object và sửa dấu phẩy.

## 6. Quản lý mốc giảm giá

Mỗi rule trong `data/discounts.json` gồm:

```json
{
  "id": "tier-250",
  "minOrder": 250000,
  "maxOrder": 399999,
  "discountPercent": 10,
  "maxDiscount": 30000
}
```

- `minOrder`: giá trị món tối thiểu.
- `maxOrder`: giá trị món tối đa; dùng `null` cho mốc cuối không giới hạn.
- `discountPercent`: phần trăm giảm.
- `maxDiscount`: số tiền giảm tối đa.

Công thức: `min(tạm tính × phần trăm / 100, giảm tối đa)`. Các khoảng không được chồng lấn, ví dụ `150000-249999`, `250000-399999`, rồi `400000-null`. Sắp xếp rule từ mốc thấp đến cao.

Muốn tắt một mốc, xóa object đó. Muốn tắt toàn bộ giảm giá, để `"rules": []`.

## 7. Đổi banner đầu trang

Mở `data/site.json`, sửa các object trong `banners`:

```json
{
  "image": "assets/images/banner/banner-moi.jpg",
  "alt": "Mô tả ảnh banner"
}
```

Thêm, sửa, xóa hoặc đổi thứ tự object tương tự carousel khuyến mãi. `alt` cần mô tả ngắn nội dung ảnh để hỗ trợ accessibility.

## 8. Kiểm tra sau khi thay dữ liệu

1. Chạy `python3 -m http.server 8080` tại thư mục gốc.
2. Mở `http://localhost:8080/`.
3. Kiểm tra trang chủ, trang sản phẩm, chi tiết sản phẩm, giỏ hàng và thanh toán.
4. Mở DevTools → Console để kiểm tra lỗi JSON hoặc đường dẫn ảnh.
5. Nếu dữ liệu cũ còn trong giỏ, xóa Local Storage rồi tải lại trang.
