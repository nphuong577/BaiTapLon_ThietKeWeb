# Danh mục hàm theo tệp

Trang này là bản tra cứu nhanh. Mở hướng dẫn riêng để xem code block và giải thích từng bước.

## JavaScript dùng chung

| Tệp/hướng dẫn | Hàm hoặc dữ liệu | Mục đích |
|---|---|---|
| [`data-loader.js`](../../js/core/data-loader.js) · [giải thích](04a-js-data-loader.md) | `getJson`, `loadSiteData`, `loadPromotions`, `loadDiscountRules`, `loadCatalog`, `findProduct` | Tải JSON, ghép catalog, tìm món |
| [`storage.js`](../../js/core/storage.js) · [giải thích](04b-js-storage.md) | `read`, `write`, `storage.getCart/setCart`, `getUsers/setUsers`, `getSession/setSession`, `clearSession`, `getOrders/setOrders`, `createCartKey` | Đọc/ghi dữ liệu demo trong localStorage |
| [`utils.js`](../../js/core/utils.js) · [giải thích](04c-js-utils.md) | `formatPrice`, `assetUrl`, `escapeHtml`, `showToast`, `setupMobileNav` | Định dạng và thao tác UI dùng chung |

## Thành phần dùng lại

| Tệp/hướng dẫn | Hàm | Mục đích |
|---|---|---|
| [`product-card.js`](../../js/components/product-card.js) · [giải thích](05a-js-product-card.md) | `productCard` | Tạo một thẻ món dạng HTML |
| [`product-customizer.js`](../../js/components/product-customizer.js) · [giải thích](05b-js-product-customizer.md) | `customizerMarkup`, `optionPill`, `bindCustomizer`; helper nội bộ `selected`, `getPricing`, `refresh` | Tạo lựa chọn và xử lý giá/số lượng |
| [`cart.js`](../../js/components/cart.js) · [giải thích](06-js-components-gio-hang.md) | `addCartItem`, `updateCartBadges`, `cartSubtotal`, `updateQuantity`, `renderCart`, `setupCartDrawer`; helper `open`, `close` | Thêm, hiển thị, sửa và xóa dòng giỏ |

## Logic theo trang

| Tệp/hướng dẫn | Hàm hoặc handler | Mục đích |
|---|---|---|
| [`home.js`](../../js/pages/home.js) · [giải thích](07-js-trang-chu.md) | `renderCategoryPreviews`, `renderSlider`, `show`, `autoplay`, `renderPromotions`, `showPromotion`, `startAutoplay`, `init` | Dữ liệu trang chủ và hai carousel |
| [`products.js`](../../js/pages/products.js) · [giải thích](08-js-thuc-don.md) | `normalize`, `filteredProducts`, `renderProducts`, `renderTabs`, `openCustomizer`, `init` | Tìm kiếm, lọc, dựng món và dialog |
| [`product.js`](../../js/pages/product.js) · [giải thích](09-js-chi-tiet-mon.md) | `init` | Tìm món theo query `id` |
| [`auth.js`](../../js/pages/auth.js) · [giải thích](10-js-tai-khoan.md) | `showError`, `showFeedback`, `switchForm`, `showAccount`; handler đăng ký/đăng nhập/đăng xuất và xóa lỗi | Tài khoản demo |
| [`checkout.js`](../../js/pages/checkout.js) · [giải thích](11-js-dat-hang.md) | `setError`, `updateTotals`, `calculateDiscount`, `updatePaymentMethod`, `fillSession`, handler submit và đổi radio/điện thoại, `init` | Kiểm tra và tạo đơn demo |

### Hàm có tên và hàm callback khác nhau thế nào?

`renderProducts()` là hàm có tên, có thể gọi trực tiếp bằng tên đó. Trong `button.addEventListener("click", () => ...)`, `() => ...` là callback: hàm được truyền cho trình duyệt để chạy sau này khi người dùng bấm.

Ví dụ:

```js
button.addEventListener("click", () => {
  renderProducts();
});
```

Không gọi `renderProducts` ngay lúc gắn sự kiện; ta đưa một hàm vào để trình duyệt gọi vào đúng thời điểm click.
