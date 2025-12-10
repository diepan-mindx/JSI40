import { auth, db } from "./firebase_config.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  or,
  getDoc,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { User, Task } from "./entities.js";

// =================================================
// kiem tra neu nguoi dung chua dang nhap -> chuyen trang
let currentUserUID = localStorage.getItem("currentUser");
console.log(currentUserUID);
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

// =================================================
// hien thi todolist dua tren user dang nhap
// tim kiem task dua tren createdBy = currentUserUID
document.addEventListener("DOMContentLoaded", async () => {
  // khi web chay -> hien thi thong tin
  const q = query(
    collection(db, "tasks"),
    where("createdBy", "==", currentUserUID)
  );
  const querySnapshot = await getDocs(q);
  // chuyen task JSON -> class Task
  const tasks = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const task = new Task(data.taskContent, data.createdBy, data.isCompleted);
    tasks.push(task.toHTMLElement()); // spread syntax ... (copy thuoc tinh tu object)
  });

  // in ra giao dien tren HTML
  renderTasks(tasks || []);
});

function renderTasks(tasks) {
  const ul = document.querySelector("#todolist");
  ul.innerHTML = ""; // xoa het phan tu con trong ul
  tasks.forEach((task) => {
    ul.innerHTML += task;
  });
}

// =================================================
// tao task
const addTaskBtn = document.querySelector("#add_task");
addTaskBtn?.addEventListener("click", async () => {
  const newTask = prompt("Nhập nội dung công việc:");
  // validate input
  if (newTask === null || newTask.trim() === "") {
    alert("Nội dung công việc không được để trống!");
    return;
  }
  // tao task moi voi createdBy = currentUserUID
  const task = new Task(newTask.trim(), currentUserUID);
  try {
    const docRef = await addDoc(collection(db, "tasks"), task.toObject());
    alert("Thêm công việc thành công!");
    // reload lai danh sach task
    renderTasks(
      [...document.querySelectorAll("#todolist li")],
      task.toHTMLElement()
    );
  } catch (error) {
    console.error("Error adding document: ", error);
    alert("Có lỗi xảy ra khi thêm công việc.");
  }
});
