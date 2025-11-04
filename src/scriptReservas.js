const traducoesReservas = {
    pt: { reservas: "Reservas", reservasTitulo: "Reservas - RoomMates", baixarRelatorio: "Baixar relatório" },
    en: { reservas: "Bookings", reservasTitulo: "Bookings - RoomMates", baixarRelatorio: "Download report" },
    es: { reservas: "Reservas", reservasTitulo: "Reservas - RoomMates", baixarRelatorio: "Descargar reporte" }
};

function aplicarIdiomaReservas(idioma) {
    const t = traducoesReservas[idioma];
    document.querySelectorAll("[data-i18n]").forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (t[key]) el.textContent = t[key];
    });
    document.title = t.reservasTitulo || document.title;
}

// === SISTEMA DE ÍCONES POR TEMA ===
const iconesReservas = {
    "azul": { voltar: "./images/seta-voltar.png", download: "./images/download-azul.png" },
    "ciano": { voltar: "./images/seta-voltar-ciano.png", download: "./images/download-ciano.png" },
    "azul-claro": { voltar: "./images/seta-voltar-azul-claro.png", download: "./images/download-azul-claro.png" },
    "verde": { voltar: "./images/seta-voltar-verde.png", download: "./images/download-verde.png" },
    "roxo": { voltar: "./images/seta-voltar-roxo.png", download: "./images/download-roxo.png" }
};

function atualizarIconesReservas(tema) {
    const iconeVoltar = document.getElementById('voltarPaginaInicial');
    const iconeDownload = document.getElementById('baixarRelatorio');

    if (iconeVoltar && iconesReservas[tema]?.voltar) {
        iconeVoltar.src = iconesReservas[tema].voltar;
    }
    if (iconeDownload && iconesReservas[tema]?.download) {
        iconeDownload.src = iconesReservas[tema].download;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const idiomaSalvo = localStorage.getItem("idioma") || "pt";
    aplicarIdiomaReservas(idiomaSalvo);

    // === APLICA TEMA SALVO ===
    const temaSalvo = localStorage.getItem("tema") || "azul";
    document.documentElement.setAttribute("data-tema", temaSalvo);
    atualizarIconesReservas(temaSalvo);

    // === EVENTOS ===
    document.getElementById('voltarPaginaInicial').addEventListener('click', () => {
        window.location.href = '/';
    });

    document.getElementById('fundoDownload').addEventListener('click', () => {
        window.open('/relatorio-reservas');
    });

    // === CARREGA RESERVAS ===
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