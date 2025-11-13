// js/particles.js
import { particulas } from './state.js';
import { hexParaRgb } from './utils.js';

export function criarParticula(x, y, cor, tamanho, duracao, vx = 0, vy = 0) {
    particulas.push({
        x, y, cor, tamanho, duracao,
        vida: duracao,
        velocidadeX: vx + (Math.random() - 0.5) * 2,
        velocidadeY: vy + (Math.random() - 0.5) * 2
    });
}

export function updateParticles() {
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

export function desenharParticulas(ctx) {
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
