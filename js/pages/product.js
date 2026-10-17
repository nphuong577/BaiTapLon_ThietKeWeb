import { findProduct } from "../core/data-loader.js";
import { updateCartBadges } from "../components/cart.js";
import { bindCustomizer, customizerMarkup } from "../components/product-customizer.js";
import { setupMobileNav } from "../core/utils.js";

const container = document.querySelector("#product-detail");
const productId = new URLSearchParams(location.search).get("id");

async function init() {
  setupMobileNav();
  updateCartBadges();
  try {
    const product = productId ? await findProduct(productId) : null;
    if (!product) {
      container.innerHTML = '<div class="not-found"><h1>Không tìm thấy món</h1><p>Sản phẩm có thể đã được thay đổi hoặc đường dẫn chưa đúng.</p><a class="primary-button" href="products.html">Xem thực đơn</a></div>';
      return;
    }
    document.title = `${product.name} | FARMY`;
    document.querySelector("#breadcrumb-name").textContent = product.name;
    container.innerHTML = customizerMarkup(product);
    bindCustomizer(container, product);
  } catch (error) {
    container.innerHTML = '<div class="not-found"><h1>Không tải được dữ liệu</h1><p>Hãy mở dự án qua local server.</p></div>';
    console.error(error);
  }
}

init();
