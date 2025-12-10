// =================================================
// kiem tra neu nguoi dung chua dang nhap -> chuyen trang
let currentUserUID = localStorage.getItem("currentUser");
if (!currentUserUID) {
  window.location.href = "./pages/login.html";
}

// =================================================
// dan link cho nav
const links = {
  "home-link": "./index.html",
  "home-link-2": "./index.html",
  "account-link": "./pages/account.html",
};
// neu la trang con -> them ../ cho link
if (location.href.includes("pages/")) {
  for (const id in links) {
    links[id] = "." + links[id];
  }
}
// gan link
for (const id in links) {
  document.querySelector(`#${id}`).href = links[id];
}
