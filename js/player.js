// js/player.js
import { jogador, teclas, gameState } from './state.js';
import { CONFIG } from './config.js';
import { handleCollisions } from './collisions.js';

export function handleInput() {
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

export function updatePlayerState() {
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
