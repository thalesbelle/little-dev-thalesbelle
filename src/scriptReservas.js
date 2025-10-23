document.addEventListener('DOMContentLoaded', async () => {

    const voltarBtn = document.getElementById('voltarPaginaInicial');

    voltarBtn.addEventListener('click', () => {
        window.location.href = '/'; 
    });

    async function carregarReservas() {
        const lista = document.getElementById('listaReservas');
        if (!lista) return;

        lista.innerHTML = '';

        try {
            const res = await fetch('/reservas');
            const reservas = await res.json();

            reservas.forEach(reserva => {

                const inicio = new Date(reserva.dataInicio);
                const fim = new Date(reserva.dataFim);
                const formatHora = d => d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
                const horarioFormatado = `${formatHora(inicio)}-${formatHora(fim)}`;

                const agora = new Date();
                let status = reserva.reservaStatus;
                if (agora > fim) status = 'finalizada';

                const div = document.createElement('div');
                div.className = 'reservaCard';
                div.innerHTML = `
                    <div class="reservaInfo">
                        <strong class='informacoesReserva'>Sala:</strong> ${reserva.idSala} <br>
                        <strong class='informacoesReserva'>Reservante:</strong> ${reserva.nomeReservante} <br>
                        <strong class='informacoesReserva'>Data:</strong> ${inicio.toLocaleDateString()} <br>
                        <strong class='informacoesReserva'>Horário:</strong> ${horarioFormatado} <br>
                        <strong class='informacoesReserva'>Status:</strong> <span class="status ${status}">${status}</span>
                    </div>
                `;
                lista.appendChild(div);
            });

        } catch (err) {
            console.error('Erro ao carregar reservas:', err);
            lista.innerHTML = '<p>Erro ao carregar reservas.</p>';
        }
    }

    await carregarReservas();
});