import { auth, db } from "./firebase_config.js";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  or,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import { User, Task } from "./entities.js";

let currentUserUID = localStorage.getItem("currentUser");
// =================================================
// hien thi todolist dua tren user dang nhap
// tim kiem task dua tren createdBy = currentUserUID
document.addEventListener("DOMContentLoaded", async () => {
  const taskStored = localStorage.getItem("tasks");
  let tasks = [];
  // neu chua co task thi fetch tu firestore
  if (!taskStored || taskStored === "[]") {
    const q = query(
      collection(db, "tasks"),
      where("createdBy", "==", currentUserUID)
    );
    const querySnapshot = await getDocs(q);
    // chuyen task JSON -> class Task
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const task = new Task(
        doc.id,
        data.taskContent,
        data.createdBy,
        data.isCompleted
      );
      tasks.push(task);
    });
    // luu tam task vao localStorage de lan sau dung lai
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  // neu co roi thi dung task da luu (tranh call firestore nhieu lan)
  tasks = JSON.parse(localStorage.getItem("tasks"));
  // khi web chay -> hien thi thong tin
  renderTasks(tasks);
});

function renderTasks(tasks) {
  const ul = document.querySelector("#todolist");
  ul.innerHTML = ""; // xoa het phan tu con trong ul
  tasks.forEach((task) => {
    const taskObj = new Task(
      task.$taskId,
      task.$taskContent,
      task.$createdBy,
      task.$isCompleted
    );
    ul.innerHTML += taskObj.toHTMLElement();
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
  const task = new Task("", newTask.trim(), currentUserUID);
  try {
    const docRef = await addDoc(collection(db, "tasks"), task.toObject());
    task.$taskId = docRef.id; // cap nhat taskId sau khi them vao firestore
    alert("Thêm công việc thành công!");
    // reload lai danh sach task
    const ul = document.querySelector("#todolist");
    ul.innerHTML += task.toHTMLElement();
    // cap nhat lai localStorage
    const taskStored = localStorage.getItem("tasks");
    let tasks = taskStored ? JSON.parse(taskStored) : [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  } catch (error) {
    console.error("Error adding document: ", error);
    alert("Có lỗi xảy ra khi thêm công việc.");
  }
});

// =================================================
// complete task
const ul = document.querySelector("#todolist");
ul?.addEventListener("click", async (event) => {
  if (
    event.target.tagName === "BUTTON" &&
    event.target.textContent === "Done"
  ) {
    const li = event.target.closest("li");
    const taskId = li.id;
    // cap nhat trang thai task tren firestore
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, { isCompleted: true });
      // cap nhat giao dien
      li.classList.add("bg-secondary", "text-white");
      event.target.disabled = true;
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("Có lỗi xảy ra khi cập nhật công việc.");
    }
  }
});

// =================================================
// delete task
document
  .querySelector("#todolist")
  ?.addEventListener("click", async (event) => {
    if (
      event.target.tagName === "BUTTON" &&
      event.target.textContent === "Del"
    ) {
      const li = event.target.closest("li");
      const taskId = li.id;
      // xoa task tren firestore
      try {
        const taskRef = doc(db, "tasks", taskId);
        await deleteDoc(taskRef);
        // cap nhat giao dien
        li.remove();
      } catch (error) {
        console.error("Error deleting document: ", error);
        alert("Có lỗi xảy ra khi xóa công việc.");
      }
    }
  });
