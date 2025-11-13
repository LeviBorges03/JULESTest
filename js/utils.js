// 2.1. UTILIDADES GERAIS
const colisao = (a, b) => (
    a.x < b.x + b.largura && a.x + a.largura > b.x &&
    a.y < b.y + b.altura && a.y + a.altura > b.y
);

function hexParaRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
}

// 2.2. CRIAÇÃO DE PARTÍCULAS
function criarParticula(x, y, cor, tamanho, duracao, vx = 0, vy = 0) {
    particulas.push({
        x, y, cor, tamanho, duracao,
        vida: duracao,
        velocidadeX: vx + (Math.random() - 0.5) * 2,
        velocidadeY: vy + (Math.random() - 0.5) * 2
    });
}
