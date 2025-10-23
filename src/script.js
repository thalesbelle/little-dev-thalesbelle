document.addEventListener('DOMContentLoaded', async () => {
    async function carregarSalas() {
        try {
            const response = await fetch('/salas');
            const salasLabs = await response.json();

            const listaSalas = document.getElementById('listaSalas');
            listaSalas.innerHTML = '';
            const telaReserva = document.querySelector('#telaReservar');
            salasLabs.forEach(sala => {
                console.log(sala)
                const divSala = document.createElement('div');
                divSala.className = 'formulario';
                divSala.idSala = `sala-${sala.idSala}`;
                divSala.innerHTML = `
                    <label><strong>Sala </strong> <span id="numero-sala-${sala.idSala}">${sala.numero}</span></label><br>
                    <label><strong>Capacidade:</strong> <span id="capacidade-sala-${sala.idSala}">${sala.capacidade}</span></label><br>
                    <label><strong>Andar:</strong> <span id="andar-sala-${sala.idSala}">${sala.andar}</span></label><br>
                    <label><strong>Bloco:</strong> <span id="bloco-sala-${sala.idSala}">${sala.bloco}</span></label><br>
                    <label><strong>Tipo:</strong> <span id="tipo-sala-${sala.idSala}">${sala.tipo}</span></label><br>
                    <button class="reservaBotao" id='sala-${sala.idSala.toString()}'><strong>Reservar</strong></button>
                    `

                listaSalas.appendChild(divSala);
                const botaoReserva = document.querySelector(`#sala-${sala.idSala.toString()}`);
                botaoReserva.addEventListener('click', () => {

                    telaReserva.removeAttribute('hidden');
                    overlay.removeAttribute('hidden');
                    body.classList.add('no-scroll');

                    document.getElementById('tituloSalaReserva').textContent = `Sala ${sala.numero}`;
                    document.getElementById('reserva-capacidade').textContent = sala.capacidade;
                    document.getElementById('reserva-andar').textContent = sala.andar;
                    document.getElementById('reserva-bloco').textContent = sala.bloco;
                    document.getElementById('reserva-tipo').textContent = sala.tipo;

                    window.idSalaSelecionada = sala.idSala;  // <---- Salva o id da sala aqui
                });
            });
        } catch (error) {
            console.error('Erro ao carregar salas:', error);
            alert('Erro ao carregar salas');
        }
    }

    const input = document.getElementById('tipo');
    const fecharReserva = document.querySelector('#fecharReserva');
    const telaReserva = document.querySelector('#telaReservar');
    const telaCadastro = document.querySelector('#telaCadastro');
    const abaCadastro = document.querySelector('#abaCadastro');
    const setaFechar = document.querySelector('#fecharConfigs');
    const setaFecharCadastro = document.querySelector('#fecharCadastro');
    const telaConfigs = document.querySelector('#telaConfiguracoes');
    const botaoConfiguracoes = document.querySelector('.botaoConfiguracoes');
    const overlay = document.getElementById('overlay');
    const body = document.body;
    const abas = document.querySelectorAll('.divAbaIndividual');
    const geral = document.getElementById('geral');
    const personalizacao = document.getElementById('personalizacao');
    const conteudoGeral = document.getElementById('conteudoGeral');
    const conteudoPersonalizacao = document.getElementById('conteudoPersonalizacao');
    const tituloPaginaConfig = document.getElementById('tituloPaginaConfig');
    const tituloSalaReserva = document.querySelector('#tituloSalaReserva');
    const paginaInicial = document.getElementById('textoPgInicial');

    paginaInicial.addEventListener('click', () => {
        telaReserva.setAttribute('hidden', 'hidden');
        telaCadastro.setAttribute('hidden', 'hidden');
        telaConfigs.setAttribute('hidden', 'hidden');
        overlay.setAttribute('hidden', 'hidden');
        body.classList.remove('no-scroll');
    });

    const campoData = document.querySelector("#dataReserva");

    if (campoData) {
        flatpickr(campoData, {
            dateFormat: "d/m/Y", 
            minDate: "today", 
            locale: "pt", 
            disableMobile: true, 
            showMonths: 1, 
            showDaysOutsideMonth: false, 
            onChange: function(selectedDates, dateStr) {
                console.log("Data escolhida:", dateStr);
            },
        });
    }

    const selectHorario = document.getElementById("horario");
    selectHorario.addEventListener("change", () => {
      console.log("Horário selecionado:", selectHorario.value);
    });

    input.addEventListener('input', () => {
        let valor = input.value;
        if (valor.length > 0) {
            input.value = valor.charAt(0).toUpperCase() + valor.slice(1);
        }
    });

    const input2 = document.getElementById('inputReservante')

    input2.addEventListener('input', () => {
        let valor = input2.value;
        if (valor.length > 0) {
            input2.value = valor.charAt(0).toUpperCase() + valor.slice(1);
        }
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

    if (abas.length > 0) {

        const defaultBackground = 'white';
        const activeBackground = 'rgba(213, 213, 213, 0.600)';

        abas.forEach(aba => {

            aba.addEventListener('click', function () {
                abas.forEach(a => {
                    a.style.backgroundColor = defaultBackground;
                });
                aba.style.backgroundColor = activeBackground;
            });
        });
    } else {
    }

    function ocultarTodosConteudos() {
        if (geral) geral.style.display = 'none';
        if (personalizacao) personalizacao.style.display = 'none';
    }

    abas.forEach(aba => {
        aba.addEventListener('click', () => {

            abas.forEach(a => a.classList.remove('abaAtiva'));

            aba.classList.add('abaAtiva');

            conteudoGeral.classList.add('oculto');
            conteudoPersonalizacao.classList.add('oculto');

            if (aba.id === 'abaGeral') {
                conteudoGeral.classList.remove('oculto');
                tituloPaginaConfig.textContent = 'Geral';
            } else if (aba.id === 'abaPersonalizacao') {
                conteudoPersonalizacao.classList.remove('oculto');
                tituloPaginaConfig.textContent = 'Personalização';
            }
        });
    });

    const engrenagem = document.querySelector('#engrenagemGeral');
    if (engrenagem) {
        engrenagem.addEventListener('mouseover', () => {
            engrenagem.classList.add('girarEngrenagem');
        });
        engrenagem.addEventListener('mouseleave', () => {
            engrenagem.classList.remove('girarEngrenagem');
        });
    }

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
                alert('Sala cadastrada com sucesso!');
                document.getElementById('telaCadastro').setAttribute('hidden', 'hidden');
                document.getElementById('overlay').setAttribute('hidden', 'hidden');
                document.body.classList.remove('no-scroll');
                await carregarSalas(); // Atualiza a lista após adicionar
            } else {
                alert('Erro ao cadastrar sala!');
            }
        } catch (error) {
            console.error('Erro ao cadastrar sala:', error);
            alert('Erro ao cadastrar sala!');
        }
    });

    // --- FORMULÁRIO DE RESERVA ---
    document.getElementById('formReserva').addEventListener('submit', async (e) => {
        e.preventDefault();

        const data = document.getElementById('dataReserva').value; // "dd/mm/yyyy"
        const horario = document.getElementById('horario').value;  // "07:30-08:20"
        const nomeReservante = document.getElementById('inputReservante').value;

        if (!data || !horario || !nomeReservante || !window.idSalaSelecionada) {
            alert('Preencha todos os campos corretamente.');
            return;
        }

        const reserva = {
            nomeReservante,
            idSala: window.idSalaSelecionada,
            data,
            horario
        };

        try {
            const res = await fetch('/reservas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reserva)
            });

            if (res.ok) {
                alert('Reserva realizada com sucesso!');
                document.getElementById('telaReservar').setAttribute('hidden', 'hidden');
                document.getElementById('overlay').setAttribute('hidden', 'hidden');
                document.body.classList.remove('no-scroll');
                e.target.reset();
                window.idSalaSelecionada = null;
            } else {
                const erro = await res.json();
                alert('Erro ao realizar a reserva: ' + (erro.error || ''));
            }
        } catch (error) {
            console.error('Erro na reserva:', error);
            alert('Erro ao realizar a reserva');
        }
    });

    // Carrega as salas ao abrir a página
    await carregarSalas();
});