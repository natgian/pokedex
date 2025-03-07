//Refs
const cardsRef = document.getElementById("cards-container");
const loaderRef = document.getElementById("loader");
const modalRef = document.getElementById("modal");
const buttonsRef = document.getElementById("buttons-container");
const searchInputRef = document.getElementById("search-input");
const scrollToTopRef = document.getElementById("scroll-to-top-btn");

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

// Fetching functions
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

async function loadMorePokemons() {
  offset = offset + 20;
  await fetchPokemons();
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

// Render functions
function renderButtonTemplate(currentArray) {
  buttonsRef.innerHTML = buttonTemplate(currentArray);
}

function reloadInitialPokemons() {
  cardsRef.innerHTML = "";
  allPokemons.map((pokemon) => renderCardTemplate(pokemon)).join("");
  renderButtonTemplate(allPokemons);
}

function openModal(id) {
  disableScroll();

  let singlePokemon = allPokemons.find((pokemon) => pokemon.id === id);
  usedArray = allPokemons;

  if (!singlePokemon) {
    singlePokemon = allFilteredPokemons.find((pokemon) => pokemon.id === id);
    usedArray = allFilteredPokemons;
  }

  const currentIndex = usedArray.findIndex((pok) => pok.id === id);
  renderModalTemplate(singlePokemon, usedArray);
  disableButtons(currentIndex);
  renderModalContentTemplate(singlePokemon, aboutTemplate);
}

function closeModal() {
  enableScroll();
  modalRef.style.display = "none";
}

function navigatePokemon(id, direction) {
  const currentIndex = usedArray.findIndex((pokemon) => pokemon.id === id);
  const newIndex = direction === "prev" ? currentIndex - 1 : currentIndex + 1;
  const newPokemon = usedArray[newIndex];

  disableButtons(newIndex);
  updateModalWithNewData(newPokemon);

  if (document.getElementById("about-btn").classList.contains("current-selection")) {
    renderModalContentTemplate(newPokemon, aboutTemplate);
  } else {
    renderModalContentTemplate(newPokemon, statsTemplate);
  }
}

function disableButtons(index) {
  const prevBtnRef = document.getElementById("prev-btn");
  const nextBtnRef = document.getElementById("next-btn");

  prevBtnRef.disabled = index <= 0;
  nextBtnRef.disabled = index >= usedArray.length - 1;

  prevBtnRef.style.opacity = index <= 0 ? "0" : "1";
  nextBtnRef.style.opacity = index >= usedArray.length - 1 ? "0" : "1";
}

function updateModalWithNewData(singlePokemon) {
  document.getElementById("modal-title").innerHTML = `${singlePokemon.name} #${singlePokemon.id}`;
  document.querySelector(
    ".modal-container"
  ).style.backgroundImage = `linear-gradient(to top, var(--bg-color), var(--${singlePokemon.types[0]}))`;
  document.querySelector(".modal-img").src = singlePokemon.img;
  document.getElementById("about-btn").setAttribute("onclick", `renderAbout(${singlePokemon.id})`);
  document.getElementById("stats-btn").setAttribute("onclick", `renderStats(${singlePokemon.id})`);
  document.querySelector(".prev").setAttribute("onclick", `navigatePokemon(${singlePokemon.id}, 'prev')`);
  document.querySelector(".next").setAttribute("onclick", `navigatePokemon(${singlePokemon.id}, 'next')`);
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

// Helper functions
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

async function fetchAndProcessSinglePokemonData(pokemon) {
  const pokemonData = await fetchSinglePokemonData(pokemon.url);
  const processedPokemonData = processData(pokemonData);
  allFilteredPokemons.push(processedPokemonData);
}

function disableScroll() {
  document.body.style.overflow = "hidden";
}

function enableScroll() {
  document.body.style.overflow = "";
}

// Event listeners
searchInputRef.addEventListener("input", (event) => {
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

if (scrollToTopRef) {
  scrollToTopRef.style.display = "none";

  document.addEventListener("scroll", () => {
    if (document.documentElement.scrollTop <= 50) {
      scrollToTopRef.style.display = "none";
    } else {
      scrollToTopRef.style.display = "block";
    }
  });
  scrollToTopRef.addEventListener("click", () => {
    document.body.scrollIntoView({ behavior: "smooth" });
  });
}
