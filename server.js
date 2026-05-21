const express = require('express');

const cors = require('cors');

const db = require('./db');

const app = express();

app.use(cors());

app.use(express.json());

app.get('/', (req, res) => {
    res.send('MoneyTrack API funcionando');
});

app.get('/usuarios', (req, res) => {

    const sql = 'SELECT * FROM usuarios';

    db.query(sql, (err, result) => {

        if(err){
            console.log(err);
            res.send('Erro no banco');
            return;
        }

        res.json(result);

    });

});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
app.post('/usuarios', (req, res) => {

    const { nome, email, senha } = req.body;

    const sql = `
        INSERT INTO usuarios (nome, email, senha)
        VALUES (?, ?, ?)
    `;

    db.query(sql, [nome, email, senha], (err, result) => {

        if(err){
            console.log(err);
            res.send('Erro ao cadastrar usuário');
            return;
        }

        res.send('Usuário cadastrado!');

    });

});
app.delete('/usuarios/:id', (req, res) => {

    const id = req.params.id;

    const sql = 'DELETE FROM usuarios WHERE id = ?';

    db.query(sql, [id], (err, result) => {

        if(err){
            console.log(err);
            res.send('Erro ao deletar');
            return;
        }

        res.send('Usuário deletado');

    });

});
app.put('/usuarios/:id', (req, res) => {

    const id = req.params.id;

    const { nome, email, senha } = req.body;

    const sql = `
        UPDATE usuarios
        SET nome = ?, email = ?, senha = ?
        WHERE id = ?
    `;

    db.query(sql, [nome, email, senha, id], (err, result) => {

        if(err){
            console.log(err);
            res.send('Erro ao atualizar usuário');
            return;
        }

        res.send('Usuário atualizado!');

    });

});
app.post('/login', (req, res) => {

    const { email, senha } = req.body;

    const sql = `
        SELECT * FROM usuarios
        WHERE email = ?
        AND senha = ?
    `;

    db.query(sql, [email, senha], (err, result) => {

        if(err){
            console.log(err);
            res.send('Erro no servidor');
            return;
        }

        if(result.length > 0){

            res.json({
                sucesso: true,
                mensagem: 'Login realizado!',
                usuario: result[0]
            });

        }else{

            res.json({
                sucesso: false,
                mensagem: 'Email ou senha inválidos'
            });

        }

    });

});
app.get('/transacoes', (req, res) => {

    const usuario_id = req.query.usuario_id;

    const sql = `
        SELECT * FROM transacao
        WHERE usuario_id = ?
    `;

    db.query(sql, [usuario_id], (err, result) => {

        if(err){

            console.log(err);

            res.status(500).send('Erro ao buscar transações');

            return;

        }

        res.json(result);

    });

});
app.post('/transacoes', (req, res) => {

    const {

        descricao,
        valor,
        tipo,
        categoria_gasto,
        usuario_id

    } = req.body;

    const sql = `

        INSERT INTO transacao
        (
            descricao,
            valor,
            tipo_transacao,
            categoria_gasto,
            usuario_id
        )

        VALUES (?, ?, ?, ?, ?)

    `;

    db.query(

        sql,

        [
            descricao,
            valor,
            tipo,
            categoria_gasto,
            usuario_id
        ],

        (erro) => {

            if(erro){

                console.log(erro);

                return res
                .status(500)
                .send('Erro');

            }

            res.send(
                'Transação cadastrada!'
            );

        }

    );

});
app.delete('/transacoes/:id', (req, res) => {

    const id = req.params.id;

    const sql =
    'DELETE FROM transacao WHERE id_transacao = ?';

    db.query(sql, [id], (err) => {

        if(err){

            console.log(err);

            res.status(500)
            .send('Erro ao excluir');

            return;

        }

        res.send('Transação excluída!');

    });

});
app.put('/transacoes/:id', (req, res) => {

    const { id } = req.params;

    const {

        descricao,
        valor,
        tipo,
        categoria_gasto

    } = req.body;

    const sql = `

        UPDATE transacao

        SET

            descricao = ?,
            valor = ?,
            tipo_transacao = ?,
            categoria_gasto = ?

        WHERE id_transacao = ?

    `;

    db.query(

        sql,

        [
            descricao,
            valor,
            tipo,
            categoria_gasto,
            id
        ],

        (erro) => {

            if(erro){

                console.log(erro);

                return res
                .status(500)
                .send('Erro');

            }

            res.send(
                'Transação atualizada!'
            );

        }

    );

});
