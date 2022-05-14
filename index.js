((Utils) => {
  const App = {
    htmlElements: {
      pokemonFinderForm: document.querySelector("#pokemon-finder-form"),
      pokemonFinderSearchType: document.querySelector(
        "#pokemon-finder-search-type"
      ),
      pokemonFinderInput: document.querySelector("#pokemon-finder-query"),
      pokemonFinderOutput: document.querySelector("#pokemon-finder-response"),
    },
    init: () => {
      App.htmlElements.pokemonFinderForm.addEventListener(
        "submit",
        App.handlers.pokemonFinderFormOnSubmit
      );
    },
    handlers: {
      pokemonFinderFormOnSubmit: async (e) => {
        e.preventDefault();

        const query = App.htmlElements.pokemonFinderInput.value;
        const searchType = App.htmlElements.pokemonFinderSearchType.value;
        console.log({ searchType });
        try {
          const response = await Utils.getPokemon({
            query,
            searchType,
          });
          console.log(response.species.url);
          const x = await Utils.getEvolution(response.species.url)
       
          console.log(x);
          const y = await Utils.getEvolution(x.evolution_chain.url)
          console.log(y);
           const renderedTemplate = App.templates.render({
            searchType,
            response,
          });
          App.htmlElements.pokemonFinderOutput.innerHTML = renderedTemplate;
        } catch (error) {
          App.htmlElements.pokemonFinderOutput.innerHTML = `<h1>${error}</h1>`;
        }
      },
    },
    templates: {
      render: ({ searchType, response }) => {
        const renderMap = {
          ability: App.templates.abilityCard,
          pokemon: App.templates.pokemonCard,
        };
        return renderMap[searchType]
          ? renderMap[searchType](response)
          : App.templates.errorCard();
      },
      errorCard: () => `<h1>There was an error</h1>`,

      pokemonCard: ({ id, name, weight, height, abilities}) => {
      
       const abilietieList = abilities.map(
          (element) => `<li>${element.ability.name}</li>`
        );
        return `<div id ='global'><div id ='dif'><h1>${name} (${id})</h1>
        <div id=text1>
               <h4>Sprites</h4>
               <h4>Weight/Height</h4>
        </div>
        <div id=text2>
               <p><img src="dog.png" alt="" width="50px" height="50px"></p>
               <p>${weight}/${height}</p>
        </div>
        <div id=text3>
               <h4>Evolution Chain</h4>
               <h4>Abilities</h4>
        </div>
        <div id=text4>
                   <p><img src="xd.png" alt="" width="50px" height="50px"></p>
                   <div id='abilities'><p>${abilietieList.join("")}</p></div>
        </div></div>`;
      },
      abilityCard: ({ id, name, pokemon }) => {
        const pokemonList = pokemon.map(
          ({ pokemon, is_hidden }) =>
            `<li><a target="_blank" href="${pokemon.url}">${pokemon.name}${
              is_hidden ? " (Hidden)" : ""
            }</a></li>`
        );
        
        return `<h1>${name} (${id})</h1><p>${pokemonList.join("")}</p>`;
      },
    },
  };
  App.init();
})(document.Utils);
