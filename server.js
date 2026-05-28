const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

/* =====================
   USUÁRIOS
===================== */

app.get('/usuarios', (req, res) => {
    db.query('SELECT * FROM usuarios', (err, result) => {
        if (err) return res.status(500).send('Erro');
        res.json(result);
    });
});

app.post('/usuarios', (req, res) => {

    const { nome, email, senha } = req.body;

    db.query(
        'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)',
        [nome, email, senha],
        (err) => {
            if (err) return res.status(500).send('Erro');
            res.send('Usuário cadastrado!');
        }
    );
});

/* 🔥 DELETE USUÁRIO (COM CASCATA MANUAL) */
app.delete('/usuarios/:id', (req, res) => {

    const id = req.params.id;

    db.query(
        'DELETE FROM usuarios WHERE id = ?',
        [id],
        (err) => {

            if (err) {
                console.log(err);
                return res.status(500).send('Erro ao excluir usuário');
            }

            res.json({
                sucesso: true,
                mensagem: 'Conta excluída com sucesso'
            });

        }
    );

});
/* LOGIN */
app.post('/login', (req, res) => {

    const { email, senha } = req.body;

    db.query(
        'SELECT * FROM usuarios WHERE email = ? AND senha = ?',
        [email, senha],
        (err, result) => {

            if (err) return res.status(500).send('Erro');

            if (result.length > 0) {
                res.json({
                    sucesso: true,
                    mensagem: 'Login ok',
                    usuario: result[0]
                });
            } else {
                res.json({
                    sucesso: false,
                    mensagem: 'Credenciais inválidas'
                });
            }
        }
    );
});

/* =====================
   TRANSAÇÕES
===================== */

app.get('/transacoes', (req, res) => {

    const usuario_id = req.query.usuario_id;

    db.query(
        'SELECT * FROM transacao WHERE usuario_id = ?',
        [usuario_id],
        (err, result) => {
            if (err) return res.status(500).send('Erro');
            res.json(result);
        }
    );
});

app.post('/transacoes', (req, res) => {

    const {
        descricao,
        valor,
        tipo,
        categoria_gasto,
        usuario_id
    } = req.body;

    db.query(
        `INSERT INTO transacao 
        (descricao, valor, tipo_transacao, categoria_gasto, usuario_id)
        VALUES (?, ?, ?, ?, ?)`,
        [descricao, valor, tipo, categoria_gasto, usuario_id],
        (err) => {
            if (err) return res.status(500).send('Erro');
            res.send('Transação criada!');
        }
    );
});

app.delete('/transacoes/:id', (req, res) => {

    db.query(
        'DELETE FROM transacao WHERE id_transacao = ?',
        [req.params.id],
        (err) => {
            if (err) return res.status(500).send('Erro');
            res.send('Transação deletada');
        }
    );
});

app.put('/transacoes/:id', (req, res) => {

    const { descricao, valor, tipo, categoria_gasto } = req.body;

    db.query(
        `UPDATE transacao 
        SET descricao=?, valor=?, tipo_transacao=?, categoria_gasto=? 
        WHERE id_transacao=?`,
        [descricao, valor, tipo, categoria_gasto, req.params.id],
        (err) => {
            if (err) return res.status(500).send('Erro');
            res.send('Atualizado!');
        }
    );
});

/* =====================
   METAS
===================== */

app.get('/metas', (req, res) => {

    db.query(
        'SELECT * FROM planejamento_financeiro WHERE usuario_id = ?',
        [req.query.usuario_id],
        (err, result) => {
            if (err) return res.status(500).send('Erro');
            res.json(result);
        }
    );
});

app.post('/metas', (req, res) => {

    const { nome, valor_meta, data_fim, usuario_id } = req.body;

    db.query(
        `INSERT INTO planejamento_financeiro 
        (nome, valor_meta, data_fim, usuario_id)
        VALUES (?, ?, ?, ?)`,
        [nome, valor_meta, data_fim, usuario_id],
        (err) => {
            if (err) return res.status(500).send('Erro');
            res.send('Meta criada!');
        }
    );
});

app.put('/metas/:id', (req, res) => {

    const { nome, valor_meta, data_fim } = req.body;

    db.query(
        `UPDATE planejamento_financeiro 
        SET nome=?, valor_meta=?, data_fim=? 
        WHERE id=?`,
        [nome, valor_meta, data_fim, req.params.id],
        (err) => {
            if (err) return res.status(500).send('Erro');
            res.send('Meta atualizada!');
        }
    );
});

app.delete('/metas/:id', (req, res) => {

    db.query(
        'DELETE FROM planejamento_financeiro WHERE id = ?',
        [req.params.id],
        (err) => {
            if (err) return res.status(500).send('Erro');
            res.send('Meta deletada');
        }
    );
});

/* ===================== */

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
app.put('/usuarios/:id', (req, res) => {

    const id = req.params.id;

    const {
        nome,
        email,
        senha,
        limite_gastos
    } = req.body;

    const sql = `
        UPDATE usuarios
        SET nome = ?, email = ?, senha = ?, limite_gastos = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [nome, email, senha, limite_gastos, id],
        (err) => {

            if (err) {
                console.log(err);
                return res.status(500).send('Erro ao atualizar usuário');
            }

            res.send('Usuário atualizado!');
        }
    );
});
