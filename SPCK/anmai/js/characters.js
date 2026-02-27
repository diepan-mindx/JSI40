const url_root = "https://genshin.jmp.blue/";

let allCharacters = []; // lưu toàn bộ dữ liệu API
let currentRegion = "all";
let currentType = "all";

async function renderCharacters() {
  const container = document.getElementById("characters-list");

  // loading
  container.innerHTML = `
    <div class="text-center my-5 w-100" id="loading-spinner">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3 text-light">Loading characters...</p>
    </div>
  `;

  try {
    const response = await fetch(url_root + "characters");
    const names = await response.json();

    // Lấy chi tiết từng nhân vật để lọc được theo region/type
    const details = await Promise.all(
      names.map(async (name) => {
        try {
          const res = await fetch(url_root + "characters/" + name);
          const data = await res.json();
          return data;
        } catch {
          return null;
        }
      })
    );

    allCharacters = details.filter(Boolean);
    displayCharacters(allCharacters);
  } catch (err) {
    console.error("Error loading characters:", err);
    container.innerHTML = `<p class="text-danger text-center">Failed to load characters.</p>`;
  }
}

// Hiển thị danh sách nhân vật
function displayCharacters(list) {
  const container = document.getElementById("characters-list");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = `<p class="text-center text-light">No characters found.</p>`;
    return;
  }

  list.forEach((char) => {
    const cardWrapper = document.createElement("div");
    cardWrapper.className = "col w-100 d-flex justify-content-center";

    const card = document.createElement("div");
    card.className =
      "card bg-dark text-light border-secondary shadow-sm mb-3";
    card.style.width = "100%";
    card.style.maxWidth = "200px";
    card.style.transition = "transform 0.2s, box-shadow 0.2s";
    card.style.cursor = "pointer";

    card.innerHTML = `
      <img
        src="${url_root + "characters/" + char.name.toLowerCase() + "/card"}"
        class="card-img-top"
        alt="${char.name}"
        style="object-fit: cover; height: 300px; border-bottom: 1px solid #555;"
      />
      <div class="card-body p-2 text-center">
        <h6 class="card-title mb-1">${char.name}</h6>
        <small class="text-muted">${char.vision || "Unknown"}</small>
      </div>
    `;

    card.addEventListener("mouseenter", () => {
      card.style.transform = "scale(1.05)";
      card.style.boxShadow = "0 0 15px rgba(255,255,255,0.2)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "scale(1)";
      card.style.boxShadow = "none";
    });
    card.addEventListener("click", () => showCharacterDetail(char.name.toLowerCase()));

    cardWrapper.appendChild(card);
    container.appendChild(cardWrapper);
  });
}

// Lọc dữ liệu theo Region và Type
function applyFilters() {
  let filtered = [...allCharacters];

  if (currentRegion !== "all") {
    filtered = filtered.filter(
      (char) => char.nation && char.nation.toLowerCase() === currentRegion
    );
  }

  if (currentType !== "all") {
    filtered = filtered.filter(
      (char) => char.vision && char.vision.toLowerCase() === currentType
    );
  }

  displayCharacters(filtered);
}

// Xử lý sự kiện change select
document.getElementById("filter-characters").addEventListener("change", (e) => {
  currentRegion = e.target.value;
  applyFilters();
});

document.getElementById("filter-type").addEventListener("change", (e) => {
  currentType = e.target.value;
  applyFilters();
});

// Modal chi tiết nhân vật
async function showCharacterDetail(char_name) {
  try {
    const response = await fetch(url_root + "characters/" + char_name);
    const data = await response.json();

    const infoHTML = `
      <div class="text-center">
        <img src="${url_root + "characters/" + char_name + "/card"}" alt="${data.name}" class="mb-3 rounded shadow w-100" />
      </div>
      <h2 class="text-center mb-3">${data.name}</h2>
      <p><strong>Description:</strong> ${data.description}</p>
      <p><strong>Gender:</strong> ${data.gender}</p>
      <p><strong>Birthday:</strong> ${data.birthday}</p>
      <p><strong>Rarity:</strong> ${data.rarity} ⭐</p>
      <p><strong>Vision:</strong> ${data.vision}</p>
      <p><strong>Weapon:</strong> ${data.weapon}</p>
      <p><strong>Nation:</strong> ${data.nation}</p>
      <p><strong>Obtain:</strong> ${data.obtain}</p>
    `;

    document.getElementById("character-modal-content").innerHTML = infoHTML;
    document.getElementById("character-modal").style.display = "block";
  } catch (err) {
    console.error("Error loading character details:", err);
    document.getElementById("character-modal-content").innerHTML = `
      <p class="text-danger">Could not load character details.</p>
    `;
  }
}

// Đóng modal
document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("character-modal").style.display = "none";
});

window.addEventListener("click", (event) => {
  const modal = document.getElementById("character-modal");
  if (event.target === modal) modal.style.display = "none";
});

// Bắt đầu render
renderCharacters();
