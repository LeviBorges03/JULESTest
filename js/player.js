// 4.2. ATUALIZAÇÃO DO JOGADOR
function handleInput() {
    let dir = 0;
    if (teclas["a"] || teclas["arrowleft"]) dir = -1;
    if (teclas["d"] || teclas["arrowright"]) dir = 1;

    jogador.velocidadeX = dir * CONFIG.PLAYER_SPEED_X;

    if ((teclas["w"] || teclas[" "] || teclas["arrowup"]) && !jogador.pulando) {
        if (jogador.saltosRestantes > 0) {
            jogador.velocidadeY = -CONFIG.JUMP_FORCE;
            jogador.saltosRestantes--;
            jogador.pulando = true;
        }
    }
    if (!(teclas["w"] || teclas[" "] || teclas["arrowup"])) {
        jogador.pulando = false;
    }
}

function updatePlayerState() {
    // Física e Movimento
    jogador.velocidadeY += CONFIG.GRAVITY;
    jogador.x += jogador.velocidadeX;
    jogador.y += jogador.velocidadeY;

    // Limites da Tela
    jogador.x = Math.max(0, Math.min(jogador.x, CONFIG.CANVAS_LARGURA - jogador.largura));

    // Rastro do Jogador
    const seMovendo = Math.abs(jogador.velocidadeX) > 0.1 || Math.abs(jogador.velocidadeY) > 0.1;
    if (seMovendo) {
        jogador.rastro.push({ x: jogador.x + jogador.raio, y: jogador.y + jogador.raio });
    }
    if (jogador.rastro.length > CONFIG.RASTRO_COMPRIMENTO || (!seMovendo && jogador.rastro.length > 0)) {
        jogador.rastro.shift();
    }

    // Cooldown do Portal
    if (gameState.portalCooldown > 0) gameState.portalCooldown--;

    // Lógica de Colisão
    handleCollisions();
}

// 4.3. LÓGICA DE COLISÃO
function handleCollisions() {
    jogador.noChao = false;
    gameState.mapa.forEach(elemento => {
        if (colisao(jogador, elemento)) {
            switch (elemento.tipo) {
                case "bloco":
                    handleBlocoCollision(elemento);
                    break;
                case "espinho":
                    handleEspinhoCollision(elemento);
                    break;
                case "chave":
                    handleChaveCollision(elemento);
                    break;
                case "portal":
                    handlePortalCollision(elemento);
                    break;
                case "coracao":
                    handleCoracaoCollision(elemento);
                    break;
            }
        }
    });
}

function handleBlocoCollision(bloco) {
    if (jogador.velocidadeY > 0 && (jogador.y + jogador.altura - jogador.velocidadeY) <= bloco.y) {
        const impacto = jogador.velocidadeY;
        jogador.y = bloco.y - jogador.altura;
        jogador.velocidadeY = 0;
        jogador.saltosRestantes = CONFIG.MAX_JUMPS;
        jogador.noChao = true;

        if (impacto > CONFIG.POEIRA_IMPACTO_MINIMO) {
            const numParticulas = Math.min(Math.floor(impacto * 1.5), CONFIG.POEIRA_MAX_PARTICULAS);
            for (let i = 0; i < numParticulas; i++) {
                criarParticula(jogador.x + jogador.raio, jogador.y + jogador.altura, CONFIG.CORES.POEIRA_RGB,
                    Math.random() * 2.5 + 1, Math.random() * 40 + 30, (Math.random() - 0.5) * 4, -Math.random() * 2);
            }
        }
    }
}

function handleEspinhoCollision() {
    if (gameState.framesDesdeRespawn >= CONFIG.INVENCIBILIDADE_FRAMES) {
        morrer();
    }
}

function handleChaveCollision(chave) {
    gameState.chavesColetadas++;
    gameState.mapa = gameState.mapa.filter(item => item !== chave);
}

function handlePortalCollision(portal) {
    if (gameState.portalCooldown === 0) {
        const destino = gameState.mapa.find(p => p.tipo === "portal" && p.id === portal.id && p !== portal);
        if (destino) {
            jogador.x = destino.x;
            jogador.y = destino.y;
            gameState.portalCooldown = CONFIG.PORTAL_COOLDOWN_FRAMES;
        }
    }
}

function handleCoracaoCollision(coracao) {
    if (gameState.vidas < CONFIG.MAX_VIDAS) {
        gameState.vidas++;
        const heartCenterX = coracao.x + coracao.largura / 2;
        const heartCenterY = coracao.y + coracao.altura / 2;
        for (let i = 0; i < CONFIG.CURA_PARTICULAS; i++) {
            const angulo = Math.random() * Math.PI * 2;
            const velocidade = Math.random() * 3 + 1;
            const vx = Math.cos(angulo) * velocidade;
            const vy = Math.sin(angulo) * velocidade;
            criarParticula(heartCenterX, heartCenterY, CONFIG.CORES.CURA_RGB, Math.random() * 3 + 2, 40, vx, vy);
        }
    }
    gameState.mapa = gameState.mapa.filter(item => item !== coracao);
}
