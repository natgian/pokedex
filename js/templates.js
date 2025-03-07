function cardTemplate({ id, name, img, types }) {
  return `
      <div id="${id}" class="card" style="background-color: var(--${types[0]})" onmouseover="this.style.backgroundColor='var(--${
    types[0]
  }-dark)'" onmouseout="this.style.backgroundColor='var(--${types[0]})'" onclick="openModal(${id})">
          <div>
            <h2 class="card-title">${name}</h2>
            <span class="card-id">#${id}</span>
          </div>
          <img
            src=${img}
            alt="${name}"
            class="card-img"
          />
          <div class="card-tags-container" id="card-tags-container">
            ${types.map((type) => `<span class="type-tag">${type}</span>`).join(" ")}
          </div>
      </div>  
  `;
}

function modalTemplate({ name, img, id, types }) {
  return `
      <div class="modal-container" onclick="event.stopPropagation()" style="background-image: linear-gradient(to top, var(--bg-color), var(--${types[0]}))">
          <button class="close-btn"><img src="./assets/icons/cross.svg" alt="close button" onclick="closeModal()" /></button>

          <div id="modal-title-wrapper">
            <span class="card-title" id="modal-title">${name} #${id}</span>
            <img
              src=${img}
              alt="${name}"
              class="modal-img"
            />
          </div>

          <div class="modal-info-wrapper">
            <div class="modal-tabs-container">
              <button id="about-btn" class="modal-tab-btn current-selection" onclick="renderAbout(${id})">About</button>
              <button id="stats-btn" class="modal-tab-btn" onclick="renderStats(${id})">Stats</button>
            </div>

            <div id="modal-content"></div>
          
            <div class="modal-navigation">
              <button id="prev-btn" class="arrow-btn prev" onclick="navigatePokemon(${id}, 'prev')"><img src="./assets/icons/angle-left.svg" alt="left arrow"/></button>
              <button id="next-btn" class="arrow-btn next" onclick="navigatePokemon(${id}, 'next')"><img src="./assets/icons/angle-right.svg" alt="right arrow"/></button>
            </div>
          </div>

        </div>
  `;
}

function aboutTemplate({ species, height, weight, abilities, types }) {
  return `
      <div class="about-content">
        <table>
          <tr>
            <th>Species:</th>
            <td>${species}</td>
          </tr>
          <tr>
            <th>Type(s):</th>
            <td>${types.join(", ")}</td>
          </tr>
          <tr>
            <th>Height:</th>
            <td>${height} m</td>
          </tr>
          <tr>
            <th>Weight:</th>
            <td>${weight} kg</td>
          </tr>
          <tr>
            <th>Abilities:</th>
            <td>${abilities.join(", ")}</td>
          </tr>
        </table>
        <div class="modal-tags-container">
            ${types.map((type) => `<span class="type-tag" style="background-color: var(--${type})">${type}</span>`).join(" ")}
        </div>
      </div>
  `;
}

function statsTemplate({ stats, types }) {
  return `
      <div class="stats-content">
        <div class="stats-wrapper">
          <span>HP: ${stats["Hp"]}</span>
          <div class="bar">
            <div class="bar-fill" style="width: ${(stats["Hp"] / 255) * 100}%; background-color: var(--${types[0]}-dark)"></div>
          </div>
        </div>

        <div class="stats-wrapper">
          <span>Attack: ${stats["Attack"]}</span>
          <div class="bar">
            <div class="bar-fill" style="width: ${(stats["Attack"] / 255) * 100}%; background-color: var(--${types[0]}-dark)"></div>
          </div>
        </div>

        <div class="stats-wrapper">
          <span>Defense: ${stats["Defense"]}</span>
          <div class="bar">
            <div class="bar-fill" style="width: ${(stats["Defense"] / 255) * 100}%; background-color: var(--${types[0]}-dark)"></div>
          </div>
        </div>

        <div class="stats-wrapper">
          <span>Special Attack: ${stats["Special-attack"]}</span>
          <div class="bar">
            <div class="bar-fill" style="width: ${(stats["Special-attack"] / 255) * 100}%; background-color: var(--${types[0]}-dark)"></div>
          </div>
        </div>

        <div class="stats-wrapper">
          <span>Special Defense: ${stats["Special-defense"]}</span>
          <div class="bar">
            <div class="bar-fill" style="width: ${(stats["Special-defense"] / 255) * 100}%; background-color: var(--${
    types[0]
  }-dark)"></div>
          </div>
        </div>

        <div class="stats-wrapper">
          <span>Speed: ${stats["Speed"]}</span>
          <div class="bar">
            <div class="bar-fill" style="width: ${(stats["Speed"] / 255) * 100}%; background-color: var(--${types[0]}-dark)"></div>
          </div>
        </div>

        <div>
          <span class="bold">Total:</span>
          <span class="bold">${Object.values(stats).reduce((sum, statValue) => sum + statValue, 0)}</span>
        </div>
      </div>
  `;
}

function buttonTemplate(currentArray) {
  if (currentArray === allFilteredPokemons) {
    return `
      <button id="load-btn" class="mt-2" onclick="reloadInitialPokemons()">Go back</button>
    `;
  } else {
    return `
      <button id="load-btn" class="mt-2" onclick="loadMorePokemons()">Load more</button>
    `;
  }
}
