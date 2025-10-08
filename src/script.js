document.addEventListener('DOMContentLoaded', async () => {
    async function carregarSalas() {
        try {
            const response = await fetch('/salasLabs');
            const salasLabs = await response.json();

            const listaSalas = document.getElementById('listaSalas');
            listaSalas.innerHTML = '';

            salasLabs.forEach(sala => {
                const divSala = document.createElement('div');
                divSala.className = 'formulario';
                divSala.id = `sala-${sala.id}`;
                divSala.innerHTML = `
                    <label><strong>Sala </strong> <span id="numero-sala-${sala.id}">${sala.numero}</span></label><br>
                    <label><strong>Capacidade:</strong> <span id="capacidade-sala-${sala.id}">${sala.capacidade}</span></label><br>
                    <label><strong>Andar:</strong> <span id="andar-sala-${sala.id}">${sala.andar}</span></label><br>
                    <label><strong>Bloco:</strong> <span id="bloco-sala-${sala.id}">${sala.bloco}</span></label><br>
                    <label><strong>Tipo:</strong> <span id="tipo-sala-${sala.id}">${sala.tipo}</span></label><br>`

                listaSalas.appendChild(divSala);
            });
        } catch (error) {
            console.error('Erro ao carregar salas:', error);
            alert('Erro ao carregar salas');
        }
    }
     /*
    function abrirFormularioEditar(sala) {
        const relatorioEditar = document.getElementById('relatorioEditar');
        const body = document.body;

        relatorioEditar.style.display = 'block';
        body.classList.add('fundoEscuro');

        document.getElementById('numeroSalaEditar').value = sala.nome;
        document.getElementById('capacidadeEditar').value = sala.capacidade;
        document.getElementById('andarEditar').value = sala.andar;
        document.getElementById('blocoEditar').value = sala.bloco;
        document.getElementById('tipoEditar').value = sala.tipo;

        const formEditar = document.getElementById('formEditarSala');
        formEditar.onsubmit = async (e) => {
            e.preventDefault();
            const novaSala = {
                numero: document.getElementById('numeroSalaEditar').value,
                capacidade: document.getElementById('capacidadeEditar').value,
                andar: document.getElementById('andarEditar').value,
                bloco: document.getElementById('blocoEditar').value,
                tipo: document.getElementById('tipoEditar').value
            };

            try {
                const res = await fetch(`/salasLabs/${sala.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(novaSala)
                });

                if (res.ok) {
                    document.getElementById(`numero-sala-${sala.id}`).textContent = novaSala.numero;
                    document.getElementById(`capacidade-sala-${sala.id}`).textContent = novaSala.capacidade;
                    document.getElementById(`andar-sala-${sala.id}`).textContent = novaSala.andar;
                    document.getElementById(`bloco-sala-${sala.id}`).textContent = novaSala.bloco;
                    document.getElementById(`tipo-sala-${sala.id}`).textContent = novaSala.tipo;

                    relatorioEditar.style.display = 'none';
                    body.classList.remove('fundoEscuro');
                    alert('Sala atualizada com sucesso!');
                } else {
                    alert('Erro ao atualizar sala');
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro ao atualizar sala');
            }
        };
    }

    document.getElementById('formSala').addEventListener('submit', async (e) => {
        e.preventDefault();
        const novaSala = {
            numero: document.getElementById('numero').value,
            capacidade: document.getElementById('capacidade').value,
            andar: document.getElementById('andar').value,
            bloco: document.getElementById('bloco').value,
            tipo: document.getElementById('tipo').value
        };

        try {
            const res = await fetch('/salasLabs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novaSala)
            });

            if (res.ok) {
                alert('Sala adicionada com sucesso!');
                carregarSalas();
                document.getElementById('formSala').reset();
            } else {
                alert('Erro ao adicionar sala');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao adicionar sala');
        }
    });

    // Fechar formulário de edição
    document.getElementById('cancelarEditar').addEventListener('click', () => {
        document.getElementById('relatorioEditar').style.display = 'none';
        document.body.classList.remove('fundoEscuro');
    });
    */

    // Carrega as salas ao abrir a página
    await carregarSalas();
});