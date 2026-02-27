const url_root = "https://genshin.jmp.blue/";
const API_Key = "";
async function renderCharacters() {
  const container = document.getElementById("characters-list");
  // goi api
  fetch(url_root + "characters")
    .then((json) => json.json()) // chuyen tu json -> object js
    .then((data) => {
      // hien thi len giao dien
      data?.forEach((char_name) => {
        const li = document.createElement("a");
        const link = document.createElement("a");

        link.innerHTML = `<img width="200" src="${url_root + "characters/" + char_name + "/card"}" alt="${char_name}" style="cursor:pointer"/>`;
        link.addEventListener("click", (e) => {
          e.preventDefault();
          showCharacterDetail(char_name);
        });
        // add vao container
        li.appendChild(link);
        container.appendChild(li);
      });
    })
    .catch((err) => console.error(err));
}

function showCharacterDetail(char_name) {
  fetch(url_root + "characters/" + char_name)
    .then((res) => res.json())
    .then((data) => {
      const infoHTML = `
        <h2>${data.name}</h2>
        <p><strong>Description:</strong> ${data.description}</p>
        <p><strong>Gender:</strong> ${data.gender}</p>
        <p><strong>Birthday:</strong> ${data.birthday}</p>
        <p><strong>Rarity:</strong> ${data.rarity} ⭐</p>
        <p><strong>Vision:</strong> ${data.vision}</p>
        <p><strong>Weapon:</strong> ${data.weapon}</p>
        <p><strong>Obtain:</strong> ${data.obtain}</p>
      `;
      document.getElementById("character-modal-content").innerHTML = infoHTML;
      document.getElementById("character-modal").style.display = "block";
    })
    .catch((err) => console.error("Lỗi khi lấy chi tiết nhân vật:", err));
};

// Đóng modal khi click vào nút X
document.querySelector(".close").addEventListener("click", () => {
  document.getElementById("character-modal").style.display = "none";
});

// Đóng modal khi click ra ngoài
window.addEventListener("click", (event) => {
  const modal = document.getElementById("character-modal");
  if (event.target === modal) {
    modal.style.display = "none";
  };
});

renderCharacters();