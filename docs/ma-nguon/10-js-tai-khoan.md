# JavaScript đăng nhập và đăng ký

#### [`js/pages/auth.js`](../../js/pages/auth.js) — đăng nhập/đăng ký demo

| Hàm | Tác dụng |
|---|---|
| `showError(inputId, message)` | Cập nhật lỗi cạnh input và thuộc tính trợ năng `aria-invalid` |
| `showFeedback(message, isError)` | Hiện thông báo chung; tô kiểu lỗi khi `isError` là đúng |
| `switchForm(mode, keepMessage)` | Chuyển giữa đăng nhập/đăng ký, đồng bộ tab, ẩn/hiện form và đổi nội dung giới thiệu |
| `showAccount()` | Đọc phiên đăng nhập; hiện khu vực tài khoản hoặc form đăng nhập |

Các sự kiện gửi form kiểm tra dữ liệu bằng biểu thức Regex:

- Đăng ký kiểm tra tên, email, số điện thoại, độ mạnh mật khẩu và xác nhận mật khẩu; sau đó kiểm tra email trùng, lưu người dùng và chuyển sang đăng nhập.
- Đăng nhập tìm người dùng có email/mật khẩu khớp; nếu đúng thì lưu phiên và chuyển về trang chủ.
- Đăng xuất xóa phiên đăng nhập.
- Khi nhập lại vào trường có lỗi, lỗi của trường đó được xóa.


### 9.13. `js/pages/auth.js`: đăng ký, đăng nhập và đăng xuất

Các Regex được định nghĩa một lần ở đầu module:

```js
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_REGEX = /^0[35789][0-9]{8}$/;
const NAME_REGEX = /^[\p{L}\s'-]{2,60}$/u;
```

- Email: kiểm tra hình dạng cơ bản có tên, `@`, miền và phần đuôi.
- Điện thoại: chấp nhận số Việt Nam bắt đầu bằng `0`, tiếp theo là `3/5/7/8/9`, rồi 8 chữ số.
- Tên: cho phép chữ Unicode, khoảng trắng, dấu nháy và gạch nối, dài 2–60 ký tự.
- Mật khẩu có một Regex riêng yêu cầu tối thiểu 8 ký tự, chữ thường, chữ hoa, số và ký tự đặc biệt.

Hiện lỗi ở cạnh trường:

```js
function showError(inputId, message) {
  const input = document.querySelector(`#${inputId}`);
  const error = document.querySelector(`[data-error-for="${inputId}"]`);
  input.setAttribute("aria-invalid", message ? "true" : "false");
  error.textContent = message || "";
}
```

`inputId` dùng để tìm cả input và vùng báo lỗi tương ứng. Nếu có thông báo thì input nhận `aria-invalid="true"`; nếu không có thì đánh dấu sai là false và xóa nội dung lỗi.

Chuyển giữa hai biểu mẫu:

```js
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
```

`mode` nhận `"login"` hoặc `"register"`. Class `active` làm CSS hiện form tương ứng; `aria-hidden` đánh dấu form đang ẩn; phần còn lại cập nhật tab và nội dung bên trái. Nếu `keepMessage` không đúng thì xóa thông báo chung.

`showAccount()` đọc session và chọn giữa màn hình form với màn hình tài khoản:

```js
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
```

`Boolean(user)` đổi giá trị session thành đúng/sai. Khi đã đăng nhập, các form/tab bị ẩn và `#account-view` hiện ra; nếu chưa đăng nhập thì form login được chọn.

**Lỗi thật cần biết:** HTML hiện không có phần tử `.notice`; `querySelector` trả `null`, rồi `.hidden` gây `TypeError`. Do đó hàm có thể dừng trước khi cập nhật các phần tử phía sau. Muốn sửa phải thêm phần tử đó vào HTML hoặc thay dòng này bằng cách kiểm tra phần tử tồn tại.

Handler đăng ký đầy đủ:

```js
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
  const passwordError = PASSWORD_REGEX.test(password)
    ? ""
    : "Cần 8 ký tự, chữ thường, chữ hoa, số và ký tự đặc biệt.";
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
```

`preventDefault()` ngăn trình duyệt tải lại trang theo cách gửi form truyền thống. `FormData` lấy giá trị theo thuộc tính `name` của input. Email được chuẩn hóa chữ thường để tránh đăng ký cùng email khác kiểu viết hoa/thường. `.test()` trả về đúng/sai khi chuỗi khớp Regex. Toán tử `? :` tạo ra thông báo lỗi nếu sai, hoặc chuỗi rỗng nếu đúng. Các lỗi được gắn vào đúng trường. Nếu chỉ cần một giá trị không hợp lệ, nhánh `return` ngăn việc lưu. `.some()` kiểm tra có tài khoản nào dùng email đó chưa. Cuối cùng, `Date.now()` tạo mã số đơn giản và danh sách được ghi lại bằng `storage.setUsers()`.

Sau khi lưu, handler gọi `registerForm.reset()`, đặt email vào ô đăng nhập, chuyển tab bằng `switchForm("login", true)`, hiển thị thông báo và gọi `showToast()`.

Handler đăng nhập đầy đủ:

```js
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);
  const email = formData.get("email").trim().toLowerCase();
  const password = formData.get("password");
  const emailError = EMAIL_REGEX.test(email) ? "" : "Email không đúng định dạng.";
  const passwordError = PASSWORD_REGEX.test(password)
    ? ""
    : "Mật khẩu chưa đúng định dạng.";

  showError("login-email", emailError);
  showError("login-password", passwordError);
  if (emailError || passwordError) return;

  const user = storage.getUsers().find(
    (item) => item.email === email && item.password === password
  );
  if (!user) {
    showFeedback("Email hoặc mật khẩu không đúng.", true);
    return;
  }

  storage.setSession({
    userId: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone
  });
  location.href = "../index.html";
});
```

Email được chuẩn hóa chữ thường giống luồng đăng ký. Sau khi kiểm tra định dạng, `.find()` tìm đúng tài khoản có cả email và mật khẩu trùng; nếu không có, người dùng nhận thông báo chung, không tiết lộ trường nào sai. Khi đúng, chỉ thông tin cần dùng làm phiên được lưu; sau đó điều hướng về trang chủ. Lưu ý mật khẩu được lưu dạng đọc được trong localStorage, nên chỉ dùng dữ liệu giả cho bản demo.

Đăng xuất xóa phiên, cập nhật giao diện và hiện thông báo:

```js
document.querySelector("#logout-button").addEventListener("click", () => {
  storage.clearSession();
  showAccount();
  showToast("Đã đăng xuất");
});
```

`clearSession()` không xóa danh sách tài khoản hoặc đơn hàng. `showAccount()` đọc lại trạng thái mới để hiện biểu mẫu đăng nhập.

Cuối file gọi `updateCartBadges()`, `setupMobileNav()` và `showAccount()` để khởi tạo trạng thái ngay khi module được tải.
