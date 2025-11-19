// goi api
const API_KEY = "";
const URL_root =
  "https://handlers.education.launchcode.org/static/planets.json";

function callAPIData() {
  fetch(URL_root)
    .then((response) => response.json()) // chuyen ve kieu js object
    .then((data) => {
      console.log(data);
      const planetUl = document.querySelector("#planets");
      data?.forEach((p) => {
        const planetCard = renderPlanetCard(p);
        planetUl.appendChild(planetCard);
      });
    });
}

callAPIData();

function renderPlanetCard(planet) {
  const html = document.createElement("li");
  html.classList.add("planet");

  html.innerHTML = `
    <img src="${planet.image}" alt="${planet.name}" />
        <div class="content">
          <h4 class="name"><strong>name: </strong> ${planet.name}</h4>
          <p class="diameter"><strong>diameter: </strong> ${planet.diameter}</p>
          <p class="star"><strong>star: </strong> ${planet.star}</p>
          <p class="distance"><strong>distance: </strong> ${planet.distance}</p>
          <p class="moons"><strong>moons: </strong> ${planet.moons}</p>
        </div>
    `;
  return html;
}
