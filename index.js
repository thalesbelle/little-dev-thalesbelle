const connection = require ('./models/db');
const util = require('util');
const express = require('express');
const app = express();
const path = require('path')
const query = util.promisify(connection.query).bind(connection);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'src')));

app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.get('/salasLabs', async (req,res) => {
    try{
        const results = await query('SELECT * FROM produtos');
        res.json(results);
    }catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/salasLabs', async (req,res) => {
    const{numero, capacidade, andar, bloco, tipo} = req.body;
    try{
        const result = await query('INSERT INTO produtos (numero, capacidade, andar, bloco, tipo) VALUES (?,?,?,?,?)', [numero, capacidade, andar, bloco, tipo]);
        res.status(201).json({id: result.insertID});
    } catch(err) {
        console.error('Erro no MySql:', err);
        res.status(500).json({error: err.message});
    }
});

app.put('/salasLabs/:id', async (req,res) => {
    const {id} = req.params;
    const {numero, capacidade, andar, bloco, tipo} = req.body;
    try{
        const results = await query('UPDATE salasLabs SET numero = ?, capacidade = ?, andar = ?, bloco = ?, tipo = ? WHERE id = ?', [numero, capacidade, andar, bloco, tipo, id]);
        res.json({message: 'Dados atualizados com sucesso'});
    } catch(err){
        console.error('Erro no MySql:', err);
        res.status(500).json({error: err.message});
    }
});

app.delete('/salasLabs/:id', async (req,res) => {
    const {id} = req.params;
    try{
    const result = await query('DELETE FROM salasLabs WHERE id = ?', [id]);
    res.json({message: 'Registro deletado com sucesso!'});
    } catch(err) {
        console.error('Erro no MySql:', err);
        res.status(500).json({error: err.message});
    }
});

app.listen(8082, () => {
  console.log('Servidor rodando em http://localhost:${8082}`');
});