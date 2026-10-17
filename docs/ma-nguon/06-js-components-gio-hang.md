# JavaScript component: giỏ hàng

#### [`js/components/cart.js`](../../js/components/cart.js)

| Hàm | Đầu vào → kết quả | Tác dụng |
|---|---|---|
| `addCartItem(item)` | Một món đã tùy chỉnh → lưu giỏ mới | Gộp số lượng nếu `createCartKey()` khớp; nếu chưa có thì thêm dòng mới, cập nhật số trên biểu tượng giỏ và báo toast |
| `updateCartBadges()` | Không có → không trả kết quả | Tính tổng số phần trong giỏ và cập nhật mọi phần tử `[data-cart-count]` |
| `cartSubtotal(cart = storage.getCart())` | Giỏ tùy chọn → tổng tiền hàng | Cộng `unitPrice × quantity` cho mọi dòng |
| `updateQuantity(key, change)` | Mã dòng giỏ và số cần cộng/trừ → không trả kết quả | Hàm nội bộ đổi số lượng; bỏ dòng nếu số lượng giảm xuống 0 |
| `renderCart(container, subtotalElement, onChange)` | Vùng chứa, nơi hiện tạm tính, callback tùy chọn → không trả kết quả | Vẽ các dòng giỏ hoặc trạng thái trống, gắn nút tăng/giảm/xóa và cập nhật tạm tính |
| `setupCartDrawer()` | Không có → không trả kết quả | Kết nối nút mở/đóng ngăn giỏ, nền mờ, phím Escape và số trên biểu tượng giỏ |

`onChange` được gọi sau khi giỏ thay đổi để trang đặt hàng tính lại tổng tiền. Một dòng giỏ được phân biệt bởi mã món + size + cay + nước; các lựa chọn khác nhau không bị gộp nhầm.


### 9.9. `js/components/cart.js`: thêm, vẽ và thay đổi giỏ hàng

Gộp món và đếm số lượng:

```js
export function addCartItem(item) {
  const cart = storage.getCart();
  const key = createCartKey(item);
  const existing = cart.find((entry) => entry.key === key);
  if (existing) existing.quantity += item.quantity;
  else cart.push({ ...item, key });
  storage.setCart(cart);
  updateCartBadges();
  showToast(`Đã thêm ${item.name} vào giỏ`);
}
```

- Đọc giỏ hiện tại trước khi thay đổi.
- Tạo `key` theo mã món và các lựa chọn.
- Nếu tìm thấy dòng trùng thì cộng số lượng; nếu không thì thêm object mới. `{ ...item, key }` sao chép trường của món vào object và thêm mã key.
- Ghi giỏ vào localStorage, đồng bộ số trên header, rồi hiện thông báo.

```js
export function updateCartBadges() {
  const count = storage.getCart()
    .reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll("[data-cart-count]").forEach((badge) => {
    badge.textContent = String(count);
  });
}

export function cartSubtotal(cart = storage.getCart()) {
  return cart.reduce((total, item) =>
    total + item.unitPrice * item.quantity, 0);
}
```

`reduce()` cộng dồn một danh sách. Hàm đầu cộng tổng số phần; hàm sau cộng tiền từng dòng. Tham số mặc định của `cartSubtotal` là giỏ hiện đang lưu, nhưng có thể truyền giỏ khác để tính thử.

Đổi số lượng là hàm nội bộ:

```js
function updateQuantity(key, change) {
  const cart = storage.getCart();
  const item = cart.find((entry) => entry.key === key);
  if (!item) return;
  item.quantity += change;
  storage.setCart(cart.filter((entry) => entry.quantity > 0));
}
```

Nếu không tìm thấy dòng thì không làm gì. Sau khi cộng/trừ, `.filter(...)` bỏ dòng có quantity bằng 0; do đó bấm giảm ở số 1 sẽ xóa món.

`renderCart(container, subtotalElement, onChange)` thực hiện bốn việc:

1. Đọc giỏ; nếu không có `container` thì dừng.
2. Nếu có món, dùng `.map()` tạo một `<article>` cho mỗi dòng; nếu trống, hiện thông báo.
3. Cập nhật tạm tính bằng `cartSubtotal()`.
4. Gắn listener cho nút tăng/giảm/xóa; sau mỗi lần thay đổi, vẽ lại giỏ, cập nhật badge và gọi `onChange` nếu được truyền.

Phần dựng các dòng và gắn sự kiện (rút gọn phần HTML cho dễ đọc):

```js
export function renderCart(container, subtotalElement, onChange) {
  const cart = storage.getCart();
  if (!container) return;

  container.innerHTML = cart.length
    ? cart.map((item) => {
        const details = [item.sizeName, item.spice, item.drinkName]
          .filter(Boolean)
          .map(escapeHtml)
          .join(" · ");
        return `<article class="cart-row">
          <img src="${assetUrl(item.image)}" alt="" />
          <div>
            <h3>${escapeHtml(item.name)}</h3>
            <p>${details}</p>
            <strong>${formatPrice(item.unitPrice)}</strong>
            <button data-cart-change="-1"
                    data-key="${escapeHtml(item.key)}">−</button>
            <span>${item.quantity}</span>
            <button data-cart-change="1"
                    data-key="${escapeHtml(item.key)}">+</button>
            <button data-cart-remove
                    data-key="${escapeHtml(item.key)}">Xóa</button>
          </div>
          <strong>${formatPrice(item.unitPrice * item.quantity)}</strong>
        </article>`;
      }).join("")
    : "<div class='empty-state'>Giỏ hàng đang trống.</div>";

  if (subtotalElement) {
    subtotalElement.textContent = formatPrice(cartSubtotal(cart));
  }

  container.querySelectorAll("[data-cart-change]").forEach((button) =>
    button.addEventListener("click", () => {
      updateQuantity(button.dataset.key, Number(button.dataset.cartChange));
      renderCart(container, subtotalElement, onChange);
      updateCartBadges();
      if (onChange) onChange();
    }));

  container.querySelectorAll("[data-cart-remove]").forEach((button) =>
    button.addEventListener("click", () => {
      storage.setCart(storage.getCart()
        .filter((item) => item.key !== button.dataset.key));
      renderCart(container, subtotalElement, onChange);
      updateCartBadges();
      if (onChange) onChange();
    }));
}
```

Đây là phiên bản giản lược để giải thích, không phải bản thay thế nguyên văn: code thật có thêm nhãn trợ năng và trạng thái trống đầy đủ. Sau khi gán `innerHTML`, các nút cũ đã bị thay, nên phải tìm các nút mới và gắn listener mới.

- `data-key` ghi mã dòng giỏ vào nút; nhờ đó handler biết cần sửa/xóa món nào.
- `Number(button.dataset.cartChange)` chuyển `"-1"`/`"1"` từ HTML thành số.
- Sau khi thay đổi, `renderCart()` tự gọi lại để cập nhật giao diện.
- `onChange()` cho phép trang checkout tính lại phí/giảm giá/tổng sau khi giỏ thay đổi.
- Nút xóa lọc giỏ để bỏ đúng `key`, không ảnh hưởng các lựa chọn khác của cùng món.

Lưu ý: đoạn rút gọn trên bỏ một điều kiện của code thật: đồ uống và tráng miệng không có trường độ cay, nên code thật đưa `null` thay `item.spice` cho hai category đó.

Ví dụ phần đọc chi tiết dòng:

```js
const details = [
  item.sizeName,
  item.category === "drink" || item.category === "dessert" ? null : item.spice,
  item.drinkName
]
  .filter(Boolean)
  .map(escapeHtml)
  .join(" · ");
```

Món nước/tráng miệng không có độ cay nên bỏ trường đó. `.filter(Boolean)` bỏ các giá trị rỗng/null; `.map(escapeHtml)` mã hóa chữ; `.join(" · ")` ghép các mô tả bằng dấu chấm giữa.

`setupCartDrawer()` tìm các phần tử ngăn giỏ. Hàm nội bộ `open()` vẽ nội dung rồi thêm class `open`, bật nền mờ và khóa cuộn trang; `close()` làm ngược lại. Các listener gọi `open`/`close` khi bấm nút, bấm nền hoặc nhấn Escape. Nếu trang không có ngăn giỏ, hàm vẫn cập nhật badge rồi kết thúc.
