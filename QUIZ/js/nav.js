// =================================================
// dark / light toggle -> change body class light / dark

const themeToggle = document.getElementById("theme-toggle");

// load saved theme
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  // save theme
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");

  // hide icon
  if (localStorage.getItem("theme") == "dark") {
    document.getElementById("dark").classList.remove("hide");
    document.getElementById("light").classList.add("hide");
  } else {
    document.getElementById("dark").classList.add("hide");
    document.getElementById("light").classList.remove("hide");
  }
});

// =================================================
// pause / play toggle

const pauseToggle = document.getElementById("pause-toggle");

pauseToggle?.addEventListener("click", () => {
  pauseToggle.classList.toggle("paused");

  const isPaused = pauseToggle.classList.contains("paused");

  if (isPaused) {
    console.log("Paused");
    document.getElementById("pause").classList.remove("hide");
    document.getElementById("play").classList.add("hide");
    // pause logic here (audio, timer, animation, game loop...)
  } else {
    console.log("Playing");
    document.getElementById("pause").classList.add("hide");
    document.getElementById("play").classList.remove("hide");
    // resume logic here
  }
});


// ================================================
// mac dinh khi load trang thi cho loading chay truoc 3s
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(()=> {
    document.querySelector("nav").classList.remove("hide")
    document.querySelector("main").classList.remove("hide")
    document.querySelector(".loading").classList.add("hide")
  }, 5000)
});
