//Refs
const cardsRef = document.getElementById("cards-container");

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
  fetchPokemons();
}

async function loadMorePokemons() {
  offset = offset + 20;
  fetchPokemons();
}

async function fetchPokemons() {
  try {
    const response = await fetch(`${BASE_URL}pokemon?limit=${limit}&offset=${offset}`);

    if (!response.ok) {
      showErrorMessage(response.status);
      return;
    }

    const data = await response.json();
    allPokemons = data.results;

    for (const pokemon of allPokemons) {
      const pokemonData = await fetchSinglePokemonData(pokemon.url);
      const processedData = processData(pokemonData);

      renderCardTemplate(processedData);
    }
  } catch (error) {
    showErrorMessage(error);
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

function showErrorMessage(error) {
  console.error(`Something went wrong: ${error}`);
  cardsRef.innerHTML = `<p class="error-message">Something went wrong: Error ${error}.
      <br>
      Please try again later.</p>`;
}

function renderCardTemplate(data) {
  cardsRef.innerHTML += cardTemplate(data);
}
