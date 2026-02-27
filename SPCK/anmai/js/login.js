import { auth } from "./firebase_config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

// ====== CHUYỂN FORM ======
const btnShowLogin = document.getElementById("showLoginFormBtn");
const btnShowSignup = document.getElementById("showSignupFormBtn");
const formLogin = document.getElementById("loginForm");
const formSignup = document.getElementById("signupForm");

btnShowLogin.onclick = () => {
  formLogin.classList.remove("d-none");
  formSignup.classList.add("d-none");
};

btnShowSignup.onclick = () => {
  formSignup.classList.remove("d-none");
  formLogin.classList.add("d-none");
};

// ====== INPUT ======
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const signupEmail = document.getElementById("signupEmail");
const signupPassword = document.getElementById("signupPassword");

// ====== NAV ======
const navLogin = document.getElementById("login-btn");
const navLogout = document.getElementById("logout-btn");

// ====== THEO DÕI ĐĂNG NHẬP ======
onAuthStateChanged(auth, (user) => {
  if (user) {
    navLogin.classList.add("d-none");
    navLogout.classList.remove("d-none");
  } else {
    navLogin.classList.remove("d-none");
    navLogout.classList.add("d-none");
  }
});

// ====== ĐĂNG KÝ ======
formSignup.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = signupEmail.value.trim();
  const password = signupPassword.value;

  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Đăng ký thành công!");
    btnShowLogin.click();
  } catch (err) {
    alert(err.message);
  }
});

// ====== ĐĂNG NHẬP ======
formLogin.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = loginEmail.value.trim();
  const password = loginPassword.value;

  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);

    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        uid: user.uid,
        email: user.email,
        name: user.email,
      }),
    );
    alert("Đăng nhập thành công!");
    window.location.href = "../index.html";
  } catch (err) {
    alert("Sai email hoặc mật khẩu!");
  }
});

// ====== ĐĂNG XUẤT ======
navLogout.addEventListener("click", async (e) => {
  e.preventDefault();
  await signOut(auth);
  alert("Đã đăng xuất!");
  window.location.href = "../index.html";
});
