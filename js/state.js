// 1.3. ESTADO DO JOGO (gameState)
let gameState = {
    jogoRodando: false,
    nivelAtual: 1,
    numMortes: 0,
    vidas: CONFIG.MAX_VIDAS,
    mapa: [],
    chavesColetadas: 0,
    framesDesdeInicio: 0,
    framesDesdeRespawn: 0,
    portalCooldown: 0,
};

// 1.4. DADOS DO PERSONAGEM
let personagem = {
    nick: "",
    cor: "#a7d1fa",
    efeito: "nenhum",
    opacidade: 1.0,
};

// 1.5. JOGADOR (jogador)
let jogador = {
    x: CONFIG.LARGURA_BLOCO * 2,
    y: CONFIG.CHAO_Y - CONFIG.LARGURA_BLOCO * 3,
    largura: CONFIG.PLAYER_LARGURA,
    altura: CONFIG.PLAYER_ALTURA,
    raio: CONFIG.PLAYER_RAIO,
    velocidadeX: 0,
    velocidadeY: 0,
    saltosRestantes: CONFIG.MAX_JUMPS,
    noChao: false,
    pulando: false,
    rastro: [],
};

// 1.6. ELEMENTOS DE CENÁRIO (estrelas, partículas)
let estrelas = [
    ...Array.from({ length: CONFIG.NUM_ESTRELAS_LONGE }, () => ({
        x: Math.random() * CONFIG.CANVAS_LARGURA,
        y: Math.random() * CONFIG.CANVAS_ALTURA * 0.7,
        r: Math.random() * 1.2 + 0.3,
        brilho: Math.random(),
        velocidade: 0.05 + Math.random() * 0.05,
    })),
    ...Array.from({ length: CONFIG.NUM_ESTRELAS_PERTO }, () => ({
        x: Math.random() * CONFIG.CANVAS_LARGURA,
        y: Math.random() * CONFIG.CANVAS_ALTURA * 0.7,
        r: Math.random() * 1.8 + 0.5,
        brilho: Math.random() * 0.5 + 0.5,
        velocidade: 0.1 + Math.random() * 0.1,
    }))
];
let particulas = [];

// 1.7. CONTROLES (teclas)
const teclas = {};
document.addEventListener("keydown", (e) => (teclas[e.key.toLowerCase()] = true));
document.addEventListener("keyup", (e) => (teclas[e.key.toLowerCase()] = false));
