const connection = require('./models/db');
const util = require('util');
const express = require('express');
const app = express();
const path = require('path')
const query = util.promisify(connection.query).bind(connection);
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'reservaSalas',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.get('/salas', async (req, res) => {
    try {
        const results = await query('SELECT * FROM salas');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/salas', async (req, res) => {
    const { numero, capacidade, andar, bloco, tipo } = req.body;
    try {
        const result = await query('INSERT INTO salas (numero, capacidade, andar, bloco, tipo) VALUES (?,?,?,?,?)', [numero, capacidade, andar, bloco, tipo]);
        res.status(201).json({ id: result.insertID });
    } catch (err) {
        console.error('Erro no MySql:', err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/salas/:id', async (req, res) => {
    const { id } = req.params;
    const { numero, capacidade, andar, bloco, tipo } = req.body;
    try {
        const results = await query('UPDATE salas SET numero = ?, capacidade = ?, andar = ?, bloco = ?, tipo = ? WHERE id = ?', [numero, capacidade, andar, bloco, tipo, id]);
        res.json({ message: 'Dados atualizados com sucesso' });
    } catch (err) {
        console.error('Erro no MySql:', err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/salas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query('DELETE FROM salas WHERE id = ?', [id]);
        res.json({ message: 'Registro deletado com sucesso!' });
    } catch (err) {
        console.error('Erro no MySql:', err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/reservas', async (req, res) => {
    try {
        const results = await query('SELECT * FROM reservas');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/reservas', async (req, res) => {
    try {
        const { nomeReservante, idSala, data, horario } = req.body;

        if (!nomeReservante || !idSala || !data || !horario) {
            return res.status(400).json({ error: "Campos obrigatórios não enviados!" });
        }

        const [horaInicio, horaFim] = horario.split('-');
        if (!horaInicio || !horaFim) {
            return res.status(400).json({ error: "Formato de horário inválido!" });
        }

        const [dia, mes, ano] = data.split('/');
        const dataISO = `${ano}-${mes}-${dia}`;
        const dataInicio = `${dataISO} ${horaInicio.trim()}:00`;
        const dataFim = `${dataISO} ${horaFim.trim()}:00`;

        // --- CHECAGEM DE CONFLITO ---
        const sqlCheck = `
            SELECT * FROM reservas
            WHERE idSala = ?
            AND reservaStatus = 'ativa'
            AND (
                (dataInicio <= ? AND dataFim > ?) OR
                (dataInicio < ? AND dataFim >= ?)
            )
        `;
        const [conflitos] = await pool.query(sqlCheck, [idSala, dataInicio, dataInicio, dataFim, dataFim]);

        if (conflitos.length > 0) {
            return res.status(400).json({ error: "Essa sala já está reservada nesse horário!" });
        }

        // --- INSERE A RESERVA ---
        const reservaStatus = 'ativa';
        const sqlInsert = `INSERT INTO reservas (nomeReservante, idSala, dataInicio, dataFim, reservaStatus)
                           VALUES (?, ?, ?, ?, ?)`;
        await pool.query(sqlInsert, [nomeReservante, idSala, dataInicio, dataFim, reservaStatus]);

        res.status(201).json({ message: "Reserva criada com sucesso!" });

    } catch (err) {
        console.error("Erro no backend:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

app.put('/reservas/:id', async (req, res) => {
    const { id } = req.params;
    const { nomeReservante, idSala, dataInicio, dataFim, reservaStatus } = req.body;
    try {
        const results = await query('UPDATE reservas SET nomeReservante = ?, idSala = ?, dataInicio = ?, dataFim = ?, reservaStatus = ? WHERE id = ?', [nomeReservante, idSala, dataInicio, dataFim, reservaStatus, id]);
        res.json({ message: 'Dados atualizados com sucesso' });
    } catch (err) {
        console.error('Erro no MySql:', err);
        res.status(500).json({ error: err.message });
    }
});

app.delete('/reservas/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await query('DELETE FROM reservas WHERE id = ?', [id]);
        res.json({ message: 'Registro deletado com sucesso!' });
    } catch (err) {
        console.error('Erro no MySql:', err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/reservas/ocupados', async (req, res) => {
    const { idSala, data } = req.query;

    if (!idSala || !data) {
        return res.status(400).json({ error: 'Parâmetros idSala e data são obrigatórios' });
    }

    try {
        const queryStr = `
            SELECT dataInicio, dataFim 
            FROM reservas 
            WHERE idSala = ? 
              AND DATE(dataInicio) = ? 
              AND reservaStatus = 'confirmada'
        `;

        const reservas = await query(queryStr, [idSala, data]);
        const ocupados = reservas.map(r => {
            const inicio = new Date(r.dataInicio);
            const fim = new Date(r.dataFim);

            const formatarHora = (date) => {
                const h = date.getHours().toString().padStart(2, '0');
                const m = date.getMinutes().toString().padStart(2, '0');
                return `${h}:${m}`;
            };

            return `${formatarHora(inicio)}-${formatarHora(fim)}`;
        });

        res.json({ ocupados });
    } catch (err) {
        console.error('Erro ao buscar reservas:', err);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

app.listen(8082, () => {
    console.log(`Servidor rodando em http://localhost:8082`);
});