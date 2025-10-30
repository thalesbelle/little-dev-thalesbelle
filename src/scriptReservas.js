const traducoesReservas = {
    pt: {
        reservas: "Reservas",
        reservasTitulo: "Reservas - RoomMates",
        baixarRelatorio: "Baixar relatório"
    },
    en: {
        reservas: "Bookings",
        reservasTitulo: "Bookings - RoomMates",
        baixarRelatorio: "Download report"
    },
    es: {
        reservas: "Reservas",
        reservasTitulo: "Reservas - RoomMates",
        baixarRelatorio: "Descargar reporte"
    }
};

function aplicarIdiomaReservas(idioma) {
    const t = traducoesReservas[idioma];
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (t[key]) el.textContent = t[key];
    });
    document.title = t.reservasTitulo || document.title;
}

document.addEventListener('DOMContentLoaded', async () => {

    const idiomaSalvo = localStorage.getItem("idioma") || "pt";
    aplicarIdiomaReservas(idiomaSalvo);

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
                        <strong class='informacoesReserva'>Sala:</strong> 
                        <span class='valor'>${reserva.idSala}</span><br>
                        
                        <strong class='informacoesReserva'>Reservante:</strong> 
                        <span class='valor'>${reserva.nomeReservante}</span><br>
                        
                        <strong class='informacoesReserva'>Data:</strong> 
                        <span class='valor'>${inicio.toLocaleDateString()}</span><br>
                        
                        <strong class='informacoesReserva'>Horário:</strong> 
                        <span class='valor'>${horarioFormatado}</span><br>
                        
                        <strong class='informacoesReserva'>Status:</strong> 
                        <span class='status ${status}'>${status}</span>
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