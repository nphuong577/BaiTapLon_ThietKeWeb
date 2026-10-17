# Hướng dẫn bổ sung dữ liệu và hình ảnh

Tài liệu thao tác đầy đủ cho mọi loại dữ liệu nằm tại `docs/quan-ly-du-lieu.md`.

## Cấu trúc dữ liệu

- `data/categories.json`: khai báo các danh mục và thứ tự hiển thị.
- `data/products/chicken.json`: gà rán.
- `data/products/rice-noodle.json`: cơm và mì Ý.
- `data/products/burger.json`: burger.
- `data/products/combo.json`: combo.
- `data/products/side.json`: món phụ.
- `data/products/dessert.json`: tráng miệng.
- `data/products/drink.json`: thức uống.
- `data/site.json`: thương hiệu và banner trang chủ.

Khi thêm category, cần làm đủ hai bước: thêm `{ "id", "name" }` vào `categories.json`, sau đó tạo file `data/products/<id>.json`. Bộ nạp dữ liệu lấy tên file theo `id`, vì vậy hai giá trị phải trùng nhau.

## Mẫu một sản phẩm

```json
{
  "id": "product-slug-khong-trung",
  "name": "Tên món",
  "category": "chicken",
  "price": 69000,
  "image": "assets/images/products/ten-anh.jpg",
  "description": "Mô tả ngắn, khoảng 15-25 từ.",
  "tag": "Món mới",
  "featured": false,
  "options": {
    "size": [
      { "id": "regular", "name": "Vừa", "extraPrice": 0 },
      { "id": "large", "name": "Lớn", "extraPrice": 10000 }
    ],
    "spice": ["Không cay", "Cay vừa", "Cay nhiều"],
    "drink": [
      { "id": "none", "name": "Không chọn", "extraPrice": 0 },
      { "id": "cola", "name": "Cola vừa", "extraPrice": 10000 }
    ]
  }
}
```

`price` và `extraPrice` phải là số, không viết dấu chấm phân cách. Mỗi sản phẩm phải có ít nhất một lựa chọn trong `size` và `drink`. Chỉ các danh mục ngoài đồ uống và tráng miệng mới cần khai báo `spice`.

## Muốn thêm một sản phẩm cần viết những gì?

1. Xác định sản phẩm thuộc category nào, sau đó mở đúng file trong `data/products/`. Ví dụ món gà thêm vào `chicken.json`, combo thêm vào `combo.json`.
2. Thêm một object mới vào mảng `products`. Object cần đủ các trường:
   - `id`: mã duy nhất, chữ thường, không dấu, không khoảng trắng. Ví dụ `chicken-cheese`.
   - `name`: tên hiển thị của món.
   - `category`: phải giống `id` category và tên file JSON.
   - `price`: giá gốc dạng số, ví dụ `69000`.
   - `image`: đường dẫn ảnh tính từ thư mục gốc.
   - `description`: mô tả ngắn của sản phẩm.
   - `tag`: nhãn như `Món mới`, `Bán chạy` hoặc `Yêu thích`.
   - `featured`: `true` hoặc `false`.
   - `options.size`: danh sách kích cỡ; mỗi lựa chọn có `id`, `name`, `extraPrice`.
   - `options.spice`: danh sách độ cay dạng chuỗi; không khai báo cho đồ uống và tráng miệng.
   - `options.drink`: danh sách thức uống; mỗi lựa chọn có `id`, `name`, `extraPrice`.
3. Đặt file ảnh vào `assets/images/`, sau đó kiểm tra đường dẫn `image` có mở được không.
4. Kiểm tra dấu phẩy JSON: object trước sản phẩm mới phải có dấu phẩy, object cuối cùng không có dấu phẩy thừa.
5. Chạy website bằng local server và mở `pages/products.html`. Trang chủ tự lấy tối đa hai món đầu tiên trong mỗi category để giới thiệu.

Nếu muốn thêm category hoàn toàn mới, cần thêm category vào `data/categories.json`, tạo file `data/products/<category-id>.json`, rồi thêm sản phẩm theo mẫu trên.

## Cấu hình các mốc giảm giá

Quy tắc giảm giá nằm trong `data/discounts.json`. Mỗi mốc có dạng:

```json
{
  "id": "tier-250",
  "minOrder": 250000,
  "maxOrder": 399999,
  "discountPercent": 10,
  "maxDiscount": 30000
}
```

- `minOrder`: tổng tiền món tối thiểu để bắt đầu được giảm.
- `maxOrder`: tổng tiền món tối đa của mốc. Dùng `null` nếu mốc không có giới hạn trên.
- `discountPercent`: phần trăm giảm, ví dụ `10` nghĩa là giảm 10%.
- `maxDiscount`: số tiền được giảm tối đa ở mốc đó.

Công thức đang dùng:

```text
số tiền giảm = min(tạm tính × discountPercent / 100, maxDiscount)
tổng thanh toán = tạm tính - số tiền giảm + phí giao hàng
```

Ví dụ đơn 300.000 ₫ thuộc mốc 250.000-399.999 ₫, giảm 10% nhưng tối đa 30.000 ₫, kết quả giảm 30.000 ₫. Các mốc không được chồng lấn nhau và nên sắp xếp từ thấp đến cao.

## Thêm khuyến mãi vào carousel

Thêm một object vào mảng `promotions` trong `data/promotions.json`. Cần viết `id`, `label`, `title`, `description`, `buttonText`, `link`, `image` và `theme`. `theme` hiện hỗ trợ `yellow`, `peach`, `red`, `cream`.

## Ảnh còn nên bổ sung

Dự án hiện đã có ảnh cho mọi món đang khai báo. Để mở rộng menu nên chuẩn bị:

- Ảnh sản phẩm vuông 1200 × 1200 px, nền sáng đồng nhất, định dạng WebP/JPG dưới 250 KB.
- Ảnh banner 1672 × 941 px hoặc cùng tỉ lệ, phần chữ quan trọng nằm trong 70% vùng giữa để không bị cắt trên điện thoại.
- Ảnh cho các nhóm còn ít dữ liệu: thức uống, món phụ, burger và các loại sốt/thêm món.
- Ảnh minh họa cửa hàng, đội ngũ và quy trình chế biến nếu muốn mở rộng trang giới thiệu.

Không dùng trực tiếp hình có bản quyền từ website tham khảo. Đặt ảnh mới trong `assets/images/<nhom>/`, đặt tên file chữ thường, không dấu, dùng dấu gạch nối.

## Cách chạy dự án

Do trình duyệt chặn `fetch()` JSON khi mở bằng `file://`, hãy chạy local server tại thư mục gốc:

```bash
python3 -m http.server 8080
```

Sau đó mở `http://localhost:8080/`. Dữ liệu giỏ hàng, tài khoản và đơn demo nằm trong localStorage; có thể xóa bằng DevTools → Application → Local Storage.
