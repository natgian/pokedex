//Refs
const cardsRef = document.getElementById("cards-container");
const loaderRef = document.getElementById("loader");
const loadButton = document.getElementById("load-btn");

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
  cardsRef.style.display = "none";
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
      const processedData = processData(pokemonData);
      newPokemonData.push(processedData);
    }

    newPokemonData.forEach((processedData) => renderCardTemplate(processedData));
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
    name: data.name.charAt(0).toUpperCase() + data.name.slice(1),
    img: data.sprites?.other?.["official-artwork"]?.["front_default"],
    types: data.types.map((typeName) => typeName.type.name.charAt(0).toUpperCase() + typeName.type.name.slice(1)),
    id: data.id,
  };
}

async function loadMorePokemons() {
  offset = offset + 20;
  await fetchPokemons(true);
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

function renderCardTemplate(data) {
  cardsRef.innerHTML += cardTemplate(data);
}
