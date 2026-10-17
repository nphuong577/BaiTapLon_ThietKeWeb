# JavaScript trang chủ

#### [`js/pages/home.js`](../../js/pages/home.js) — trang chủ

| Hàm | Tác dụng |
|---|---|
| `renderCategoryPreviews(categories)` | Lọc danh mục đặc biệt `all`; lấy tối đa hai món đầu mỗi danh mục và tạo nhóm thẻ món |
| `renderSlider(banners)` | Tạo ảnh banner, nút chấm, nút trước/sau và tự chuyển mỗi 5 giây; không tự chạy nếu người dùng bật giảm chuyển động |
| `renderPromotions(promotionData)` | Vẽ slide khuyến mãi, nút điều khiển, chấm chọn; tạm dừng khi rê chuột trên khung và dùng thời gian `autoplayMs` từ JSON |
| `init()` | Thiết lập menu/giỏ, tải thông tin site, catalog và khuyến mãi rồi gọi các hàm render; hiện thông báo lỗi nếu không tải được |

Trong `renderSlider()`, `show(index)` chọn slide có chỉ số vòng quanh danh sách và đồng bộ chấm; `autoplay()` khởi động lại đồng hồ. Trong `renderPromotions()`, `showPromotion(index)` chọn slide khuyến mãi; `startAutoplay()` bắt đầu lại đồng hồ nếu được bật.


### 9.10. `js/pages/home.js`: trang chủ

Trạng thái dùng chung trong trang:

```js
const state = {
  products: [],
  slide: 0,
  promotion: 0,
  timer: null,
  promotionTimer: null
};
const previews = document.querySelector("#category-previews");
```

`state` giữ danh sách món, chỉ số slide hiện tại và mã đồng hồ tự chạy để có thể dừng đồng hồ cũ. `previews` trỏ đến vùng HTML để đổ danh mục xem trước.

#### `renderCategoryPreviews(categories)`

```js
function renderCategoryPreviews(categories) {
  const productCategories = categories.filter((category) => category.id !== "all");
  previews.innerHTML = productCategories.map((category) => {
    const samples = state.products
      .filter((product) => product.category === category.id)
      .slice(0, 2);
    if (!samples.length) return "";
    return `<section class="category-preview">
      <div class="category-preview-heading">
        <div><span class="eyebrow">Danh mục</span><h2>${category.name}</h2></div>
        <a href="pages/products.html?category=${category.id}">Xem tất cả →</a>
      </div>
      <div class="product-grid">
        ${samples.map((product) => productCard(product, "pages/", false)).join("")}
      </div>
    </section>`;
  }).join("");
}
```

Hàm này không tải dữ liệu; nó nhận danh sách danh mục đã tải và dùng `state.products` đã có sẵn. `.filter()` lấy món cùng category; `.slice(0, 2)` giới hạn hai món xem trước; `productCard(..., "pages/", false)` tạo card có liên kết chi tiết thay vì nút “Chọn món”. Cuối cùng, các section được nối thành một chuỗi và đặt vào `previews.innerHTML`.

> `category.name` và `category.id` trong đoạn tạo HTML được đưa trực tiếp vào chuỗi. Với dữ liệu do người dùng nhập hoặc nguồn không đáng tin, cần escape text/attribute trước khi chèn.

#### `renderSlider(banners)`

```js
function renderSlider(banners) {
  const track = document.querySelector("#slider-track");
  const dots = document.querySelector("#slider-dots");
  track.innerHTML = banners.map((banner, index) =>
    `<div class="slide ${index === 0 ? "active" : ""}">
       <img src="${banner.image}" alt="${banner.alt}" />
     </div>`).join("");
  dots.innerHTML = banners.map((_, index) =>
    `<button type="button" data-slide="${index}"
      aria-label="Đến ảnh ${index + 1}"></button>`).join("");

  const show = (index) => {
    state.slide = (index + banners.length) % banners.length;
    track.querySelectorAll(".slide").forEach((slide, slideIndex) =>
      slide.classList.toggle("active", slideIndex === state.slide));
    dots.querySelectorAll("button").forEach((dot, dotIndex) =>
      dot.classList.toggle("active", dotIndex === state.slide));
  };
  const autoplay = () => {
    window.clearInterval(state.timer);
    state.timer = window.setInterval(() => show(state.slide + 1), 5000);
  };
  document.querySelector(".slider-arrow.prev").addEventListener("click", () => {
    show(state.slide - 1);
    autoplay();
  });
  document.querySelector(".slider-arrow.next").addEventListener("click", () => {
    show(state.slide + 1);
    autoplay();
  });
  dots.querySelectorAll("button").forEach((dot) =>
    dot.addEventListener("click", () => {
      show(Number(dot.dataset.slide));
      autoplay();
    }));
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) autoplay();
}
```

`% banners.length` làm chỉ số quay vòng: lùi từ ảnh đầu sẽ tới ảnh cuối, tiến từ ảnh cuối sẽ về ảnh đầu. `classList.toggle("active", điều_kiện)` bật class đúng một slide và đúng một chấm. Bấm mũi tên hoặc chấm sẽ đổi slide rồi khởi động lại đồng hồ 5 giây. `matchMedia("(prefers-reduced-motion: reduce)")` tôn trọng cài đặt giảm chuyển động của người dùng.

#### `renderPromotions(promotionData)`

Hàm này dựng slide, nút chấm, kết nối các nút điều khiển và quản lý tự chạy:

```js
function renderPromotions(promotionData) {
  const promotions = promotionData.promotions;
  const autoplayMs = promotionData.autoplayMs;
  const carousel = document.querySelector("#promotion-carousel");
  const dots = document.querySelector("#promotion-dots");

  carousel.innerHTML = promotions.map((promotion, index) => `
    <article class="promotion-slide ${index === 0 ? "active" : ""}"
      data-theme="${promotion.theme}">
      <div class="promotion-content">
        <span class="eyebrow">${promotion.label}</span>
        <h3>${promotion.title}</h3>
        <p>${promotion.description}</p>
        <a class="primary-button" href="${promotion.link}">
          ${promotion.buttonText}
        </a>
      </div>
      <img src="${promotion.image}" alt="${promotion.title}" />
    </article>`).join("");
  dots.innerHTML = promotions.map((_, index) => `
    <button type="button" class="${index === 0 ? "active" : ""}"
      data-promotion="${index}"
      aria-label="Xem khuyến mãi ${index + 1}"></button>`).join("");

  function showPromotion(index) {
    state.promotion = (index + promotions.length) % promotions.length;
    carousel.querySelectorAll(".promotion-slide").forEach((slide, slideIndex) =>
      slide.classList.toggle("active", slideIndex === state.promotion));
    dots.querySelectorAll("button").forEach((dot, dotIndex) =>
      dot.classList.toggle("active", dotIndex === state.promotion));
  }

  function startAutoplay() {
    window.clearInterval(state.promotionTimer);
    if (autoplayMs > 0 &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      state.promotionTimer =
        window.setInterval(() => showPromotion(state.promotion + 1), autoplayMs);
    }
  }

  document.querySelector("#promotion-prev").addEventListener("click", () => {
    showPromotion(state.promotion - 1);
    startAutoplay();
  });
  document.querySelector("#promotion-next").addEventListener("click", () => {
    showPromotion(state.promotion + 1);
    startAutoplay();
  });
  dots.querySelectorAll("button").forEach((dot) =>
    dot.addEventListener("click", () => {
      showPromotion(Number(dot.dataset.promotion));
      startAutoplay();
    }));
  carousel.addEventListener("mouseenter", () =>
    window.clearInterval(state.promotionTimer));
  carousel.addEventListener("mouseleave", startAutoplay);
  startAutoplay();
}
```

`(index + promotions.length) % promotions.length` làm chỉ số quay vòng. `classList.toggle("active", điều_kiện)` đồng bộ slide đang thấy và nút chấm. `startAutoplay()` hủy interval trước khi tạo cái mới để tránh nhiều đồng hồ chạy song song; `autoplayMs <= 0` hoặc cài đặt giảm chuyển động sẽ tắt tự chạy. `mouseenter` dừng timer khi rê chuột lên khung; `mouseleave` chạy lại.

```js
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
    previews.innerHTML = "<div class='empty-state'>Không tải được dữ liệu.</div>";
    console.error(error);
  }
}

init();
```

`init()` là điểm bắt đầu của trang chủ. Các hàm tải được `await` trong một `try`; nếu bất kỳ bước tải nào lỗi thì `catch` ghi lỗi vào Console và đưa thông báo lên trang. Dòng `init()` ở cuối thật sự gọi hàm khởi tạo.
