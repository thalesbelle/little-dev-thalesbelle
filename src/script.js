document.addEventListener('DOMContentLoaded', async () => {
    async function carregarSalas() {
        try {
            const response = await fetch('/salas');
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
                    <label><strong>Tipo:</strong> <span id="tipo-sala-${sala.id}">${sala.tipo}</span></label><br>
                    <button id="reservaBotao"><strong>Reservar</strong></button>
                    `

                listaSalas.appendChild(divSala);
            });
        } catch (error) {
            console.error('Erro ao carregar salas:', error);
            alert('Erro ao carregar salas');
        }
    }

    const telaConfigs = document.querySelector('#telaConfiguracoes');
    const botaoConfiguracoes = document.querySelector('.botaoConfiguracoes');
    const overlay = document.getElementById('overlay');
    const body = document.body;

    botaoConfiguracoes.addEventListener('click', () => {

        telaConfigs.toggleAttribute('hidden');

        overlay.toggleAttribute('hidden');

        body.classList.toggle('no-scroll');
    });


    const abas = document.querySelectorAll('.divAbaIndividual');

    if (abas.length > 0) {

        const defaultBackground = 'white';
        const activeBackground = 'rgba(213, 213, 213, 0.600)';

        abas.forEach(aba => {
            console.log('Adicionando clique a:', aba);
            aba.addEventListener('click', function () {
                abas.forEach(a => {
                    a.style.backgroundColor = defaultBackground;
                });
                aba.style.backgroundColor = activeBackground;
            });
        });
    } else {
    }

    const geral = document.getElementById('geral');
    const personalizacao = document.getElementById('personalizacao');

    function ocultarTodosConteudos() {
        if (geral) geral.style.display = 'none';
        if (personalizacao) personalizacao.style.display = 'none';
    }

    const conteudoGeral = document.getElementById('conteudoGeral');
    const conteudoPersonalizacao = document.getElementById('conteudoPersonalizacao');
    const tituloPaginaConfig = document.getElementById('tituloPaginaConfig');

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




    const setaFechar = document.querySelector('#fecharConfigs');

    setaFechar.addEventListener('click', () => {

        telaConfigs.setAttribute('hidden', 'hidden');

        overlay.setAttribute('hidden', 'hidden');
    });

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