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

function mostrarTelaFinal(titulo, msg) {
    gameState.jogoRodando = false;
    telaFinal.classList.remove("hidden");
    tituloFinal.textContent = titulo;
    mensagemFinal.innerHTML = msg;
}

function setupUI() {
    // Botões principais do jogo
    btnJogar.onclick = iniciarJogo;
    btnJogarNovamente.onclick = iniciarJogo;
    btnReiniciarNivel.onclick = reiniciarFaseAtual;

    // --- LÓGICA DE CUSTOMIZAÇÃO ---
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

    function salvarPersonagem(slot) {
        if (!personagem.nick) {
            alert("Por favor, dê um nick ao seu personagem antes de salvar!");
            return;
        }
        localStorage.setItem(`personagem_slot_${slot}`, JSON.stringify(personagem));
        popularSlots(); // Atualiza a UI dos slots
    }

    function carregarPersonagem(slot) {
        const salvo = localStorage.getItem(`personagem_slot_${slot}`);
        if (salvo) {
            const dados = JSON.parse(salvo);
            personagem.nick = dados.nick;
            personagem.cor = dados.cor;
            personagem.efeito = dados.efeito;

            // Atualiza a UI de customização
            inputNick.value = personagem.nick;
            seletorCorAvancado.value = personagem.cor;
            document.querySelectorAll('.efeito-btn').forEach(btn => {
                // Com o sistema novo, a chave do efeito é o que importa
                const efeitoKey = Object.keys(EFEITOS).find(key => EFEITOS[key].nome.toLowerCase() === personagem.efeito.toLowerCase() || key === personagem.efeito);
                if (efeitoKey) {
                    personagem.efeito = efeitoKey; // Garante que estamos usando a chave
                    btn.classList.toggle('selecionado', btn.title === EFEITOS[efeitoKey].nome);
                }
            });
            desenharPreview();
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


    // Preencher cores e efeitos
    Object.keys(EFEITOS).forEach(key => {
        const efeito = EFEITOS[key];
        const btnEfeito = document.createElement("button");
        btnEfeito.classList.add("efeito-btn");
        btnEfeito.textContent = efeito.emoji;
        btnEfeito.title = efeito.nome;
        btnEfeito.onclick = () => {
            personagem.efeito = key;
            desenharPreview();
            document.querySelectorAll('.efeito-btn').forEach(btn => btn.classList.remove('selecionado'));
            btnEfeito.classList.add('selecionado');
        };
        listaEfeitosContainer.appendChild(btnEfeito);
    });

    // Listeners dos controles
    btnCustomizacao.onclick = () => {
        telaInicial.classList.add("hidden"); // Esconde a tela inicial
        menuCustomizacao.classList.remove("hidden");
        if (gameState.jogoRodando) {
            gameState.jogoRodando = false;
        }
        desenharPreview();
        popularSlots(); // Popula os slots sempre que o menu é aberto
    };

    btnFecharMenu.onclick = () => {
        menuCustomizacao.classList.add("hidden");
        if (!telaInicial.classList.contains("hidden") || !telaFinal.classList.contains("hidden")) {
           // Não faz nada
        } else {
            gameState.jogoRodando = true;
            gameLoop();
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

    btnAjuda.onclick = () => {
        alert(
            'MENU DE CUSTOMIZAÇÃO:\n\n' +
            '1. Nick: Escreva um nome de até 7 letras para seu personagem.\n' +
            '2. Cores: Clique em uma das cores predefinidas ou use o seletor para uma cor personalizada.\n' +
            '3. Efeitos: Selecione um efeito visual para seu personagem durante o jogo.\n' +
            '4. Slots de Personagem:\n' +
            '   - Salvar: Salva seu personagem atual no slot selecionado (requer um nick).\n' +
            '   - Carregar: Carrega a aparência de um personagem salvo.\n' +
            '   - X: Deleta um personagem salvo.\n\n' +
            'Clique em "Fechar" para voltar ao jogo.'
        );
    };

    function desenharPreview() {
        previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
        const cx = previewCanvas.width / 2;
        const cy = previewCanvas.height / 2;
        const raio = CONFIG.PLAYER_RAIO * 1.5;

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
    }

    popularSlots();
}
