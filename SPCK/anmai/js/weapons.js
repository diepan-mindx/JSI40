const url_root = "https://genshin.jmp.blue/";

let allWeapons = [];
let currentType = "all";
let currentRarity = "all";

async function renderWeapons() {
  const container = document.getElementById("weapons-list");

  // loading spinner
  container.innerHTML = `
    <div class="text-center my-5 w-100" id="loading-spinner">
      <div class="spinner-border text-primary" style="width: 3rem; height: 3rem;" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-3 text-light">Loading weapons...</p>
    </div>
  `;

  try {
    const response = await fetch(url_root + "weapons");
    const names = await response.json();

    // Gọi chi tiết từng weapon
    const details = await Promise.all(
      names.map(async (name) => {
        try {
          const res = await fetch(url_root + "weapons/" + name);
          const data = await res.json();
          return data;
        } catch {
          return null;
        }
      })
    );

    allWeapons = details.filter(Boolean);
    displayWeapons(allWeapons);
  } catch (err) {
    console.error("Error loading weapons:", err);
    container.innerHTML = `<p class="text-danger text-center">Failed to load weapons.</p>`;
  }
}

function displayWeapons(list) {
  const container = document.getElementById("weapons-list");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = `<p class="text-center text-light">No weapons found.</p>`;
    return;
  }

  list.forEach((weapon) => {
      const cardWrapper = document.createElement("div");
      cardWrapper.className = "col d-flex justify-content-center";

      const card = document.createElement("div");
      card.className =
        "card bg-dark text-light border-secondary shadow-sm mb-3";
      card.style.width = "100%";
      card.style.maxWidth = "200px";
      card.style.transition = "transform 0.2s, box-shadow 0.2s";
      card.style.cursor = "pointer";

      card.innerHTML = `
      <img
        src="${url_root + "weapons/" + weapon.name.toLowerCase().replaceAll(" ", "-") + "/icon"}"
        class="card-img-top p-2"
        alt="${weapon.name}"
        style="object-fit: contain; height: 200px; border-bottom: 1px solid #555;"
      />
      <div class="card-body p-2 text-center">
        <h6 class="card-title mb-1">${weapon.name}</h6>
        <small class="text-muted">${weapon.type || "Unknown"} | ${
        weapon.rarity
      }★</small>
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
      card.addEventListener("click", () =>
        showWeaponDetail(weapon.name.toLowerCase())
      );

      cardWrapper.appendChild(card);
      container.appendChild(cardWrapper);
  });
}

function applyFilters() {
  let filtered = [...allWeapons];

  if (currentType !== "all") {
    filtered = filtered.filter(
      (weapon) => weapon.type && weapon.type.toLowerCase() === currentType
    );
  }

  if (currentRarity !== "all") {
    filtered = filtered.filter(
      (weapon) => weapon.rarity && String(weapon.rarity) === currentRarity
    );
  }

  displayWeapons(filtered);
}

// Lắng nghe select thay đổi
document.getElementById("filter-weapontype").addEventListener("change", (e) => {
  currentType = e.target.value;
  applyFilters();
});

document
  .getElementById("filter-weaponrarity")
  .addEventListener("change", (e) => {
    currentRarity = e.target.value;
    applyFilters();
  });

// Modal chi tiết vũ khí
async function showWeaponDetail(name) {
  try {
    const response = await fetch(url_root + "weapons/" + name);
    const data = await response.json();
    if (data) {
      const infoHTML = `
      <div class="text-center">
        <img src="${url_root + "weapons/" + name + "/icon"}" alt="${
        data.name
      }" class="mb-3 rounded shadow w-100" width="150" />
      </div>
      <h2 class="text-center mb-3">${data.name}</h2>
      <p><strong>Description:</strong> ${data.description}</p>
      <p><strong>Type:</strong> ${data.type}</p>
      <p><strong>Rarity:</strong> ${data.rarity} ⭐</p>
      <p><strong>Base ATK:</strong> ${data.baseAttack}</p>
      <p><strong>Substat:</strong> ${data.subStat || "None"}</p>
      <p><strong>Passive:</strong> ${data.passiveName || "—"}</p>
      <p><strong>Effect:</strong> ${data.passiveDesc || "—"}</p>
      <p><strong>Obtain:</strong> ${data.obtain || "Unknown"}</p>
    `;

      document.getElementById("weapon-modal-content").innerHTML = infoHTML;
      document.getElementById("weapon-modal").style.display = "block";
    }
  } catch (err) {
    console.error("Error loading weapon details:", err);
    document.getElementById("weapon-modal-content").innerHTML = `
      <p class="text-danger">Could not load weapon details.</p>
    `;
  }
}

// Đóng modal
document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("weapon-modal").style.display = "none";
});

window.addEventListener("click", (event) => {
  const modal = document.getElementById("weapon-modal");
  if (event.target === modal) modal.style.display = "none";
});

renderWeapons();
