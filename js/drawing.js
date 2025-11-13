// 3. LÓGICA DE DESENHO (RENDERIZAÇÃO)

// 3.1. FUNÇÃO PRINCIPAL DE DESENHO
function desenhar() {
    desenharCenario();
    desenharRastro();
    desenharMapa();
    desenharJogador();
    desenharParticulas();
}

// 3.2. DESENHO DOS ELEMENTOS
function desenharCenario() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, CONFIG.CORES.CENARIO_GRAD_COR_1);
    grad.addColorStop(0.5, CONFIG.CORES.CENARIO_GRAD_COR_2);
    grad.addColorStop(1, CONFIG.CORES.CENARIO_GRAD_COR_3);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    estrelas.forEach(e => {
        e.brilho += (Math.random() - 0.5) * 0.04;
        e.brilho = Math.max(0.1, Math.min(e.brilho, 1));

        ctx.fillStyle = `rgba(255,255,255,${e.brilho})`;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fill();

        e.x -= e.velocidade;
        if (e.x < -5) e.x = canvas.width + 5;
    });

    const luaX = canvas.width - CONFIG.LUA_X_OFFSET;
    const luaY = CONFIG.LUA_Y;
    const luaR = CONFIG.LUA_RAIO;
    const haloSize = luaR * CONFIG.LUA_HALO_SIZE_MULT;

    const gradHalo = ctx.createRadialGradient(luaX, luaY, 10, luaX, luaY, haloSize);
    gradHalo.addColorStop(0, CONFIG.CORES.LUA_HALO);
    gradHalo.addColorStop(1, "transparent");
    ctx.fillStyle = gradHalo;
    ctx.fillRect(luaX - haloSize, luaY - haloSize, haloSize * 2, haloSize * 2);

    const gradLua = ctx.createRadialGradient(luaX, luaY, 10, luaX, luaY, luaR);
    gradLua.addColorStop(0, CONFIG.CORES.LUA_CLARA);
    gradLua.addColorStop(1, CONFIG.CORES.LUA_COR_INTERNA);
    ctx.fillStyle = gradLua;
    ctx.beginPath();
    ctx.arc(luaX, luaY, luaR, 0, Math.PI * 2);
    ctx.fill();

    const gradChao = ctx.createLinearGradient(0, CONFIG.CHAO_Y, 0, canvas.height);
    gradChao.addColorStop(0, CONFIG.CORES.CHAO_GRAD_COR_1);
    gradChao.addColorStop(0.6, CONFIG.CORES.CHAO_GRAD_COR_2);
    ctx.fillStyle = gradChao;
    ctx.fillRect(0, CONFIG.CHAO_Y, canvas.width, canvas.height - CONFIG.CHAO_Y);
}

function desenharRastro() {
    if (jogador.rastro.length < 2) return;
    const corRastroRGB = hexParaRgb(personagem.cor) || CONFIG.CORES.JOGADOR_RASTRO_RGB;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    for (let i = jogador.rastro.length - 1; i > 0; i--) {
        const pontoAtual = jogador.rastro[i];
        const pontoAnterior = jogador.rastro[i - 1];
        const alpha = (i / jogador.rastro.length);

        ctx.beginPath();
        ctx.moveTo(pontoAnterior.x, pontoAnterior.y);
        ctx.lineTo(pontoAtual.x, pontoAtual.y);

        ctx.strokeStyle = `rgba(${corRastroRGB}, ${alpha * 0.5})`;
        ctx.lineWidth = (jogador.raio * alpha) * 1.8;
        ctx.stroke();
    }
}

function aplicarEfeitos(ctx, cx, cy) {
    // Resetar opacidade e outros estilos que podem ser modificados pelos efeitos
    personagem.opacidade = 1.0;
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    const efeitoAtual = EFEITOS[personagem.efeito];

    if (efeitoAtual && typeof efeitoAtual.update === 'function') {
        // Passa todos os parâmetros necessários para a função de update do efeito
        efeitoAtual.update(ctx, cx, cy, personagem, gameState, jogador, criarParticula);
    }
}

function desenharJogador() {
    ctx.save();
    const cx = jogador.x + jogador.raio;
    const cy = jogador.y + jogador.raio;

    // Aplica os efeitos visuais que podem modificar a opacidade ou gerar partículas
    aplicarEfeitos(ctx, cx, cy);

    ctx.globalAlpha = personagem.opacidade;

    const gradJog = ctx.createRadialGradient(cx, cy - 5, 5, cx, cy, jogador.raio);
    gradJog.addColorStop(0, "#ffffff");
    gradJog.addColorStop(1, personagem.cor);
    ctx.fillStyle = gradJog;
    ctx.beginPath();
    ctx.arc(cx, cy, jogador.raio, 0, Math.PI * 2);
    ctx.fill();

    if (gameState.framesDesdeRespawn < CONFIG.INVENCIBILIDADE_FRAMES && gameState.framesDesdeRespawn % 6 < 3) {
        ctx.strokeStyle = "#FFF";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(cx, cy, jogador.raio + 3, 0, Math.PI * 2);
        ctx.stroke();
    }

    ctx.restore();

    // Desenha o Nick
    if (personagem.nick) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.font = "12px 'Courier New', Courier, monospace";
        const nickWidth = ctx.measureText(personagem.nick).width;
        ctx.fillRect(cx - nickWidth / 2 - 5, cy - jogador.raio - 20, nickWidth + 10, 18);

        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(personagem.nick, cx, cy - jogador.raio - 8);
    }
}

function desenharMapa() {
    gameState.mapa.forEach(e => {
        if (e.tipo === "bloco") {
            const grad = ctx.createLinearGradient(e.x, e.y, e.x, e.y + e.altura);
            grad.addColorStop(0, CONFIG.CORES.BLOCO_GRAD_TOP);
            grad.addColorStop(1, CONFIG.CORES.BLOCO);
            ctx.fillStyle = grad;
            ctx.fillRect(e.x, e.y, e.largura, e.altura);
        } else if (e.tipo === "espinho") {
            ctx.fillStyle = CONFIG.CORES.ESPINHO;
            ctx.strokeStyle = CONFIG.CORES.ESPINHO;
            ctx.lineWidth = CONFIG.ESPINHO_LINE_WIDTH;
            ctx.lineJoin = "round";
            ctx.beginPath();
            const num = Math.floor(e.largura / CONFIG.ESPINHO_DENTE_LARGURA);
            for (let i = 0; i < num; i++) {
                const x = e.x + i * CONFIG.ESPINHO_DENTE_LARGURA;
                ctx.moveTo(x, e.y + e.altura);
                ctx.lineTo(x + CONFIG.ESPINHO_DENTE_LARGURA / 2, e.y);
                ctx.lineTo(x + CONFIG.ESPINHO_DENTE_LARGURA, e.y + e.altura);
            }
            ctx.stroke();
            ctx.fill();

            ctx.strokeStyle = CONFIG.CORES.PORTA_STROKE_COR;
            ctx.lineWidth = CONFIG.ESPINHO_SHADOW_LINE_WIDTH;
            ctx.stroke();

            ctx.lineJoin = "miter"; ctx.lineWidth = 1;
        } else if (e.tipo === "chave") {
            ctx.fillStyle = CONFIG.CORES.CHAVE;
            ctx.beginPath();
            ctx.arc(e.x + e.largura / 2, e.y + e.largura / 2, e.largura / 2, 0, Math.PI * 2);
            ctx.fill();
        } else if (e.tipo === "porta") {
            const pX = e.x + (e.largura - CONFIG.PORTA_LARGURA) / 2;
            const pY = e.y - (CONFIG.PORTA_ALTURA - e.altura);
            const cor = gameState.chavesColetadas >= e.chavesNecessarias ? CONFIG.CORES.PORTA_ABERTA : CONFIG.CORES.PORTA_FECHADA;
            const grad = ctx.createLinearGradient(pX, pY, pX + CONFIG.PORTA_LARGURA, pY + CONFIG.PORTA_ALTURA);
            grad.addColorStop(0, cor);
            grad.addColorStop(1, cor === CONFIG.CORES.PORTA_ABERTA ? "#f9a8d4" : "#1e1b4b");

            ctx.fillStyle = grad;
            ctx.fillRect(pX, pY, CONFIG.PORTA_LARGURA, CONFIG.PORTA_ALTURA);

            ctx.strokeStyle = CONFIG.CORES.PORTA_STROKE_COR;
            ctx.lineWidth = 4;
            ctx.strokeRect(pX, pY, CONFIG.PORTA_LARGURA, CONFIG.PORTA_ALTURA);

            if (gameState.chavesColetadas >= e.chavesNecessarias) {
                ctx.shadowBlur = CONFIG.PORTA_BRILHO_SHADOW_BLUR;
                ctx.shadowColor = CONFIG.CORES.PORTA_ABERTA;
                ctx.fillStyle = `rgba(255, 255, 255, ${0.6 + Math.sin(gameState.framesDesdeInicio * CONFIG.PORTA_BRILHO_ANIM_SPEED) * 0.1})`;
                ctx.beginPath();
                const raioBrilho = CONFIG.PORTA_BRILHO_RAIO_BASE + Math.sin(gameState.framesDesdeInicio * CONFIG.PORTA_BRILHO_ANIM_SPEED) * CONFIG.PORTA_BRILHO_RAIO_ANIM;
                ctx.arc(pX + CONFIG.PORTA_LARGURA / 2, pY + CONFIG.PORTA_ALTURA / 2, raioBrilho, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        } else if (e.tipo === "portal") {
            ctx.fillStyle = CONFIG.CORES.PORTAL;
            ctx.shadowColor = CONFIG.CORES.PORTAL_BRILHO;
            ctx.shadowBlur = CONFIG.PORTAL_SHADOW_BLUR;
            ctx.fillRect(e.x, e.y, e.largura, e.altura);
            ctx.shadowBlur = 0;
        } else if (e.tipo === "coracao") {
            const x = e.x;
            const y = e.y;
            const w = e.largura;
            const h = e.altura;

            // Cor e gradiente para imitar o estilo do HUD
            const grad = ctx.createRadialGradient(x + w / 2, y + h / 2, 1, x + w / 2, y + h / 2, w);
            grad.addColorStop(0, "#fb7185"); // Centro mais claro
            grad.addColorStop(1, CONFIG.CORES.CORACAO); // Cor da borda
            ctx.fillStyle = grad;

            // Path aprimorado para uma forma de coração mais definida
            ctx.beginPath();
            ctx.moveTo(x + w / 2, y + h * 0.35);
            ctx.bezierCurveTo(x, y, x, y + h * 0.7, x + w / 2, y + h);
            ctx.bezierCurveTo(x + w, y + h * 0.7, x + w, y, x + w / 2, y + h * 0.35);
            ctx.closePath();
            ctx.fill();

            // Desenha o reflexo para ser idêntico ao do HUD
            ctx.save();
            const reflexoX = x + w * 0.5;
            const reflexoY = y + h * 0.3;
            const reflexoRaioX = w * 0.38;
            const reflexoRaioY = h * 0.18;

            ctx.translate(reflexoX, reflexoY);
            ctx.rotate((Math.PI / 180) * CONFIG.CORACAO_REFLEXO_ROTATION_DEGREES);

            ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
            ctx.beginPath();
            ctx.ellipse(0, 0, reflexoRaioX, reflexoRaioY, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    });
}

function desenharParticulas() {
    particulas.forEach(p => {
        const opacidade = p.vida / p.duracao;
        let corFinal = p.cor;

        // NEW: Handle color transition for particles like cinders
        if (p.finalCor) {
            const rInicial = parseInt(p.cor.split(',')[0]);
            const gInicial = parseInt(p.cor.split(',')[1]);
            const bInicial = parseInt(p.cor.split(',')[2]);
            const rFinal = parseInt(p.finalCor.split(',')[0]);
            const gFinal = parseInt(p.finalCor.split(',')[1]);
            const bFinal = parseInt(p.finalCor.split(',')[2]);

            const progress = 1 - opacidade; // 0 -> 1 as particle dies
            const r = Math.floor(rInicial + (rFinal - rInicial) * progress);
            const g = Math.floor(gInicial + (gFinal - gInicial) * progress);
            const b = Math.floor(bInicial + (bFinal - bInicial) * progress);
            corFinal = `${r},${g},${b}`;
        }

        if (p.texto || p.scramble) { // Se for uma partícula de texto ou scrambler
            ctx.font = '20px monospace';
            const corTexto = p.cor.startsWith('#') ? hexParaRgb(p.cor) : corFinal;
            ctx.fillStyle = `rgba(${corTexto || '255,255,255'}, ${opacidade})`;

            let textoFinal = p.texto;
            // NEW: Handle scrambling text effect
            if (p.scramble) {
                if (p.vida < 5) { // Last few frames
                    textoFinal = p.finalText;
                } else {
                    textoFinal = String.fromCharCode(Math.random() * 94 + 33);
                }
            }
            ctx.fillText(textoFinal, p.x, p.y);
        } else { // Partícula normal
            ctx.fillStyle = `rgba(${corFinal}, ${opacidade})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.tamanho * opacidade, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}
