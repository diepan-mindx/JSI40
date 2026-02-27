// nav.js
import { db, auth } from "./firebase_config.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-auth.js";

// ========== LOGIN / LOGOUT ==========
window.addEventListener("DOMContentLoaded", async () => {
  const loginLink = document.getElementById("ls");
  const logoutLink = document.getElementById("logoutLink");

  const isLoggedIn = localStorage.getItem("currentUserID") != null;

  if (isLoggedIn) {
    loginLink.style.display = "none";
    logoutLink.style.display = "inline";
  } else {
    loginLink.style.display = "inline";
    logoutLink.style.display = "none";
  }

  // Đăng xuất
  logoutLink.addEventListener("click", async (e) => {
    e.preventDefault();

    localStorage.removeItem("currentUserID");
    // dang xuat ben Firebase Auth
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        window.location.href = "index.html";
      })
      .catch((error) => {
        // An error happened.
        console.error("Error signing out: ", error);
      });
  });
});

// ========== MENU HAMBURGER ==========
document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.getElementById("menuBtn");
  const sidebar = document.querySelector(".sidebar");
  const overlay = document.getElementById("overlay");

  menuBtn.addEventListener("click", () => {
    sidebar.classList.add("active");
    overlay.classList.add("active");
  });

  overlay.addEventListener("click", () => {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  });
});

// ========== TARGET TIME ==========
document.getElementById("target-time-btn").addEventListener("click", () => {
  document.getElementById("target-time-modal").style.display = "block";
});

document
  .getElementById("set-target-btn")
  .addEventListener("click", async () => {
    const value = parseFloat(document.getElementById("target-input").value);

    if (!isNaN(value)) {
      const settingRef = doc(db, "settings", "targetTime");
      await setDoc(settingRef, { value });
    }

    document.getElementById("target-time-modal").style.display = "none";
  });

// ========== THEME SWITCH ==========
const themeSwitch = document.getElementById("themeSwitch");
themeSwitch.addEventListener("change", () => {
  document.body.classList.toggle("light", themeSwitch.checked);
  document.getElementById("themeName").innerText = themeSwitch.checked
    ? "Sáng"
    : "Tối";
});

// ========== WCA API CODE (giữ nguyên hành vi) ==========
const params = new URLSearchParams(window.location.search);
const code = params.get("code");

if (code) {
  const sessionRef = doc(db, "session", "current");
  updateDoc(sessionRef, { WCAAPICODE: code });
}
