import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  setDoc,
  serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js";

import { db } from "./firebase_config.js";

// save on firestore
class User {
  constructor(
    username,
    email,
    uid,
    WCA_ID = null,
    avg5 = 0,
    avg12 = 0,
    photoURL = "https://inkythuatso.com/uploads/thumbnails/800/2023/03/10-anh-dai-dien-trang-inkythuatso-03-15-27-10.jpg",
  ) {
    this.$username = username;
    this.$email = email;
    this.$uid = uid;
    this.$WCA_ID = WCA_ID;
    this.$avg5 = avg5;
    this.$avg12 = avg12;
    this.$photoURL = photoURL;
  }

  toObject() {
    return {
      username: this.$username,
      email: this.$email,
      uid: this.$uid,
      WCA_ID: this.$WCA_ID,
      avg5: this.$avg5,
      avg12: this.$avg12,
      photoURL: this.$photoURL,
    };
  }

  // =========================
  // GET USER BY UID
  // =========================
  static async getByUID(uid) {
    const q = query(collection(db, "users"), where("uid", "==", uid));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn("User not found");
      return null;
    }

    const data = snapshot.docs[0].data();

    return new User(
      data.username,
      data.email,
      data.uid,
      data.WCA_ID,
      data.avg5,
      data.avg12,
      data.photoURL,
    );
  }

  // =========================
  // update WCA_ID
  // =========================
  async updateWCAID(newWCAID) {
    const isDuplicate = await this.isWCAIDDuplicate(newWCAID);

    if (isDuplicate) {
      console.warn("WCA_ID already exists");
      return;
    }

    const q = query(collection(db, "users"), where("uid", "==", this.$uid));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn("User not found");
      return;
    }

    const ref = snapshot.docs[0].ref;

    await updateDoc(ref, {
      WCA_ID: newWCAID,
    });

    this.$WCA_ID = newWCAID;
  }

  // =========================
  //  save user to Firestore
  // =========================
  async save() {
    try {
      // Check duplicate username first (optional but recommended)
      if (await User.isUsernameTaken(this.$username)) {
        throw new Error("Username already taken");
      }

      // Save using uid as document id
      const ref = doc(db, "users", this.$uid);

      await setDoc(ref, this.toObject());

      console.log("User saved successfully");
    } catch (err) {
      console.error("Error saving user:", err);
      throw err;
    }
  }
  // =========================
  // check duplicate WCA_ID
  // =========================
  async isWCAIDDuplicate(wcaId) {
    const q = query(collection(db, "users"), where("WCA_ID", "==", wcaId));

    const snapshot = await getDocs(q);

    // No duplicate found
    if (snapshot.empty) {
      return false;
    }

    // Check if duplicate belongs to this user
    const isOwnRecord = snapshot.docs.some(
      (doc) => doc.data().uid === this.$uid,
    );

    return !isOwnRecord;
  }
  // =========================
  // check duplicate username
  // =========================
  static async isUsernameTaken(username) {
    const q = query(collection(db, "users"), where("username", "==", username));

    const snapshot = await getDocs(q);

    return !snapshot.empty; // true = taken, false = available
  }
  // =========================
  // UPDATE PROFILE
  // username, photoURL, WCA_ID
  // =========================
  async updateProfile({ username = null, photoURL = null, WCA_ID = null }) {
    const q = query(collection(db, "users"), where("uid", "==", this.$uid));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.warn("User not found");
      return;
    }

    const ref = snapshot.docs[0].ref;

    // Build update object dynamically
    const updateData = {};

    if (username !== null) {
      updateData.username = username;
      this.$username = username;
    }

    if (photoURL !== null) {
      updateData.photoURL = photoURL;
      this.$photoURL = photoURL;
    }

    // Only update WCA_ID if it is a non-empty string
    if (typeof WCA_ID === "string" && WCA_ID.trim() !== "") {
      updateData.WCA_ID = WCA_ID;
      this.$WCA_ID = WCA_ID;
    }

    await updateDoc(ref, updateData);
  }
}

// ==============================
// HISTORY TIMER CLASS
// ==============================
class HistoryTimer {
  constructor(uid, time, cubeType = "3x3") {
    this.$uid = uid;
    this.$time = time;
    this.$cubeType = cubeType;
    this.$createdAt = serverTimestamp();
  }

  toObject() {
    return {
      uid: this.$uid,
      time: this.$time,
      cubeType: this.$cubeType,
      createdAt: this.$createdAt,
    };
  }

  // =========================
  // add history
  // =========================
  async save() {
    await addDoc(collection(db, "histories"), this.toObject());
  }

  // =========================
  // remove history
  // =========================
  static async delete(id) {
    await deleteDoc(doc(db, "histories", id));
  }

  static async getByUID(uid) {
    const q = query(collection(db, "histories"), where("uid", "==", uid));

    const snapshot = await getDocs(q);

    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Sort locally instead
    return data.sort((a, b) => b.time - a.time);
  }
  // =========================
  // calculate averages
  // =========================
  static async calculateAverages(uid, counter = 5) {
    const histories = await this.getByUID(uid);

    if (histories.length < counter) return 0;

    const times = histories
      .slice(0, counter)
      .map((h) => h.time)
      .sort((a, b) => a - b);

    // remove best & worst
    times.shift();
    times.pop();

    const avg = times.reduce((sum, t) => sum + t, 0) / times.length;

    return Math.round(avg);
  }
}

export { User, HistoryTimer };
