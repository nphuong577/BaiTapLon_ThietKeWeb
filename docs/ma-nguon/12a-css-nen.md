# CSS nền tảng: `styles/base/`

Hai tệp nền được nạp trước CSS thành phần và CSS trang.

## `variables.css`: bảng màu và giá trị dùng lại

```css
:root {
  --red: #e31837;
  --red-dark: #b80f29;
  --yellow: #ffc72c;
  --cream: #fff8e8;
  --peach: #ffe4d7;
  --ink: #211c18;
  --muted: #6f6259;
  --white: #fff;
  --line: #eadfd6;
  --shadow: 0 16px 40px rgba(82, 43, 19, .12);
  --radius: 22px;
}
```

`:root` là phạm vi toàn tài liệu. Các tên `--red`, `--shadow` là biến CSS; nơi dùng sẽ viết `var(--red)`. Đổi màu ở đây giúp các quy tắc tham chiếu biến đổi theo cùng lúc. Một số màu trong CSS vẫn được viết trực tiếp bằng mã hex nên có thể không đổi theo.

## `global.css`: quy tắc chung

```css
* { box-sizing: border-box; }
body {
  margin: 0;
  color: var(--ink);
  background: #fffdf8;
  font-family: "Inter", Arial, sans-serif;
}
img { display: block; max-width: 100%; }
button, input, select, textarea { font: inherit; }
```

- `box-sizing: border-box` làm chiều rộng phần tử bao gồm padding và viền, dễ tính bố cục hơn.
- `body` đặt nền, màu chữ và font mặc định.
- `max-width: 100%` ngăn ảnh tràn khỏi vùng chứa.
- Form kế thừa font giao diện.

File này còn định nghĩa `.primary-button`, `.inner-main`, `.form-field`, `.field-error`, `.toast`, `.skip-link`, `.sr-only` và media query giảm chuyển động. Vì áp dụng rộng, khi sửa selector chung hãy kiểm tra nhiều trang để tránh làm ảnh hưởng ngoài ý muốn.

## Đọc selector cơ bản

```css
.primary-button { background: var(--red); }
.toast.show { opacity: 1; }
body.no-scroll { overflow: hidden; }
```

`.` chọn class; `body.no-scroll` chỉ tác động khi `body` có class `no-scroll`; `.toast.show` yêu cầu cùng phần tử có cả hai class. JS thường thêm/xóa class, CSS định nghĩa hình thức của trạng thái đó.

**Khi sửa:** chỉnh biến để đổi theme; chỉnh quy tắc toàn cục chỉ khi muốn thay đổi nhiều trang; nếu thay đổi chỉ thuộc một trang, dùng CSS trang.
