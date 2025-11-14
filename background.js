let estrelas = [];

function criarEstrelas() {
    const svg = document.querySelector("svg");
    const numEstrelasLonge = 150;
    const numEstrelasPerto = 50;
    const viewBox = svg.viewBox.baseVal;

    // Grupo para as estrelas, para que fiquem no fundo
    let estrelasGrupo = svg.querySelector("#estrelas-grupo");
    if (!estrelasGrupo) {
        estrelasGrupo = document.createElementNS("http://www.w3.org/2000/svg", "g");
        estrelasGrupo.setAttribute("id", "estrelas-grupo");
        svg.insertBefore(estrelasGrupo, svg.firstChild);
    }

    estrelas = [];
    estrelasGrupo.innerHTML = ''; // Limpa estrelas antigas

    // Estrelas de fundo (longe)
    for (let i = 0; i < numEstrelasLonge; i++) {
        const estrela = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        const x = Math.random() * viewBox.width;
        const y = Math.random() * viewBox.height * 0.9;
        const r = Math.random() * 1.2 + 0.3;

        TweenMax.set(estrela, { attr: { cx: x, cy: y, r: r, fill: 'white', opacity: Math.random() } });
        estrelasGrupo.appendChild(estrela);

        estrelas.push({
            element: estrela,
            x: x,
            velocidade: 0.05 + Math.random() * 0.05
        });
    }

    // Estrelas da frente (perto)
    for (let i = 0; i < numEstrelasPerto; i++) {
        const estrela = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        const x = Math.random() * viewBox.width;
        const y = Math.random() * viewBox.height * 0.9;
        const r = Math.random() * 1.8 + 0.5;

        TweenMax.set(estrela, { attr: { cx: x, cy: y, r: r, fill: 'white', opacity: Math.random() * 0.5 + 0.5 } });
        estrelasGrupo.appendChild(estrela);

        estrelas.push({
            element: estrela,
            x: x,
            velocidade: 0.1 + Math.random() * 0.1
        });
    }
}

function animarEstrelas() {
    const viewBox = document.querySelector("svg").viewBox.baseVal;
    estrelas.forEach(estrela => {
        estrela.x -= estrela.velocidade;
        if (estrela.x < -5) {
            estrela.x = viewBox.width + 5;
        }
        TweenMax.set(estrela.element, { attr: { cx: estrela.x } });

        // Efeito de brilho subtil
        if (Math.random() > 0.99) {
            TweenMax.to(estrela.element, 0.5, { opacity: Math.random() * 0.7 + 0.3, yoyo: true, repeat: 1 });
        }
    });
}
