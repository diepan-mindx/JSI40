// controller.js
import { HistoryTimer } from "./entities.js";
import { generateNewScramble } from "./scramble.js";

// ==========================
// AUTH CHECK
// ==========================
const currentUID = localStorage.getItem("currentUserID");

if (!currentUID) {
  alert("Bạn cần đăng nhập để sử dụng tính năng này!");
  throw new Error("User not logged in");
}

// ==========================
// STATE
// ==========================
let timerInterval = null;
let startTime = 0;
let running = false;
let spacePressed = false;
let canStart = false;

let histories = []; // store firestore histories

// ==========================
// DOM
// ==========================
const timerDisplay = document.getElementById("timer");
const historyList = document.getElementById("historyList");

// ===== AO DISPLAY =====
const ao5Display = document.createElement("div");
ao5Display.className = "ao-display";
ao5Display.textContent = "avg5: --";
timerDisplay.insertAdjacentElement("afterend", ao5Display);

const ao12Display = document.createElement("div");
ao12Display.className = "ao-display";
ao12Display.textContent = "avg12: --";
ao5Display.insertAdjacentElement("afterend", ao12Display);

// ==========================
// LOAD HISTORY
// ==========================
async function loadHistories() {
  histories = await HistoryTimer.getByUID(currentUID);
  refreshHistory();
  updateAverages();
}

loadHistories();

// ==========================
// TIMER LOGIC
// ==========================
function updateTimer() {
  const elapsed = (Date.now() - startTime) / 1000;
  timerDisplay.textContent = elapsed.toFixed(2);

  const target = parseFloat(
    localStorage.getItem("targetTime")
  );

  if (!isNaN(target) && elapsed > target) {
    timerDisplay.style.color = "red";
  }
}

// ==========================
// SAVE SOLVE
// ==========================
async function saveTime(timeText) {
  const timeValue = parseFloat(timeText);
  if (isNaN(timeValue)) return;

  const cubeType =
    document.getElementById("cubeType")?.value ||
    "3x3x3";

  const history = new HistoryTimer(
    currentUID,
    timeValue,
    cubeType
  );

  await history.save();

  await loadHistories();

  generateNewScramble();
}

// ==========================
// REFRESH UI
// ==========================
function refreshHistory() {
  historyList.innerHTML = "";

  histories.forEach((h, idx) => {
    const li = document.createElement("li");

    li.textContent = `${idx + 1}) ${h.time.toFixed(
      2
    )}`;

    li.onclick = async () => {
      if (
        confirm(
          `Xóa lần giải ${h.time.toFixed(2)}?`
        )
      ) {
        await HistoryTimer.delete(h.id);
        await loadHistories();
      }
    };

    historyList.appendChild(li);
  });
}

// ==========================
// AVERAGES
// ==========================
function updateAverages() {
  const times = histories.map((h) => h.time);

  const calc = (n) => {
    if (times.length < n) return "--";

    let arr = times.slice(0, n).sort((a, b) => a - b);

    arr.shift();
    arr.pop();

    return (
      arr.reduce((a, b) => a + b, 0) /
      arr.length
    ).toFixed(2);
  };

  ao5Display.textContent =
    "avg5: " + calc(5);

  ao12Display.textContent =
    "avg12: " + calc(12);
}

// ==========================
// EVENTS
// ==========================
document.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !spacePressed) {
    e.preventDefault();
    spacePressed = true;

    if (running) {
      stopTimer();
    } else {
      timerDisplay.style.color = "red";

      setTimeout(() => {
        if (spacePressed) {
          canStart = true;
          timerDisplay.style.color = "lime";
        }
      }, 300);
    }
  }

  if (e.code === "KeyR") resetSession();
});

document.addEventListener("keyup", (e) => {
  if (e.code === "Space") {
    spacePressed = false;

    if (!running && canStart) startTimer();

    canStart = false;
  }
});

// ==========================
// START / STOP
// ==========================
function startTimer() {
  running = true;
  startTime = Date.now();

  timerInterval = setInterval(updateTimer, 10);

  timerDisplay.style.color = "#fff";
}

function stopTimer() {
  running = false;

  clearInterval(timerInterval);

  timerDisplay.style.color =
    document.body.classList.contains("light")
      ? "#000"
      : "#fff";

  saveTime(timerDisplay.textContent);
}

// ==========================
// RESET
// ==========================
function resetSession() {
  clearInterval(timerInterval);

  running = false;

  histories = [];

  timerDisplay.textContent = "0.00";

  refreshHistory();
  updateAverages();

  generateNewScramble();
}