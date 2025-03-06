//Refs
const cardsRef = document.getElementById("cards-container");
const loaderRef = document.getElementById("loader");
const loadButton = document.getElementById("load-btn");
const modalRef = document.getElementById("modal");
const searchInput = document.getElementById("search-input");
const buttonsRef = document.getElementById("buttons-container");

// API
const BASE_URL = "https://pokeapi.co/api/v2/";
let limit = 20;
let offset = 0;

// Storage
let allPokemons = [];
let allFilteredPokemons = [];
let usedArray = allPokemons;

function init() {
  getInitialPokemons();
}

async function getInitialPokemons() {
  cardsRef.innerHTML = "";
  showLoader();
  fetchPokemons();
}

function renderButtonTemplate(currentArray) {
  buttonsRef.innerHTML = buttonTemplate(currentArray);
}

function reloadInitialPokemons() {
  cardsRef.innerHTML = "";
  allPokemons.map((pokemon) => renderCardTemplate(pokemon)).join("");
  renderButtonTemplate(allPokemons);
}

async function fetchPokemons() {
  showLoader();

  try {
    const response = await fetch(`${BASE_URL}pokemon?limit=${limit}&offset=${offset}`);

    if (!response.ok) {
      showErrorMessage(response.status);
      return;
    }

    const data = await response.json();
    const newPokemons = data.results;
    const newPokemonData = [];

    for (const pokemon of newPokemons) {
      const pokemonData = await fetchSinglePokemonData(pokemon.url);
      const processedPokemonData = processData(pokemonData);
      newPokemonData.push(processedPokemonData);
      allPokemons.push(processedPokemonData);
    }

    newPokemonData.map((pokemon) => renderCardTemplate(pokemon)).join("");
    renderButtonTemplate(allPokemons);
  } catch (error) {
    showErrorMessage(error);
  } finally {
    hideLoader();
  }
}

async function fetchSinglePokemonData(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      showErrorMessage(response.status);
      return;
    }
    return await response.json();
  } catch (error) {
    showErrorMessage(error);
  }
}

function processData(data) {
  return {
    id: data.id,
    name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
    img: data.sprites?.other?.["official-artwork"]?.["front_default"],
    types: data.types.map((typeName) => typeName.type.name.charAt(0).toUpperCase() + typeName.type.name.slice(1)),
    height: data.height / 10,
    weight: data.weight / 10,
    species: data.species?.name.charAt(0).toUpperCase() + data.species?.name.slice(1),
    abilities: data.abilities.map((abilityName) => abilityName.ability.name.charAt(0).toUpperCase() + abilityName.ability.name.slice(1)),
    stats: data.stats.reduce((statsObject, statData) => {
      const statName = statData.stat.name.charAt(0).toUpperCase() + statData.stat.name.slice(1);
      statsObject[statName] = statData.base_stat;
      return statsObject;
    }, {}),
  };
}

async function loadMorePokemons() {
  offset = offset + 20;
  await fetchPokemons();
}

function openModal(id) {
  let singlePokemon = allPokemons.find((pokemon) => pokemon.id === id);
  usedArray = allPokemons;

  if (!singlePokemon) {
    singlePokemon = allFilteredPokemons.find((pokemon) => pokemon.id === id);
    usedArray = allFilteredPokemons;
  }

  renderModalTemplate(singlePokemon, usedArray);
  renderModalContentTemplate(singlePokemon, aboutTemplate);
}

function closeModal() {
  modalRef.style.display = "none";
}

function getPrevious(id) {
  const currentIndex = usedArray.findIndex((pokemon) => pokemon.id === id);
  const prevPokemon = usedArray[currentIndex - 1];

  if (currentIndex <= 0) {
    return;
  }

  if (!prevPokemon) {
    return;
  }

  updateModalWithNewData(prevPokemon);

  if (document.getElementById("about-btn").classList.contains("current-selection")) {
    renderModalContentTemplate(prevPokemon, aboutTemplate);
  } else {
    renderModalContentTemplate(prevPokemon, statsTemplate);
  }
}

function getNext(id) {
  const currentIndex = usedArray.findIndex((pokemon) => pokemon.id === id);
  const nextPokemon = usedArray[currentIndex + 1];

  if (!nextPokemon) {
    return;
  }

  if (currentIndex >= usedArray.length - 1) {
    return;
  }

  updateModalWithNewData(nextPokemon);

  if (document.getElementById("about-btn").classList.contains("current-selection")) {
    renderModalContentTemplate(nextPokemon, aboutTemplate);
  } else {
    renderModalContentTemplate(nextPokemon, statsTemplate);
  }
}

function updateModalWithNewData(singlePokemon) {
  document.getElementById("modal-title").innerHTML = `${singlePokemon.name} #${singlePokemon.id}`;
  document.querySelector(
    ".modal-container"
  ).style.backgroundImage = `linear-gradient(to top, var(--bg-color), var(--${singlePokemon.types[0]}))`;
  document.querySelector(".modal-img").src = singlePokemon.img;
  document.getElementById("about-btn").setAttribute("onclick", `renderAbout(${singlePokemon.id})`);
  document.getElementById("stats-btn").setAttribute("onclick", `renderStats(${singlePokemon.id})`);
  document.querySelector(".prev").setAttribute("onclick", `getPrevious(${singlePokemon.id})`);
  document.querySelector(".next").setAttribute("onclick", `getNext(${singlePokemon.id})`);
}

function showLoader() {
  loaderRef.style.display = "flex";
  buttonsRef.style.display = "none";
}

function hideLoader() {
  loaderRef.style.display = "none";
  cardsRef.style.display = "flex";
  buttonsRef.style.display = "flex";
}

function showErrorMessage(error) {
  console.error(`Something went wrong: ${error}`);
  cardsRef.innerHTML = `<p class="error-message">Something went wrong: Error ${error}.
      <br>
      Please try again later.</p>`;
}

function renderCardTemplate(data) {
  cardsRef.innerHTML += cardTemplate(data);
}

function renderModalTemplate(data, array) {
  modalRef.innerHTML = modalTemplate(data, array);
  modalRef.style.display = "flex";
}

function renderModalContentTemplate(data, template) {
  const modalContentRef = document.getElementById("modal-content");
  modalContentRef.innerHTML = "";
  modalContentRef.innerHTML += template(data);
}

function renderStats(id) {
  let singlePokemon = allPokemons.find((pokemon) => pokemon.id === id);

  if (!singlePokemon) {
    singlePokemon = allFilteredPokemons.find((pokemon) => pokemon.id === id);
    currentArray = allFilteredPokemons;
  }

  renderModalContentTemplate(singlePokemon, statsTemplate);
  document.getElementById("about-btn").classList.remove("current-selection");
  document.getElementById("stats-btn").classList.add("current-selection");
}

function renderAbout(id) {
  let singlePokemon = allPokemons.find((pokemon) => pokemon.id === id);

  if (!singlePokemon) {
    singlePokemon = allFilteredPokemons.find((pokemon) => pokemon.id === id);
  }

  renderModalContentTemplate(singlePokemon, aboutTemplate);
  document.getElementById("about-btn").classList.add("current-selection");
  document.getElementById("stats-btn").classList.remove("current-selection");
}

async function fetchFilteredPokemons(query) {
  try {
    const response = await fetch(`${BASE_URL}pokemon?limit=1025`);

    if (!response.ok) {
      showErrorMessage(response.status);
      return;
    }

    const data = await response.json();
    const filteredPokemons = data.results.filter((pokemon) => pokemon.name.startsWith(query));

    if (filteredPokemons.length === 0) {
      allFilteredPokemons = [];
      cardsRef.innerHTML = `<p class="error-message">No results. Please try another search.</p>`;
      return;
    }

    allFilteredPokemons = [];

    for (const pokemon of filteredPokemons) {
      await fetchAndProcessSinglePokemonData(pokemon);
    }

    allFilteredPokemons.map((pokemon) => renderCardTemplate(pokemon));
  } catch (error) {
    showErrorMessage(error);
  }
}

async function fetchAndProcessSinglePokemonData(pokemon) {
  const pokemonData = await fetchSinglePokemonData(pokemon.url);
  const processedPokemonData = processData(pokemonData);
  allFilteredPokemons.push(processedPokemonData);
}

searchInput.addEventListener("input", (event) => {
  renderButtonTemplate(allFilteredPokemons);
  const query = event.target.value.trim().toString().toLowerCase();

  if (query === "") {
    cardsRef.innerHTML = "";
  }

  if (query.length >= 3) {
    cardsRef.innerHTML = "";
    fetchFilteredPokemons(query);
  }
});
