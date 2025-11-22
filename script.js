const cardContainer = document.getElementById("card-container");
const lancamentosContainer = document.getElementById("lancamentos-container");
const categoryFiltersContainer = document.getElementById("category-filters");
const inputBusca = document.querySelector("#input-busca");
const lancamentosSection = document.querySelector('.lancamentos-section');
const todosOsJogosTitle = document.getElementById('todos-os-jogos-title'); // Título original
const botaoVoltar = document.getElementById('botao-voltar');
let dados = [];

// Função para carregar os dados do JSON apenas uma vez.
async function carregarDados() {
    try {
        const resposta = await fetch("data.json");
        dados = await resposta.json(); // Armazena todos os jogos
        renderizarDestaques(dados); // Renderiza os lançamentos
        criarFiltrosDeCategoria(dados); // Cria os botões de filtro
        renderizarCards(dados); // Mostra todos os jogos inicialmente
    } catch (error) {
        console.error("Erro ao carregar os dados:", error);
    }
}

function iniciarBusca() {
    const termoBuscado = inputBusca.value.toLowerCase();
    filtrarEExibir(termoBuscado);
}

function filtrarEExibir(termo, categoria = 'todos') {
    // Esconde ou mostra a seção de lançamentos e ajusta o título e o botão de voltar
    if (termo || categoria !== 'todos') {
        lancamentosSection.style.display = 'none';
        todosOsJogosTitle.textContent = 'Resultados da Busca';
        botaoVoltar.style.display = 'inline-block'; // Mostra o botão
    } else {
        lancamentosSection.style.display = 'block';
        todosOsJogosTitle.textContent = 'Todos os Jogos';
        botaoVoltar.style.display = 'none'; // Esconde o botão
    }
    // Remove a classe 'active' de todos os botões de categoria
    document.querySelectorAll('.category-filters button').forEach(btn => btn.classList.remove('active'));

    // Adiciona 'active' ao botão clicado ou ao botão 'Todos' se for uma busca
    const btnAtivo = document.querySelector(`.category-filters button[data-category="${categoria}"]`);
    if (btnAtivo) {
        btnAtivo.classList.add('active');
    }

    let resultados = dados.filter(jogo => {
        const nomeJogo = jogo.nome.toLowerCase();
        const descricaoJogo = jogo.descrição.toLowerCase();
        const correspondeTermo = !termo || nomeJogo.includes(termo) || descricaoJogo.includes(termo);
        const correspondeCategoria = categoria === 'todos' || descricaoJogo.includes(categoria.toLowerCase());
        return correspondeTermo && correspondeCategoria;
    });
    
    renderizarCards(resultados);
}

function renderizarCards(jogos) {
    cardContainer.innerHTML = ""; // Limpa os cards existentes antes de renderizar novos
    jogos.forEach(jogo => {
        const article = document.createElement("article");
        article.classList.add("card"); // Classe base para todos os cards

        article.innerHTML = `
            <div class="card-info">
                <h2>${jogo.nome}</h2> 
                <p>${jogo.Ano}</p>
                <p>${jogo.descrição}</p>
                <a href="${jogo.link}" target="_blank">Saiba mais</a>
            </div>
            <div class="promocao-container" id="promo-${jogo.slug || jogo.nome.replace(/\s+/g, '-')}">
                <p>Verificando promoções...</p>
            </div>`;
        cardContainer.appendChild(article);

        // Depois que o card está na tela, busca a promoção
        if (jogo.slug) {
            buscarPromocao(jogo); // Passa o objeto 'jogo' inteiro
        } else {
            const promoContainer = document.getElementById(`promo-${jogo.nome.replace(/\s+/g, '-')}`);
            promoContainer.innerHTML = `<p>Não foi possível verificar promoções.</p>`;
        }
    });
}

function renderizarDestaques(jogos) {
    // Ordena os jogos por ano (do mais novo para o mais antigo) e pega os 5 primeiros
    const destaques = [...jogos].sort((a, b) => b.Ano - a.Ano).slice(0, 5);

    lancamentosContainer.innerHTML = ""; // Limpa os destaques existentes
    destaques.forEach(jogo => {
        const article = document.createElement("article");
        article.classList.add("card", "lancamento"); // Adiciona a classe especial 'lancamento'
        article.innerHTML = `
            <div class="card-info">
                <h2>${jogo.nome}</h2>
                <p class="ano">${jogo.Ano}</p>
                <p>${jogo.descrição}</p>
                <a href="${jogo.link}" target="_blank">Saiba mais</a>
            </div>
            <div class="promocao-container" id="promo-${jogo.slug || jogo.nome.replace(/\s+/g, '-')}">
                <p>Verificando promoções...</p>
            </div>`;
        lancamentosContainer.appendChild(article);

        if (jogo.slug) {
            buscarPromocao(jogo);
        } else {
            const promoContainer = document.getElementById(`promo-${jogo.nome.replace(/\s+/g, '-')}`);
            promoContainer.innerHTML = `<p>Não foi possível verificar promoções.</p>`;
        }
    });
}

function criarFiltrosDeCategoria(jogos) {
    const generos = new Set(['Todos', 'RPG', 'Ação', 'Aventura', 'Plataforma', 'Simulação', 'Estratégia']); // Base de gêneros
    
    categoryFiltersContainer.innerHTML = '';
    generos.forEach(genero => {
        const button = document.createElement('button');
        button.textContent = genero;
        button.dataset.category = genero.toLowerCase();
        button.onclick = () => filtrarEExibir(inputBusca.value.toLowerCase(), genero.toLowerCase());
        categoryFiltersContainer.appendChild(button);
    });
    categoryFiltersContainer.querySelector('button').classList.add('active'); // Ativa o botão 'Todos' por padrão
}

// Função (simulada) para buscar a melhor promoção de um jogo
async function buscarPromocao(jogo) {
    const promoContainer = document.getElementById(`promo-${jogo.slug}`);
    
    // --- Início da Lógica Real (exemplo conceitual) ---
    // Você precisaria de uma chave de API de um serviço como o IsThereAnyDeal
    // const apiKey = 'SUA_CHAVE_DE_API_AQUI';
    // const url = `https://api.isthereanydeal.com/v01/game/prices/?key=${apiKey}&plains=${slugDoJogo}`;
    
    try {
        // const response = await fetch(url);
        // const data = await response.json();
        // const bestDeal = data.data[slugDoJogo].list[0]; // Pega a primeira oferta (geralmente a melhor)

        // --- Simulação de uma resposta da API ---
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000)); // Simula um tempo de espera variado
        
        // Adiciona uma chance de 70% de encontrar uma promoção
        if (Math.random() < 0.7) {
            // --- Lógica de Preço Simulado Baseado no Ano ---
            const anoAtual = new Date().getFullYear();
            const idadeDoJogo = anoAtual - jogo.Ano;
            let minPrice, maxPrice;

            if (idadeDoJogo <= 1) { // Jogos muito recentes (até 1 ano)
                minPrice = 150; maxPrice = 250;
            } else if (idadeDoJogo <= 4) { // Jogos recentes (2 a 4 anos)
                minPrice = 80; maxPrice = 149;
            } else if (idadeDoJogo <= 7) { // Jogos intermediários (5 a 7 anos)
                minPrice = 40; maxPrice = 79;
            } else { // Jogos mais antigos (mais de 7 anos)
                minPrice = 10; maxPrice = 39;
            }

            // Gera um preço aleatório dentro da faixa definida
            const precoSimulado = Math.random() * (maxPrice - minPrice) + minPrice;

            const bestDeal = { price_new: precoSimulado, shop: { name: 'Nuuvem' }, url: 'https://www.nuuvem.com/' }; // Dados de exemplo com preço dinâmico

            // --- Fim da Simulação ---

            promoContainer.innerHTML = `
                <p class="promo-title">🔥 Em promoção!</p>
                <p>Melhor preço: <strong>R$ ${bestDeal.price_new.toFixed(2).replace('.', ',')}</strong> na ${bestDeal.shop.name}</p>
                <a href="${bestDeal.url}" class="promo-link" target="_blank">Ir para a loja</a>`;
        } else {
            // Simula o caso de não encontrar promoção
            promoContainer.innerHTML = `<p>Nenhuma promoção encontrada no momento.</p>`;
        }

    } catch (error) {
        console.error("Erro ao buscar promoção para " + jogo.slug, error);
        promoContainer.innerHTML = `<p>Promoção não encontrada.</p>`;
    }
}

// --- Lógica para o botão de Voltar/Limpar Busca ---
botaoVoltar.addEventListener('click', () => {
    inputBusca.value = ''; // Limpa o campo de texto da busca
    // Chama a função de filtro sem termo e com a categoria 'todos' para resetar a visualização
    filtrarEExibir('', 'todos');
});

// --- Lógica para o Carrossel de Lançamentos ---
document.addEventListener('DOMContentLoaded', () => {
    const prevBtn = document.getElementById('prev-lancamento');
    const nextBtn = document.getElementById('next-lancamento');
    const container = document.getElementById('lancamentos-container');

    const scrollAmount = 300; // Quantidade de pixels para rolar

    prevBtn.addEventListener('click', () => container.scrollLeft -= scrollAmount);
    nextBtn.addEventListener('click', () => container.scrollLeft += scrollAmount);
});

// --- Lógica para Troca de Tema (Dark/Light Mode) ---
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const body = document.body;

    // Ícones para os temas
    const lightIcon = '☀️';
    const darkIcon = '🌙';

    // Função para aplicar o tema e o ícone correto
    const applyTheme = (theme) => {
        if (theme === 'light') {
            body.classList.add('light-mode');
            themeToggleBtn.textContent = darkIcon;
        } else {
            body.classList.remove('light-mode');
            themeToggleBtn.textContent = lightIcon;
        }
    };

    // Verifica o tema salvo no localStorage ou usa o padrão (dark)
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);

    // Adiciona o evento de clique ao botão
    themeToggleBtn.addEventListener('click', () => {
        const newTheme = body.classList.contains('light-mode') ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
});

// Carrega os dados assim que o script é executado
carregarDados();
