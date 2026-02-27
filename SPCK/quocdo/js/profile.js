// profile.js
import { User } from "./entities.js";

// ==========================
// AUTH CHECK
// ==========================
const uid = localStorage.getItem("currentUserID");

if (!uid) {
  alert("Bạn cần đăng nhập!");
  location.href = "./login.html";
  throw new Error("Not logged in");
}

// ==========================
// DOM
// ==========================
const usernameInput =
  document.getElementById("username");

const emailInput =
  document.getElementById("email");

const wcaInput =
  document.getElementById("wcaid");

const photoInput =
  document.getElementById("photoURL");

const photoPreview =
  document.getElementById("photoPreview");

const saveBtn =
  document.getElementById("saveProfile");

// ==========================
// LOAD USER
// ==========================
let currentUser = null;

async function loadProfile() {
  currentUser = await User.getByUID(uid);
  console.log(currentUser)

  if (!currentUser) {
    alert("Không tải được dữ liệu user");
    return;
  }

  usernameInput.value =
    currentUser.$username;

  emailInput.value =
    currentUser.$email;

  wcaInput.value =
    currentUser.$WCA_ID || "";

  photoInput.value =
    currentUser.$photoURL;

  photoPreview.src =
    currentUser.$photoURL;
}

loadProfile();

// ==========================
// PREVIEW PHOTO
// ==========================
photoInput.addEventListener("input", () => {
  photoPreview.src =
    photoInput.value ||
    "https://inkythuatso.com/uploads/thumbnails/800/2023/03/10-anh-dai-dien-trang-inkythuatso-03-15-27-10.jpg";
});

// ==========================
// SAVE PROFILE
// ==========================
saveBtn.onclick = async () => {
  const newUsername =
    usernameInput.value.trim();

  const newPhoto =
    photoInput.value.trim();

  const newWCA =
    wcaInput.value.trim();

  if (!newUsername) {
    alert("Username không hợp lệ");
    return;
  }
  console.log(newPhoto)

  // update username + photo
  await currentUser.updateProfile(
    newUsername,
    newPhoto,
    newWCA
  );

  // // update WCA ID
  // await currentUser.updateWCAID(
  //   newWCA || null
  // );

  alert("Đã lưu thay đổi!");
};