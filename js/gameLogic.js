// js/gameLogic.js
import { gameState, jogador, personagem } from './state.js';
import { CONFIG } from './config.js';
import { criarParticula, updateParticles } from './particles.js';
import { handleInput, updatePlayerState } from './player.js';
import { desenhar } from './drawing.js';
import { criarMapa } from './map.js';
import { hexParaRgb } from './utils.js';
import { colisao } from './utils.js';

const vidasContainerEsquerda = document.getElementById("vidasContainerEsquerda");
const vidasContainerDireita = document.getElementById("vidasContainerDireita");
const nivelDisplay = document.getElementById("nivelDisplay");
const xpBar = document.getElementById("xpBar");
const telaFinal = document.getElementById("telaFinal");
const tituloFinal = document.getElementById("tituloFinal");
const mensagemFinal = document.getElementById("mensagemFinal");

export function morrer() {
    if (gameState.framesDesdeRespawn < CONFIG.MORTE_INSTANTANEA_DELAY || !gameState.jogoRodando) return;
    const corParticula = hexParaRgb(personagem.cor) || CONFIG.CORES.MORTE_RGB;

    for (let i = 0; i < CONFIG.MORTE_PARTICULAS; i++) {
        criarParticula(jogador.x + jogador.raio, jogador.y + jogador.raio, corParticula, 4, 50);
    }
    gameState.numMortes++;
    gameState.vidas--;
    (gameState.vidas <= 0) ? mostrarTelaFinal("GAME OVER!", `Você morreu ${gameState.numMortes} vezes!`) : reiniciarNivel();
}

function atualizarPlacar() {
    vidasContainerEsquerda.innerHTML = "";
    vidasContainerDireita.innerHTML = "";

    for (let i = 0; i < CONFIG.MAX_VIDAS; i++) {
        const heartContainer = (i < 5) ? vidasContainerEsquerda : vidasContainerDireita;
        if (i < gameState.vidas) {
            const heart = document.createElement("div");
            heart.classList.add("heart");
            heart.innerHTML = `<span class="reflexo"></span>`;
            heartContainer.appendChild(heart);
        }
    }

    nivelDisplay.textContent = gameState.nivelAtual;
    xpBar.style.width = `${(gameState.nivelAtual / CONFIG.MAX_NIVEIS) * 100}%`;
}

export function reiniciarNivel() {
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

function mostrarTelaFinal(titulo, msg) {
    gameState.jogoRodando = false;
    telaFinal.classList.remove("hidden");
    tituloFinal.textContent = titulo;
    mensagemFinal.innerHTML = msg;
}

export function iniciarJogo() {
    const telaInicial = document.getElementById("telaInicial");
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

export function reiniciarFaseAtual() {
    if (gameState.jogoRodando) {
        reiniciarNivel();
    }
}

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

function atualizar() {
    gameState.framesDesdeInicio++;
    gameState.framesDesdeRespawn++;

    handleInput();
    updatePlayerState();
    updateParticles();
    checkGameStatus();
}

export function gameLoop() {
    if (!gameState.jogoRodando) return;
    atualizar();
    desenhar();
    atualizarPlacar();
    requestAnimationFrame(gameLoop);
}
