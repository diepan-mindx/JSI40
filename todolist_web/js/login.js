import { auth, db } from "./firebase_config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  or,
  getDoc,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { User } from "./entities.js";

// =================================================
// neu da dang nhap thi chuyen ve trang home
let currentUserUID = localStorage.getItem("currentUser");
if (currentUserUID) {
  window.location.href = "../index.html";
}

// =================================================
// login
const loginForm = document.getElementById("signin-form");
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  // sign in with firebase auth
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // luu vao local storage
      localStorage.setItem("currentUser", user.uid);
      // thong bao dang nhap thanh cong -> chuyen sang home
      alert("Đăng nhập thành công!");
      // xoa task luu tam de load lai
      localStorage.removeItem("tasks");
      location.href = "../index.html";
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      alert("Đăng nhập thất bại! Vui lòng kiểm tra lại email và mật khẩu.");
      console.error(errorMessage);
    });
});

// =================================================
// signup
const signupForm = document.getElementById("signup-form");
function validateSignupForm(email, username, password, confirmPassword) {
  // username >= 6 + no space
  if (username.length < 6) {
    alert("Tên người dùng phải có 6 kí tự trở lên.");
    return false;
  }
  if (username.includes(" ")) {
    alert("Tên người dùng không được dùng dấu cách");
    return false;
  }
  // pass >= 6
  if (password < 6) {
    alert("Mật khẩu phải cókhẩuí tự trở lên.");
    return false;
  }
  // pass == confirmpass
  if (password !== confirmPassword) {
    alert("Mật khẩu không trùng khớp với trường nhập lại.");
    return false;
  }
  return true;
}

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  // ---------------------------------------
  // validate form
  const username = document.getElementById("signupUsername");
  const email = document.getElementById("signupEmail");
  const password = document.getElementById("signupPassword");
  const confirmPassword = document.getElementById("signupConfirmPassword");
  if (
    validateSignupForm(
      username.value,
      email.value,
      password.value,
      confirmPassword.value
    )
  ) {
    // --------------------------------------
    // kiem tra khong duoc trung email + username cu
    // su dung cau lenh query de lay du lieu user co email/ username trung lap
    const q = query(
      collection(db, "users"),
      or(
        where("username", "==", username.value),
        where("email", "==", email.value)
      )
    );
    let isDuplicated = false;
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      // neu trung -> khong lam tiep
      isDuplicated = true;
    });
    if (isDuplicated) {
      alert("Email hoặc Username đã được đăng kí, vui lòng đăng nhập!");
      return; // dung ham khong lam them
    }

    // --------------------------------------
    // create account with firebase auth
    createUserWithEmailAndPassword(auth, email.value, password.value)
      .then(async (userCredential) => {
        // Signed up
        const user = userCredential.user;
        // --------------------------------------
        // create account with firebase firestore
        const newUser = new User(username.value, email.value, user.uid);

        // Add a new document with a generated id.
        const docRef = await addDoc(
          collection(db, "users"),
          newUser.toObject()
        );
        console.log("Document written with ID: ", docRef.id);
        // luu vao local storage
        localStorage.setItem("currentUser", user.uid);
        // thong bao dang ki thanh cong -> chuyen sang home
        alert("Đăng kí tài khoản thành công!");
        // xoa task luu tam de load lai
        localStorage.removeItem("tasks");
        location.href = "../index.html";
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ...
        console.error(errorMessage);
      });
  }
});
