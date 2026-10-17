import { storage } from "../core/storage.js";
import { cartSubtotal, renderCart } from "../components/cart.js";
import { formatPrice, setupMobileNav } from "../core/utils.js";
import { loadDiscountRules } from "../core/data-loader.js";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^0[35789][0-9]{8}$/;
const form = document.querySelector("#checkout-form");
const items = document.querySelector("#checkout-items");
const subtotalOutput = document.querySelector("#checkout-subtotal");
const feeOutput = document.querySelector("#delivery-fee");
const totalOutput = document.querySelector("#order-total");
const placeOrderButton = document.querySelector("#place-order");
let discountRules = [];

function setError(id, message = "") {
  const input = document.querySelector(`#${id}`);
  input.setAttribute("aria-invalid", String(Boolean(message)));
  document.querySelector(`[data-error-for="${id}"]`).textContent = message;
}

function refreshSummary() {
  renderCart(items, subtotalOutput, updateTotals);
  updateTotals();
}

function updateTotals() {
  const subtotal = cartSubtotal();
  const deliveryFee = subtotal === 0 || subtotal >= 250000 ? 0 : 25000;
  const discount = calculateDiscount(subtotal);
  subtotalOutput.textContent = formatPrice(subtotal);
  document.querySelector("#discount-amount").textContent = discount.amount ? `−${formatPrice(discount.amount)}` : "0 ₫";
  feeOutput.textContent = deliveryFee ? formatPrice(deliveryFee) : "Miễn phí";
  totalOutput.textContent = formatPrice(subtotal - discount.amount + deliveryFee);
  placeOrderButton.disabled = subtotal === 0;
}

function calculateDiscount(subtotal) {
  for (const rule of discountRules) {
    const reachedMinimum = subtotal >= rule.minOrder;
    const belowMaximum = rule.maxOrder === null || subtotal <= rule.maxOrder;
    if (reachedMinimum && belowMaximum) {
      const percentValue = Math.floor(subtotal * rule.discountPercent / 100);
      const amount = Math.min(percentValue, rule.maxDiscount);
      document.querySelector("#discount-message").textContent = `Đã áp dụng giảm ${rule.discountPercent}%, tối đa ${formatPrice(rule.maxDiscount)}.`;
      return { amount, rule };
    }
  }

  const nextRule = discountRules.find((rule) => subtotal < rule.minOrder);
  document.querySelector("#discount-message").textContent = subtotal > 0 && nextRule
    ? `Thêm ${formatPrice(nextRule.minOrder - subtotal)} để được giảm ${nextRule.discountPercent}%.`
    : "";
  return { amount: 0, rule: null };
}

function updatePaymentMethod() {
  const selected = document.querySelector('input[name="payment"]:checked');
  document.querySelector("#bank-transfer").hidden = selected.value !== "bank-transfer";
  const phone = document.querySelector("#customer-phone").value;
  document.querySelector("#transfer-content").textContent = `FARMY ${phone || "SĐT"}`;
  document.querySelectorAll(".payment-card").forEach((card) => {
    card.classList.toggle("selected", card.contains(selected));
  });
}

function fillSession() {
  const session = storage.getSession();
  const suggestion = document.querySelector("#login-suggestion");
  if (session) {
    document.querySelector("#customer-name").value = session.name || "";
    document.querySelector("#customer-phone").value = session.phone || "";
    document.querySelector("#customer-email").value = session.email || "";
    suggestion.textContent = `Đang đặt hàng với tài khoản ${session.email}.`;
  } else {
    suggestion.innerHTML = 'Bạn có thể đặt hàng không cần tài khoản hoặc <a href="auth.html?next=checkout">đăng nhập để tự điền thông tin</a>.';
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const values = Object.fromEntries(new FormData(form));
  const errors = {
    "customer-name": values.name.trim().length >= 2 ? "" : "Vui lòng nhập họ tên.",
    "customer-phone": PHONE_REGEX.test(values.phone.trim()) ? "" : "Số điện thoại Việt Nam chưa hợp lệ.",
    "customer-email": EMAIL_REGEX.test(values.email.trim()) ? "" : "Email chưa đúng định dạng.",
    "customer-address": values.address.trim().length >= 10 ? "" : "Địa chỉ cần ít nhất 10 ký tự."
  };
  Object.entries(errors).forEach(([id, message]) => setError(id, message));
  const message = document.querySelector("#checkout-message");
  if (Object.values(errors).some(Boolean)) { message.textContent = "Vui lòng kiểm tra lại thông tin giao hàng."; return; }

  const cart = storage.getCart();
  const subtotal = cartSubtotal(cart);
  if (!cart.length) { message.textContent = "Giỏ hàng đang trống."; return; }
  if (subtotal < 60000) { message.textContent = "Giá trị món tối thiểu để giao hàng là 60.000 ₫."; return; }
  const deliveryFee = subtotal >= 250000 ? 0 : 25000;
  const discount = calculateDiscount(subtotal);
  const order = {
    id: `FM${Date.now().toString().slice(-8)}`,
    customer: { name: values.name.trim(), phone: values.phone.trim(), email: values.email.trim(), address: values.address.trim() },
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
  document.querySelector("#order-success").scrollIntoView({ behavior: "smooth" });
});

document.querySelectorAll('input[name="payment"]').forEach((radio) => {
  radio.addEventListener("change", updatePaymentMethod);
});
document.querySelector("#customer-phone").addEventListener("input", (event) => {
  document.querySelector("#transfer-content").textContent = `FARMY ${event.target.value || "SĐT"}`;
});

async function init() {
  fillSession();
  setupMobileNav();
  updatePaymentMethod();
  try {
    discountRules = await loadDiscountRules();
  } catch (error) {
    console.error("Không tải được quy tắc giảm giá", error);
  }
  refreshSummary();
}

init();
