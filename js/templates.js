function cardTemplate(pokemon) {
  const { name, id } = pokemon;
  console.log(pokemon);
  return `
        <div class="card" style="background-color: var(--${pokemon.types[0].type.name})" onmouseover="this.style.backgroundColor='var(--${pokemon.types[0].type.name}-dark)'" onmouseout="this.style.backgroundColor='var(--${pokemon.types[0].type.name})'">
          <div>
            <h2 class="card-title">${pokemon.name}</h2>
            <p class="mt-1">#${pokemon.id}</p>
          </div>
          <img
            src=${pokemon.sprites?.other?.["official-artwork"]?.["front_default"]}
            alt="${pokemon.name}"
            class="card-img"
          />

          <div class="card-tags-container" id="card-tags-container">
            <span class="type-tag">Grass</span>
            <span class="type-tag">Fighting</span>
          </div>
        </div>  
  `;
}
