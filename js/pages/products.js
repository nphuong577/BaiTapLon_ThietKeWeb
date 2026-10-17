import { loadCatalog } from "../core/data-loader.js";
import { setupMobileNav } from "../core/utils.js";
import { productCard } from "../components/product-card.js";
import { setupCartDrawer } from "../components/cart.js";
import { bindCustomizer, customizerMarkup } from "../components/product-customizer.js";

const state = { products: [], categories: [], category: new URLSearchParams(location.search).get("category") || "all", search: "" };
const grid = document.querySelector("#product-grid");
const tabs = document.querySelector("#category-tabs");
const dialog = document.querySelector("#product-dialog");

function normalize(value) { return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("vi"); }
function filteredProducts() {
  const query = normalize(state.search.trim());
  return state.products.filter((product) => (state.category === "all" || product.category === state.category) && (!query || normalize(`${product.name} ${product.description}`).includes(query)));
}
function renderProducts() {
  const products = filteredProducts();
  grid.innerHTML = products.length ? products.map((product) => productCard(product, "")).join("") : '<div class="empty-state"><strong>Không tìm thấy sản phẩm phù hợp.</strong><p>Hãy thử từ khóa hoặc danh mục khác.</p></div>';
  document.querySelector("#result-count").textContent = `${products.length} sản phẩm`;
  document.querySelector("#catalog-title").textContent = state.categories.find((category) => category.id === state.category)?.name || "Tất cả sản phẩm";
  grid.querySelectorAll("[data-order-id]").forEach((button) => button.addEventListener("click", () => openCustomizer(button.dataset.orderId)));
}
function renderTabs() {
  tabs.innerHTML = state.categories.map((category) => `<button type="button" class="${category.id === state.category ? "active" : ""}" data-category="${category.id}">${category.name}</button>`).join("");
  tabs.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
    state.category = button.dataset.category;
    const url = new URL(location.href);
    if (state.category === "all") url.searchParams.delete("category"); else url.searchParams.set("category", state.category);
    history.replaceState({}, "", url);
    renderTabs(); renderProducts();
  }));
}
function openCustomizer(productId) {
  const product = state.products.find((item) => item.id === productId);
  if (!product) return;
  document.querySelector("#dialog-content").innerHTML = customizerMarkup(product);
  bindCustomizer(dialog, product, () => dialog.close());
  dialog.showModal();
}
async function init() {
  setupMobileNav(); setupCartDrawer();
  dialog.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => { if (event.target === dialog) dialog.close(); });
  document.querySelector("#search-input").addEventListener("input", (event) => { state.search = event.target.value; renderProducts(); });
  try {
    const catalog = await loadCatalog();
    state.products = catalog.products; state.categories = catalog.categories;
    if (!state.categories.some((category) => category.id === state.category)) state.category = "all";
    renderTabs(); renderProducts();
  } catch (error) {
    grid.innerHTML = '<div class="empty-state"><strong>Không tải được dữ liệu.</strong><p>Hãy chạy website qua local server.</p></div>';
    console.error(error);
  }
}
init();
