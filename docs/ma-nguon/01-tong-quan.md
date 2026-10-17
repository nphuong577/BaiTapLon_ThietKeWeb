# Tổng quan và bản đồ dự án

## 1. Bản đồ dự án và cách website hoạt động

| Thư mục/tệp | Nói đơn giản | Khi nào cần vào đây? |
|---|---|---|
| `index.html`, `pages/*.html` | Khung nội dung và các trang người dùng mở | Sửa chữ, biểu mẫu, bố cục nội dung hoặc liên kết trang |
| `data/*.json`, `data/products/*.json` | Nội dung có cấu trúc: món, giá, banner, ưu đãi | Thêm/sửa/xóa món hoặc đổi dữ liệu hiển thị |
| `js/core/` | Công cụ dùng chung như tải JSON, lưu dữ liệu, định dạng giá | Thay đổi cách dữ liệu được đọc, lưu hoặc dùng chung |
| `js/components/` | Các phần giao diện có thể tái sử dụng như thẻ món và giỏ | Thay đổi cách một thành phần hoạt động ở nhiều trang |
| `js/pages/` | Logic riêng của từng trang | Thay đổi hành vi trang chủ, thực đơn, đăng nhập, đặt hàng |
| `styles/base/` | Nền tảng giao diện và màu sắc | Đổi màu chủ đạo, font, kiểu nút và trường nhập chung |
| `styles/components/` | Giao diện thành phần dùng nhiều nơi | Sửa đầu trang, chân trang, thẻ món hoặc giỏ |
| `styles/pages/` | Giao diện riêng của mỗi trang | Chỉnh bố cục hoặc chi tiết trang cụ thể |
| `assets/images/` | Ảnh logo, món ăn, banner và ảnh nền | Thêm hoặc thay ảnh; đường dẫn ảnh được tham chiếu trong JSON/HTML |

### Luồng dữ liệu chính

```text
Tệp HTML tạo khung trang
        ↓
Tệp JS của trang bắt đầu chạy (được nạp bằng type="module")
        ↓
data-loader.js tải JSON trong thư mục data/
        ↓
JavaScript tạo nội dung HTML và gắn sự kiện bấm/nhập
        ↓
CSS định hình giao diện
        ↓
storage.js lưu giỏ hàng, tài khoản demo và đơn vào localStorage
```

Các thuật ngữ được dùng trong tài liệu:

| Thuật ngữ | Giải thích dễ hiểu |
|---|---|
| Module | Một tệp JS có một nhóm trách nhiệm; có thể nhập hàm từ module khác |
| Hàm (function) | Một nhóm thao tác có tên, dùng để thực hiện một việc |
| Tham số | Thông tin được đưa vào hàm để hàm xử lý |
| Trả về (return) | Kết quả mà hàm gửi lại cho nơi gọi nó |
| Sự kiện | Hành động của người dùng như bấm nút, nhập chữ, gửi biểu mẫu |
| DOM | Cách trình duyệt biểu diễn các phần tử HTML để JavaScript tìm và cập nhật |
| `localStorage` | Kho lưu trữ nhỏ trong trình duyệt; vẫn còn sau khi tải lại trang, nhưng chỉ ở trình duyệt/thiết bị đó |
| Responsive | Giao diện tự sắp xếp lại để dùng được trên màn hình lớn và điện thoại |

---

