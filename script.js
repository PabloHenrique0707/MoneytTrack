let usuarioLogado =
JSON.parse(localStorage.getItem('usuario'));

/* LOGIN */

async function fazerLogin(){

    const email =
    document.getElementById('email').value;

    const senha =
    document.getElementById('senha').value;

    const resposta = await fetch(
        'http://localhost:3000/login',
        {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                email,
                senha
            })

        }
    );

    const resultado =
    await resposta.json();

    mostrarPopup(resultado.mensagem);

    if(resultado.sucesso){

        localStorage.setItem(
            'usuario',
            JSON.stringify(resultado.usuario)
        );

        window.location.href =
        'dashboard.html';

    }

}

/* CADASTRO */

function mostrarCadastro(){

    document.getElementById('loginBox')
    .style.display = 'none';

    document.getElementById('cadastroBox')
    .style.display = 'block';

}

function mostrarLogin(){

    document.getElementById('loginBox')
    .style.display = 'block';

    document.getElementById('cadastroBox')
    .style.display = 'none';

}

async function cadastrarNovoUsuario(){

    const nome =
    document.getElementById('nomeCadastro').value;

    const email =
    document.getElementById('emailCadastro').value;

    const senha =
    document.getElementById('senhaCadastro').value;

    const resposta = await fetch(
        'http://localhost:3000/usuarios',
        {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({
                nome,
                email,
                senha
            })

        }
    );

    const resultado =
    await resposta.text();

    mostrarPopup(resultado);

    mostrarLogin();

}

/* ADICIONAR TRANSAÇÃO */

async function adicionarTransacao(){

    const descricao =
    document.getElementById('descricao').value;

    const valor =
    document.getElementById('valor').value;

    const tipo =
    document.getElementById('tipo').value;

    const categoria_gasto =
    document.getElementById('categoria').value;

    await fetch(
        'http://localhost:3000/transacoes',
        {

            method: 'POST',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({

                descricao,
                valor,
                tipo,
                categoria_gasto,
                usuario_id: usuarioLogado.id

            })

        }
    );

    mostrarPopup('Transação adicionada!');

    listarTransacoes();

}

/* LISTAR TRANSAÇÕES */

async function listarTransacoes(){

    const resposta = await fetch(
        `http://localhost:3000/transacoes?usuario_id=${usuarioLogado.id}`
    );

    const transacoes =
    await resposta.json();

    const lista =
    document.getElementById('listaTransacoes');

    const resumo =
    document.getElementById('resumoDashboard');

    if(!lista || !resumo){
        return;
    }

    lista.innerHTML = '';
    resumo.innerHTML = '';

    let receitas = 0;
    let despesas = 0;

    transacoes.forEach(transacao => {

        if(
            transacao.tipo_transacao
            === 'receita'
        ){

            receitas +=
            Number(transacao.valor);

        }else{

            despesas +=
            Number(transacao.valor);

        }

        lista.innerHTML += `

        <div class="transacao">

            <div>

                <strong>
                    ${transacao.descricao}
                </strong>

                <p>
                    R$ ${transacao.valor}
                </p>

                <small>
                    ${transacao.tipo_transacao}
                </small>

                <br>

                <small>
                    ${transacao.categoria_gasto}
                </small>

            </div>

            <div>

                <button onclick="editarTransacao(

                    ${transacao.id_transacao},

                    '${transacao.descricao}',

                    '${transacao.valor}',

                    '${transacao.tipo_transacao}',

                    '${transacao.categoria_gasto}'

                )">

                    Editar

                </button>

                <button onclick="deletarTransacao(
                    ${transacao.id_transacao}
                )">

                    Excluir

                </button>

            </div>

        </div>

        `;

    });

    transacoes
    .slice(-3)
    .reverse()
    .forEach(transacao => {

        resumo.innerHTML += `

        <div class="transacao">

            <div>

                <strong>
                    ${transacao.descricao}
                </strong>

            </div>

            <div class="${
                transacao.tipo_transacao
                === 'receita'
                ? 'receita-texto'
                : 'despesa-texto'
            }">

                R$ ${transacao.valor}

            </div>

        </div>

        `;

    });

    const receitasElemento =
    document.getElementById('receitas');

    const despesasElemento =
    document.getElementById('despesas');

    const saldoElemento =
    document.getElementById('saldo');

    if(receitasElemento){

        receitasElemento.innerText =
        `R$ ${receitas}`;

    }

    if(despesasElemento){

        despesasElemento.innerText =
        `R$ ${despesas}`;

    }

    if(saldoElemento){

        saldoElemento.innerText =
        `R$ ${receitas - despesas}`;

    }

    /* GRÁFICO */

    const categorias = {};

    transacoes.forEach(transacao => {

        const categoria =
        transacao.categoria_gasto;

        if(categorias[categoria]){

            categorias[categoria] +=
            Number(transacao.valor);

        }else{

            categorias[categoria] =
            Number(transacao.valor);

        }

    });

    const ctx =
    document.getElementById(
        'graficoFinanceiro'
    );

    if(ctx){

        if(window.grafico){

            window.grafico.destroy();

        }

        window.grafico = new Chart(ctx, {

            type: 'doughnut',

            data: {

                labels:
                Object.keys(categorias),

                datasets: [{

                    data:
                    Object.values(categorias),

                    backgroundColor: [

                        '#00e676',
                        '#ff5252',
                        '#2196f3',
                        '#ff9800',
                        '#9c27b0',
                        '#00bcd4',
                        '#ffc107'

                    ],

                    borderWidth: 0

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false

            }

        });

    }
}
/* EDITAR TRANSAÇÃO */

let transacaoEditando = null;

function editarTransacao(

    id,
    descricaoAtual,
    valorAtual,
    tipoAtual,
    categoriaAtual

){

    transacaoEditando = id;

    document.getElementById(
        'editarDescricao'
    ).value = descricaoAtual;

    document.getElementById(
        'editarValor'
    ).value = valorAtual;

    document.getElementById(
        'editarTipo'
    ).value = tipoAtual;

    document.getElementById(
        'editarCategoria'
    ).value = categoriaAtual;

    document.getElementById(
        'modalTransacao'
    ).style.display = 'flex';

}

/* FECHAR MODAL */

function fecharModalTransacao(){

    document.getElementById(
        'modalTransacao'
    ).style.display = 'none';

}

/* SALVAR EDIÇÃO */

async function salvarEdicaoTransacao(){

    const descricao =
    document.getElementById(
        'editarDescricao'
    ).value;

    const valor =
    document.getElementById(
        'editarValor'
    ).value;

    const tipo =
    document.getElementById(
        'editarTipo'
    ).value;

    const categoria_gasto =
    document.getElementById(
        'editarCategoria'
    ).value;

    await fetch(

        `http://localhost:3000/transacoes/${transacaoEditando}`,

        {

            method: 'PUT',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({

                descricao,
                valor,
                tipo,
                categoria_gasto,
                usuario_id: usuarioLogado.id

            })

        }

    );

    fecharModalTransacao();

    mostrarPopup(
        'Transação atualizada!'
    );

    listarTransacoes();

}

/* DELETAR TRANSAÇÃO */

async function deletarTransacao(id){

    await fetch(

        `http://localhost:3000/transacoes/${id}`,

        {
            method: 'DELETE'
        }

    );

    mostrarPopup(
        'Transação excluída!'
    );

    listarTransacoes();

}
/* DELETAR TRANSAÇÃO */

async function deletarTransacao(id){

    await fetch(

        `http://localhost:3000/transacoes/${id}`,

        {
            method: 'DELETE'
        }

    );

    mostrarPopup(
        'Transação excluída!'
    );

    listarTransacoes();

}

/* PERFIL */

function carregarPerfil(){

    if(!usuarioLogado){
        return;
    }

    const nomePerfil =
    document.getElementById('nomePerfil');

    const perfilNome =
    document.getElementById('perfilNome');

    const perfilEmail =
    document.getElementById('perfilEmail');

    if(nomePerfil){

        nomePerfil.innerHTML =
        `👤 ${usuarioLogado.nome}`;

    }

    if(perfilNome){

        perfilNome.innerText =
        usuarioLogado.nome;

    }

    if(perfilEmail){

        perfilEmail.innerText =
        usuarioLogado.email;

    }

}

function abrirPerfil(){

    document.getElementById('dashboardArea')
    .style.display = 'none';

    document.getElementById('perfilArea')
    .style.display = 'block';

    document.getElementById('transacoesArea')
    .style.display = 'none';

}

function abrirDashboard(){

    document.getElementById('dashboardArea')
    .style.display = 'block';

    document.getElementById('perfilArea')
    .style.display = 'none';

    document.getElementById('transacoesArea')
    .style.display = 'none';

}

function abrirTransacoes(){

    document.getElementById('dashboardArea')
    .style.display = 'none';

    document.getElementById('perfilArea')
    .style.display = 'none';

    document.getElementById('transacoesArea')
    .style.display = 'block';

}

function logout(){

    localStorage.removeItem('usuario');

    window.location.href =
    'login.html';

}

/* POPUP */

function mostrarPopup(mensagem){

    const popup =
    document.getElementById('popup');

    popup.innerText = mensagem;

    popup.classList.add('mostrar');

    setTimeout(() => {

        popup.classList.remove(
            'mostrar'
        );

    }, 3000);

}

/* MODAL PERFIL */

function abrirModalPerfil(){

    document.getElementById(
        'modalEditar'
    ).style.display = 'flex';

    document.getElementById(
        'editarNome'
    ).value = usuarioLogado.nome;

    document.getElementById(
        'editarEmail'
    ).value = usuarioLogado.email;

}

function fecharModal(){

    document.getElementById(
        'modalEditar'
    ).style.display = 'none';

}

async function salvarPerfil(){

    const nome =
    document.getElementById(
        'editarNome'
    ).value;

    const email =
    document.getElementById(
        'editarEmail'
    ).value;

    const senha =
    document.getElementById(
        'editarSenha'
    ).value;

    await fetch(

        `http://localhost:3000/usuarios/${usuarioLogado.id}`,

        {

            method: 'PUT',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({

                nome,
                email,
                senha

            })

        }

    );

    usuarioLogado.nome = nome;
    usuarioLogado.email = email;

    localStorage.setItem(
        'usuario',
        JSON.stringify(usuarioLogado)
    );

    carregarPerfil();

    fecharModal();

    mostrarPopup(
        'Perfil atualizado!'
    );

}

/* INICIAR */

if(usuarioLogado){

    carregarPerfil();

    listarTransacoes();

}
function fecharModalTransacao(){

    document.getElementById(
        'modalTransacao'
    ).style.display = 'none';

}

async function salvarEdicaoTransacao(){

    const descricao =
    document.getElementById(
        'editarDescricao'
    ).value;

    const valor =
    document.getElementById(
        'editarValor'
    ).value;

    const tipo =
    document.getElementById(
        'editarTipo'
    ).value;

    const categoria_gasto =
    document.getElementById(
        'editarCategoria'
    ).value;

    await fetch(

        `http://localhost:3000/transacoes/${transacaoEditando}`,

        {

            method: 'PUT',

            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({

                descricao,
                valor,
                tipo,
                categoria_gasto,
                usuario_id: usuarioLogado.id

            })

        }

    );

    fecharModalTransacao();

    mostrarPopup(
        'Transação atualizada!'
    );

    listarTransacoes();

}
