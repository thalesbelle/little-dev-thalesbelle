const traducoes = {
    pt: {
        paginaInicial: "Página Inicial",
        reservas: "Reservas",
        cadastro: "Cadastro",
        nomeReservante: "Nome do Reservante:",
        confirmar: "Confirmar",
        sala: "Sala",
        capacidade: "Capacidade:",
        andar: "Andar:",
        bloco: "Bloco:",
        tipo: "Tipo:",
        dataReserva: "Data da Reserva:",
        escolherHorario: "Escolha o horário:",
        placeholderNome: "Seu nome",
        sucessoReserva: "Reserva realizada com sucesso!",
        erroReserva: "Erro ao realizar a reserva",
        sucessoCadastro: "Sala cadastrada com sucesso!",
        erroCadastro: "Erro ao cadastrar sala!",
        geral: "Geral",
        personalizacao: "Personalização",
        idioma: "Idioma",
        cadastrar: "Cadastrar",
        salas: "SALAS",
        selecioneHorario: "Selecione o horário",
        reservar: "Reservar"
    },
    en: {
        paginaInicial: "Home",
        reservas: "Bookings",
        cadastro: "Register",
        nomeReservante: "Booker's Name:",
        confirmar: "Confirm",
        sala: "Room",
        capacidade: "Capacity:",
        andar: "Floor:",
        bloco: "Block:",
        tipo: "Type:",
        dataReserva: "Reservation Date:",
        escolherHorario: "Choose a time:",
        placeholderNome: "Your name",
        sucessoReserva: "Reservation completed successfully!",
        erroReserva: "Error making reservation",
        sucessoCadastro: "Room registered successfully!",
        erroCadastro: "Error registering room!",
        geral: "General",
        personalizacao: "Customization",
        idioma: "Language",
        cadastrar: "Register",
        salas: "ROOMS",
        selecioneHorario: "Select a time",
        reservar: "Book"
    },
    es: {
        paginaInicial: "Página Principal",
        reservas: "Reservas",
        cadastro: "Registro",
        nomeReservante: "Nombre del Reservante:",
        confirmar: "Confirmar",
        sala: "Sala",
        capacidade: "Capacidad:",
        andar: "Piso:",
        bloco: "Bloque:",
        tipo: "Tipo:",
        dataReserva: "Fecha de la Reserva:",
        escolherHorario: "Elige el horario:",
        placeholderNome: "Tu nombre",
        sucessoReserva: "¡Reserva realizada con éxito!",
        erroReserva: "Error al realizar la reserva",
        sucessoCadastro: "¡Sala registrada con éxito!",
        erroCadastro: "Error al registrar la sala",
        geral: "General",
        personalizacao: "Personalización",
        idioma: "Idioma",
        cadastrar: "Registrar",
        salas: "SALAS",
        selecioneHorario: "Seleccione un horario",
        reservar: "Reservar"
    }
};

// Tradução de valores do banco (Sala, Laboratório, etc.)
const traducoesBanco = {
    tipo: {
        pt: { "Sala": "Sala", "Laboratório": "Laboratório" },
        en: { "Sala": "Classroom", "Laboratório": "Laboratory" },
        es: { "Sala": "Sala", "Laboratorio": "Laboratorio" }
    }
};

function aplicarIdioma(idioma) {
    const t = traducoes[idioma];

    // Traduz elementos com data-i18n
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (t[key]) {
            if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
                el.placeholder = t[key];
            } else if (el.tagName === "BUTTON" || el.tagName === "OPTION") {
                el.textContent = t[key];
            } else {
                el.textContent = t[key];
            }
        }
    });

    // Atualiza título da reserva se estiver aberta
    if (window.idSalaSelecionada && document.getElementById('tituloSalaReserva')) {
        const numeroSala = document.querySelector(`#numero-sala-${window.idSalaSelecionada}`)?.textContent;
        if (numeroSala) {
            document.getElementById('tituloSalaReserva').textContent = `${t.sala} ${numeroSala}`;
        }
    }

    // Atualiza flatpickr
    const campoData = document.querySelector("#dataReserva");
    if (campoData && campoData._flatpickr) {
        campoData._flatpickr.set("locale", idioma);
    }
}

// Função auxiliar para traduzir valores do banco
function traduzirValor(campo, valor, idioma) {
    return traducoesBanco[campo]?.[idioma]?.[valor] || valor;
}

document.addEventListener('DOMContentLoaded', async () => {
    const selectIdioma = document.getElementById("idioma");
    const idiomaSalvo = localStorage.getItem("idioma") || "pt";
    if (selectIdioma) selectIdioma.value = idiomaSalvo;

    // Elementos DOM
    const listaSalas = document.getElementById('listaSalas');
    const telaReserva = document.querySelector('#telaReservar');
    const overlay = document.getElementById('overlay');
    const body = document.body;
    const fecharReserva = document.querySelector('#fecharReserva');
    const abaCadastro = document.querySelector('#abaCadastro');
    const telaCadastro = document.querySelector('#telaCadastro');
    const setaFechar = document.querySelector('#fecharConfigs');
    const setaFecharCadastro = document.querySelector('#fecharCadastro');
    const telaConfigs = document.querySelector('#telaConfiguracoes');
    const botaoConfiguracoes = document.querySelector('.botaoConfiguracoes');
    const abas = document.querySelectorAll('.divAbaIndividual');
    const conteudoGeral = document.getElementById('conteudoGeral');
    const conteudoPersonalizacao = document.getElementById('conteudoPersonalizacao');
    const tituloPaginaConfig = document.getElementById('tituloPaginaConfig');
    const paginaInicial = document.getElementById('textoPgInicial');

    // Função para carregar e traduzir salas
    async function carregarSalas() {
        try {
            const response = await fetch('/salas');
            const salasLabs = await response.json();
            listaSalas.innerHTML = '';

            const idiomaAtual = localStorage.getItem("idioma") || "pt";

            salasLabs.forEach(sala => {
                const divSala = document.createElement('div');
                divSala.className = 'formulario';
                divSala.id = `sala-${sala.idSala}`;

                const tipoTraduzido = traduzirValor('tipo', sala.tipo, idiomaAtual);

                divSala.innerHTML = `
                    <label><strong data-i18n="sala"></strong> <span id="numero-sala-${sala.idSala}">${sala.numero}</span></label><br>
                    <label><strong data-i18n="capacidade"></strong> <span id="capacidade-sala-${sala.idSala}">${sala.capacidade}</span></label><br>
                    <label><strong data-i18n="andar"></strong> <span id="andar-sala-${sala.idSala}">${sala.andar}</span></label><br>
                    <label><strong data-i18n="bloco"></strong> <span id="bloco-sala-${sala.idSala}">${sala.bloco}</span></label><br>
                    <label><strong data-i18n="tipo"></strong> 
                        <span id="tipo-sala-${sala.idSala}" data-tipo-original="${sala.tipo}">${tipoTraduzido}</span>
                    </label><br>
                    <button class="reservaBotao" data-i18n="reservar" id="sala-${sala.idSala}"></button>
                `;

                listaSalas.appendChild(divSala);

                const botaoReserva = divSala.querySelector(`#sala-${sala.idSala}`);
                botaoReserva.addEventListener('click', () => {
                    telaReserva.removeAttribute('hidden');
                    overlay.removeAttribute('hidden');
                    body.classList.add('no-scroll');

                    const t = traducoes[idiomaAtual];
                    const tipoTraduzido = traduzirValor('tipo', sala.tipo, idiomaAtual);

                    document.getElementById('tituloSalaReserva').textContent = `${t.sala} ${sala.numero}`;
                    document.getElementById('reserva-capacidade').textContent = sala.capacidade;
                    document.getElementById('reserva-andar').textContent = sala.andar;
                    document.getElementById('reserva-bloco').textContent = sala.bloco;
                    document.getElementById('reserva-tipo').textContent = tipoTraduzido;

                    window.idSalaSelecionada = sala.idSala;
                });
            });

            aplicarIdioma(idiomaAtual); // Traduz labels e botões
        } catch (error) {
            console.error('Erro ao carregar salas:', error);
            alert('Erro ao carregar salas');
        }
    }

    // Mudança de idioma
    if (selectIdioma) {
        selectIdioma.addEventListener("change", async (e) => {
            const idiomaEscolhido = e.target.value;
            localStorage.setItem("idioma", idiomaEscolhido);

            // Atualiza valores do banco já no DOM
            document.querySelectorAll('[data-tipo-original]').forEach(span => {
                const original = span.getAttribute('data-tipo-original');
                span.textContent = traduzirValor('tipo', original, idiomaEscolhido);
            });

            // Atualiza tela de reserva se aberta
            if (window.idSalaSelecionada) {
                const tipoSpan = document.getElementById(`tipo-sala-${window.idSalaSelecionada}`);
                if (tipoSpan) {
                    tipoSpan.textContent = traduzirValor('tipo', tipoSpan.dataset.tipoOriginal, idiomaEscolhido);
                }
            }

            aplicarIdioma(idiomaEscolhido);
        });
    }

    // Eventos de UI
    paginaInicial.addEventListener('click', () => {
        telaReserva.setAttribute('hidden', 'hidden');
        telaCadastro.setAttribute('hidden', 'hidden');
        telaConfigs.setAttribute('hidden', 'hidden');
        overlay.setAttribute('hidden', 'hidden');
        body.classList.remove('no-scroll');
    });

    fecharReserva.addEventListener('click', () => {
        telaReserva.setAttribute('hidden', 'hidden');
        overlay.toggleAttribute('hidden');
        body.classList.toggle('no-scroll');
    });

    abaCadastro.addEventListener('click', () => {
        telaCadastro.toggleAttribute('hidden');
        overlay.toggleAttribute('hidden');
        body.classList.toggle('no-scroll');
    });

    setaFechar.addEventListener('click', () => {
        telaConfigs.setAttribute('hidden', 'hidden');
        overlay.setAttribute('hidden', 'hidden');
    });

    setaFecharCadastro.addEventListener('click', () => {
        telaCadastro.setAttribute('hidden', 'hidden');
        overlay.toggleAttribute('hidden');
        body.classList.toggle('no-scroll');
    });

    botaoConfiguracoes.addEventListener('click', () => {
        telaConfigs.toggleAttribute('hidden');
        overlay.toggleAttribute('hidden');
        body.classList.toggle('no-scroll');
    });

    // Abas de configuração
    abas.forEach(aba => {
        aba.addEventListener('click', () => {
            abas.forEach(a => a.classList.remove('abaAtiva'));
            aba.classList.add('abaAtiva');

            conteudoGeral.classList.add('oculto');
            conteudoPersonalizacao.classList.add('oculto');

            if (aba.id === 'abaGeral') {
                conteudoGeral.classList.remove('oculto');
                tituloPaginaConfig.textContent = traducoes[localStorage.getItem("idioma") || "pt"].geral;
            } else if (aba.id === 'abaPersonalizacao') {
                conteudoPersonalizacao.classList.remove('oculto');
                tituloPaginaConfig.textContent = traducoes[localStorage.getItem("idioma") || "pt"].personalizacao;
            }
        });
    });

    // Engrenagem giratória
    const engrenagem = document.querySelector('#engrenagemGeral');
    if (engrenagem) {
        engrenagem.addEventListener('mouseover', () => engrenagem.classList.add('girarEngrenagem'));
        engrenagem.addEventListener('mouseleave', () => engrenagem.classList.remove('girarEngrenagem'));
    }

    // Capitalizar inputs
    const inputTipo = document.getElementById('tipo');
    const inputReservante = document.getElementById('inputReservante');
    [inputTipo, inputReservante].forEach(input => {
        if (input) {
            input.addEventListener('input', () => {
                let valor = input.value;
                if (valor.length > 0) {
                    input.value = valor.charAt(0).toUpperCase() + valor.slice(1);
                }
            });
        }
    });

    // Flatpickr
    const campoData = document.querySelector("#dataReserva");
    if (campoData) {
        flatpickr(campoData, {
            dateFormat: "d/m/Y",
            minDate: "today",
            locale: "pt",
            disableMobile: true,
            onChange: async function (selectedDates, dateStr) {
                if (!window.idSalaSelecionada) return;

                const [dia, mes, ano] = dateStr.split('/');
                const dataFormatada = `${dia}-${mes}-${ano}`;

                try {
                    const res = await fetch(`/reservas/ocupadas/${window.idSalaSelecionada}/${dataFormatada}`);
                    const horariosOcupados = await res.json();
                    const selectHorario = document.getElementById("horario");

                    for (let opt of selectHorario.options) {
                        if (horariosOcupados.includes(opt.value)) {
                            opt.disabled = true;
                            opt.textContent = `${opt.value.replace('-', ' - ')} (Indisponível)`;
                        } else {
                            opt.disabled = false;
                            opt.textContent = opt.value ? opt.value.replace('-', ' - ') : '-- Selecione o horário --';
                        }
                    }
                } catch (error) {
                    console.error("Erro ao buscar horários ocupados:", error);
                }
            }
        });
    }

    // Cadastrar sala
    document.querySelector('.botaoCadastrar').addEventListener('click', async () => {
        const novaSala = {
            numero: document.getElementById('numero').value,
            capacidade: document.getElementById('capacidade').value,
            andar: document.getElementById('andar').value,
            bloco: document.getElementById('bloco').value,
            tipo: document.getElementById('tipo').value
        };

        try {
            const res = await fetch('/salas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novaSala)
            });

            if (res.ok) {
                alert(traducoes[localStorage.getItem("idioma") || "pt"].sucessoCadastro);
                telaCadastro.setAttribute('hidden', 'hidden');
                overlay.setAttribute('hidden', 'hidden');
                body.classList.remove('no-scroll');
                await carregarSalas();
            } else {
                alert(traducoes[localStorage.getItem("idioma") || "pt"].erroCadastro);
            }
        } catch (error) {
            console.error('Erro ao cadastrar sala:', error);
            alert(traducoes[localStorage.getItem("idioma") || "pt"].erroCadastro);
        }
    });

    // Reservar sala
    document.getElementById('formReserva').addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = document.getElementById('dataReserva').value;
        const horario = document.getElementById('horario').value;
        const nomeReservante = document.getElementById('inputReservante').value;

        if (!data || !horario || !nomeReservante || !window.idSalaSelecionada) {
            alert('Preencha todos os campos corretamente.');
            return;
        }

        const reserva = { nomeReservante, idSala: window.idSalaSelecionada, data, horario };

        try {
            const res = await fetch('/reservas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reserva)
            });

            if (res.ok) {
                alert(traducoes[localStorage.getItem("idioma") || "pt"].sucessoReserva);
                telaReserva.setAttribute('hidden', 'hidden');
                overlay.setAttribute('hidden', 'hidden');
                body.classList.remove('no-scroll');
                e.target.reset();
                window.idSalaSelecionada = null;
            } else {
                const erro = await res.json();
                alert('Erro ao realizar a reserva: ' + (erro.error || ''));
            }
        } catch (error) {
            console.error('Erro na reserva:', error);
            alert(traducoes[localStorage.getItem("idioma") || "pt"].erroReserva);
        }
    });

    await carregarSalas();
});