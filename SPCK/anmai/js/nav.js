// ===== NAVBAR LOGIN SYSTEM =====

// lấy user từ localStorage
function getCurrentUser() {
  const data = localStorage.getItem("currentUser");
  return data ? JSON.parse(data) : null;
}

// DOM
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const accountLink = document.getElementById("account-link");
const accountName = document.getElementById("account-name");

// cập nhật navbar
function updateNavbar() {
  const user = getCurrentUser();

  if (user) {
    // đã login
    loginBtn.classList.add("d-none");
    logoutBtn.classList.remove("d-none");
    accountLink.classList.remove("d-none");

    accountName.textContent = user.name || user.email || "Account";
  } else {
    // chưa login
    loginBtn.classList.remove("d-none");
    logoutBtn.classList.add("d-none");
    accountLink.classList.add("d-none");
  }
}

// logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", (e) => {
    e.preventDefault();

    localStorage.removeItem("currentUser");

    updateNavbar();

    window.location.href = "/index.html";
  });
}

// load navbar khi mở trang
document.addEventListener("DOMContentLoaded", updateNavbar);
