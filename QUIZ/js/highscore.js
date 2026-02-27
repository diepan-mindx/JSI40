import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js";

import { db } from "./firebase_config.js";
import { Leaderboard } from "./entities.js";
// call from firebase firestore (query) and show
async function renderHTML() {
  const container = document.getElementById("leader-board");

  try {
    // get leaderboard document
    const ref = doc(db, "leaderboards", "quiz_easy");
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      container.innerHTML = new Leaderboard(
        "quiz",
        "easy",
        "quiz_easy",
        []
      ).toHTMLElement();
      return;
    }

    const data = snap.data();

    // create entity
    const leaderboard = new Leaderboard(
      data.type,
      data.level,
      data.id,
      data.users || []
    );

    // render using entity
    container.outerHTML = leaderboard.toHTMLElement();
  } catch (err) {
    console.error("Failed to load leaderboard:", err);
    container.innerHTML = `
      <div class="no-data">
        Failed to load leaderboard
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", renderHTML);

// ========================================
// add highscore

