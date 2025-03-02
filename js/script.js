//Refs
const cardsRef = document.getElementById("cards-container");
const loaderRef = document.getElementById("loader");
const loadButton = document.getElementById("load-btn");
const modalRef = document.getElementById("modal");

// API
const BASE_URL = "https://pokeapi.co/api/v2/";
let limit = 20;
let offset = 0;

let allPokemons = [];

function init() {
  getInitialPokemons();
}

async function getInitialPokemons() {
  cardsRef.innerHTML = "";
  showLoader();
  fetchPokemons();
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
      allPokemons.push(processedPokemonData);
      newPokemonData.push(processedPokemonData);
    }

    newPokemonData.forEach((processedPokemonData) => renderCardTemplate(processedPokemonData));
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
  await fetchPokemons(true);
}

function getPrevious(id) {
  if (id === 1) {
    return;
  }
  const singlePokemon = allPokemons.find((pokemon) => pokemon.id === id - 1);
  document.getElementById("modal-title").innerHTML = `${singlePokemon.name} #${singlePokemon.id}`;
  document.querySelector(
    ".modal-container"
  ).style.backgroundImage = `linear-gradient(to top, var(--bg-color), var(--${singlePokemon.types[0]}))`;
  document.querySelector(".modal-img").src = singlePokemon.img;
  document.getElementById("about-btn").setAttribute("onclick", `showAbout(${singlePokemon.id})`);
  document.getElementById("stats-btn").setAttribute("onclick", `showStats(${singlePokemon.id})`);
  document.querySelector(".prev").setAttribute("onclick", `getPrevious(${singlePokemon.id})`);
  document.querySelector(".next").setAttribute("onclick", `getNext(${singlePokemon.id})`);

  if (document.getElementById("about-btn").classList.contains("current-selection")) {
    renderModalContentTemplate(singlePokemon, aboutTemplate);
  } else {
    renderModalContentTemplate(singlePokemon, statsTemplate);
  }
}

function getNext(id) {
  if (id >= allPokemons.length) {
    return;
  }
  const singlePokemon = allPokemons.find((pokemon) => pokemon.id === id + 1);
  document.getElementById("modal-title").innerHTML = `${singlePokemon.name} #${singlePokemon.id}`;
  document.querySelector(
    ".modal-container"
  ).style.backgroundImage = `linear-gradient(to top, var(--bg-color), var(--${singlePokemon.types[0]}))`;
  document.querySelector(".modal-img").src = singlePokemon.img;
  document.getElementById("about-btn").setAttribute("onclick", `showAbout(${singlePokemon.id})`);
  document.getElementById("stats-btn").setAttribute("onclick", `showStats(${singlePokemon.id})`);
  document.querySelector(".prev").setAttribute("onclick", `getPrevious(${singlePokemon.id})`);
  document.querySelector(".next").setAttribute("onclick", `getNext(${singlePokemon.id})`);

  if (document.getElementById("about-btn").classList.contains("current-selection")) {
    renderModalContentTemplate(singlePokemon, aboutTemplate);
  } else {
    renderModalContentTemplate(singlePokemon, statsTemplate);
  }
}

function showLoader() {
  loaderRef.style.display = "flex";
  loadButton.style.display = "none";
}

function hideLoader() {
  loaderRef.style.display = "none";
  loadButton.style.display = "block";
  cardsRef.style.display = "flex";
}

function showErrorMessage(error) {
  console.error(`Something went wrong: ${error}`);
  cardsRef.innerHTML = `<p class="error-message">Something went wrong: Error ${error}.
      <br>
      Please try again later.</p>`;
}

function openModal(id) {
  const singlePokemon = allPokemons.find((pokemon) => pokemon.id === id);
  renderModalTemplate(singlePokemon);
  renderModalContentTemplate(singlePokemon, aboutTemplate);
}

function closeModal() {
  modalRef.style.display = "none";
}

function renderCardTemplate(data) {
  cardsRef.innerHTML += cardTemplate(data);
}

function renderModalTemplate(data) {
  modalRef.innerHTML = modalTemplate(data);
  modalRef.style.display = "flex";
}

function renderModalContentTemplate(data, template) {
  const modalContentRef = document.getElementById("modal-content");
  modalContentRef.innerHTML = "";
  modalContentRef.innerHTML += template(data);
}

function showStats(id) {
  const singlePokemon = allPokemons.find((pokemon) => pokemon.id === id);
  renderModalContentTemplate(singlePokemon, statsTemplate);
  document.getElementById("about-btn").classList.remove("current-selection");
  document.getElementById("stats-btn").classList.add("current-selection");
}

function showAbout(id) {
  const singlePokemon = allPokemons.find((pokemon) => pokemon.id === id);
  renderModalContentTemplate(singlePokemon, aboutTemplate);
  document.getElementById("about-btn").classList.add("current-selection");
  document.getElementById("stats-btn").classList.remove("current-selection");
}
