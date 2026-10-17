const ROOT_URL = new URL("../../", import.meta.url);
let toastTimer;

export function formatPrice(value) {
  return `${Number(value).toLocaleString("vi-VN")} ₫`;
}
export const assetUrl = (path) => new URL(path, ROOT_URL).href;

export function escapeHtml(value = "") {
  return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]);
}

export function showToast(message) {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

export function setupMobileNav() {
  const button = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  button?.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
  });
}
