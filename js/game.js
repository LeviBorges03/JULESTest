// 4.1. FUNÇÃO PRINCIPAL DE ATUALIZAÇÃO
function atualizar() {
    gameState.framesDesdeInicio++;
    gameState.framesDesdeRespawn++;

    handleInput();
    updatePlayerState();
    updateParticles();
    checkGameStatus();

    // Atualiza o timer das plataformas que desaparecem
    gameState.mapa.forEach(elemento => {
        if (elemento.tipo === 'plataforma-desaparece' && elemento.timer > 0) {
            elemento.timer--;
        }
    });

    // Remove as plataformas que desapareceram
    gameState.mapa = gameState.mapa.filter(elemento => elemento.timer !== 0);
}


// 4.4. ATUALIZAÇÃO DAS PARTÍCULAS
function updateParticles() {
    for (let i = particulas.length - 1; i >= 0; i--) {
        const p = particulas[i];
        if (p.texto) {
            p.y += p.vy;
        } else {
            p.x += p.velocidadeX;
            p.y += p.velocidadeY;
        }
        p.vida--;
        if (p.vida <= 0) particulas.splice(i, 1);
    }
}

// 4.5. VERIFICAÇÃO DE STATUS DO JOGO
function checkGameStatus() {
    const porta = gameState.mapa.find(e => e.tipo === "porta");
    if (porta) {
        const colisaoPorta = {
            x: porta.x + (porta.largura - CONFIG.PORTA_LARGURA) / 2,
            y: porta.y - (CONFIG.PORTA_ALTURA - porta.altura),
            largura: CONFIG.PORTA_LARGURA, altura: CONFIG.PORTA_ALTURA
        };
        if (colisao(jogador, colisaoPorta) && gameState.chavesColetadas >= porta.chavesNecessarias) {
            gameState.nivelAtual++;
            (gameState.nivelAtual > CONFIG.MAX_NIVEIS) ? mostrarTelaFinal("VITÓRIA!", `Você completou ${CONFIG.MAX_NIVEIS} níveis!`) : reiniciarNivel();
        }
    }
    if (jogador.y > CONFIG.CANVAS_ALTURA + CONFIG.MORTE_POR_QUEDA_Y_OFFSET) morrer();
}

// =================================================================================================
// 5. CRIAÇÃO DE MAPAS
// =================================================================================================

// 5.1. FUNÇÕES DE CRIAÇÃO DE OBJETOS
const criarBloco = (x, y, w = CONFIG.LARGURA_BLOCO, h = CONFIG.ALTURA_BLOCO) => ({ tipo: "bloco", x, y, largura: w, altura: h });
const criarPlataformaQueDesaparece = (x, y, w = CONFIG.LARGURA_BLOCO, h = CONFIG.ALTURA_BLOCO) => ({ tipo: "plataforma-desaparece", x, y, largura: w, altura: h, timer: -1 });
const criarEspinho = (x, y, w = CONFIG.LARGURA_BLOCO, h = CONFIG.ESPINHO_ALTURA) => ({ tipo: "espinho", x, y, largura: w, altura: h });
const criarChave = (x, y) => ({ tipo: "chave", x, y, largura: CONFIG.CHAVE_TAMANHO, altura: CONFIG.CHAVE_TAMANHO });
const criarPorta = (x, y, ch = 0) => ({ tipo: "porta", x, y, largura: CONFIG.PORTA_LARGURA_BASE, altura: CONFIG.PORTA_ALTURA_BASE, chavesNecessarias: ch });
const criarPortal = (x, y, id, w = CONFIG.PORTAL_LARGURA, h = CONFIG.PORTAL_ALTURA) => ({ tipo: "portal", x, y, largura: w, altura: h, id });
const criarCoracao = (x, y) => ({ tipo: "coracao", x, y, largura: CONFIG.CORACAO_TAMANHO, altura: CONFIG.CORACAO_TAMANHO });

// 5.2. LÓGICA DE GERAÇÃO DE NÍVEIS
function criarMapa(nivel) {
    let m = [];
    if (nivel === 1) {
        m.push(criarBloco(0, CONFIG.CHAO_Y, CONFIG.CANVAS_LARGURA, CONFIG.ALTURA_BLOCO * 2));
    }

    const layoutNivel = obterLayoutNivel(nivel);
    if (layoutNivel) {
        m.push(...layoutNivel);
    }

    if (nivel > 1) {
        adicionarCoracoes(m, nivel);
    }

    return m;
}

function obterLayoutNivel(nivel) {
    const XPORTA = CONFIG.CANVAS_LARGURA - CONFIG.PORTA_X_OFFSET;
    const ESPINHO_Y = CONFIG.CHAO_Y - CONFIG.ESPINHO_ALTURA;

    switch (nivel) {
        case 1:
            return [
                criarBloco(200, CONFIG.CHAO_Y - 80, 100),
                criarEspinho(400, ESPINHO_Y, 150),
                criarChave(230, CONFIG.CHAO_Y - 120),
                criarPorta(XPORTA, CONFIG.CHAO_Y - 60, 1)
            ];
        default: {
            const m = [];
            m.push(criarEspinho(0, CONFIG.CHAO_Y, CONFIG.CANVAS_LARGURA, CONFIG.ALTURA_BLOCO));

            const numPlataformas = Math.max(4, 12 - nivel);
            const larguraPlataforma = CONFIG.LARGURA_BLOCO * (Math.max(2, 5 - Math.floor(nivel / 3)));
            let xAtual = CONFIG.LARGURA_BLOCO * 2;
            let yAtual = CONFIG.CHAO_Y - CONFIG.ALTURA_BLOCO * 3;

            m.push(criarBloco(xAtual, yAtual, larguraPlataforma * 1.5));

            for (let i = 1; i < numPlataformas; i++) {
                const dX = 90 + Math.random() * 120;
                const dY = (Math.random() - 0.5) * 200;
                xAtual += larguraPlataforma + dX;
                if (xAtual > CONFIG.CANVAS_LARGURA - larguraPlataforma - CONFIG.PORTA_X_OFFSET) {
                    break;
                }
                yAtual += dY;
                yAtual = Math.max(200, Math.min(yAtual, CONFIG.CHAO_Y - 100));
                m.push(criarPlataformaQueDesaparece(xAtual, yAtual, larguraPlataforma));
            }

            const ultimaPlataforma = m[m.length - 1];
            const portaX = ultimaPlataforma.x + ultimaPlataforma.largura / 2 - CONFIG.PORTA_LARGURA_BASE / 2;
            m.push(criarBloco(portaX - 20, ultimaPlataforma.y, CONFIG.PORTA_LARGURA_BASE + 40));
            m.push(criarPorta(portaX, ultimaPlataforma.y, 0));

            return m;
        }
    }
}

function adicionarCoracoes(mapa, nivel) {
    const chanceCoracao = CONFIG.CHANCE_CORACAO_INICIAL + (nivel * CONFIG.CHANCE_CORACAO_INCREMENTO_POR_NIVEL);
    if (Math.random() < chanceCoracao) {
        let tentativas = CONFIG.CORACAO_GERACAO_TENTATIVAS;
        while (tentativas > 0) {
            const platLargura = CONFIG.LARGURA_BLOCO * 3;
            const platX = Math.random() * (CONFIG.CANVAS_LARGURA - platLargura - (CONFIG.CORACAO_GERACAO_X_PADDING * 2)) + CONFIG.CORACAO_GERACAO_X_PADDING;
            const platY = Math.random() * (CONFIG.CHAO_Y - CONFIG.CORACAO_GERACAO_Y_MAX_OFFSET) + CONFIG.CORACAO_GERACAO_Y_MIN;

            const novaPlataforma = criarBloco(platX, platY, platLargura, CONFIG.ALTURA_BLOCO);

            let overlap = mapa.some(elemento => colisao(elemento, {
                x: novaPlataforma.x - CONFIG.CORACAO_GERACAO_OVERLAP_MARGIN, y: novaPlataforma.y - CONFIG.CORACAO_GERACAO_OVERLAP_MARGIN,
                largura: novaPlataforma.largura + (CONFIG.CORACAO_GERACAO_OVERLAP_MARGIN * 2), altura: novaPlataforma.altura + (CONFIG.CORACAO_GERACAO_OVERLAP_MARGIN * 2)
            }));

            if (!overlap) {
                mapa.push(novaPlataforma);
                mapa.push(criarCoracao(
                    novaPlataforma.x + novaPlataforma.largura / 2 - CONFIG.CORACAO_TAMANHO / 2,
                    novaPlataforma.y - CONFIG.CORACAO_TAMANHO
                ));
                break;
            }
            tentativas--;
        }
    }
}


// =================================================================================================
// 6. FLUXO PRINCIPAL DO JOGO
// =================================================================================================

// 6.1. FUNÇÕES DE CONTROLE DE FLUXO
function morrer() {
    if (gameState.framesDesdeRespawn < CONFIG.MORTE_INSTANTANEA_DELAY || !gameState.jogoRodando) return;
    const corParticula = hexParaRgb(personagem.cor) || CONFIG.CORES.MORTE_RGB;

    for (let i = 0; i < CONFIG.MORTE_PARTICULAS; i++) {
        criarParticula(jogador.x + jogador.raio, jogador.y + jogador.raio, corParticula, 4, 50);
    }
    gameState.numMortes++;
    gameState.vidas--;
    (gameState.vidas <= 0) ? mostrarTelaFinal("GAME OVER!", `Você morreu ${gameState.numMortes} vezes!`) : reiniciarNivel();
}

function reiniciarNivel() {
    gameState.framesDesdeRespawn = 0;
    gameState.mapa = criarMapa(gameState.nivelAtual);

    if (gameState.nivelAtual === 1) {
        jogador.x = CONFIG.LARGURA_BLOCO * 2;
        jogador.y = CONFIG.CHAO_Y - CONFIG.LARGURA_BLOCO * 3;
    } else {
        const primeiraPlataforma = gameState.mapa.find(e => e.tipo === 'bloco' || e.tipo === 'plataforma-desaparece');
        if (primeiraPlataforma) {
            jogador.x = primeiraPlataforma.x + primeiraPlataforma.largura / 2 - jogador.largura / 2;
            jogador.y = primeiraPlataforma.y - jogador.altura;
        } else {
            // Fallback para o caso de não haver plataforma
            jogador.x = CONFIG.LARGURA_BLOCO * 2;
            jogador.y = CONFIG.CHAO_Y - CONFIG.LARGURA_BLOCO * 3;
        }
    }


    jogador.velocidadeX = 0;
    jogador.velocidadeY = 0;
    jogador.saltosRestantes = CONFIG.MAX_JUMPS;
    jogador.noChao = false;
    gameState.chavesColetadas = 0;
}
