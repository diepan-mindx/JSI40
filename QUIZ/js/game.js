import quizData from "./data.js";
import { db } from "./firebase_config.js";
import {
  collection,
  addDoc,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

// ============================
// lay ten nguoi dung
const username = prompt("Enter your name:") || "Anonymous";
// luu ten voi diem so


// ============================
// tạo danh sách dữ liệu lên firestore
async function addData() {
  // lay collection questions
  const questionsCol = collection(db, "questions");
  // kiem tra neu chua co du lieu thi them -> x
  // them tung cau hoi
  for (const question of quizData.questions) {
    await addDoc(questionsCol, question);
  }
}

// addData();