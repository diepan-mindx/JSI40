// ls.js  (Login - Signup Controller)

import { auth } from "./firebase_config.js";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

import { User } from "./entities.js";

// ==========================
// DOM
// ==========================
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const toggleText = document.getElementById("toggleText");
const formTitle = document.getElementById("formTitle");

let isLogin = true;

// ==========================
// AUTO LOGIN CHECK
// ==========================
let currentUserID = localStorage.getItem("currentUserID");
if (currentUserID) {
  location.href = "../index.html";
}

// ==========================
// TOGGLE UI
// ==========================
function updateForm() {
  if (isLogin) {
    loginForm.classList.add("active");
    registerForm.classList.remove("active");

    formTitle.textContent = "Đăng nhập";

    toggleText.innerHTML = `Chưa có tài khoản?
       <a href="#" id="toggleLink">Đăng ký</a>`;
  } else {
    loginForm.classList.remove("active");
    registerForm.classList.add("active");

    formTitle.textContent = "Đăng ký";

    toggleText.innerHTML = `Đã có tài khoản?
       <a href="#" id="toggleLink">Đăng nhập</a>`;
  }

  document.getElementById("toggleLink").addEventListener("click", toggle);
}

function toggle(e) {
  e.preventDefault();
  isLogin = !isLogin;
  updateForm();
}

document.getElementById("toggleLink").addEventListener("click", toggle);

// ==========================
// LOGIN
// ==========================
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("login_user").value.trim();

  const password = document.getElementById("login_password").value;

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);

    const uid = cred.user.uid;

    // save local session
    localStorage.setItem("currentUserID", uid);

    alert("Đăng nhập thành công!");

    location.href = "../index.html";
  } catch (err) {
    console.error(err);

    alert("Sai email hoặc mật khẩu!");
  }
});

// ==========================
// REGISTER
// ==========================
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // ===== GET DATA =====
  const username = document.getElementById("reg_username").value.trim();

  const email = document.getElementById("reg_email").value.trim();

  const wcaID = document.getElementById("reg_wca_id").value.trim();

  const password = document.getElementById("reg_password").value;

  const confirm = document.getElementById("reg_confirm").value;

  // ======================
  // VALIDATION
  // ======================
  if (username.length < 3 || username.length > 18) {
    alert("Username từ 3 → 18 ký tự");
    return;
  }

  if (password.length < 6) {
    alert("Mật khẩu tối thiểu 6 ký tự");
    return;
  }

  if (password !== confirm) {
    alert("Mật khẩu xác nhận không khớp");
    return;
  }

  // ======================
  // CHECK DUP USERNAME
  // ======================
  const taken = await User.isUsernameTaken(username);

  if (taken) {
    alert("Username đã tồn tại!");
    return;
  }

  // ======================
  // CREATE AUTH
  // ======================
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    const uid = cred.user.uid;

    // ======================
    // SAVE FIRESTORE USER
    // ======================
    const newUser = new User(username, email, uid, wcaID || null);

    await newUser.save();

    // save session
    localStorage.setItem("currentUserID", uid);

    alert("Đăng ký thành công!");

    location.href = "../index.html";
  } catch (err) {
    console.error(err);

    if (err.code === "auth/email-already-in-use") {
      alert("Email đã được sử dụng!");
    } else {
      alert("Đăng ký thất bại!");
    }
  }
});
