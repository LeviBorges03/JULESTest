const EFEITOS = {
    // Base Effects (not directly selectable, but used by others)
    _leaves: (x, y, cor, emoji = "🍁") => {
        const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textElement.textContent = emoji;
        svg.appendChild(textElement);
        TweenMax.set(textElement, { attr: { x: x, y: y, fill: cor, "font-size": "24px", "pointer-events": "none" } });
        TweenMax.to(textElement, 3, { attr: { y: y + 200, x: x + (Math.random() - 0.5) * 100 }, rotation: Math.random() * 360, transformOrigin: "center center", opacity: 0, ease: Power1.easeOut, onComplete: () => svg.removeChild(textElement) });
    },
    _matrix: (x, y, cor, symbol) => {
        const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textElement.textContent = symbol;
        svg.appendChild(textElement);
        TweenMax.set(textElement, { attr: { x: x, y: y, fill: cor, "font-size": "20px", "font-family": "monospace", "pointer-events": "none" }, opacity: 1 });
        TweenMax.to(textElement, 1.5, { attr: { y: y + 150 }, opacity: 0, ease: Power1.easeIn, onComplete: () => svg.removeChild(textElement) });
    },
    _fogo: (x, y, cor, symbol) => {
        const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textElement.textContent = symbol;
        svg.appendChild(textElement);
        TweenMax.set(textElement, { attr: { x: x, y: y, fill: cor, "font-size": "22px", "pointer-events": "none" }, opacity: 1 });
        TweenMax.to(textElement, 0.8, { attr: { y: y - 80, x: x + (Math.random() - 0.5) * 40 }, opacity: 0, ease: Power1.easeOut, onComplete: () => svg.removeChild(textElement) });
    },
    _raio: (x, y, cor, symbol) => {
        const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        textElement.textContent = symbol;
        svg.appendChild(textElement);
        TweenMax.set(textElement, { attr: { x: x, y: y, fill: cor, "font-size": "20px", "pointer-events": "none" }, opacity: 1, scale: 0.5 });
        TweenMax.to(textElement, 0.5, { opacity: 0, scale: 2.5, ease: Power1.easeOut, onComplete: () => svg.removeChild(textElement) });
    },

    // Selectable Effects
    nenhum: { cor: '#808080', simbolo: '🚫', action: () => {} },
    particulas: {
        cor: '#FFFFFF',
        simbolo: '✨',
        action: (x, y, cor, quantidade = 15) => {
            for (let i = 0; i < quantidade; i++) {
                const particle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                svg.appendChild(particle);
                TweenMax.set(particle, { attr: { cx: x, cy: y, r: Math.random() * 4 + 2, fill: cor, opacity: 1 } });
                TweenMax.to(particle, Math.random() * 0.8 + 0.4, { attr: { cx: x + (Math.random() - 0.5) * 60, cy: y + (Math.random() - 0.5) * 60, opacity: 0 }, ease: Power1.easeOut, onComplete: () => svg.removeChild(particle) });
            }
        }
    },
    leaves: { cor: '#008000', simbolo: '🍁', action: (x, y, cor) => EFEITOS._leaves.call(this, x, y, cor, '🍁') },

    // Themed Effects
    gelo: { cor: '#ADD8E6', simbolo: '❆', action: (x, y, cor) => EFEITOS._raio.call(this, x, y, '#ADD8E6', '❆') },
    agua: { cor: '#0000FF', simbolo: '💧', action: (x, y, cor) => EFEITOS._raio.call(this, x, y, '#00BFFF', '💧') },
    terra: { cor: '#A0522D', simbolo: '🌍', action: (x, y, cor) => EFEITOS._raio.call(this, x, y, '#8B4513', '🌍') },
    vento: { cor: '#87CEEB', simbolo: '💨', action: (x, y, cor) => EFEITOS._raio.call(this, x, y, '#D3D3D3', '💨') },
    estrela: { cor: '#FFFF00', simbolo: '⭐', action: (x, y, cor) => EFEITOS._raio.call(this, x, y, '#FFD700', '⭐') },
    coracao: { cor: '#FF0000', simbolo: '❤️', action: (x, y, cor) => EFEITOS._raio.call(this, x, y, '#FF69B4', '❤️') },
    musica: { cor: '#EE82EE', simbolo: '🎵', action: (x, y, cor) => EFEITOS._raio.call(this, x, y, '#9370DB', '🎵') },
    fantasma: { cor: '#FFFFFF', simbolo: '👻', action: (x, y, cor) => EFEITOS._raio.call(this, x, y, '#F8F8FF', '👻') },
    alien: { cor: '#00FF00', simbolo: '👽', action: (x, y, cor) => EFEITOS._raio.call(this, x, y, '#7FFF00', '👽') },
    diamante: { cor: '#00FFFF', simbolo: '💎', action: (x, y, cor) => EFEITOS._raio.call(this, x, y, '#B9F2FF', '💎') },
};

// --- Script to Generate Effect Variations ---
(() => {
    // Matrix Variations
    const matrix_symbols = ["ﾊ","ﾐ","ﾋ","ｰ","ｳ","ｼ","ﾅ","ﾓ","ﾆ","ｻ","ﾜ","ﾂ","ｵ","ﾘ","ｱ","ﾎ","ﾃ","ﾏ","ｹ","ﾒ","ｴ","ｶ","ｷ","ﾑ","ﾕ","ﾗ","ｾ","ﾈ","ｽ","ﾀ","ﾇ","ﾍ","ｦ","ｲ","ｸ","ｺ","ｿ","ﾁ","ﾄ","ﾉ","ﾌ","ﾔ","ﾖ","ﾙ","ﾚ","ﾛ","ﾝ"];
    const matrix_infinite_symbols = ["©","µ","∞","Ω","Σ","π","∆","ƒ","∂","√","∫","≈","≠","≤","≥","⊂","⊃","⊕","⊗","⊥","⊄","⊅","⊦","⊧","⊨","⊩","⊪","⊫","⊬","⊭","⊮","⊯","⊰","⊱","⋇","⋈","⋉","⋊","⋋","⋌","⋍","⋎","⋏","⋐","⋑","⋒","⋓","⋔","⋕"];
    for (let i = 0; i < 40; i++) {
        const symbol = matrix_symbols[i % matrix_symbols.length];
        EFEITOS[`matrix${i}`] = { cor: '#00FF00', simbolo: symbol, action: (x, y, cor) => EFEITOS._matrix.call(this, x, y, '#00ff00', symbol) };
    }
    const infinite_colors = ['#39ff14', '#00ff7f', '#cfff04'];
    for (let i = 0; i < 40; i++) {
        const symbol = matrix_infinite_symbols[i % matrix_infinite_symbols.length];
        const color = infinite_colors[i % infinite_colors.length];
        EFEITOS[`matrixInfinite${i}`] = { cor: '#00FF00', simbolo: symbol, action: (x, y, cor) => EFEITOS._matrix.call(this, x, y, color, symbol) };
    }

    // Fire Variations
    const fire_symbols = ["🔥", "💥", "☄️", "🌶️", "🌋"];
    const fire_colors = ["#ff4500", "#ff6347", "#ff7f50", "#ffa500", "#ffd700"];
    for (let i = 0; i < 20; i++) {
        const symbol = fire_symbols[i % fire_symbols.length];
        const color = fire_colors[i % fire_colors.length];
        EFEITOS[`fogo${i}`] = { cor: '#FF4500', simbolo: symbol, action: (x, y, cor) => EFEITOS._fogo.call(this, x, y, color, symbol) };
    }

    // Ray Variations
    const ray_symbols = ["⚡️", "✨", "💫", "☄️", "💥"];
    const ray_colors = ["#ffff00", "#fffa00", "#fffacd", "#fafad2", "#eee8aa"];
    for (let i = 0; i < 10; i++) {
        const symbol = ray_symbols[i % ray_symbols.length];
        const color = ray_colors[i % ray_colors.length];
        EFEITOS[`raio${i}`] = { cor: '#FFFF00', simbolo: symbol, action: (x, y, cor) => EFEITOS._raio.call(this, x, y, color, symbol) };
    }

    // Leaves Variations
    const leaves_emojis = ["🌸","💧","⭐","☀️","🌙","☁️","☔","❄️","☃️","🌪️","🌊","🌍","🌎","🌏","🌷","🌹","🌺","🌻","🌼","🌾","🍄","🌵","🌴","🌳","🌲","🌱","🌿","🍀","🍁","🍂","🍃","🍇","🍈","🍉","🍊","🍋","🍌","🍍","🍎","🍏","🍐","🍑","🍒","🍓","🥝","🍅","🥥","🥑","🍆","🥔","🥕","🌽","🌶️","🥒","🥬","🥦","🧄","🧅"];
    const leaf_colors = { '🌸':'#FFC0CB', '💧':'#0000FF', '⭐':'#FFFF00', '☀️':'#FFFF00', '🌙':'#F5F5DC', '☁️':'#FFFFFF', '☔':'#0000FF', '❄️':'#ADD8E6', '☃️':'#FFFFFF', '🌪️':'#A9A9A9', '🌊':'#0000FF', '🌍':'#A0522D', '🌎':'#A0522D', '🌏':'#A0522D', '🌷':'#FFC0CB', '🌹':'#FF0000', '🌺':'#FF0000', '🌻':'#FFFF00', '🌼':'#FFFF00', '🌾':'#F5DEB3', '🍄':'#A0522D', '🌵':'#008000', '🌴':'#008000', '🌳':'#008000', '🌲':'#008000', '🌱':'#008000', '🌿':'#008000', '🍀':'#008000', '🍁':'#FF4500', '🍂':'#FF4500', '🍃':'#008000', '🍇':'#800080', '🍈':'#90EE90', '🍉':'#FF0000', '🍊':'#FFA500', '🍋':'#FFFF00', '🍌':'#FFFF00', '🍍':'#FFFF00', '🍎':'#FF0000', '🍏':'#008000', '🍐':'#90EE90', '🍑':'#FFA500', '🍒':'#FF0000', '🍓':'#FF0000', '🥝':'#90EE90', '🍅':'#FF0000', '🥥':'#A0522D', '🥑':'#008000', '🍆':'#800080', '🥔':'#A0522D', '🥕':'#FFA500', '🌽':'#FFFF00', '🌶️':'#FF0000', '🥒':'#008000', '🥬':'#008000', '🥦':'#008000', '🧄':'#F5F5DC', '🧅':'#F5F5DC' };
    for (let i = 0; i < 60; i++) {
        const emoji = leaves_emojis[i % leaves_emojis.length];
        const color = leaf_colors[emoji] || '#008000';
        EFEITOS[`leaves${i}`] = { cor: color, simbolo: emoji, action: (x, y, cor) => EFEITOS._leaves.call(this, x, y, cor, emoji) };
    }
})();
