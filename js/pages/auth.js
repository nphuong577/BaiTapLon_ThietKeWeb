import { storage } from "../core/storage.js";
import { updateCartBadges } from "../components/cart.js";
import { setupMobileNav, showToast } from "../core/utils.js";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^0[35789][0-9]{8}$/;
const NAME_REGEX = /^[\p{L}\s'-]{2,60}$/u;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/;

const loginForm = document.querySelector("#login-form");
const registerForm = document.querySelector("#register-form");
const formStage = document.querySelector("#auth-form-stage");
const accountView = document.querySelector("#account-view");
const feedback = document.querySelector("#auth-feedback");

function showError(inputId, message) {
  const input = document.querySelector(`#${inputId}`);
  const error = document.querySelector(`[data-error-for="${inputId}"]`);
  input.setAttribute("aria-invalid", message ? "true" : "false");
  error.textContent = message || "";
}

function showFeedback(message, isError) {
  feedback.textContent = message || "";
  feedback.classList.toggle("error", Boolean(isError));
}

function switchForm(mode, keepMessage) {
  const isRegister = mode === "register";
  loginForm.classList.toggle("active", !isRegister);
  registerForm.classList.toggle("active", isRegister);
  loginForm.setAttribute("aria-hidden", String(isRegister));
  registerForm.setAttribute("aria-hidden", String(!isRegister));

  document.querySelectorAll("[data-auth-tab]").forEach((button) => {
    const isActive = button.dataset.authTab === mode;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });

  document.querySelector("#auth-visual-title").textContent = isRegister
    ? "Tạo tài khoản, nhận món ngon nhanh hơn"
    : "Đăng nhập để bữa ngon tiện hơn";
  document.querySelector("#auth-visual-copy").textContent = isRegister
    ? "Đăng ký bằng email để lưu thông tin giao hàng trên trình duyệt này."
    : "Lưu thông tin giao hàng và xem lại đơn đặt thử nghiệm trên trình duyệt này.";

  if (!keepMessage) showFeedback("");
}

function showAccount() {
  const user = storage.getSession();
  const loggedIn = Boolean(user);
  document.querySelector(".auth-tabs").hidden = loggedIn;
  document.querySelector(".notice").hidden = loggedIn;
  feedback.hidden = loggedIn;
  formStage.hidden = loggedIn;
  accountView.hidden = !loggedIn;

  if (user) {
    document.querySelector("#account-name").textContent = `Xin chào, ${user.name}`;
    document.querySelector("#account-email").textContent = user.email;
  } else {
    switchForm("login");
  }
}

document.querySelectorAll("[data-auth-tab]").forEach((button) => {
  button.addEventListener("click", () => switchForm(button.dataset.authTab));
});

document.querySelectorAll(".auth-form input").forEach((input) => {
  input.addEventListener("input", () => showError(input.id, ""));
});

registerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(registerForm);
  const name = formData.get("name").trim();
  const email = formData.get("email").trim().toLowerCase();
  const phone = formData.get("phone").trim();
  const password = formData.get("password");
  const confirm = formData.get("confirm");

  const nameError = NAME_REGEX.test(name) ? "" : "Họ tên chưa hợp lệ.";
  const emailError = EMAIL_REGEX.test(email) ? "" : "Email không đúng định dạng.";
  const phoneError = PHONE_REGEX.test(phone) ? "" : "Số điện thoại Việt Nam chưa hợp lệ.";
  const passwordError = PASSWORD_REGEX.test(password) ? "" : "Cần 8 ký tự, chữ thường, chữ hoa, số và ký tự đặc biệt.";
  const confirmError = password === confirm ? "" : "Mật khẩu nhập lại không khớp.";

  showError("register-name", nameError);
  showError("register-email", emailError);
  showError("register-phone", phoneError);
  showError("register-password", passwordError);
  showError("register-confirm", confirmError);

  if (nameError || emailError || phoneError || passwordError || confirmError) {
    showFeedback("Vui lòng kiểm tra lại thông tin.", true);
    return;
  }

  const users = storage.getUsers();
  if (users.some((user) => user.email === email)) {
    showError("register-email", "Email này đã được đăng ký.");
    return;
  }

  users.push({ id: Date.now(), name, email, phone, password });
  storage.setUsers(users);
  registerForm.reset();
  document.querySelector("#login-email").value = email;
  switchForm("login", true);
  showFeedback("Đăng ký thành công. Hãy đăng nhập.");
  showToast("Đăng ký thành công");
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const email = formData.get("email").trim().toLowerCase();
  const password = formData.get("password");
  const emailError = EMAIL_REGEX.test(email) ? "" : "Email không đúng định dạng.";
  const passwordError = PASSWORD_REGEX.test(password) ? "" : "Mật khẩu chưa đúng định dạng.";

  showError("login-email", emailError);
  showError("login-password", passwordError);
  if (emailError || passwordError) return;

  const user = storage.getUsers().find((item) => item.email === email && item.password === password);
  if (!user) {
    showFeedback("Email hoặc mật khẩu không đúng.", true);
    return;
  }

  storage.setSession({ userId: user.id, name: user.name, email: user.email, phone: user.phone });
  location.href = "../index.html";
});

document.querySelector("#logout-button").addEventListener("click", () => {
  storage.clearSession();
  showAccount();
  showToast("Đã đăng xuất");
});

updateCartBadges();
setupMobileNav();
showAccount();
