import { db, auth } from "./firebase_config.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  doc,
  query,
  orderBy,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

const blogContainer = document.querySelector(".blog-scroll");
const form = document.querySelector("form");

let currentUser = null;

const blogRef = collection(db, "blogs");

// =======================
// AUTH
// =======================
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  loadBlogs();
});

// kiem tra neu o create blog ma khong login -> out ra blog
if (location.href.includes("create-blog.html")) {
  if (!currentUser) {
    alert("Bạn cần đăng nhập");
    location.href = "./blog.html";
  }
}

// =======================
// CREATE BLOG
// =======================
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!currentUser) {
      alert("Bạn cần đăng nhập");
      return;
    }

    const title = form.querySelector("input[type='text']").value;
    const imgURL = form.querySelector("input[type='url']").value;
    const content = form.querySelector("textarea").value;

    await addDoc(blogRef, {
      title: title,
      imgURL: imgURL,
      content: content,
      like: 0,
      dislike: 0,
      created_at: Date.now(),
      created_by: currentUser.uid,
      author_email: currentUser.email,
    });

    alert("Đăng bài thành công");

    window.location.href = "./blog.html";
  });
}

// =======================
// LOAD BLOGS
// =======================
async function loadBlogs() {
  if (!blogContainer) return;

  blogContainer.innerHTML = "";

  const q = query(blogRef, orderBy("like", "desc"));

  const snapshot = await getDocs(q);

  snapshot.forEach((docSnap) => {
    const blog = docSnap.data();
    const id = docSnap.id;

    const isOwner = currentUser && currentUser.uid === blog.created_by;

    const card = document.createElement("div");
    card.className = "blog-card";

    card.innerHTML = `

      <div class="blog-header">
        <div>
          <div class="email">${blog.author_email}</div>
          <div class="date">
            ${new Date(blog.created_at).toLocaleDateString()}
          </div>
        </div>

        ${
          isOwner
            ? `
          <div>
            <span class="edit" data-id="${id}">✏️</span>
            <span class="delete" data-id="${id}">🗑</span>
          </div>
        `
            : ""
        }
      </div>

      <h3>${blog.title}</h3>

      <p>${blog.content}</p>

      ${
        blog.imgURL
          ? `
        <img class="blog-image" src="${blog.imgURL}">
      `
          : ""
      }

      <div class="blog-action">

        <div class="action-btn dislike" data-id="${id}">
          👎 ${blog.dislike}
        </div>

        <div class="action-btn like" data-id="${id}">
          👍 ${blog.like}
        </div>

      </div>
    `;

    blogContainer.appendChild(card);
  });

  addEvents();
}

// =======================
// EVENTS
// =======================
function addEvents() {
  // LIKE
  document.querySelectorAll(".like").forEach((btn) => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      const blogDoc = doc(db, "blogs", id);

      const current = Number(btn.textContent.replace("👍", ""));

      await updateDoc(blogDoc, {
        like: current + 1,
      });

      loadBlogs();
    };
  });

  // DISLIKE
  document.querySelectorAll(".dislike").forEach((btn) => {
    btn.onclick = async () => {
      const id = btn.dataset.id;
      const blogDoc = doc(db, "blogs", id);

      const current = Number(btn.textContent.replace("👎", ""));

      await updateDoc(blogDoc, {
        dislike: current + 1,
      });

      loadBlogs();
    };
  });

  // DELETE
  document.querySelectorAll(".delete").forEach((btn) => {
    btn.onclick = async () => {
      if (!confirm("Xóa bài viết?")) return;

      const id = btn.dataset.id;

      await deleteDoc(doc(db, "blogs", id));

      loadBlogs();
    };
  });

  // EDIT
  document.querySelectorAll(".edit").forEach((btn) => {
    btn.onclick = async () => {
      const id = btn.dataset.id;

      const newTitle = prompt("Nhập tiêu đề mới");

      if (!newTitle) return;

      await updateDoc(doc(db, "blogs", id), {
        title: newTitle,
      });

      loadBlogs();
    };
  });
}

// =======================
// SORT
// =======================

window.sortByLikes = async () => {
  const q = query(blogRef, orderBy("like", "desc"));
  renderSorted(q);
};

window.sortByDislikes = async () => {
  const q = query(blogRef, orderBy("dislike", "asc"));
  renderSorted(q);
};

async function renderSorted(q) {
  blogContainer.innerHTML = "";

  const snapshot = await getDocs(q);

  snapshot.forEach((docSnap) => {
    const blog = docSnap.data();

    const card = document.createElement("div");
    card.className = "blog-card";

    card.innerHTML = `
      <h3>${blog.title}</h3>
      <p>${blog.content}</p>
    `;

    blogContainer.appendChild(card);
  });
}
