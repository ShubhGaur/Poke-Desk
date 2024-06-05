let pokemons = [];
let limit = 20;
let offset = 0;
const pokemonsDiv = document.querySelector("#pokemons");
const AddBtn = document.querySelector("#AddMore");
const filterByType = document.querySelector("#filterByType");
const searchByName = document.querySelector("#searchByName");

window.addEventListener("load", async () => {
  const initialData = await getDataFromAPI(
    "https://pokeapi.co/api/v2/pokemon?limit=" + limit + "&offset=" + offset
  );

  const promises = initialData.results.map((pokeObj) => {
    return getDataFromAPI(pokeObj.url);
  });

  const finalData = await Promise.all(promises);
  // console.log(finalData);
  pokemons.push(...finalData);
  displayPokemons(finalData);
});

AddBtn.addEventListener("click", AddPokemons);

filterByType.addEventListener("change", filterPokemons);

searchByName.addEventListener("keyup", searchPokemons);

function searchPokemons(e) {
  const searchTerm = e.target.value;
  let copy = pokemons;
  copy = copy.filter((pokemon) => {
    return pokemon.name.toLowerCase().includes(searchTerm);
  });

  if (copy.length === 0) {
    pokemonsDiv.innerHTML = "<p class='noPokemon'>NO POKEMON FOUND. ADD MORE</p>";
  } else {
    pokemonsDiv.innerHTML = "";
    displayPokemons(copy);
  }
}

function filterPokemons(e) {
  let copy = pokemons;
  copy = copy.filter((pokemon) => {
    return pokemon.types[0].type.name === e.target.value;
  });
  // console.log(copy);

  pokemonsDiv.innerHTML = "";
  displayPokemons(copy);
}

async function AddPokemons() {
  offset += limit;
  // console.log(offset);
  const newData = await getDataFromAPI(
    "https://pokeapi.co/api/v2/pokemon?limit=" + limit + "&offset=" + offset
  );

  const promises = newData.results.map((pokeObj) => {
    return getDataFromAPI(pokeObj.url);
  });

  const finalData = await Promise.all(promises);
  // console.log(finalData);
  pokemons.push(...finalData);
  displayPokemons(finalData);
}

function displayPokemons(pokemonsToPrint) {
  //   console.log(pokemons);
  pokemonsToPrint.forEach((pokemon) => {
    const div1 = document.createElement("div");
    const div2 = document.createElement("div");
    const div3 = document.createElement("div");
    const div4 = document.createElement("div");
    const img = document.createElement("img");
    const name = document.createElement("p");
    const weight = document.createElement("h4")
    const height = document.createElement("h4")
    div1.classList.add("flip-card")
    div2.classList.add("flip-card-inner")
    div3.classList.add("pokemon");
    div4.classList.add("flip-card-back")
    name.classList.add("pokemon-name");

    weight.innerText = "Weight :"+ pokemon.weight;
    height.innerText = "Height :"+ pokemon.height;
    name.innerText = pokemon.name;
    img.src = pokemon.sprites.other.dream_world.front_default;
    div4.append(height, weight)
    for(i=0;i<=pokemon.stats.length-1;i++){
      let stat= document.createElement("p")
      stat.innerText = pokemon.stats[i].stat.name +" : "+ pokemon.stats[i].base_stat;
      div4.append(stat)
    }
    div1.append(div2)
    div2.append(div3,div4)
    div3.append(img, name);
    console.log(pokemon)

    pokemonsDiv.append(div1);
  });
}

async function getDataFromAPI(url) {
  const response = await fetch(url);
  const result = await response.json();
  return result;
}
