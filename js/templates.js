function cardTemplate({ id, name, img, types }) {
  const typeTags = types.map((type) => `<span class="type-tag">${type}</span>`).join(" ");
  return `
        <div class="card" style="background-color: var(--${types[0]})" onmouseover="this.style.backgroundColor='var(--${types[0]}-dark)'" onmouseout="this.style.backgroundColor='var(--${types[0]})'">
          <div>
            <h2 class="card-title">${name}</h2>
            <p class="mt-1">#${id}</p>
          </div>
          <img
            src=${img}
            alt="${name}"
            class="card-img"
          />

          <div class="card-tags-container" id="card-tags-container">
            ${typeTags}
          </div>
        </div>  
  `;
}
