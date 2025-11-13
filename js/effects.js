const EFEITOS = {
    'nenhum': { nome: "Nenhum", emoji: "⚪" },
    'fantasma': {
        nome: "Fantasma", emoji: "👻",
        update: (ctx, cx, cy, personagem, gameState) => {
            personagem.opacidade = 0.6 + Math.sin(gameState.framesDesdeInicio * 0.1) * 0.1;
        }
    },
    'partículas': {
        nome: "Partículas", emoji: "✨",
        update: (ctx, cx, cy, personagem, gameState, jogador, criarParticula) => {
            const corParticula = hexParaRgb(personagem.cor) || '255,255,255';
            if (gameState.framesDesdeInicio % 5 === 0) {
                criarParticula(cx + (Math.random() - 0.5) * jogador.largura, cy + (Math.random() - 0.5) * jogador.altura, corParticula, Math.random() * 2 + 1, 20, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.5);
            }
        }
    },
    // --- Novos Efeitos Variados ---
    'ice_shard': {
        nome: "Ice Shard", emoji: "❆",
        update: (ctx, cx, cy, p, gs, j) => {
            if (gs.framesDesdeInicio % 10 === 0) {
                 const iceSymbols = ['✶', '❄', '❆', '❅'];
                 const symbol = iceSymbols[Math.floor(Math.random() * iceSymbols.length)];
                 particulas.push({ x: cx, y: cy, duracao: 60, vida: 60, texto: symbol, cor: '#ADD8E6', vx: (Math.random() - 0.5) * 2, vy: (Math.random() - 0.5) * 2 });
            }
        }
    },
    'ice_aura': {
        nome: "Ice Aura", emoji: "💎",
        update: (ctx, cx, cy, p) => {
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#00FFFF';
        }
    },
    'ice_frost': {
        nome: "Frost", emoji: "🥶",
        update: (ctx, cx, cy, p, gs, j, criar) => {
            if (j.noChao) {
                 criar(j.x + j.largura / 2, j.y + j.altura, '240,248,255', 10, 30, 0, 0);
            }
        }
    },
    'nature_leaves': {
        nome: "Leaves", emoji: "🍁",
        update: (ctx, cx, cy, p, gs, j) => {
            if (gs.framesDesdeInicio % 12 === 0) {
                const leaves = ['🍁', '🍂', '🍃'];
                particulas.push({ x: cx, y: cy, duracao: 80, vida: 80, texto: leaves[Math.floor(Math.random() * leaves.length)], vy: 1, vx: Math.random() - 0.5 });
            }
        }
    },
    'nature_vines': {
        nome: "Vines", emoji: "덩굴",
        update: (ctx, cx, cy, p, gs, j) => {
            j.rastro.forEach((pos, i) => {
                const green = 150 + Math.floor(i / j.rastro.length * 105);
                ctx.fillStyle = `rgb(0, ${green}, 0)`;
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, (i/j.rastro.length) * 5, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    },
    'tech_nanobots': {
        nome: "Nanobots", emoji: "🤖",
        update: (ctx, cx, cy, p, gs, j, criar) => {
            if (gs.framesDesdeInicio % 3 === 0) {
                criar(cx + (Math.random() - 0.5)*15, cy + (Math.random() - 0.5)*15, '192,192,192', 2, 20);
            }
        }
    },
    'tech_glitch_heavy': {
        nome: "Heavy Glitch", emoji: "📺",
        update: (ctx, cx, cy, p, gs, j) => {
            if (Math.random() > 0.8) {
                const x = j.x + (Math.random() - 0.5) * 30;
                const y = j.y + (Math.random() - 0.5) * 30;
                ctx.drawImage(canvas, j.x, j.y, j.largura, j.altura, x, y, j.largura, j.altura);
            }
        }
    },
    'shadow_tentacles': {
        nome: "Shadow Tentacles", emoji: "🐙",
        update: (ctx, cx, cy, p, gs, j) => {
            if (j.rastro.length > 2) {
                ctx.strokeStyle = `rgba(30, 30, 30, 0.3)`;
                ctx.lineWidth = 10;
                ctx.beginPath();
                ctx.moveTo(j.rastro[0].x, j.rastro[0].y);
                for(let i=1; i < j.rastro.length; i++) {
                     const pos = j.rastro[i];
                     const controlX = pos.x + (Math.random() - 0.5) * 20;
                     const controlY = pos.y + (Math.random() - 0.5) * 20;
                     ctx.quadraticCurveTo(controlX, controlY, pos.x, pos.y);
                }
                ctx.stroke();
            }
        }
    },
    'celestial_stars': {
        nome: "Starry", emoji: "🌟",
        update: (ctx, cx, cy, p, gs, j) => {
            if (gs.framesDesdeInicio % 8 === 0) {
                 const stars = ['✦', '✧', '★', '☆'];
                 particulas.push({ x: cx, y: cy, duracao: 50, vida: 50, texto: stars[Math.floor(Math.random() * stars.length)], cor: '#FFFFE0', vx: (Math.random()-0.5)*1.5, vy: (Math.random()-0.5)*1.5 });
            }
        }
    },
    'celestial_blackhole': {
        nome: "Black Hole", emoji: "⚫",
        update: (ctx, cx, cy, p, gs, j) => {
            p.opacidade = 0.5;
            const radius = 25;
            const grad = ctx.createRadialGradient(cx, cy, 1, cx, cy, radius);
            grad.addColorStop(0, 'rgba(0,0,0,1)');
            grad.addColorStop(0.8, 'rgba(50,0,100,0.5)');
            grad.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = grad;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    },
    // --- Novos Efeitos de Raio ---
    'lightning_strike': {
        nome: "Lightning Strike", emoji: "벼",
        update: (ctx, cx, cy, p, gs, j, criar) => {
            if (Math.random() > 0.99) {
                ctx.strokeStyle = `rgba(255, 255, 255, 0.9)`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(cx, 0);
                let x = cx;
                let y = 0;
                while (y < cy) {
                    let newX = x + (Math.random() - 0.5) * 20;
                    let newY = y + Math.random() * 20;
                    ctx.lineTo(newX, newY);
                    x = newX;
                    y = newY;
                }
                ctx.lineTo(cx, cy);
                ctx.stroke();
            }
        }
    },
    'lightning_ball': {
        nome: "Ball Lightning", emoji: "🔮",
        update: (ctx, cx, cy, p, gs, j, criar) => {
            const angle = gs.framesDesdeInicio * 0.1;
            const x = cx + Math.cos(angle) * 30;
            const y = cy + Math.sin(angle) * 30;
            criar(x, y, '255,255,0', 5, 5);
        }
    },
    'lightning_storm': {
        nome: "Lightning Storm", emoji: "⛈️",
        update: (ctx, cx, cy, p, gs, j) => {
            if (Math.random() > 0.98) {
                ctx.fillStyle = `rgba(200, 200, 255, ${0.2 + Math.random() * 0.3})`;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }
    },
    'lightning_charged': {
        nome: "Charged", emoji: "🔋",
        update: (ctx, cx, cy, p, gs, j, criar) => {
            p.cor = '#FFFF00';
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#FFFF00';
        }
    },
    'lightning_plasma': {
        nome: "Plasma", emoji: "✨",
        update: (ctx, cx, cy, p, gs, j, criar) => {
            if (gs.framesDesdeInicio % 5 === 0) {
                criar(cx, cy, '173, 216, 230', 8, 30, (Math.random() - 0.5) * 1, (Math.random() - 0.5) * 1);
            }
        }
    },
    'lightning_static': {
        nome: "Static Field", emoji: "⚡",
        update: (ctx, cx, cy, p, gs, j, criar) => {
            if (Math.random() > 0.8) {
                criar(cx + (Math.random() - 0.5) * 40, cy + (Math.random() - 0.5) * 40, '255,255,255', 1, 10);
            }
        }
    },
    'lightning_tesla': {
        nome: "Tesla Coil", emoji: "🗼",
        update: (ctx, cx, cy, p, gs, j, criar) => {
            if (Math.random() > 0.9) {
                ctx.strokeStyle = 'rgba(0, 191, 255, 0.7)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(j.x + j.largura, 0); // Canto superior direito
                ctx.stroke();
            }
        }
    },
    'lightning_conductor': {
        nome: "Conductor", emoji: "🔗",
        update: (ctx, cx, cy, p, gs, j) => {
            const closestKey = gameState.mapa.find(e => e.tipo === 'chave');
            if (closestKey) {
                ctx.strokeStyle = 'rgba(255, 255, 0, 0.2)';
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(closestKey.x + closestKey.largura / 2, closestKey.y + closestKey.altura / 2);
                ctx.stroke();
            }
        }
    },
    'lightning_overcharge': {
        nome: "Overcharge", emoji: "💥",
        update: (ctx, cx, cy, p, gs, j) => {
            j.velocidadeX *= (1 + Math.sin(gs.framesDesdeInicio * 0.3) * 0.05);
            if (Math.random() > 0.9) {
                particulas.push({ x: cx, y: cy, duracao: 15, vida: 15, texto: '⚡', cor: '#FFFF00', vx: (Math.random() - 0.5)*2, vy: (Math.random() - 0.5)*2 });
            }
        }
    },
    'lightning_magnetic': {
        nome: "Magnetic", emoji: "🧲",
        update: (ctx, cx, cy, p, gs, j, criar) => {
            if (gs.framesDesdeInicio % 2 === 0) {
                 const angle = gs.framesDesdeInicio * 0.2;
                 criar(cx, cy, '200,200,255', 2, 20, Math.cos(angle) * 2, Math.sin(angle) * 2);
                 criar(cx, cy, '255,200,200', 2, 20, -Math.cos(angle) * 2, -Math.sin(angle) * 2);
            }
        }
    },
    // --- Novos Efeitos de Fogo ---
    'fire_ember': {
        nome: "Fire Embers", emoji: "✨",
        update: (ctx, cx, cy, p, gs, j, criar) => {
            if (gs.framesDesdeInicio % 8 === 0) {
                criar(cx, cy, '255, 100, 0', Math.random() * 3 + 1, 60, (Math.random() - 0.5) * 1, -Math.random() * 1);
            }
        }
    },
    'fire_smoke': {
        nome: "Fire Smoke", emoji: "💨",
        update: (ctx, cx, cy, p, gs, j, criar) => {
            if (gs.framesDesdeInicio % 5 === 0) {
                criar(cx, cy, '50, 50, 50', Math.random() * 8 + 5, 80, (Math.random() - 0.5) * 0.5, -Math.random() * 0.8);
            }
        }
    },
    'fire_blue': {
        nome: "Blue Fire", emoji: "💙",
        update: (ctx, cx, cy, p, gs, j, criar) => {
            if (gs.framesDesdeInicio % 3 === 0) {
                const cor = Math.random() > 0.5 ? '0, 100, 255' : '0, 200, 255';
                criar(cx, cy, cor, Math.random() * 4 + 2, 35, (Math.random() - 0.5) * 1.2, -Math.random() * 1.8);
            }
        }
    },
    'fire_ball': {
        nome: "Fireball", emoji: "☄️",
        update: (ctx, cx, cy, p, gs, j, criar) => {
            p.cor = '#FF4500';
            ctx.shadowBlur = 20;
            ctx.shadowColor = '#FF0000';
        }
    },
    'fire_sparks': {
        nome: "Fire Sparks", emoji: "🎇",
        update: (ctx, cx, cy, p, gs, j, criar) => {
            if (Math.random() > 0.8) {
                criar(cx, cy, '255, 255, 0', Math.random() * 2, 20, (Math.random() - 0.5) * 4, (Math.random() - 0.5) * 4);
            }
        }
    },
    'fire_lava': {
        nome: "Lava Lamp", emoji: "🌋",
        update: (ctx, cx, cy, p, gs, j, criar) => {
            if (gs.framesDesdeInicio % 15 === 0) {
                criar(cx, cy + j.raio, '255, 0, 0', 10, 80, (Math.random() - 0.5) * 0.4, -0.5);
            }
        }
    },
    'fire_inferno': {
        nome: "Inferno", emoji: "👹",
        update: (ctx, cx, cy, p, gs, j, criar) => {
            if (gs.framesDesdeInicio % 2 === 0) {
                const cor = ['255,0,0', '255,69,0', '255,140,0'][Math.floor(Math.random()*3)];
                criar(cx, cy, cor, Math.random() * 8 + 2, 25, (Math.random() - 0.5) * 2, -Math.random() * 2);
            }
        }
    },
    'fire_soot': {
        nome: "Soot", emoji: "⚫",
        update: (ctx, cx, cy, p, gs, j, criar) => {
            if (gs.framesDesdeInicio % 10 === 0) {
                criar(cx, cy, '10, 10, 10', Math.random() * 5 + 1, 70, (Math.random() - 0.5) * 0.3, -Math.random() * 0.7);
            }
        }
    },
    'fire_phoenix': {
        nome: "Phoenix", emoji: "🐦",
        update: (ctx, cx, cy, p, gs, j, criar) => {
             if (gs.framesDesdeInicio % 5 === 0) {
                 const cor = Math.random() > 0.3 ? '255, 215, 0' : '255, 69, 0';
                 particulas.push({ x: cx, y: cy, duracao: 50, vida: 50, texto: '🔥', vy: -2, vx: (Math.random() - 0.5) * 1, cor: cor });
             }
        }
    },
    'fire_heatwave': {
        nome: "Heatwave", emoji: "♨️",
        update: (ctx, cx, cy, p, gs, j) => {
            if (Math.random() > 0.8) {
                const x = j.x + (Math.random() - 0.5) * 20;
                const y = j.y + (Math.random() - 0.5) * 20;
                ctx.globalAlpha = 0.1;
                ctx.drawImage(canvas, j.x, j.y, j.largura, j.altura, x, y, j.largura, j.altura);
                ctx.globalAlpha = 1.0;
            }
        }
    },
    'fire_wildfire': {
        nome: "Wildfire", emoji: "🌳🔥",
        update: (ctx, cx, cy, p, gs, j, criar) => {
            if (Math.random() > 0.5) {
                criar(j.x + (Math.random() - 0.5) * 50, j.y + (Math.random() - 0.5) * 50, '255, 80, 0', 5, 40);
            }
        }
    },
    'fire_cinder': {
        nome: "Cinder", emoji: "⚫",
        update: (ctx, cx, cy, p, gs, j, criar) => {
             if (gs.framesDesdeInicio % 6 === 0) {
                const lifetime = Math.random() * 80 + 40;
                particulas.push({ 
                    x: cx, y: cy, duracao: lifetime, vida: lifetime, 
                    tamanho: Math.random() * 3 + 1, 
                    cor: '255,100,0', // Start hot
                    finalCor: '50,50,50', // End cool
                    vy: -1, vx: (Math.random() - 0.5) 
                });
             }
        }
    },
    'fire_soul': {
        nome: "Soul Fire", emoji: "👻🔥",
        update: (ctx, cx, cy, p, gs, j, criar) => {
            if (gs.framesDesdeInicio % 4 === 0) {
                const cor = Math.random() > 0.5 ? '0, 255, 127' : '60, 179, 113';
                criar(cx, cy, cor, 4, 40, (Math.random() - 0.5) * 0.8, -1.2);
            }
        }
    },
    'fire_explosion': {
        nome: "Explosion", emoji: "💥",
        update: (ctx, cx, cy, p, gs, j, criar) => {
            if (gs.framesDesdeInicio % 50 === 1) {
                for(let i=0; i<30; i++) {
                    const angle = Math.random() * Math.PI * 2;
                    const speed = Math.random() * 5 + 2;
                    criar(cx, cy, '255,165,0', 4, 50, Math.cos(angle)*speed, Math.sin(angle)*speed);
                }
            }
        }
    },
    'fire_magma': {
        nome: "Magma", emoji: "🔴",
        update: (ctx, cx, cy, p, gs, j, criar) => {
            p.cor = `rgb(200, ${Math.floor(Math.sin(gs.framesDesdeInicio * 0.1) * 55 + 50)}, 0)`;
             if (gs.framesDesdeInicio % 12 === 0) {
                criar(cx, cy + j.raio, '255,40,0', 6, 60, (Math.random() - 0.5) * 0.5, 0.1);
             }
        }
    },
    'fire_sun': {
        nome: "Sun Fire", emoji: "☀️",
        update: (ctx, cx, cy, p, gs, j, criar) => {
            ctx.shadowBlur = 30;
            ctx.shadowColor = '#FFFF00';
            if (gs.framesDesdeInicio % 10 === 0) {
                 const angle = Math.random() * Math.PI * 2;
                 criar(cx + Math.cos(angle)*20, cy + Math.sin(angle)*20, '255,255,224', 5, 30, Math.cos(angle)*1, Math.sin(angle)*1);
            }
        }
    },
    'fire_ash': {
        nome: "Ashfall", emoji: "🌨️",
        update: (ctx, cx, cy, p, gs, j, criar) => {
            if (gs.framesDesdeInicio % 3 === 0) {
                 criar(Math.random() * canvas.width, 0, '180,180,180', 2, 100, (Math.random() - 0.5)*0.2, 1.5);
            }
        }
    },
    'fire_wisp': {
        nome: "Fire Wisp", emoji: "🔹",
        update: (ctx, cx, cy, p, gs, j, criar) => {
            const angle = gs.framesDesdeInicio * 0.05;
            const x = cx + Math.cos(angle) * 30;
            const y = cy + Math.sin(angle) * 30;
            criar(x, y, '255,100,0', 3, 10);
        }
    },
    'fire_comet': {
        nome: "Fire Comet", emoji: "☄️",
        update: (ctx, cx, cy, p, gs, j, criar) => {
             if (j.rastro.length > 5) {
                const pos = j.rastro[0];
                criar(pos.x, pos.y, '255,80,0', 8, 20);
             }
        }
    },
    'fire_jet': {
        nome: "Fire Jet", emoji: "🚀",
        update: (ctx, cx, cy, p, gs, j, criar) => {
            if (j.velocidadeY < -1) { // Apenas quando pulando
                criar(cx, cy + j.raio, '255,100,0', 6, 20, (Math.random() - 0.5) * 2, 3);
            }
        }
    },
    // --- Novos Efeitos Matrix ---
    'matrix_rain': {
        nome: "Matrix Rain", emoji: "💧",
        update: (ctx, cx, cy, p, gs, j, criar) => {
            if (gs.framesDesdeInicio % 2 === 0) {
                criar(j.x + Math.random() * j.largura, j.y, '50, 255, 50', Math.random() * 2 + 1, 40, 0, 4);
            }
        }
    },
    'matrix_glitch': {
        nome: "Matrix Glitch", emoji: "💾",
        update: (ctx, cx, cy, p, gs, j) => {
            if (Math.random() > 0.9) {
                const char = String.fromCharCode(0x30A0 + Math.random() * 96);
                ctx.fillStyle = `rgba(0, 255, 0, ${Math.random() * 0.5 + 0.5})`;
                ctx.font = `${Math.random() * 20 + 10}px monospace`;
                ctx.fillText(char, cx + (Math.random() - 0.5) * 50, cy + (Math.random() - 0.5) * 50);
            }
        }
    },
    'matrix_binary': {
        nome: "Matrix Binary", emoji: "🔢",
        update: (ctx, cx, cy, p, gs, j) => {
            if (gs.framesDesdeInicio % 5 === 0) {
                particulas.push({ x: cx, y: cy, duracao: 50, vida: 50, texto: Math.random() > 0.5 ? '1' : '0', vy: 2.5, cor: '#32CD32' });
            }
        }
    },
    'matrix_symbol': {
        nome: "Matrix Symbol", emoji: "🔣",
        update: (ctx, cx, cy, p, gs, j) => {
            if (gs.framesDesdeInicio % 10 === 0) {
                const symbols = ['日', '本', '語', 'Ψ', 'Ω'];
                particulas.push({ x: cx, y: cy, duracao: 60, vida: 60, texto: symbols[Math.floor(Math.random() * symbols.length)], vy: 2, cor: '#ADFF2F' });
            }
        }
    },
     'matrix_scan': {
        nome: "Matrix Scanline", emoji: "📉",
        update: (ctx, cx, cy, p, gs, j) => {
            const scanY = (gs.framesDesdeInicio * 3) % (j.altura * 2) + j.y - j.altura / 2;
            ctx.fillStyle = 'rgba(0, 255, 0, 0.2)';
            ctx.fillRect(j.x - 10, scanY, j.largura + 20, 2);
        }
    },
    'matrix_pulse': {
        nome: "Matrix Pulse", emoji: "💹",
        update: (ctx, cx, cy) => {
            const radius = 20 + Math.sin(gameState.framesDesdeInicio * 0.1) * 10;
            ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    },
    'matrix_distortion': {
        nome: "Matrix Distortion", emoji: "📠",
        update: (ctx, cx, cy, p, gs, j) => {
            p.opacidade = 0.8 + Math.random() * 0.2;
            if (Math.random() > 0.95) {
                j.x += (Math.random() - 0.5) * 5;
            }
        }
    },
    'matrix_code': {
        nome: "Matrix Code", emoji: "📜",
        update: (ctx, cx, cy, p, gs, j) => {
            ctx.fillStyle = 'rgba(0, 255, 0, 0.8)';
            ctx.font = "10px monospace";
            const code = "x=Math.random()";
            ctx.fillText(code, cx - 30, cy - 25);
        }
    },
    'matrix_aura': {
        nome: "Matrix Aura", emoji: "❇️",
        update: (ctx, cx, cy, p) => {
            ctx.shadowBlur = 25;
            ctx.shadowColor = '#00FF00';
        }
    },
     'matrix_trail': {
        nome: "Matrix Trail", emoji: "📉",
        update: (ctx, cx, cy, p, gs, j, criar) => {
             if (j.rastro.length > 2) {
                const pos = j.rastro[0];
                const char = String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96));
                particulas.push({x: pos.x, y: pos.y, duracao: 30, vida: 30, texto: char, cor: '#00FF00' });
             }
        }
    },
     'matrix_cascade': {
        nome: "Matrix Cascade", emoji: "⛆",
        update: (ctx, cx, cy, p, gs, j, criar) => {
            if (gs.framesDesdeInicio % 3 === 0) {
                const char = ['0', '1'][Math.floor(Math.random() * 2)];
                particulas.push({ x: cx, y: j.y, duracao: 80, vida: 80, texto: char, vy: 3, cor: '#39FF14' });
            }
        }
    },
     'matrix_grid': {
        nome: "Matrix Grid", emoji: "🌐",
        update: (ctx, cx, cy, p, gs, j) => {
            ctx.strokeStyle = `rgba(0, 255, 0, ${0.1 + Math.sin(gs.framesDesdeInicio * 0.1) * 0.1})`;
            ctx.lineWidth = 1;
            for (let i = -2; i <= 2; i++) {
                ctx.beginPath();
                ctx.moveTo(cx - 20, cy + i * 10);
                ctx.lineTo(cx + 20, cy + i * 10);
                ctx.stroke();
            }
        }
    },
     'matrix_flux': {
        nome: "Matrix Flux", emoji: "🌀",
        update: (ctx, cx, cy, p, gs, j, criar) => {
            if (gs.framesDesdeInicio % 4 === 0) {
                const angle = gs.framesDesdeInicio * 0.1;
                criar(cx, cy, '127,255,0', 3, 30, Math.cos(angle) * 2, Math.sin(angle) * 2);
            }
        }
    },
    'matrix_error': {
        nome: "Matrix Error", emoji: "❗",
        update: (ctx, cx, cy, p, gs) => {
            if (Math.random() > 0.98) {
                particulas.push({ x: cx, y: cy, duracao: 40, vida: 40, texto: 'ERR', cor: '#FF3131', vy: -1 });
            }
        }
    },
    'matrix_hex': {
        nome: "Matrix Hex", emoji: "⛓️",
        update: (ctx, cx, cy, p, gs) => {
            if (gs.framesDesdeInicio % 8 === 0) {
                const hexChar = "0123456789ABCDEF"[Math.floor(Math.random() * 16)];
                particulas.push({ x: cx, y: cy, duracao: 50, vida: 50, texto: hexChar, vy: 2, cor: '#7FFF00' });
            }
        }
    },
    'matrix_neural': {
        nome: "Matrix Neural", emoji: "🧠",
        update: (ctx, cx, cy, p, gs, j) => {
            if (Math.random() > 0.9) {
                ctx.strokeStyle = 'rgba(173, 255, 47, 0.5)';
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(cx + (Math.random() - 0.5) * 40, cy + (Math.random() - 0.5) * 40);
                ctx.stroke();
            }
        }
    },
    'matrix_vision': {
        nome: "Matrix Vision", emoji: "👁️",
        update: (ctx, cx, cy, p, gs, j) => {
            p.cor = '#00FF00'; // Força a cor do jogador
            ctx.fillStyle = 'rgba(0, 20, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height); // Overlay verde
        }
    },
    'matrix_digit': {
        nome: "Matrix Digit", emoji: "⁹",
        update: (ctx, cx, cy, p, gs) => {
            if (gs.framesDesdeInicio % 6 === 0) {
                const digit = Math.floor(Math.random() * 10);
                particulas.push({ x: cx, y: cy, duracao: 45, vida: 45, texto: digit.toString(), vy: 2.2, cor: '#50C878' });
            }
        }
    },
    'matrix_wave': {
        nome: "Matrix Wave", emoji: "〰️",
        update: (ctx, cx, cy, p, gs, j) => {
            const wave = Math.sin(j.x * 0.1 + gs.framesDesdeInicio * 0.1) * 5;
            j.y += wave;
            p.opacidade = 0.9;
        }
    },
     'matrix_fragments': {
        nome: "Matrix Fragments", emoji: "碎",
        update: (ctx, cx, cy, p, gs, j, criar) => {
            if (gs.framesDesdeInicio % 7 === 0) {
                 const char = "[]{}()";
                 const c = char[Math.floor(Math.random() * char.length)];
                 particulas.push({ x: cx, y: cy, duracao: 40, vida: 40, texto: c, cor: '#98FF98', vx: (Math.random() - 0.5) * 3, vy: (Math.random() - 0.5) * 3 });
            }
        }
    },
     'matrix_decryption': {
        nome: "Matrix Decryption", emoji: "🔑",
        update: (ctx, cx, cy, p, gs, j) => {
             if (gs.framesDesdeInicio % 10 === 0 && Math.random() > 0.7) { // Trigger less often
                const finalChar = String.fromCharCode(0x30A0 + Math.random() * 96);
                // Create a "scrambler" particle
                particulas.push({ 
                    x: cx, y: cy, duracao: 15, vida: 15, 
                    scramble: true, finalText: finalChar, 
                    cor: '#C1FFC1', finalCor: '#00FF00'
                });
             }
        }
    },
    'matrix_construct': {
        nome: "Matrix Construct", emoji: "🏛️",
        update: (ctx, cx, cy, p, gs, j) => {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 + Math.random() * 0.2})`;
            ctx.lineWidth = 1;
            ctx.strokeRect(j.x, j.y, j.largura, j.altura);
        }
    },
    'matrix_anomaly': {
        nome: "Matrix Anomaly", emoji: "❓",
        update: (ctx, cx, cy, p, gs, j) => {
            p.cor = `hsl(${gs.framesDesdeInicio % 60}, 100%, 50%)`; // Piscada vermelha
            if (Math.random() > 0.9) {
                p.opacidade = 0.5;
            }
        }
    },
    'matrix_data_stream': {
        nome: "Matrix Data Stream", emoji: "📤",
        update: (ctx, cx, cy, p, gs, j, criar) => {
             if (gs.framesDesdeInicio % 2 === 0) {
                 criar(cx, cy, '144, 238, 144', 4, 30, j.velocidadeX * 1.5, j.velocidadeY * 1.5);
             }
        }
    },
    'matrix_operator': {
        nome: "Matrix Operator", emoji: "🧑‍💻",
        update: (ctx, cx, cy, p, gs) => {
            if (gs.framesDesdeInicio % 30 === 0) {
                const cmds = ['load', 'run', 'trace', 'ping'];
                particulas.push({ x: cx - 20, y: cy - 30, duracao: 25, vida: 25, texto: cmds[Math.floor(Math.random()*cmds.length)], cor: '#FFFFFF' });
            }
        }
    },
    'matrix_firewall': {
        nome: "Matrix Firewall", emoji: "🧱",
        update: (ctx, cx, cy, p, gs, j) => {
            const radius = j.raio + 10 + Math.sin(gs.framesDesdeInicio * 0.2) * 3;
            ctx.strokeStyle = 'rgba(255, 100, 0, 0.7)';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
    },
    'matrix_protocol': {
        nome: "Matrix Protocol", emoji: "📜",
        update: (ctx, cx, cy, p, gs) => {
            if (gs.framesDesdeInicio % 15 === 0) {
                particulas.push({ x: cx, y: cy, duracao: 40, vida: 40, texto: "TCP", cor: '#B6FCD5', vy: -1.5 });
                particulas.push({ x: cx, y: cy, duracao: 40, vida: 40, texto: "UDP", cor: '#B6FCD5', vy: 1.5 });
            }
        }
    },
    'matrix_relic': {
        nome: "Matrix Relic", emoji: "💎",
        update: (ctx, cx, cy, p, gs, j) => {
            const angle = gs.framesDesdeInicio * 0.05;
            ctx.strokeStyle = '#00FFFF';
            ctx.lineWidth = 2;
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angle);
            ctx.strokeRect(-15, -15, 30, 30);
            ctx.restore();
        }
    },
    'matrix_corruption': {
        nome: "Matrix Corruption", emoji: "👾",
        update: (ctx, cx, cy, p, gs, j) => {
            if (Math.random() > 0.9) {
                const x = j.x + (Math.random() - 0.5) * 10;
                const y = j.y + (Math.random() - 0.5) * 10;
                const size = Math.random() * 10;
                ctx.fillStyle = `rgb(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255})`;
                ctx.fillRect(x, y, size, size);
            }
        }
    },
    'matrix_sys': {
        nome: "Matrix System Call", emoji: "⚙️",
        update: (ctx, cx, cy, p, gs) => {
            if (gs.framesDesdeInicio % 25 === 0) {
                 particulas.push({ x: cx, y: cy, duracao: 30, vida: 30, texto: 'sys_read()', cor: '#E0FFFF' });
            }
        }
    },
    'matrix_feedback': {
        nome: "Matrix Feedback", emoji: "➰",
        update: (ctx, cx, cy, p, gs, j) => {
            if (gs.framesDesdeInicio % 5 === 0) {
                ctx.globalAlpha = 0.3;
                ctx.drawImage(canvas, j.x - 5, j.y - 5, j.largura + 10, j.altura + 10, j.x, j.y, j.largura, j.altura);
                ctx.globalAlpha = 1.0;
            }
        }
    },
    'matrix_kernel': {
        nome: "Matrix Kernel", emoji: "⚛️",
        update: (ctx, cx, cy, p, gs, j) => {
            ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
            ctx.font = "10px monospace";
            ctx.fillText("[KERN]", cx - 20, cy + 30);
        }
    },
    'matrix_overload': {
        nome: "Matrix Overload", emoji: "🤯",
        update: (ctx, cx, cy, p, gs, j, criar) => {
            const overloadFactor = Math.abs(Math.sin(gs.framesDesdeInicio * 0.2)) * 10;
            for(let i=0; i < overloadFactor; i++) {
                const char = String.fromCharCode(0x30A0 + Math.random() * 96);
                particulas.push({ x: cx, y: cy, duracao: 20, vida: 20, texto: char, vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5, cor: '#FF4500' });
            }
        }
    },
    'matrix_loop': {
        nome: "Matrix Infinite Loop", emoji: "🔄",
        update: (ctx, cx, cy, p, gs, j) => {
            EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '∞', '#00FF7F', 0.1, 30);
        },
        orbital: (ctx, cx, cy, p, gs, texto, cor, velocidade, raio, senoidal = false, amp = 15) => {
            const angle = gs.framesDesdeInicio * velocidade;
            const currentRadius = senoidal ? raio + Math.sin(gs.framesDesdeInicio * velocidade * 2) * amp : raio;
            const x = cx + Math.cos(angle) * currentRadius;
            const y = cy + Math.sin(angle) * currentRadius;
            particulas.push({ x, y, duracao: 8, vida: 8, texto: texto, cor: cor });
        }
    },
    // --- Novos Efeitos de Loop Infinito ---
    'loop_atom': { nome: "Atomic Loop", emoji: "⚛️", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '⚛️', '#00FFFF', 0.1, 30) },
    'loop_dna': { nome: "DNA Loop", emoji: "🧬", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '🧬', '#FF00FF', 0.08, 35, true) },
    'loop_star': { nome: "Star Loop", emoji: "⭐", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '⭐', '#FFFF00', 0.12, 25) },
    'loop_heart': { nome: "Heart Loop", emoji: "❤️", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '❤️', '#FF0000', 0.05, 40) },
    'loop_money': { nome: "Money Loop", emoji: "💲", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '💲', '#00FF00', 0.15, 20) },
    'loop_fire': { nome: "Fire Loop", emoji: "🔥", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '🔥', '#FF4500', 0.1, 30, true) },
    'loop_ice': { nome: "Ice Loop", emoji: "❄️", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '❄️', '#ADD8E6', 0.07, 38) },
    'loop_yingyang': { nome: "YingYang Loop", emoji: "☯️", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '☯️', '#FFFFFF', 0.05, 30) },
    'loop_peace': { nome: "Peace Loop", emoji: "☮️", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '☮️', '#FFC0CB', 0.08, 32) },
    'loop_biohazard': { nome: "Biohazard Loop", emoji: "☣️", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '☣️', '#FFFF00', 0.1, 28) },
    'loop_smile': { nome: "Smile Loop", emoji: "😊", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '😊', '#FFD700', 0.1, 30, true, 20) },
    'loop_music': { nome: "Music Loop", emoji: "🎵", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '🎵', '#8A2BE2', 0.12, 25) },
    'loop_gear': { nome: "Gear Loop", emoji: "⚙️", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '⚙️', '#C0C0C0', 0.06, 40) },
    'loop_recycle': { nome: "Recycle Loop", emoji: "♻️", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '♻️', '#008000', 0.1, 30) },
    'loop_warning': { nome: "Warning Loop", emoji: "⚠️", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '⚠️', '#FFD700', 0.09, 33) },
    'loop_pizza': { nome: "Pizza Loop", emoji: "🍕", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '🍕', '#FFA500', 0.1, 30, false, 40) },
    'loop_ghost': { nome: "Ghost Loop", emoji: "👻", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '👻', '#E6E6FA', 0.08, 35, true) },
    'loop_alien': { nome: "Alien Loop", emoji: "👽", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '👽', '#98FB98', 0.11, 28) },
    'loop_moon': { nome: "Moon Loop", emoji: "🌙", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '🌙', '#F0E68C', 0.05, 45) },
    'loop_sun': { nome: "Sun Loop", emoji: "☀️", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '☀️', '#FFD700', 0.07, 42) },
    'loop_cloud': { nome: "Cloud Loop", emoji: "☁️", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '☁️', '#F5F5F5', 0.1, 30, true, 20) },
    'loop_umbrella': { nome: "Umbrella Loop", emoji: "☂️", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '☂️', '#DA70D6', 0.09, 34) },
    'loop_coffee': { nome: "Coffee Loop", emoji: "☕", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '☕', '#8B4513', 0.1, 29) },
    'loop_controller': { nome: "Controller Loop", emoji: "🎮", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '🎮', '#808080', 0.13, 22) },
    'loop_crown': { nome: "Crown Loop", emoji: "👑", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '👑', '#FFD700', 0.08, 36) },
    'loop_diamond': { nome: "Diamond Loop", emoji: "💎", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '💎', '#B9F2FF', 0.1, 30, false, 30) },
    'loop_rocket': { nome: "Rocket Loop", emoji: "🚀", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '🚀', '#FF4500', 0.15, 20, true) },
    'loop_key': { nome: "Key Loop", emoji: "🔑", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '🔑', '#FFD700', 0.1, 30, false, 25) },
    'loop_lock': { nome: "Lock Loop", emoji: "🔒", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '🔒', '#C0C0C0', 0.06, 38) },
    'loop_bulb': { nome: "Bulb Loop", emoji: "💡", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '💡', '#FFFFE0', 0.1, 30, true, 10) },
    'loop_bomb': { nome: "Bomb Loop", emoji: "💣", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '💣', '#808080', 0.1, 30, false, 5) },
    'loop_bell': { nome: "Bell Loop", emoji: "🔔", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '🔔', '#FFD700', 0.12, 27) },
    'loop_magnet': { nome: "Magnet Loop", emoji: "🧲", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '🧲', '#B22222', 0.1, 30, true, 30) },
    'loop_battery': { nome: "Battery Loop", emoji: "🔋", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '🔋', '#7CFC00', 0.07, 39) },
    'loop_wrench': { nome: "Wrench Loop", emoji: "🔧", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '🔧', '#A9A9A9', 0.09, 31) },
    'loop_compass': { nome: "Compass Loop", emoji: "🧭", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '🧭', '#DEB887', 0.05, 42) },
    'loop_joystick': { nome: "Joystick Loop", emoji: "🕹️", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '🕹️', '#DC143C', 0.14, 23) },
    'loop_crystal_ball': { nome: "Crystal Ball Loop", emoji: "🔮", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '🔮', '#BA55D3', 0.08, 35) },
    'loop_telescope': { nome: "Telescope Loop", emoji: "🔭", update: (ctx, cx, cy, p, gs) => EFEITOS.matrix_loop.orbital(ctx, cx, cy, p, gs, '🔭', '#4682B4', 0.06, 40, true, 25) },
    'matrix_packet': {
        nome: "Matrix Packet", emoji: "📦",
        update: (ctx, cx, cy, p, gs, j, criar) => {
            if (gs.framesDesdeInicio % 20 === 0) {
                 criar(j.x - 20, j.y, '200,200,255', 5, 50, 4, 0);
                 criar(j.x + j.largura + 20, j.y, '200,200,255', 5, 50, -4, 0);
            }
        }
    },
     'matrix_sentinel': {
        nome: "Matrix Sentinel", emoji: "🦑",
        update: (ctx, cx, cy, p, gs, j) => {
             if (Math.random() > 0.95) {
                ctx.strokeStyle = 'rgba(255, 0, 0, 0.8)';
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
                ctx.stroke();
             }
        }
    },
    'matrix_oracle': {
        nome: "Matrix Oracle", emoji: "🔮",
        update: (ctx, cx, cy, p, gs) => {
             const radius = 15 + Math.sin(gs.framesDesdeInicio * 0.05) * 5;
             const grad = ctx.createRadialGradient(cx, cy, 1, cx, cy, radius);
             grad.addColorStop(0, 'rgba(200, 200, 255, 0.8)');
             grad.addColorStop(1, 'rgba(0, 255, 0, 0)');
             ctx.fillStyle = grad;
             ctx.beginPath();
             ctx.arc(cx, cy, radius, 0, Math.PI * 2);
             ctx.fill();
        }
    },
    'matrix_white_rabbit': {
        nome: "Matrix White Rabbit", emoji: "🐇",
        update: (ctx, cx, cy, p, gs, j) => {
            if (gs.framesDesdeInicio % 60 === 0) {
                particulas.push({ x: j.x, y: j.y - 30, duracao: 55, vida: 55, texto: '🐇', vy: -1.5 });
            }
        }
    },
    'matrix_agent': {
        nome: "Matrix Agent", emoji: "🕶️",
        update: (ctx, cx, cy, p, gs, j) => {
             p.cor = '#1A1A1A'; // Cor escura
             p.opacidade = 0.95;
             ctx.shadowBlur = 10;
             ctx.shadowColor = '#FFFFFF';
        }
    },
    'rastro luminoso': {
        nome: "Rastro Luminoso", emoji: "💫",
        update: (ctx, cx, cy, personagem) => {
            ctx.shadowBlur = 15;
            ctx.shadowColor = personagem.cor;
        }
    },
    'bolhas': {
        nome: "Bolhas", emoji: "🧼",
        update: (ctx, cx, cy, personagem, gameState, jogador, criarParticula) => {
            if (gameState.framesDesdeInicio % 10 === 0) {
                criarParticula(cx + (Math.random() - 0.5) * jogador.largura, cy + jogador.raio, '255, 255, 255', Math.random() * 4 + 2, 50, (Math.random() - 0.5) * 0.2, -Math.random() * 1.5 - 0.5);
            }
        }
    },
    'elétrico': {
        nome: "Elétrico", emoji: "⚡",
        update: (ctx, cx, cy) => {
            if (Math.random() > 0.95) {
                ctx.strokeStyle = `rgba(255, 255, 0, ${Math.random() * 0.7 + 0.3})`;
                ctx.lineWidth = Math.random() * 3 + 1;
                ctx.beginPath();
                ctx.moveTo(cx, cy);
                for (let i = 0; i < 4; i++) {
                    ctx.lineTo(cx + (Math.random() - 0.5) * 60, cy + (Math.random() - 0.5) * 60);
                }
                ctx.stroke();
            }
        }
    },
    'fogo': {
        nome: "Fogo", emoji: "🔥",
        update: (ctx, cx, cy, personagem, gameState, jogador, criarParticula) => {
            if (gameState.framesDesdeInicio % 3 === 0) {
                const cor = Math.random() > 0.5 ? '255, 87, 34' : '255, 193, 7';
                criarParticula(cx, cy + jogador.raio / 2, cor, Math.random() * 5 + 3, 30, (Math.random() - 0.5) * 1, -Math.random() * 1.5);
            }
        }
    },
    'gelo': {
        nome: "Gelo", emoji: "❄️",
        update: (ctx, cx, cy, personagem, gameState, jogador, criarParticula) => {
            if (gameState.framesDesdeInicio % 4 === 0) {
                criarParticula(cx + (Math.random() - 0.5) * jogador.largura, cy + (Math.random() - 0.5) * jogador.altura, '200, 225, 255', Math.random() * 2 + 1, 40, 0, 0);
            }
        }
    },
    'glitch': {
        nome: "Glitch", emoji: "💥",
        update: (ctx, cx, cy, personagem, gameState, jogador) => {
            if (Math.random() > 0.9) {
                const offsetX = (Math.random() - 0.5) * 15;
                const offsetY = (Math.random() - 0.5) * 15;
                ctx.drawImage(canvas, jogador.x, jogador.y, jogador.largura, jogador.altura, jogador.x + offsetX, jogador.y + offsetY, jogador.largura, jogador.altura);
            }
        }
    },
    'sombra': {
        nome: "Sombra", emoji: "🌑",
        update: (ctx) => {
            ctx.shadowOffsetX = 10;
            ctx.shadowOffsetY = 10;
            ctx.shadowColor = 'rgba(0,0,0,0.4)';
            ctx.shadowBlur = 5;
        }
    },
    'arco-íris': {
        nome: "Arco-íris", emoji: "🌈",
        update: (ctx, cx, cy, personagem, gameState) => {
            personagem.cor = `hsl(${gameState.framesDesdeInicio % 360}, 100%, 70%)`;
        }
    },
    'holograma': {
        nome: "Holograma", emoji: "🌐",
        update: (ctx, cx, cy, personagem, gameState, jogador) => {
            personagem.opacidade = 0.7;
            ctx.strokeStyle = `hsla(${gameState.framesDesdeInicio % 360}, 100%, 80%, 0.7)`;
            ctx.lineWidth = 2;
            ctx.strokeRect(jogador.x - 5, jogador.y - 5, jogador.largura + 10, jogador.altura + 10);
            if (Math.random() > 0.8) {
                ctx.fillStyle = `hsla(${gameState.framesDesdeInicio % 360}, 100%, 80%, 0.1)`;
                ctx.fillRect(0, Math.random() * canvas.height, canvas.width, Math.random() * 5);
            }
        }
    },
    'psicodélico': {
        nome: "Psicodélico", emoji: "🌀",
        update: (ctx, cx, cy, personagem, gameState) => {
            const r = Math.sin(gameState.framesDesdeInicio * 0.1) * 127 + 128;
            const g = Math.sin(gameState.framesDesdeInicio * 0.1 + 2) * 127 + 128;
            const b = Math.sin(gameState.framesDesdeInicio * 0.1 + 4) * 127 + 128;
            personagem.cor = `rgb(${r},${g},${b})`;
            ctx.shadowBlur = 20;
            ctx.shadowColor = `rgb(${g},${b},${r})`;
        }
    },
    'coração': {
        nome: "Coração", emoji: "💖",
        update: (ctx, cx, cy, personagem, gameState, jogador, criarParticula) => {
            if (gameState.framesDesdeInicio % 15 === 0) {
                criarParticula(cx, cy, '255, 105, 180', 10, 50, (Math.random() - 0.5) * 1, -Math.random() * 1);
            }
        }
    },
    'musical': {
        nome: "Musical", emoji: "🎶",
        update: (ctx, cx, cy, personagem, gameState) => {
            if (gameState.framesDesdeInicio % 20 === 0) {
                const nota = ['🎵', '🎶', '🎼'][Math.floor(Math.random() * 3)];
                particulas.push({ x: cx, y: cy, duracao: 30, vida: 30, texto: nota, vy: -2 });
            }
        }
    },
    'cósmico': {
        nome: "Cósmico", emoji: "🌌",
        update: (ctx, cx, cy, personagem, gameState) => {
            ctx.shadowBlur = 25;
            ctx.shadowColor = `hsl(${(gameState.framesDesdeInicio + 180) % 360}, 100%, 70%)`;
        }
    },
    'matrix': {
        nome: "Matrix", emoji: "💻",
        update: (ctx, cx, cy, personagem, gameState, jogador) => {
            if (gameState.framesDesdeInicio % 4 === 0) {
                particulas.push({ x: cx + (Math.random() - 0.5) * jogador.largura, y: cy, duracao: 60, vida: 60, texto: String.fromCharCode(0x30A0 + Math.random() * 96), vy: 2, cor: '#00ff00' });
            }
        }
    },
    'nuvem': {
        nome: "Nuvem", emoji: "☁️",
        update: (ctx, cx, cy, personagem, gameState, jogador, criarParticula) => {
            personagem.opacidade = 0.8;
            if (gameState.framesDesdeInicio % 8 === 0) {
                criarParticula(cx, cy + jogador.altura / 2, '255, 255, 255', 15, 60, (Math.random() - 0.5) * 0.5, 0);
            }
        }
    },
    'tóxico': {
        nome: "Tóxico", emoji: "☣️",
        update: (ctx, cx, cy, personagem, gameState, jogador, criarParticula) => {
            if (gameState.framesDesdeInicio % 10 === 0) {
                criarParticula(cx, cy + jogador.raio, '173, 255, 47', 8, 50, (Math.random() - 0.5) * 0.3, -Math.random() * 1);
            }
        }
    },
    'estático': {
        nome: "Estático", emoji: "📺",
        update: (ctx, cx, cy, personagem, gameState, jogador) => {
            if (Math.random() > 0.5) {
                personagem.opacidade = 0.7;
                ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.2})`;
                ctx.fillRect(jogador.x + (Math.random() - 0.5) * 10, jogador.y + (Math.random() - 0.5) * 10, jogador.largura, jogador.altura);
            }
        }
    }
};
