import { auth, db } from "./firebase_config.js";
import {
  collection,
  query,
  where,
  getDocs,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { User, Task } from "./entities.js";

let currentUserUID = localStorage.getItem("currentUser");
// =================================================
// hien thi thong tin user dang nhap
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const q = query(
      collection(db, "users"),
      where("uid", "==", currentUserUID)
    );

    const querySnapshot = await getDocs(q);
    // chuyen task JSON -> class Task
    if (querySnapshot.empty) {
      alert("No such user document!");
      // chuyen trang dang nhap
      window.location.href = "./login.html";
      return;
    }
    
    const dataShot = querySnapshot.docs[0];
    const data = dataShot.data();
    const user = new User(
      data.username,
      data.email,
      currentUserUID,
      data.photoURL
    );
    // hien thi len UI
    document.getElementById("account-username").innerText = user.$username;
    document.getElementById("account-email").innerText = user.$email;
    document.getElementById("account-img").src = user.$photoURL;
    document.getElementById("account-uid").innerText = user.$uid;
    // luu lai de khong goi nhiu lan
    localStorage.setItem("currentUserInfo", JSON.stringify(user));
  } catch (error) {
    alert("Error fetching user document:", error);
    console.error(error);
  }
});

// =================================================
// logout
const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", () => {
  // xoa local storage
  localStorage.removeItem("currentUser");
  // chuyen ve trang login
  window.location.href = "./login.html";
});
