// 6.2. LOOP PRINCIPAL DO JOGO
function gameLoop() {
    if (!gameState.jogoRodando) return;
    atualizar();
    desenhar();
    atualizarPlacar();
    requestAnimationFrame(gameLoop);
}

// 6.3. INICIALIZAÇÃO
function setup() {
    setupUI();

    // Início do jogo
    reiniciarNivel();
    desenhar();
}

function reiniciarNivel() {
    gameState.framesDesdeRespawn = 0;
    gameState.mapa = criarMapa(gameState.nivelAtual);
    jogador.x = CONFIG.LARGURA_BLOCO * 2;
    jogador.y = CONFIG.CHAO_Y - CONFIG.LARGURA_BLOCO * 3;
    jogador.velocidadeX = 0;
    jogador.velocidadeY = 0;
    jogador.saltosRestantes = CONFIG.MAX_JUMPS;
    jogador.noChao = false;
    gameState.chavesColetadas = 0;
}

function iniciarJogo() {
    telaInicial.classList.add("hidden");
    telaFinal.classList.add("hidden");
    if (!gameState.jogoRodando || gameState.vidas <= 0) {
        gameState.nivelAtual = 1;
        gameState.numMortes = 0;
        gameState.vidas = CONFIG.MAX_VIDAS;
    }
    atualizarPlacar();
    reiniciarNivel();
    gameState.jogoRodando = true;
    gameLoop();
}

function reiniciarFaseAtual() {
    if (gameState.jogoRodando) {
        reiniciarNivel();
    }
}

setup();
