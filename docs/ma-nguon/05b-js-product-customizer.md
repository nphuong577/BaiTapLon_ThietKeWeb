# JavaScript component: product-customizer.js

#### [`js/components/product-customizer.js`](../../js/components/product-customizer.js)

| Hàm | Đầu vào → kết quả | Tác dụng |
|---|---|---|
| `customizerMarkup(product, includeImage = true)` | Dữ liệu món và tùy chọn ảnh → HTML dạng chuỗi | Tạo phần chọn size, độ cay (nếu áp dụng), nước và số lượng |
| `optionPill(group, value, label, checked)` | Tên nhóm, giá trị, chữ hiển thị, trạng thái chọn → HTML dạng chuỗi | Tạo một lựa chọn radio dùng chung |
| `bindCustomizer(root, product, onAdded)` | Vùng HTML, món, callback tùy chọn → không trả kết quả | Theo dõi lựa chọn, giới hạn số lượng 1–20, cập nhật tổng và thêm cấu hình món vào giỏ |

Bên trong `bindCustomizer()`:

- `selected(name)` đọc giá trị đang được chọn như `size`, `spice`, `drink`.
- `getPricing()` tìm lựa chọn size/nước và tính giá một phần.
- `refresh()` cập nhật số lượng và tổng tiền trên giao diện.
- Khi bấm nút thêm, dữ liệu món đã chọn được gửi tới `addCartItem()`, sau đó chạy `onAdded` nếu được truyền vào (trang thực đơn dùng để đóng hộp thoại).


### 9.8. `js/components/product-customizer.js`: tạo và xử lý lựa chọn món

Tạo các lựa chọn từ JSON:

```js
export function customizerMarkup(product, includeImage = true) {
  const sizes = product.options.size
    .map((option, index) => optionPill(
      "size", option.id,
      `${option.name}${option.extraPrice ? ` (+${formatPrice(option.extraPrice)})` : ""}`,
      index === 0
    )).join("");

  const supportsSpice = !["drink", "dessert"].includes(product.category);
  const spices = supportsSpice
    ? product.options.spice.map((name, index) =>
        optionPill("spice", name, name, index === 0)).join("")
    : "";
  const drinks = product.options.drink
    .map((option, index) => optionPill(
      "drink", option.id,
      `${option.name}${option.extraPrice ? ` (+${formatPrice(option.extraPrice)})` : ""}`,
      index === 0
    )).join("");
  return `<div class="dialog-product">
    ${includeImage ? `<img src="${assetUrl(product.image)}"
      alt="${escapeHtml(product.name)}" />` : ""}
    <div class="dialog-info" data-customizer>
      <span class="eyebrow">${escapeHtml(product.tag)}</span>
      <h2>${escapeHtml(product.name)}</h2>
      <p>${escapeHtml(product.description)}</p>
      <strong class="price">Từ ${formatPrice(product.price)}</strong>
      <div class="option-group"><strong>Chọn kích cỡ</strong>
        <div class="option-list">${sizes}</div>
      </div>
      ${supportsSpice ? `<div class="option-group">
        <strong>Chọn độ cay</strong><div class="option-list">${spices}</div>
      </div>` : ""}
      <div class="option-group"><strong>Chọn thức uống</strong>
        <div class="option-list">${drinks}</div>
      </div>
      <div class="option-group"><strong>Số lượng</strong>
        <div class="quantity-control">
          <button type="button" data-quantity-change="-1">−</button>
          <b data-quantity>1</b>
          <button type="button" data-quantity-change="1">+</button>
        </div>
      </div>
      <div class="dialog-total">
        <strong data-total>${formatPrice(product.price)}</strong>
        <button class="primary-button" type="button" data-add-customized>
          Thêm vào giỏ
        </button>
      </div>
    </div>
  </div>`;
}
```

- `.map(...)` biến từng lựa chọn trong JSON thành một đoạn HTML.
- `.join("")` nối các đoạn thành một chuỗi liền nhau.
- `index === 0` chọn lựa chọn đầu danh sách làm mặc định.
- `supportsSpice` bỏ giao diện độ cay với đồ uống và tráng miệng.
- `data-customizer`, `data-quantity`, `data-total`, `data-quantity-change`, `data-add-customized` là các “điểm móc” để hàm bind tìm đúng phần tử.
- Phần `return` cuối hàm bao gồm ảnh tùy chọn, mô tả, các lựa chọn, số lượng và nút thêm giỏ.
- `${...}` chèn giá trị hoặc đoạn HTML con vào template string; dấu backtick cho phép chuỗi trải nhiều dòng.
- `includeImage` là công tắc: trang chi tiết và dialog mặc định có ảnh; có thể truyền `false` để bỏ ảnh nếu muốn.
- `data-quantity` chứa số đang chọn; `data-total` chứa tổng hiện tại; các hook này được `refresh()` tìm và cập nhật.

Tạo một nút chọn dạng radio:

```js
function optionPill(group, value, label, checked) {
  return `<label class="option-pill">
    <input type="radio" name="${group}" value="${escapeHtml(value)}" ${checked ? "checked" : ""} />
    <span>${escapeHtml(label)}</span>
  </label>`;
}
```

Radio cùng `name` tạo thành một nhóm chỉ chọn được một giá trị. `<label>` bọc input nên người dùng có thể bấm vào phần chữ. `checked` đặt trạng thái được chọn đầu tiên. Giá trị và nhãn được escape trước khi chèn.

Kết nối sự kiện và tính giá:

```js
export function bindCustomizer(root, product, onAdded) {
  const panel = root.querySelector("[data-customizer]");
  if (!panel) return;
  let quantity = 1;

  const selected = (name) =>
    panel.querySelector(`input[name="${name}"]:checked`)?.value;

  const getPricing = () => {
    const size = product.options.size.find((option) => option.id === selected("size"))
      || product.options.size[0];
    const drink = product.options.drink.find((option) => option.id === selected("drink"))
      || product.options.drink[0];
    return { size, drink, unitPrice: product.price + size.extraPrice + drink.extraPrice };
  };

  const refresh = () => {
    panel.querySelector("[data-quantity]").textContent = String(quantity);
    panel.querySelector("[data-total]").textContent =
      formatPrice(getPricing().unitPrice * quantity);
  };

  panel.querySelectorAll("input").forEach((input) =>
    input.addEventListener("change", refresh)
  );
  panel.querySelectorAll("[data-quantity-change]").forEach((button) =>
    button.addEventListener("click", () => {
      quantity = Math.max(1, Math.min(20,
        quantity + Number(button.dataset.quantityChange)));
      refresh();
    })
  );
  panel.querySelector("[data-add-customized]").addEventListener("click", () => {
    const { size, drink, unitPrice } = getPricing();
    addCartItem({
      productId: product.id,
      name: product.name,
      image: product.image,
      category: product.category,
      sizeId: size.id,
      sizeName: size.name,
      spice: selected("spice"),
      drinkId: drink.id,
      drinkName: drink.name,
      unitPrice,
      quantity
    });
    onAdded?.();
  });
}
```

- `root` là vùng cần tìm bộ tùy chỉnh; có thể là dialog hoặc phần nội dung trang chi tiết.
- Nếu không có `[data-customizer]`, hàm dừng để tránh cập nhật sai vùng.
- `selected(name)` lấy giá trị radio đang chọn; `?.value` tránh lỗi nếu chưa tìm thấy.
- `.find(...)` dò option theo `id`; nếu không có kết quả dùng option đầu tiên.
- `unitPrice` là giá cơ bản cộng nâng cấp size và nước.
- `refresh()` đồng bộ con số trên màn hình sau khi chọn radio hoặc đổi số lượng.

Phần listener thực hiện cập nhật và thêm giỏ:

```js
panel.querySelectorAll("input").forEach((input) =>
  input.addEventListener("change", refresh)
);

panel.querySelectorAll("[data-quantity-change]").forEach((button) =>
  button.addEventListener("click", () => {
    quantity = Math.max(1, Math.min(20,
      quantity + Number(button.dataset.quantityChange)));
    refresh();
  })
);
```

`Number(...)` chuyển nội dung `data-quantity-change` (`"-1"` hoặc `"1"`) thành số. `Math.min(20, ...)` chặn số lượng tối đa 20; `Math.max(1, ...)` chặn tối thiểu 1. Khi đổi xong, gọi `refresh()`.

```js
panel.querySelector("[data-add-customized]").addEventListener("click", () => {
  const { size, drink, unitPrice } = getPricing();
  addCartItem({
    productId: product.id,
    name: product.name,
    image: product.image,
    category: product.category,
    sizeId: size.id,
    sizeName: size.name,
    spice: selected("spice"),
    drinkId: drink.id,
    drinkName: drink.name,
    unitPrice,
    quantity
  });
  onAdded?.();
});
```

Khi bấm, hàm chụp lại lựa chọn hiện tại thành một object chuẩn rồi gửi sang `addCartItem()`. `onAdded?.()` gọi callback nếu nơi tạo bộ chọn đã truyền callback; trang thực đơn truyền callback đóng dialog, trang chi tiết không cần.
