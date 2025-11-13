// 4.1. FUNÇÃO PRINCIPAL DE ATUALIZAÇÃO
function atualizar() {
    gameState.framesDesdeInicio++;
    gameState.framesDesdeRespawn++;

    handleInput();
    updatePlayerState();
    updateParticles();
    checkGameStatus();
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

// 5. CRIAÇÃO DE MAPAS
// 5.1. FUNÇÕES DE CRIAÇÃO DE OBJETOS
const criarBloco = (x, y, w = CONFIG.LARGURA_BLOCO, h = CONFIG.ALTURA_BLOCO) => ({ tipo: "bloco", x, y, largura: w, altura: h });
const criarEspinho = (x, y, w = CONFIG.LARGURA_BLOCO, h = CONFIG.ESPINHO_ALTURA) => ({ tipo: "espinho", x, y, largura: w, altura: h });
const criarChave = (x, y) => ({ tipo: "chave", x, y, largura: CONFIG.CHAVE_TAMANHO, altura: CONFIG.CHAVE_TAMANHO });
const criarPorta = (x, y, ch = 0) => ({ tipo: "porta", x, y, largura: CONFIG.PORTA_LARGURA_BASE, altura: CONFIG.PORTA_ALTURA_BASE, chavesNecessarias: ch });
const criarPortal = (x, y, id, w = CONFIG.PORTAL_LARGURA, h = CONFIG.PORTAL_ALTURA) => ({ tipo: "portal", x, y, largura: w, altura: h, id });
const criarCoracao = (x, y) => ({ tipo: "coracao", x, y, largura: CONFIG.CORACAO_TAMANHO, altura: CONFIG.CORACAO_TAMANHO });

// 5.2. LÓGICA DE GERAÇÃO DE NÍVEIS
function criarMapa(nivel) {
    let m = [criarBloco(0, CONFIG.CHAO_Y, CONFIG.CANVAS_LARGURA, CONFIG.ALTURA_BLOCO * 2)];

    // Adiciona o layout específico do nível
    const layoutNivel = obterLayoutNivel(nivel);
    if (layoutNivel) {
        m.push(...layoutNivel);
    }

    // Adiciona corações aleatoriamente
    adicionarCoracoes(m, nivel);

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
        case 2:
            const platformWidth = CONFIG.LARGURA_BLOCO * 3;
            return [
                criarBloco(200, CONFIG.CHAO_Y - 80, 100),
                criarBloco(450, CONFIG.CHAO_Y - 150, platformWidth),
                criarChave(450 + (platformWidth - CONFIG.CHAVE_TAMANHO) / 2, CONFIG.CHAO_Y - 150 - CONFIG.CHAVE_TAMANHO),
                criarEspinho(300, ESPINHO_Y, 50),
                criarEspinho(600, ESPINHO_Y, 80),
                criarBloco(450, CONFIG.CHAO_Y - 250, platformWidth),
                criarEspinho(450, CONFIG.CHAO_Y - 250 - CONFIG.ESPINHO_ALTURA, platformWidth),
                criarPorta(XPORTA, CONFIG.CHAO_Y - 60, 1),
                criarBloco(50, CONFIG.CHAO_Y - 350, platformWidth),
                criarBloco(CONFIG.CANVAS_LARGURA - 110 - (platformWidth - 60), CONFIG.CHAO_Y - 450, platformWidth),
                criarPortal(50 + (platformWidth - CONFIG.PORTAL_LARGURA) / 2, CONFIG.CHAO_Y - 350 - CONFIG.PORTAL_ALTURA, 1),
                criarPortal(CONFIG.CANVAS_LARGURA - 110 - (platformWidth - 60) + (platformWidth - CONFIG.PORTAL_LARGURA) / 2, CONFIG.CHAO_Y - 450 - CONFIG.PORTAL_ALTURA, 1)
            ];
        // Adicione mais casos para mais níveis aqui
        default:
            // Por padrão, cria um nível vazio se não houver layout definido
            return [criarPorta(XPORTA, CONFIG.CHAO_Y - 60, 0)];
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
