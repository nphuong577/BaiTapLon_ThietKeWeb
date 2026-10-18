# JavaScript trang đặt hàng

#### [`js/pages/checkout.js`](../../js/pages/checkout.js) — đặt hàng demo

| Hàm | Tác dụng |
|---|---|
| `setError(id, message = "")` | Cập nhật trạng thái lỗi của một trường giao hàng |
| `updateTotals()` | Tính tạm tính, phí giao, giảm giá và tổng; khóa nút đặt hàng khi giỏ trống |
| `calculateDiscount(subtotal)` | Dò các luật đã tải; trả số tiền giảm và luật áp dụng; cập nhật lời nhắc trên giao diện |
| `updatePaymentMethod()` | Hiện/ẩn thông tin chuyển khoản demo và đánh dấu phương thức được chọn |
| `fillSession()` | Nếu đã đăng nhập thì tự điền tên/điện thoại/email; nếu chưa thì hiện gợi ý đăng nhập |
| `init()` | Điền phiên, thiết lập menu/thanh toán, tải luật giảm giá rồi hiển thị tóm tắt |

Khi gửi form, đoạn xử lý sự kiện kiểm tra thông tin, giỏ không trống và giá trị món tối thiểu 60.000 ₫; sau đó tạo mã đơn, lưu đơn, xóa giỏ và hiện màn hình thành công. Đơn hàng có khách hàng, món, tạm tính, giảm giá, phí giao, tổng, trạng thái và thời gian tạo.

> Nếu không tải được JSON giảm giá, trang ghi lỗi vào Console và tiếp tục khởi tạo với danh sách luật rỗng. Phí giao và ngưỡng tối thiểu hiện được viết trực tiếp trong JS, không lấy từ JSON.

---


### 9.14. `js/pages/checkout.js`: tính tiền và tạo đơn demo

Các selector ở đầu file lưu tham chiếu tới form, nơi hiện giỏ, giá và nút đặt:

```js
const form = document.querySelector("#checkout-form");
const items = document.querySelector("#checkout-items");
const subtotalOutput = document.querySelector("#checkout-subtotal");
const feeOutput = document.querySelector("#delivery-fee");
const totalOutput = document.querySelector("#order-total");
let discountRules = [];
```

`discountRules` bắt đầu rỗng; `init()` sẽ tải luật từ JSON sau. Các phần tử HTML có `id` tương ứng là bắt buộc để JS hoạt động.

Helper xử lý lỗi cho từng trường:

```js
function setError(id, message = "") {
  const input = document.querySelector(`#${id}`);
  input.setAttribute("aria-invalid", String(Boolean(message)));
  document.querySelector(`[data-error-for="${id}"]`).textContent = message;
}

```

`setError()` cập nhật cả trạng thái trợ năng `aria-invalid` lẫn chữ báo lỗi cạnh trường. Khi khởi tạo, `init()` gọi `renderCart(items, subtotalOutput, updateTotals)` để vẽ giỏ, rồi gọi `updateTotals()` tính tổng. Callback này cũng được gọi lại khi khách thay đổi số lượng hoặc xóa món để phần giá luôn đồng bộ.

```js
function updateTotals() {
  const subtotal = cartSubtotal();
  const deliveryFee = subtotal === 0 || subtotal >= 250000 ? 0 : 25000;
  const discount = calculateDiscount(subtotal);
  subtotalOutput.textContent = formatPrice(subtotal);
  document.querySelector("#discount-amount").textContent =
    discount.amount ? `−${formatPrice(discount.amount)}` : "0 ₫";
  feeOutput.textContent = deliveryFee ? formatPrice(deliveryFee) : "Miễn phí";
  totalOutput.textContent =
    formatPrice(subtotal - discount.amount + deliveryFee);
  placeOrderButton.disabled = subtotal === 0;
}
```

Phí giao hiện là 25.000 đồng nếu có hàng và dưới 250.000; đơn từ ngưỡng đó miễn phí. Sau đó hàm trừ giảm giá, cộng phí và cập nhật giao diện. Nút xác nhận bị khóa nếu tạm tính bằng 0.

`calculateDiscount(subtotal)` chạy qua từng rule theo thứ tự. Nó kiểm tra `subtotal >= minOrder` và `subtotal <= maxOrder` (hoặc max là `null`), lấy phần trăm giảm rồi chặn ở `maxDiscount`. Nếu chưa đủ một mốc tiếp theo, hiển thị số tiền cần thêm. Kết quả trả về luôn có dạng `{ amount, rule }`, giúp lúc lưu đơn biết số giảm và mã luật đã áp dụng.

```js
function calculateDiscount(subtotal) {
  for (const rule of discountRules) {
    const reachedMinimum = subtotal >= rule.minOrder;
    const belowMaximum = rule.maxOrder === null || subtotal <= rule.maxOrder;
    if (reachedMinimum && belowMaximum) {
      const percentValue = Math.floor(subtotal * rule.discountPercent / 100);
      const amount = Math.min(percentValue, rule.maxDiscount);
      document.querySelector("#discount-message").textContent =
        `Đã áp dụng giảm ${rule.discountPercent}%, tối đa ${formatPrice(rule.maxDiscount)}.`;
      return { amount, rule };
    }
  }

  const nextRule = discountRules.find((rule) => subtotal < rule.minOrder);
  document.querySelector("#discount-message").textContent =
    subtotal > 0 && nextRule
      ? `Thêm ${formatPrice(nextRule.minOrder - subtotal)} để được giảm ${nextRule.discountPercent}%.`
      : "";
  return { amount: 0, rule: null };
}
```

`Math.floor()` làm tròn phần trăm xuống số nguyên đồng; `Math.min()` bảo đảm giảm không vượt trần. `find()` tìm mốc kế tiếp để hiển thị lời nhắc. Nếu không có mốc phù hợp hoặc mốc kế tiếp, kết quả vẫn có cấu trúc giống nhau nhưng `amount` bằng 0 và `rule` là `null`.

`updatePaymentMethod()` đọc radio đang chọn; nếu là `bank-transfer` thì hiện hướng dẫn chuyển khoản mô phỏng. Hàm cũng tạo nội dung chuyển khoản từ số điện thoại đang nhập và bật class `selected` trên đúng thẻ thanh toán.

```js
function updatePaymentMethod() {
  const selected = document.querySelector('input[name="payment"]:checked');
  document.querySelector("#bank-transfer").hidden =
    selected.value !== "bank-transfer";
  const phone = document.querySelector("#customer-phone").value;
  document.querySelector("#transfer-content").textContent =
    `FARMY ${phone || "SĐT"}`;
  document.querySelectorAll(".payment-card").forEach((card) => {
    card.classList.toggle("selected", card.contains(selected));
  });
}
```

Radio được tìm theo `name="payment"` và trạng thái `:checked`. `card.contains(selected)` xác định radio nằm bên trong thẻ thanh toán nào để chỉ đánh dấu thẻ đó. Trang luôn cần có ít nhất một radio được chọn; HTML hiện đặt COD làm lựa chọn mặc định.

`fillSession()` tự điền tên, điện thoại, email từ phiên đăng nhập nếu có. Nếu không đăng nhập, nó chèn lời gợi ý và link đăng nhập vào `#login-suggestion`.

```js
function fillSession() {
  const session = storage.getSession();
  const suggestion = document.querySelector("#login-suggestion");
  if (session) {
    document.querySelector("#customer-name").value = session.name || "";
    document.querySelector("#customer-phone").value = session.phone || "";
    document.querySelector("#customer-email").value = session.email || "";
    suggestion.textContent = `Đang đặt hàng với tài khoản ${session.email}.`;
  } else {
    suggestion.innerHTML =
      'Bạn có thể đặt hàng không cần tài khoản hoặc <a href="auth.html?next=checkout">đăng nhập để tự điền thông tin</a>.';
  }
}
```

Khi chưa đăng nhập, link tĩnh được đưa vào bằng `innerHTML` để link có thể bấm. Nếu nội dung link/chuỗi này lấy từ người dùng hoặc API ngoài thì không nên chèn trực tiếp; dùng DOM API hoặc escape giá trị.

Khi gửi form, đoạn xử lý:

```js
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form));
  const errors = {
    "customer-name": values.name.trim().length >= 2 ? "" : "Vui lòng nhập họ tên.",
    "customer-phone": PHONE_REGEX.test(values.phone.trim())
      ? "" : "Số điện thoại Việt Nam chưa hợp lệ.",
    "customer-email": EMAIL_REGEX.test(values.email.trim())
      ? "" : "Email chưa đúng định dạng.",
    "customer-address": values.address.trim().length >= 10
      ? "" : "Địa chỉ cần ít nhất 10 ký tự."
  };
  Object.entries(errors).forEach(([id, error]) => setError(id, error));
  const message = document.querySelector("#checkout-message");
  if (Object.values(errors).some(Boolean)) {
    message.textContent = "Vui lòng kiểm tra lại thông tin giao hàng.";
    return;
  }

  const cart = storage.getCart();
  const subtotal = cartSubtotal(cart);
  if (!cart.length) {
    message.textContent = "Giỏ hàng đang trống.";
    return;
  }
  if (subtotal < 60000) {
    message.textContent = "Giá trị món tối thiểu để giao hàng là 60.000 ₫.";
    return;
  }

  const deliveryFee = subtotal >= 250000 ? 0 : 25000;
  const discount = calculateDiscount(subtotal);
  const order = {
    id: `FM${Date.now().toString().slice(-8)}`,
    customer: {
      name: values.name.trim(),
      phone: values.phone.trim(),
      email: values.email.trim(),
      address: values.address.trim()
    },
    deliveryTime: values.deliveryTime,
    note: values.note.trim(),
    payment: values.payment,
    items: cart,
    subtotal,
    discount: discount.amount,
    discountRuleId: discount.rule ? discount.rule.id : null,
    deliveryFee,
    total: subtotal - discount.amount + deliveryFee,
    status: "received",
    createdAt: new Date().toISOString()
  };

  storage.setOrders([order, ...storage.getOrders()]);
  storage.setCart([]);
  document.querySelector(".checkout-layout").hidden = true;
  document.querySelector(".page-intro").hidden = true;
  document.querySelector("#order-code").textContent = order.id;
  document.querySelector("#order-success").hidden = false;
  document.querySelector("#order-success")
    .scrollIntoView({ behavior: "smooth" });
});
```

`Object.fromEntries()` đổi FormData thành object dễ đọc, ví dụ `values.name`. `Object.entries(errors)` cho phép duyệt từng cặp tên trường/thông báo; `Object.values(errors).some(Boolean)` kiểm tra có lỗi nào không. Các nhánh `return` dừng xử lý để không lưu đơn sai.

`Date.now().toString().slice(-8)` lấy 8 chữ số cuối của thời gian hiện tại để làm mã minh họa, không phải mã bảo đảm duy nhất cho hệ thống thật. `.trim()` bỏ khoảng trắng thừa ở đầu/cuối thông tin. `items` giữ các dòng giỏ tại thời điểm tạo đơn. `...storage.getOrders()` giữ các đơn cũ rồi đặt đơn mới ở đầu danh sách. Sau khi lưu đơn, giỏ được xóa. Phần handler phía trên là nơi tạo và lưu object này; bảng sau đây giải thích các trường mà không lặp lại cùng object thêm lần nữa.

Đơn được lưu với các trường:

| Trường | Ý nghĩa |
|---|---|
| `id` | Mã demo bắt đầu `FM`, phần sau lấy từ thời gian hiện tại |
| `customer` | Tên, điện thoại, email, địa chỉ |
| `deliveryTime`, `note`, `payment` | Thời điểm nhận dự kiến, ghi chú và phương thức thanh toán |
| `items` | Bản sao nội dung giỏ tại thời điểm đặt |
| `subtotal`, `discount`, `discountRuleId`, `deliveryFee`, `total` | Các thành phần tính tiền |
| `status` | Trạng thái khởi đầu `received` |
| `createdAt` | Ngày giờ ISO lúc tạo đơn |

Sau khi lưu: xóa giỏ, ẩn phần form và giới thiệu, điền mã đơn, hiện vùng thành công rồi cuộn tới đó. Các listener thanh toán và nhập điện thoại cập nhật thông tin chuyển khoản; cuối file, `init()` tải luật giảm giá rồi vẽ lại giỏ và tổng kết.

Khởi tạo trang:

```js
async function init() {
  fillSession();
  setupMobileNav();
  updatePaymentMethod();
  try {
    discountRules = await loadDiscountRules();
  } catch (error) {
    console.error("Không tải được quy tắc giảm giá", error);
  }
  renderCart(items, subtotalOutput, updateTotals);
  updateTotals();
}

init();
```

`await loadDiscountRules()` tải các mốc giảm trước lần tính tổng đầu tiên. Nếu tải thất bại, lỗi được ghi rõ vào Console; trang vẫn hiển thị giỏ và tính phí giao hàng nhưng không áp dụng giảm giá. Lệnh gọi `init()` ở cuối module thực sự bắt đầu quy trình.
