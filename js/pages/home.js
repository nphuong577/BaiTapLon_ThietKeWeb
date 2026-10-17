import { loadCatalog, loadPromotions, loadSiteData } from "../core/data-loader.js";
import { setupMobileNav } from "../core/utils.js";
import { productCard } from "../components/product-card.js";
import { setupCartDrawer } from "../components/cart.js";

const state = { products: [], slide: 0, promotion: 0, timer: null, promotionTimer: null };
const previews = document.querySelector("#category-previews");

function renderCategoryPreviews(categories) {
  const productCategories = categories.filter((category) => category.id !== "all");
  previews.innerHTML = productCategories.map((category) => {
    const samples = state.products.filter((product) => product.category === category.id).slice(0, 2);
    if (!samples.length) return "";
    return `<section class="category-preview"><div class="category-preview-heading"><div><span class="eyebrow">Danh mục</span><h2>${category.name}</h2></div><a href="pages/products.html?category=${category.id}">Xem tất cả →</a></div><div class="product-grid">${samples.map((product) => productCard(product, "pages/", false)).join("")}</div></section>`;
  }).join("");
}

function renderSlider(banners) {
  const track = document.querySelector("#slider-track");
  const dots = document.querySelector("#slider-dots");
  track.innerHTML = banners.map((banner, index) => `<div class="slide ${index === 0 ? "active" : ""}"><img src="${banner.image}" alt="${banner.alt}" /></div>`).join("");
  dots.innerHTML = banners.map((_, index) => `<button type="button" class="${index === 0 ? "active" : ""}" data-slide="${index}" aria-label="Đến ảnh ${index + 1}"></button>`).join("");
  const show = (index) => {
    state.slide = (index + banners.length) % banners.length;
    track.querySelectorAll(".slide").forEach((slide, slideIndex) => slide.classList.toggle("active", slideIndex === state.slide));
    dots.querySelectorAll("button").forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === state.slide));
  };
  const autoplay = () => { window.clearInterval(state.timer); state.timer = window.setInterval(() => show(state.slide + 1), 5000); };
  document.querySelector(".slider-arrow.prev").addEventListener("click", () => { show(state.slide - 1); autoplay(); });
  document.querySelector(".slider-arrow.next").addEventListener("click", () => { show(state.slide + 1); autoplay(); });
  dots.querySelectorAll("button").forEach((dot) => dot.addEventListener("click", () => { show(Number(dot.dataset.slide)); autoplay(); }));
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) autoplay();
}

function renderPromotions(promotionData) {
  const promotions = promotionData.promotions;
  const autoplayMs = promotionData.autoplayMs;
  const carousel = document.querySelector("#promotion-carousel");
  const dots = document.querySelector("#promotion-dots");
  carousel.innerHTML = promotions.map((promotion, index) => `
    <article class="promotion-slide ${index === 0 ? "active" : ""}" data-theme="${promotion.theme}">
      <div class="promotion-content"><span class="eyebrow">${promotion.label}</span><h3>${promotion.title}</h3><p>${promotion.description}</p><a class="primary-button" href="${promotion.link}">${promotion.buttonText}</a></div>
      <img src="${promotion.image}" alt="${promotion.title}" />
    </article>`).join("");
  dots.innerHTML = promotions.map((_, index) => `<button type="button" class="${index === 0 ? "active" : ""}" data-promotion="${index}" aria-label="Xem khuyến mãi ${index + 1}"></button>`).join("");

  function showPromotion(index) {
    state.promotion = (index + promotions.length) % promotions.length;
    carousel.querySelectorAll(".promotion-slide").forEach((slide, slideIndex) => slide.classList.toggle("active", slideIndex === state.promotion));
    dots.querySelectorAll("button").forEach((dot, dotIndex) => dot.classList.toggle("active", dotIndex === state.promotion));
  }

  function startAutoplay() {
    window.clearInterval(state.promotionTimer);
    if (autoplayMs > 0 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      state.promotionTimer = window.setInterval(() => showPromotion(state.promotion + 1), autoplayMs);
    }
  }

  document.querySelector("#promotion-prev").addEventListener("click", () => { showPromotion(state.promotion - 1); startAutoplay(); });
  document.querySelector("#promotion-next").addEventListener("click", () => { showPromotion(state.promotion + 1); startAutoplay(); });
  dots.querySelectorAll("button").forEach((dot) => dot.addEventListener("click", () => { showPromotion(Number(dot.dataset.promotion)); startAutoplay(); }));
  carousel.addEventListener("mouseenter", () => window.clearInterval(state.promotionTimer));
  carousel.addEventListener("mouseleave", startAutoplay);
  startAutoplay();
}

async function init() {
  setupMobileNav();
  setupCartDrawer();
  try {
    const site = await loadSiteData();
    const catalog = await loadCatalog();
    const promotionData = await loadPromotions();
    state.products = catalog.products;
    renderSlider(site.banners);
    renderCategoryPreviews(catalog.categories);
    renderPromotions(promotionData);
  } catch (error) {
    previews.innerHTML = '<div class="empty-state"><strong>Không tải được dữ liệu.</strong><p>Hãy chạy website qua local server thay vì mở file trực tiếp.</p></div>';
    console.error(error);
  }
}

init();
