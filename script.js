const app = () => {
    return {
        characters: [],
        personagemSelect: null,
        episodioSelecionado: [],
        vizinhoSelecionado: [],
        urlImagem: "https://rickandmortyapi.com/api/character/avatar/19.jpeg",

        async init() {
            try {
                let page = 1;
                let allCharacters = [];

                // Loop para buscar todos os personagens paginados da API
                while (page !== null) {
                    const response = await axios.get(`https://rickandmortyapi.com/api/character/?page=${page}`);
                    const charactersPage = response.data.results;
                    allCharacters = [...allCharacters, ...charactersPage];

                    // Verifica se há próxima página e atualiza o valor da variável 'page'
                    page = response.data.info.next ? new URL(response.data.info.next).searchParams.get('page') : null;
                }

                // Ordena os personagens por nome
                allCharacters.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                });

                // Atribui todos os personagens à variável 'characters'
                this.characters = allCharacters;
                console.log(this.characters);
            } catch (error) {
                console.log(error);
            }
        },

        selecionarPersonagem(personagem) {
            // Atualiza o personagem selecionado
            this.personagemSelect = personagem;
            console.log(this.personagemSelect);

            // Limpa e preenche os episódios do personagem selecionado
            this.episodioSelecionado = [];
            for (episodio of personagem.episode) {
                axios.get(episodio)
                    .then((response) => {
                        this.episodioSelecionado.push("Ep" + ") " + response.data.id + " " + response.data.name);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }

            // Limpa e preenche os vizinhos do personagem selecionado
            this.vizinhoSelecionado = [];
            axios.get(personagem.location.url)
                .then((response) => {
                    const residents = response.data.residents;
                    const requests = residents.map(vizinho => axios.get(vizinho));
                    Promise.all(requests)
                        .then((responses) => {
                            const vizinhosOrdenados = responses.map(response => response.data.name).sort();
                            this.vizinhoSelecionado = vizinhosOrdenados;
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                });
        }
    };
};
