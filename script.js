// =================================================================================================
// 1. SETUP E VARIÁVEIS GLOBAIS
// =================================================================================================

// 1.1. ELEMENTOS DO DOM
const vidasContainerEsquerda = document.getElementById("vidasContainerEsquerda");
const vidasContainerDireita = document.getElementById("vidasContainerDireita");
const nivelDisplay = document.getElementById("nivelDisplay");
const telaInicial = document.getElementById("telaInicial");
const telaFinal = document.getElementById("telaFinal");
const btnJogar = document.getElementById("btnJogar");
const btnJogarNovamente = document.getElementById("btnJogarNovamente");
const tituloFinal = document.getElementById("tituloFinal");
const mensagemFinal = document.getElementById("mensagemFinal");

var svg = document.querySelector("svg");
var cursor = svg.createSVGPoint();
var arrows = document.querySelector(".arrows");
var randomAngle = 0;

// bow rotation point
var pivot = {
	x: 100,
	y: 250
};

// 1.2. CONFIGURAÇÕES GERAIS (CONFIG)
const CONFIG = {
    MAX_VIDAS: 10,
    MAX_ALVOS: 6,
};

// 1.3. ESTADO DO JOGO (gameState)
let gameState = {
    jogoRodando: false,
    score: 0,
    vidas: CONFIG.MAX_VIDAS,
    alvos: [],
    particulasAcumuladas: 0,
};

// 1.4. DADOS DO PERSONAGEM
let personagem = {
    nick: "",
    cor: "#a7d1fa",
    efeitos: ["nenhum"],
    opacidade: 1.0,
};

// =================================================================================================
// 2. FUNÇÕES DE CRIAÇÃO E UTILIDADES
// =================================================================================================

function criarAlvo() {
    const id = `alvo-${Date.now()}`;
    const novoAlvoG = document.createElementNS("http://www.w3.org/2000/svg", "g");
    novoAlvoG.setAttribute("id", id);

    const x = Math.random() * 100 + 850;
    const y = Math.random() * 150 + 50;

    novoAlvoG.innerHTML = `
        <path fill="#FFF" d="M924.2,274.2c-21.5,21.5-45.9,19.9-52,3.2c-4.4-12.1,2.4-29.2,14.2-41c11.8-11.8,29-18.6,41-14.2 C944.1,228.3,945.7,252.8,924.2,274.2z" />
        <path fill="#F4531C" d="M915.8,265.8c-14.1,14.1-30.8,14.6-36,4.1c-4.1-8.3,0.5-21.3,9.7-30.5s22.2-13.8,30.5-9.7 C930.4,235,929.9,251.7,915.8,265.8z" />
        <path fill="#FFF" d="M908.9,258.9c-8,8-17.9,9.2-21.6,3.5c-3.2-4.9-0.5-13.4,5.6-19.5c6.1-6.1,14.6-8.8,19.5-5.6 C918.1,241,916.9,250.9,908.9,258.9z" />
        <path fill="#F4531C" d="M903.2,253.2c-2.9,2.9-6.7,3.6-8.3,1.7c-1.5-1.8-0.6-5.4,2-8c2.6-2.6,6.2-3.6,8-2 C906.8,246.5,906.1,250.2,903.2,253.2z" />
    `;

    svg.insertBefore(novoAlvoG, arrows);

    const alvoState = {
        id: id,
        element: novoAlvoG,
        x: x,
        y: y
    };

    gameState.alvos.push(alvoState);

    if (EFEITOS.particulas && EFEITOS.particulas.action) {
        EFEITOS.particulas.action(x, y, "#FFF", 20);
    }

    TweenMax.set(novoAlvoG, {
        attr: { transform: `translate(${x - 900}, ${y - 249.5})` },
        scale: 0,
        transformOrigin: "center center"
    });
    TweenMax.to(novoAlvoG, 0.5, {
        scale: 1,
        ease: Back.easeOut,
        delay: 0.3
    });
}

// =================================================================================================
// 6. FLUXO PRINCIPAL DO JOGO
// =================================================================================================

function morrer() {
    gameState.vidas--;
    if (gameState.vidas <= 0) {
        mostrarTelaFinal("GAME OVER!", `Você fez ${gameState.score} pontos!`);
    }
    atualizarPlacar();
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
    nivelDisplay.textContent = gameState.score;
}

function mostrarTelaFinal(titulo, msg) {
    gameState.jogoRodando = false;
    telaFinal.classList.remove("hidden");
    tituloFinal.textContent = titulo;
    mensagemFinal.innerHTML = msg;
}

function iniciarJogo() {
    telaInicial.classList.add("hidden");
    telaFinal.classList.add("hidden");
    gameState.score = 0;
    gameState.vidas = CONFIG.MAX_VIDAS;
    gameState.particulasAcumuladas = 0;

    gameState.alvos.forEach(alvo => alvo.element.remove());
    gameState.alvos = [];

    atualizarPlacar();
    gameState.jogoRodando = true;
    criarAlvo();
}

function draw(e) {
    if (gameState.jogoRodando) {
        iniciarDisparo(e);
    }
}

function iniciarDisparo(e) {
	randomAngle = (Math.random() * Math.PI * 0.03) - 0.015;
	TweenMax.to(".arrow-angle use", 0.3, { opacity: 1 });
	window.addEventListener("mousemove", aim);
	window.addEventListener("mouseup", loose);
	aim(e);
}

function aim(e) {
	var point = getMouseSVG(e);
	point.x = Math.min(point.x, pivot.x - 7);
	point.y = Math.max(point.y, pivot.y + 7);
	var dx = point.x - pivot.x;
	var dy = point.y - pivot.y;
	var angle = Math.atan2(dy, dx) + randomAngle;
	var bowAngle = angle - Math.PI;
	var distance = Math.min(Math.sqrt((dx * dx) + (dy * dy)), 50);
	var scale = Math.min(Math.max(distance / 30, 1), 2);
	TweenMax.to("#bow", 0.3, { scaleX: scale, rotation: bowAngle + "rad", transformOrigin: "right center" });
	TweenMax.to(".arrow-angle", 0.3, { rotation: bowAngle + "rad", svgOrigin: "100 250" });
	TweenMax.to(".arrow-angle use", 0.3, { x: -distance });
	TweenMax.to("#bow polyline", 0.3, { attr: { points: "88,200 " + Math.min(pivot.x - ((1 / scale) * distance), 88) + ",250 88,300" } });
	var radius = distance * 9;
	var offset = { x: (Math.cos(bowAngle) * radius), y: (Math.sin(bowAngle) * radius) };
	var arcWidth = offset.x * 3;
	TweenMax.to("#arc", 0.3, { attr: { d: "M100,250c" + offset.x + "," + offset.y + "," + (arcWidth - offset.x) + "," + (offset.y + 50) + "," + arcWidth + ",50" }, autoAlpha: distance/60 });
}

function loose() {
	window.removeEventListener("mousemove", aim);
	window.removeEventListener("mouseup", loose);
	TweenMax.to("#bow", 0.4, { scaleX: 1, transformOrigin: "right center", ease: Elastic.easeOut });
	TweenMax.to("#bow polyline", 0.4, { attr: { points: "88,200 88,250 88,300" }, ease: Elastic.easeOut });
	var newArrow = document.createElementNS("http://www.w3.org/2000/svg", "use");
	newArrow.setAttributeNS('http://www.w3.org/1999/xlink', 'href', "#ciano-projectile");
	arrows.appendChild(newArrow);
	var path = MorphSVGPlugin.pathDataToBezier("#arc");
    const trailInterval = applyProjectileEffects(newArrow);

	TweenMax.to([newArrow], 0.5, {
        force3D: true,
        bezier: { type: "cubic", values: path, autoRotate: ["x", "y", "rotation"] },
        onUpdate: hitTest,
        onUpdateParams: ["{self}", trailInterval],
        onComplete: onMiss,
        onCompleteParams: ["{self}", trailInterval],
        ease: Linear.easeNone
    });
	TweenMax.to("#arc", 0.3, { opacity: 0 });
	TweenMax.set(".arrow-angle use", { opacity: 0 });
}

function applyProjectileEffects(arrow) {
    let trailInterval = null;

    if (personagem.efeitos.includes('glow') || personagem.efeitos.some(e => e.startsWith('raio'))) {
        arrow.style.filter = "url(#glow)";
    }

    const hasTrailEffect = personagem.efeitos.some(e => e.startsWith('particulas') || e.startsWith('fogo') || e.startsWith('matrix'));
    if (hasTrailEffect) {
        trailInterval = setInterval(() => {
            const transform = arrow._gsTransform;
            if (transform) {
                const trailEffectKey = personagem.efeitos.find(e => e.startsWith('particulas') || e.startsWith('fogo') || e.startsWith('matrix'));
                if (EFEITOS[trailEffectKey] && EFEITOS[trailEffectKey].action) {
                    EFEITOS[trailEffectKey].action(transform.x, transform.y, personagem.cor, 2);
                }
            }
        }, 30);
    }
    return trailInterval;
}

function hitTest(tween, trailInterval) {
    var arrow = tween.target[0];
    var transform = arrow._gsTransform;
    const arrowRadius = 15;
    const targetRadius = 35;

    for (let i = gameState.alvos.length - 1; i >= 0; i--) {
        const alvo = gameState.alvos[i];
        var dx = transform.x - alvo.x;
        var dy = transform.y - alvo.y;
        var distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < targetRadius) {
            if (trailInterval) clearInterval(trailInterval);
            tween.pause();

            TweenMax.to(arrow, 0.3, { opacity: 0, onComplete: () => arrow.remove() });

            var selector = ".hit";
            if (distance < 10) {
                selector = ".bullseye";
                gameState.score++;
                atualizarPlacar();

                alvo.element.remove();
                gameState.alvos.splice(i, 1);

                setTimeout(criarAlvo, 500);

                if (gameState.score > 0 && gameState.score % 5 === 0 && gameState.alvos.length < CONFIG.MAX_ALVOS) {
                    setTimeout(criarAlvo, 700);
                }
            }

            personagem.efeitos.forEach(efeito => {
                if (EFEITOS[efeito] && EFEITOS[efeito].action) {
                    EFEITOS[efeito].action(transform.x, transform.y, personagem.cor, 15);
                }
            });

            showMessage(selector);
            return;
        }
    }
}

function onMiss(tween, trailInterval) {
    if (trailInterval) clearInterval(trailInterval);
    const arrow = tween.target[0];
    const transform = arrow._gsTransform;
    TweenMax.to(arrow, 0.3, { opacity: 0, onComplete: () => arrow.remove() });
    if (EFEITOS.particulas && EFEITOS.particulas.action) {
        EFEITOS.particulas.action(transform.x, transform.y, "#888888", 10);
    }
	showMessage(".miss");
    morrer();
}

function showMessage(selector) {
	TweenMax.killTweensOf(selector);
	TweenMax.killChildTweensOf(selector);
	TweenMax.set(selector, { autoAlpha: 1 });
	TweenMax.staggerFromTo(selector + " path", .5, { rotation: -5, scale: 0, transformOrigin: "center" }, { scale: 1, ease: Back.easeOut }, .05);
	TweenMax.staggerTo(selector + " path", .3, { delay: 2, rotation: 20, scale: 0, ease: Back.easeIn }, .03);
}

function getMouseSVG(e) {
	cursor.x = e.clientX;
	cursor.y = e.clientY;
	return cursor.matrixTransform(svg.getScreenCTM().inverse());
}

// 6.3. INICIALIZAÇÃO
function setup() {
    const btnAbrirCustomizacao = document.getElementById("btnAbrirCustomizacao");
    const btnIniciarDireto = document.getElementById("btnIniciarDireto");
    const telaBemVindo = document.getElementById("telaBemVindo");
    const btnVoltarMenu = document.getElementById("btnVoltarMenu");

    btnJogar.onclick = () => {
        menuCustomizacao.classList.add("hidden");
        iniciarJogo();
    };
    btnJogarNovamente.onclick = iniciarJogo;
    btnIniciarDireto.onclick = () => {
        telaBemVindo.classList.add("hidden");
        iniciarJogo();
    };
    btnVoltarMenu.onclick = () => {
        telaFinal.classList.add("hidden");
        telaBemVindo.classList.remove("hidden");
    };

    const btnCustomizacao = document.getElementById("btnCustomizacao");
    const menuCustomizacao = document.getElementById("menuCustomizacao");
    const btnFecharMenu = document.getElementById("btnFecharMenu");
    const inputNick = document.getElementById("inputNick");
    const seletorCorAvancado = document.getElementById("seletorCorAvancado");
    const listaEfeitosContainer = document.getElementById("listaEfeitos");
    const previewCanvas = document.getElementById("previewCanvas");
    const previewCtx = previewCanvas.getContext("2d");
    const slotsContainer = document.getElementById("slotsContainer");
    const btnAjuda = document.getElementById("btnAjuda");
    const cianoProjectile = document.querySelector("#ciano-projectile circle");

    function salvarPersonagem(slot) {
        if (!personagem.nick) {
            alert("Por favor, dê um nick ao seu personagem antes de salvar!");
            return;
        }
        localStorage.setItem(`personagem_slot_${slot}`, JSON.stringify(personagem));
        popularSlots();
    }

    function carregarPersonagem(slot) {
        const salvo = localStorage.getItem(`personagem_slot_${slot}`);
        if (salvo) {
            const dados = JSON.parse(salvo);
            personagem.nick = dados.nick;
            personagem.cor = dados.cor;
            personagem.efeitos = Array.isArray(dados.efeitos) ? dados.efeitos : [dados.efeito || "nenhum"];
            inputNick.value = personagem.nick;
            seletorCorAvancado.value = personagem.cor;
            desenharPreview();
            popularEfeitos();
        }
    }

    function deletarPersonagem(slot) {
        localStorage.removeItem(`personagem_slot_${slot}`);
        popularSlots();
    }

    function popularSlots() {
        slotsContainer.innerHTML = "";
        for (let i = 1; i <= 4; i++) {
            const slot = document.createElement("div");
            slot.classList.add("slot");
            const salvo = localStorage.getItem(`personagem_slot_${i}`);
            const dados = salvo ? JSON.parse(salvo) : null;
            slot.innerHTML = `
                <div class="slot-preview" style="background-color: ${dados ? dados.cor : '#020617'};"></div>
                <div class="slot-nick">${dados ? dados.nick : 'Vazio'}</div>
                <div class="slot-botoes">
                    <button class="btn-salvar-slot">Salvar</button>
                    ${dados ? '<button class="btn-carregar-slot">Carregar</button><button class="btn-deletar-slot">X</button>' : ''}
                </div>
            `;
            slot.querySelector('.btn-salvar-slot').onclick = () => salvarPersonagem(i);
            if (dados) {
                slot.querySelector('.btn-carregar-slot').onclick = () => carregarPersonagem(i);
                slot.querySelector('.btn-deletar-slot').onclick = () => deletarPersonagem(i);
            }
            slotsContainer.appendChild(slot);
        }
    }

    const openCustomization = () => {
        telaBemVindo.classList.add("hidden");
        menuCustomizacao.classList.remove("hidden");
        if (gameState.jogoRodando) {
            gameState.jogoRodando = false;
        }
        desenharPreview();
        popularSlots();
        popularEfeitos();
    };

    btnCustomizacao.onclick = openCustomization;
    btnAbrirCustomizacao.onclick = openCustomization;

    btnFecharMenu.onclick = () => {
        menuCustomizacao.classList.add("hidden");
        if (!gameState.jogoRodando) {
            telaBemVindo.classList.remove("hidden");
        }
    };
    
    inputNick.oninput = (e) => {
        personagem.nick = e.target.value;
        desenharPreview();
    };

    seletorCorAvancado.oninput = (e) => {
        personagem.cor = e.target.value;
        desenharPreview();
    };

    let botoesEfeitosCriados = false;
    function popularEfeitos() {
        if (!botoesEfeitosCriados) {
            listaEfeitosContainer.innerHTML = "";
            const efeitosArray = Object.keys(EFEITOS).filter(key => !key.startsWith('_')).map(key => ({ key: key, ...EFEITOS[key] }));
            const colorOrder = { "#FF0000": 1, "#FFA500": 2, "#FFFF00": 3, "#008000": 4, "#0000FF": 5, "#4B0082": 6, "#EE82EE": 7, "#FFFFFF": 8, "#808080": 9 };
            efeitosArray.sort((a, b) => (colorOrder[a.cor.toUpperCase()] || 10) - (colorOrder[b.cor.toUpperCase()] || 10));
            efeitosArray.forEach(efeito => {
                const key = efeito.key;
                const btn = document.createElement("button");
                btn.textContent = efeito.simbolo;
                btn.title = key;
                btn.classList.add("btn-efeito");
                btn.dataset.effectKey = key;
                btn.onclick = () => {
                    if (key === "nenhum") {
                        personagem.efeitos = ["nenhum"];
                    } else {
                        const indexNenhum = personagem.efeitos.indexOf("nenhum");
                        if (indexNenhum > -1) personagem.efeitos.splice(indexNenhum, 1);
                        const index = personagem.efeitos.indexOf(key);
                        if (index > -1) {
                            personagem.efeitos.splice(index, 1);
                        } else {
                            if (personagem.efeitos.length < 4) personagem.efeitos.push(key);
                        }
                        if (personagem.efeitos.length === 0) personagem.efeitos.push("nenhum");
                    }
                    atualizarBotoesEfeitos();
                    desenharPreview();
                };
                listaEfeitosContainer.appendChild(btn);
            });
            botoesEfeitosCriados = true;
        }
        atualizarBotoesEfeitos();
    }

    function atualizarBotoesEfeitos() {
        const botoes = listaEfeitosContainer.querySelectorAll('.btn-efeito');
        botoes.forEach(btn => {
            const key = btn.dataset.effectKey;
            btn.classList.toggle("active", personagem.efeitos.includes(key));
        });
    }

    btnAjuda.onclick = () => {
        alert(
            'MENU DE CUSTOMIZAÇÃO:\\n\\n' +
            '1. Nick: Escreva um nome de até 7 letras para seu personagem.\\n' +
            '2. Cores: Clique em uma das cores predefinidas ou use o seletor para uma cor personalizada.\\n' +
            '3. Efeitos: Selecione um efeito visual para seu personagem durante o jogo.\\n' +
            '4. Slots de Personagem:\\n' +
            '   - Salvar: Salva seu personagem atual no slot selecionado (requer um nick).\\n' +
            '   - Carregar: Carrega a aparência de um personagem salvo.\\n' +
            '   - X: Deleta um personagem salvo.\\n\\n' +
            'Clique em "Fechar" para voltar ao jogo.'
        );
    };

    function desenharPreview() {
        previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        const cx = previewCanvas.width / 2;
        const cy = previewCanvas.height / 2;
        const raio = 30 * 1.5;
        personagem.efeitos.forEach(key => {
            if (key.startsWith('particulas')) {
                 for (let i = 0; i < 5; i++) {
                    previewCtx.fillStyle = personagem.cor;
                    previewCtx.globalAlpha = Math.random() * 0.5 + 0.2;
                    previewCtx.beginPath();
                    previewCtx.arc(cx + (Math.random() - 0.5) * 60, cy + (Math.random() - 0.5) * 60, Math.random() * 3 + 1, 0, Math.PI * 2);
                    previewCtx.fill();
                }
            }
        });
        previewCtx.globalAlpha = 1.0;
        const grad = previewCtx.createRadialGradient(cx, cy - 5, 5, cx, cy, raio);
        grad.addColorStop(0, "#ffffff");
        grad.addColorStop(1, personagem.cor);
        previewCtx.fillStyle = grad;
        previewCtx.beginPath();
        previewCtx.arc(cx, cy, raio, 0, Math.PI * 2);
        previewCtx.fill();
        if (personagem.nick) {
            previewCtx.fillStyle = "rgba(0, 0, 0, 0.5)";
            previewCtx.font = "14px 'Courier New', Courier, monospace";
            const nickWidth = previewCtx.measureText(personagem.nick).width;
            previewCtx.fillRect(cx - nickWidth / 2 - 5, cy - raio - 25, nickWidth + 10, 20);
            previewCtx.fillStyle = "white";
            previewCtx.textAlign = "center";
            previewCtx.fillText(personagem.nick, cx, cy - raio - 10);
        }
        cianoProjectile.setAttribute("fill", personagem.cor);
    }

    popularSlots();
    criarEstrelas();
    function gameLoop() {
        if(gameState.jogoRodando) {
            animarEstrelas();
        }
        requestAnimationFrame(gameLoop);
    }
    gameLoop();
}

window.addEventListener("mousedown", draw);
setup();
