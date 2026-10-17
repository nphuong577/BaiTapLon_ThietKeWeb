const DATA_ROOT = new URL("../../data/", import.meta.url);

async function getJson(path) {
  const response = await fetch(new URL(path, DATA_ROOT));
  if (!response.ok) throw new Error(`Không thể tải ${path} (${response.status})`);
  return response.json();
}

export async function loadSiteData() {
  return getJson("site.json");
}

export async function loadPromotions() {
  return getJson("promotions.json");
}

export async function loadDiscountRules() {
  const data = await getJson("discounts.json");
  return data.rules;
}

export async function loadCatalog() {
  const { categories } = await getJson("categories.json");
  const productCategories = categories.filter((category) => category.id !== "all");
  const products = [];

  for (const category of productCategories) {
    const data = await getJson(`products/${category.id}.json`);
    products.push(...data.products);
  }

  return { categories, products };
}

export async function findProduct(productId) {
  const catalog = await loadCatalog();
  return catalog.products.find((product) => product.id === productId) || null;
}
