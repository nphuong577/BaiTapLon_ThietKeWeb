# JavaScript core: storage.js

#### [`js/core/storage.js`](../../js/core/storage.js) — lưu dữ liệu trong trình duyệt

| Hàm/API | Tác dụng |
|---|---|
| `read(key, fallback)` | Đọc và giải mã JSON từ `localStorage`; nếu chưa có dữ liệu hoặc dữ liệu không đọc được thì trả giá trị mặc định |
| `write(key, value)` | Chuyển giá trị thành JSON và lưu |
| `storage.getCart()` / `storage.setCart(cart)` | Lấy/lưu giỏ hàng |
| `storage.getUsers()` / `storage.setUsers(users)` | Lấy/lưu danh sách tài khoản demo |
| `storage.getSession()` / `storage.setSession(session)` | Lấy/lưu phiên đăng nhập demo |
| `storage.clearSession()` | Xóa phiên đăng nhập hiện tại |
| `storage.getOrders()` / `storage.setOrders(orders)` | Lấy/lưu lịch sử đơn demo |
| `createCartKey(item)` | Tạo mã so sánh từ mã món, size, độ cay, nước để các lựa chọn giống hệt nhau được gộp vào cùng dòng giỏ |

Các tên khóa hiện được đặt phiên bản như `farmy_cart_v1`. Nếu đổi định dạng giỏ/tài khoản, dữ liệu cũ trong trình duyệt có thể không còn tương thích; cần nghĩ đến việc đổi phiên bản hoặc hướng dẫn người dùng xóa Local Storage.


### 9.5. `js/core/storage.js`: cách lưu và đọc trên trình duyệt

```js
const KEYS = {
  cart: "farmy_cart_v1",
  users: "farmy_users_v1",
  session: "farmy_session_v1",
  orders: "farmy_orders_v1"
};
```

Đây là tên các ngăn lưu trữ trong `localStorage`. Tiền tố `farmy_` tránh va chạm với website khác; `_v1` đánh dấu phiên bản dữ liệu.

```js
function read(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
```

- `localStorage.getItem(key)` chỉ trả văn bản hoặc `null`; vì vậy `JSON.parse()` chuyển văn bản thành mảng/object JS.
- `?? fallback` dùng giá trị mặc định nếu kết quả là `null` hoặc `undefined`. Giỏ/tài khoản/đơn mặc định là `[]`, phiên đăng nhập là `null`.
- `try/catch` tránh website dừng khi dữ liệu cũ bị hỏng hoặc không đọc được; riêng `write()` hiện không bắt lỗi nếu trình duyệt từ chối ghi (ví dụ hết dung lượng).
- `JSON.stringify(value)` chuyển object/mảng thành văn bản để lưu.

API công khai cho các loại dữ liệu:

```js
export const storage = {
  getCart: () => read(KEYS.cart, []),
  setCart: (cart) => write(KEYS.cart, cart),
  getUsers: () => read(KEYS.users, []),
  setUsers: (users) => write(KEYS.users, users),
  getSession: () => read(KEYS.session, null),
  setSession: (session) => write(KEYS.session, session),
  clearSession: () => localStorage.removeItem(KEYS.session),
  getOrders: () => read(KEYS.orders, []),
  setOrders: (orders) => write(KEYS.orders, orders)
};
```

Mỗi cặp `get`/`set` dùng chung hàm `read`/`write`, giúp các trang không phải tự nhớ tên khóa. `clearSession()` chỉ xóa phiên hiện tại, không xóa danh sách tài khoản hay đơn hàng.

```js
export function createCartKey(item) {
  return [item.productId, item.sizeId, item.spice, item.drinkId].join("|");
}
```

Hàm ghép các lựa chọn thành một chuỗi như `fried-chicken|large|Cay vừa|cola`. Giỏ dùng chuỗi này để quyết định có thể cộng dồn số lượng hay phải tạo một dòng riêng.

