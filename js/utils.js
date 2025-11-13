// js/utils.js
export const colisao = (a, b) => (
    a.x < b.x + b.largura && a.x + a.largura > b.x &&
    a.y < b.y + b.altura && a.y + a.altura > b.y
);

export function hexParaRgb(hex) {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
}
