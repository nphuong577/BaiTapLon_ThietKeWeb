import { addCartItem } from "./cart.js";
import { assetUrl, escapeHtml, formatPrice } from "../core/utils.js";

export function customizerMarkup(product, includeImage = true) {
  const sizes = product.options.size.map((option, index) => optionPill("size", option.id, `${option.name}${option.extraPrice ? ` (+${formatPrice(option.extraPrice)})` : ""}`, index === 0)).join("");
  const supportsSpice = !["drink", "dessert"].includes(product.category);
  const spices = supportsSpice ? product.options.spice.map((name, index) => optionPill("spice", name, name, index === 0)).join("") : "";
  const drinks = product.options.drink.map((option, index) => optionPill("drink", option.id, `${option.name}${option.extraPrice ? ` (+${formatPrice(option.extraPrice)})` : ""}`, index === 0)).join("");
  return `<div class="dialog-product">${includeImage ? `<img src="${assetUrl(product.image)}" alt="${escapeHtml(product.name)}" />` : ""}<div class="dialog-info" data-customizer><span class="eyebrow">${escapeHtml(product.tag)}</span><h2>${escapeHtml(product.name)}</h2><p>${escapeHtml(product.description)}</p><strong class="price">Từ ${formatPrice(product.price)}</strong><div class="option-group"><strong>Chọn kích cỡ</strong><div class="option-list">${sizes}</div></div>${supportsSpice ? `<div class="option-group"><strong>Chọn độ cay</strong><div class="option-list">${spices}</div></div>` : ""}<div class="option-group"><strong>Chọn thức uống</strong><div class="option-list">${drinks}</div></div><div class="option-group"><strong>Số lượng</strong><div class="quantity-control"><button type="button" data-quantity-change="-1">−</button><b data-quantity>1</b><button type="button" data-quantity-change="1">+</button></div></div><div class="dialog-total"><strong data-total>${formatPrice(product.price)}</strong><button class="primary-button" type="button" data-add-customized>Thêm vào giỏ</button></div></div></div>`;
}

function optionPill(group, value, label, checked) {
  return `<label class="option-pill"><input type="radio" name="${group}" value="${escapeHtml(value)}" ${checked ? "checked" : ""} /><span>${escapeHtml(label)}</span></label>`;
}

export function bindCustomizer(root, product, onAdded) {
  const panel = root.querySelector("[data-customizer]");
  if (!panel) return;
  let quantity = 1;
  const selected = (name) => panel.querySelector(`input[name="${name}"]:checked`)?.value;
  const getPricing = () => {
    const size = product.options.size.find((option) => option.id === selected("size")) || product.options.size[0];
    const drink = product.options.drink.find((option) => option.id === selected("drink")) || product.options.drink[0];
    return { size, drink, unitPrice: product.price + size.extraPrice + drink.extraPrice };
  };
  const refresh = () => {
    panel.querySelector("[data-quantity]").textContent = String(quantity);
    panel.querySelector("[data-total]").textContent = formatPrice(getPricing().unitPrice * quantity);
  };
  panel.querySelectorAll("input").forEach((input) => input.addEventListener("change", refresh));
  panel.querySelectorAll("[data-quantity-change]").forEach((button) => button.addEventListener("click", () => {
    quantity = Math.max(1, Math.min(20, quantity + Number(button.dataset.quantityChange)));
    refresh();
  }));
  panel.querySelector("[data-add-customized]").addEventListener("click", () => {
    const { size, drink, unitPrice } = getPricing();
    addCartItem({ productId: product.id, name: product.name, image: product.image, category: product.category, sizeId: size.id, sizeName: size.name, spice: selected("spice"), drinkId: drink.id, drinkName: drink.name, unitPrice, quantity });
    onAdded?.();
  });
}
