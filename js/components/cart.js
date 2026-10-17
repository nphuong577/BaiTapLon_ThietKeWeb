import { createCartKey, storage } from "../core/storage.js";
import { assetUrl, escapeHtml, formatPrice, showToast } from "../core/utils.js";

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

export function updateCartBadges() {
  const count = storage.getCart().reduce((total, item) => total + item.quantity, 0);
  document.querySelectorAll("[data-cart-count]").forEach((badge) => { badge.textContent = String(count); });
}

export function cartSubtotal(cart = storage.getCart()) {
  return cart.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
}

function updateQuantity(key, change) {
  const cart = storage.getCart();
  const item = cart.find((entry) => entry.key === key);
  if (!item) return;
  item.quantity += change;
  storage.setCart(cart.filter((entry) => entry.quantity > 0));
}

export function renderCart(container, subtotalElement, onChange) {
  const cart = storage.getCart();
  if (!container) return;
  container.innerHTML = cart.length ? cart.map((item) => `
    <article class="cart-row">
      <img src="${assetUrl(item.image)}" alt="" />
      <div><h3>${escapeHtml(item.name)}</h3><p>${escapeHtml(item.sizeName)} · ${escapeHtml(item.spice)} · ${escapeHtml(item.drinkName)}</p><strong>${formatPrice(item.unitPrice)}</strong>
        <div class="cart-row-actions"><button type="button" data-cart-change="-1" data-key="${escapeHtml(item.key)}" aria-label="Giảm số lượng">−</button><span>${item.quantity}</span><button type="button" data-cart-change="1" data-key="${escapeHtml(item.key)}" aria-label="Tăng số lượng">+</button><button class="remove-item" type="button" data-cart-remove data-key="${escapeHtml(item.key)}">Xóa</button></div>
      </div><strong>${formatPrice(item.unitPrice * item.quantity)}</strong>
    </article>`).join("") : '<div class="empty-state"><strong>Giỏ hàng đang trống.</strong><p>Hãy quay lại thực đơn để chọn món.</p></div>';
  if (subtotalElement) subtotalElement.textContent = formatPrice(cartSubtotal(cart));

  container.querySelectorAll("[data-cart-change]").forEach((button) => button.addEventListener("click", () => {
    updateQuantity(button.dataset.key, Number(button.dataset.cartChange));
    renderCart(container, subtotalElement, onChange);
    updateCartBadges();
    if (onChange) onChange();
  }));
  container.querySelectorAll("[data-cart-remove]").forEach((button) => button.addEventListener("click", () => {
    storage.setCart(storage.getCart().filter((item) => item.key !== button.dataset.key));
    renderCart(container, subtotalElement, onChange);
    updateCartBadges();
    if (onChange) onChange();
  }));
}

export function setupCartDrawer() {
  const drawer = document.querySelector("#cart-drawer");
  const backdrop = document.querySelector("#drawer-backdrop");
  const items = document.querySelector("#cart-items");
  const subtotal = document.querySelector("#cart-subtotal");
  if (!drawer) { updateCartBadges(); return; }

  const close = () => {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    backdrop.hidden = true;
    document.body.classList.remove("no-scroll");
  };
  const open = () => {
    renderCart(items, subtotal);
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    backdrop.hidden = false;
    document.body.classList.add("no-scroll");
  };
  document.querySelector("#open-cart")?.addEventListener("click", open);
  document.querySelector("#close-cart")?.addEventListener("click", close);
  backdrop?.addEventListener("click", close);
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") close(); });
  updateCartBadges();
}
