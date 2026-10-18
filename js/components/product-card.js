import { assetUrl, escapeHtml, formatPrice } from "../core/utils.js";

export function productCard(product, pagePrefix = "pages/", showOrder = true) {
  const productUrl = `${pagePrefix}product.html?id=${encodeURIComponent(product.id)}`;
  const action = showOrder
    ? `<button class="order-button" type="button" data-order-id="${escapeHtml(product.id)}">Chọn món</button>`
    : `<a class="order-button" href="${productUrl}">Xem chi tiết</a>`;

  return `
    <article class="product-card">
      <a class="product-image-wrap" href="${productUrl}">
        <img src="${assetUrl(product.image)}" alt="${escapeHtml(product.name)}" loading="lazy" />
        <span class="tag">${escapeHtml(product.tag)}</span>
      </a>
      <div class="product-body">
        <h3><a href="${productUrl}">${escapeHtml(product.name)}</a></h3>
        <p>${escapeHtml(product.description)}</p>
        <div class="product-footer"><strong class="price">${formatPrice(product.price)}</strong>${action}</div>
      </div>
    </article>`;
}
