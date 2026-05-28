let todasTransacoes = [];
let usuarioLogado =
JSON.parse(localStorage.getItem('usuario'));

function formatarMoeda(valor){

    return Number(valor)
    .toLocaleString(

        'pt-BR',

        {

            style: 'currency',

            currency: 'BRL'

        }

    );

}

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
document.getElementById('valor').value

.replace(/\./g, '')
.replace(',', '.');

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

    const transacoesOriginais = await resposta.json();

todasTransacoes = transacoesOriginais;

const transacoes = aplicarFiltros(transacoesOriginais);

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
                    ${formatarMoeda(transacao.valor)}
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

    const limite = Number(usuarioLogado.limite_gastos || 0);

let alerta = document.getElementById('alertaLimite');

if (!alerta) return;

if (limite > 0 && despesas > limite) {
    alerta.innerText = "⚠️ Você ultrapassou seu limite de gastos!";
    alerta.style.color = "red";
}

else if (limite > 0 && despesas > limite * 0.8) {
    alerta.innerText = "⚠️ Você está quase estourando seu limite!";
    alerta.style.color = "orange";
}

else {
    alerta.innerText = "";
}

    atualizarResumo(receitas, despesas);

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

                ${formatarMoeda(transacao.valor)}

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
        formatarMoeda(receitas);

    }

    if(despesasElemento){

        despesasElemento.innerText =
        formatarMoeda(despesas);

    }

    if(saldoElemento){

        saldoElemento.innerText =
        formatarMoeda(
    receitas - despesas
    
);

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
    document.getElementById('dashboardArea').style.display = 'none';
    document.getElementById('perfilArea').style.display = 'block';
    document.getElementById('transacoesArea').style.display = 'none';
    document.getElementById('metasArea').style.display = 'none';
}
function abrirDashboard(){
    document.getElementById('dashboardArea').style.display = 'block';
    document.getElementById('perfilArea').style.display = 'none';
    document.getElementById('transacoesArea').style.display = 'none';
    document.getElementById('metasArea').style.display = 'none';
}

function abrirTransacoes(){
    document.getElementById('dashboardArea').style.display = 'none';
    document.getElementById('perfilArea').style.display = 'none';
    document.getElementById('transacoesArea').style.display = 'block';
    document.getElementById('metasArea').style.display = 'none';
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
    document.getElementById('editarNome').value;

    const email =
    document.getElementById('editarEmail').value;

    const senha =
    document.getElementById('editarSenha').value;

    const limite_gastos =
    Number(document.getElementById('editarLimite').value);

    await fetch(`http://localhost:3000/usuarios/${usuarioLogado.id}`, {

    method: 'PUT',

    headers: {
        'Content-Type': 'application/json'
    },

    body: JSON.stringify({
        nome,
        email,
        senha,
        limite_gastos
    })

});

    usuarioLogado.nome = nome;
    usuarioLogado.email = email;
    usuarioLogado.limite_gastos = limite_gastos;

    localStorage.setItem(
        'usuario',
        JSON.stringify(usuarioLogado)
    );

    carregarPerfil();
    fecharModal();

    mostrarPopup('Perfil atualizado!');
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
/* ABRIR ÁREA METAS */

function abrirMetas(){
    document.getElementById('dashboardArea').style.display = 'none';
    document.getElementById('perfilArea').style.display = 'none';
    document.getElementById('transacoesArea').style.display = 'none';
    document.getElementById('metasArea').style.display = 'block';

    listarMetas();
}

/* ABRIR MODAL META */

function abrirModalMeta(){

    document.getElementById(
        'modalMeta'
    ).style.display = 'flex';

}

/* FECHAR MODAL META */

function fecharModalMeta(){

    document.getElementById(
        'modalMeta'
    ).style.display = 'none';

}

async function salvarMeta() {

    console.log("clicou salvar meta");

    const nome = document.getElementById('nomeMeta').value;
    const valor_meta_input = document.getElementById('valorMeta').value;
    const data_fim = document.getElementById('prazoMeta').value;

    // validação de campos vazios (antes de qualquer conversão)
    if (
        nome.trim() === '' ||
        valor_meta_input.trim() === '' ||
        data_fim.trim() === ''
    ) {
        mostrarPopup('Preencha todos os campos!');
        return;
    }

    // converter valor só depois da validação
    const valor_meta = Number(
        valor_meta_input
            .replace(/\./g, '')
            .replace(',', '.')
    );

    if (isNaN(valor_meta) || valor_meta <= 0) {
        mostrarPopup('O valor da meta deve ser maior que zero!');
        return;
    }

    // EDITAR META
    if (metaEditando) {

        await fetch(
            `http://localhost:3000/metas/${metaEditando}`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome,
                    valor_meta,
                    data_fim
                })
            }
        );

        mostrarPopup('Meta atualizada!');
        metaEditando = null;

    } else {

        // CRIAR META
        await fetch(
            'http://localhost:3000/metas',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nome,
                    valor_meta,
                    data_fim,
                    usuario_id: usuarioLogado.id
                })
            }
        );

        mostrarPopup('Meta criada!');
    }

    fecharModalMeta();
    listarMetas();
}

/* LISTAR METAS */

async function listarMetas(){

    const resposta = await fetch(
        `http://localhost:3000/metas?usuario_id=${usuarioLogado.id}`
    );

    const metas = await resposta.json();

    const lista = document.getElementById('listaMetas');

    if(!lista) return;

    lista.innerHTML = '';

    metas.forEach(meta => {

        lista.innerHTML += `

        <div class="card-meta">

            <h2>${meta.nome}</h2>

            <p>${formatarMoeda(meta.valor_meta)}</p>

            <small>
                Prazo: ${new Date(meta.data_fim).toLocaleDateString('pt-BR')}
            </small>

            <div class="botoes-meta">

                <button onclick="editarMeta(${meta.id})">
                    Editar
                </button>

                <button onclick="excluirMeta(${meta.id})">
                    Excluir
                </button>

            </div>

        </div>

        `;

    });

}
async function excluirMeta(id){

    await fetch(

        `http://localhost:3000/metas/${id}`,

        {

            method: 'DELETE'

        }

    );

    mostrarPopup(
        'Meta excluída!'
    );

    listarMetas();

}
let metaEditando = null;

function editarMeta(id){
    metaEditando = id;
    document.getElementById('modalMeta').style.display = 'flex';
}

    metaEditando = id;

    document.getElementById(
        'modalMeta'
    ).style.display = 'flex';


function aplicarMascaraMoeda(input){

    let valor = input.value;

    valor = valor.replace(/\D/g, '');

    valor = (valor / 100)
    .toFixed(2) + '';

    valor = valor.replace('.', ',');

    valor = valor.replace(
        /(\d)(?=(\d{3})+(?!\d))/g,
        '$1.'
    );

    input.value = valor;

}
async function excluirContaConfirmada() {

    await fetch(`http://localhost:3000/usuarios/${usuarioLogado.id}`, {
        method: 'DELETE'
    });

    localStorage.removeItem('usuario');

    mostrarPopup("Conta excluída!");

    window.location.href = "login.html";
}
function abrirConfirmExclusaoConta() {
    document.getElementById('modalConfirm').style.display = 'flex';
}
function fecharModalConfirm() {
    document.getElementById('modalConfirm').style.display = 'none';
}
async function gerarRelatorio() {

    const resposta = await fetch(
        `http://localhost:3000/transacoes?usuario_id=${usuarioLogado.id}`
    );

    const transacoes = await resposta.json();

    let receitas = 0;
    let despesas = 0;

    transacoes.forEach(t => {

        const valor = Number(t.valor);

        if (t.tipo_transacao === 'receita') {
            receitas += valor;
        } else {
            despesas += valor;
        }

    });

    const saldo = receitas - despesas;

    let situacao = '';
    let analise = '';

    if (receitas > despesas) {
        situacao = 'POSITIVO';
        analise = 'Você teve mais entradas do que saídas. Seu fluxo financeiro está saudável.';
    } else if (despesas > receitas) {
        situacao = 'NEGATIVO';
        analise = 'Você gastou mais do que recebeu. É bom revisar seus gastos.';
    } else {
        situacao = 'EQUILIBRADO';
        analise = 'Entradas e saídas estão equilibradas.';
    }

    const janela = window.open('', '_blank');

    janela.document.write(`
        <html>
        <head>
            <title>Relatório Financeiro</title>
            <style>
                body { font-family: Arial; padding: 20px; background:#f4f4f4; }
                h1 { color: #333; }

                .card {
                    margin: 10px 0;
                    padding: 10px;
                    border: 1px solid #ccc;
                    background: white;
                    border-radius: 6px;
                }

                .status {
                    margin-top: 15px;
                    font-weight: bold;
                    font-size: 18px;
                }

                .positivo { color: green; }
                .negativo { color: red; }
                .neutro { color: orange; }
            </style>
        </head>

        <body>

            <h1>📊 Relatório Financeiro</h1>

            <div class="card">Receitas: R$ ${receitas.toFixed(2)}</div>
            <div class="card">Despesas: R$ ${despesas.toFixed(2)}</div>
            <div class="card"><strong>Saldo: R$ ${saldo.toFixed(2)}</strong></div>

            <div class="status">
                Situação: ${situacao}
            </div>

            <div class="card">
                ${analise}
            </div>

        </body>
        </html>
    `);

    janela.document.close();
    janela.print();
}
function atualizarResumo(receitas, despesas) {

    const saldo = receitas - despesas;

    const ids = {
        receitas: 'receitas',
        despesas: 'despesas',
        saldo: 'saldo',
        receitasTransacoes: 'receitasTransacoes',
        despesasTransacoes: 'despesasTransacoes'
    };

    for (let id in ids) {
        const el = document.getElementById(ids[id]);
        if (el) el.innerText = '';
    }

    if (document.getElementById('receitas')) {
        document.getElementById('receitas').innerText = formatarMoeda(receitas);
    }

    if (document.getElementById('despesas')) {
        document.getElementById('despesas').innerText = formatarMoeda(despesas);
    }

    if (document.getElementById('saldo')) {
        document.getElementById('saldo').innerText = formatarMoeda(saldo);
    }

    if (document.getElementById('receitasTransacoes')) {
        document.getElementById('receitasTransacoes').innerText = formatarMoeda(receitas);
    }

    if (document.getElementById('despesasTransacoes')) {
        document.getElementById('despesasTransacoes').innerText = formatarMoeda(despesas);
    }
}
function abrirModalPerfil(){

    document.getElementById('modalEditar')
    .style.display = 'flex';

    document.getElementById('editarNome').value =
    usuarioLogado.nome;

    document.getElementById('editarEmail').value =
    usuarioLogado.email;

    document.getElementById('editarLimite').value =
    usuarioLogado.limite_gastos || 0;

}
function aplicarFiltros(transacoes) {

    const tipo = document.getElementById('filtroTipo').value;
    const categoria = document.getElementById('filtroCategoria').value;
    const min = Number(document.getElementById('filtroMin').value) || 0;
    const max = Number(document.getElementById('filtroMax').value) || Infinity;

    return transacoes.filter(t => {

        const valor = Number(t.valor);

        const tipoOk = !tipo || t.tipo_transacao === tipo;
        const catOk = !categoria || t.categoria_gasto === categoria;
        const minOk = valor >= min;
        const maxOk = valor <= max;

        return tipoOk && catOk && minOk && maxOk;
    });
}
function filtrarTransacoes() {
    listarTransacoes();
}
