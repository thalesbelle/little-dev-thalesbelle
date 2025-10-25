import express from "express";
import path from "path";
import fs from "fs";
import PDFDocument from "pdfkit";
import mysql from "mysql2/promise";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src')));

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '01011976',
    database: 'reservaSalas',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.get('/salas', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM salas');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/salas', async (req, res) => {
    const { numero, capacidade, andar, bloco, tipo } = req.body;
    try {
        const [result] = await pool.query(
            'INSERT INTO salas (numero, capacidade, andar, bloco, tipo) VALUES (?,?,?,?,?)',
            [numero, capacidade, andar, bloco, tipo]
        );
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        console.error('Erro no MySQL:', err);
        res.status(500).json({ error: err.message });
    }
});

app.get('/reservas', async (req, res) => {
    try {
        const [results] = await pool.query('SELECT * FROM reservas');
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
        const [dia, mes, ano] = data.split('/');
        const dataISO = `${ano}-${mes}-${dia}`;
        const dataInicio = `${dataISO} ${horaInicio.trim()}:00`;
        const dataFim = `${dataISO} ${horaFim.trim()}:00`;

        const sqlCheck = `
      SELECT * FROM reservas
      WHERE idSala = ? AND reservaStatus = 'ativa'
        AND ((dataInicio <= ? AND dataFim > ?) OR (dataInicio < ? AND dataFim >= ?))
    `;
        const [conflitos] = await pool.query(sqlCheck, [idSala, dataInicio, dataInicio, dataFim, dataFim]);
        if (conflitos.length > 0) {
            return res.status(400).json({ error: "Essa sala já está reservada nesse horário!" });
        }

        const reservaStatus = 'ativa';
        await pool.query(
            `INSERT INTO reservas (nomeReservante, idSala, dataInicio, dataFim, reservaStatus)
       VALUES (?, ?, ?, ?, ?)`,
            [nomeReservante, idSala, dataInicio, dataFim, reservaStatus]
        );

        res.status(201).json({ message: "Reserva criada com sucesso!" });
    } catch (err) {
        console.error("Erro no backend:", err);
        res.status(500).json({ error: "Erro interno do servidor" });
    }
});

app.get("/relatorio-reservas", async (req, res) => {
    try {
        const [rows] = await pool.query(`
      SELECT idreserva, nomeReservante, idSala, dataInicio, dataFim, reservaStatus
      FROM reservas
    `);

        if (rows.length === 0) return res.status(404).send("Nenhuma reserva encontrada.");

        const doc = new PDFDocument({ margin: 40, size: "A4" });
        const filePath = path.join(process.cwd(), "relatorio_reservas.pdf");
        const writeStream = fs.createWriteStream(filePath);
        doc.pipe(writeStream);

        // --- Cabeçalho ---
        doc
            .fillColor("#003366")
            .fontSize(24)
            .text("Relatório de Reservas", { align: "center" })
            .moveDown(0.5);

        doc
            .fillColor("#000000")
            .fontSize(12)
            .text(`Data de geração: ${new Date().toLocaleString()}`, { align: "center" })
            .moveDown(1);

        // --- Tabela ---
        const tableTop = doc.y;
        const itemHeight = 20;
        const columnWidths = [50, 150, 50, 100, 100, 80]; // ajuste das colunas

        // Cabeçalho da tabela
        const headers = ["ID", "Reservante", "Sala", "Início", "Fim", "Status"];
        doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(12);

        let x = 40;
        headers.forEach((header, i) => {
            doc
                .rect(x, tableTop, columnWidths[i], itemHeight)
                .fill("#003366")
                .fillColor("#FFFFFF")
                .text(header, x + 5, tableTop + 5, { width: columnWidths[i] - 10, align: "left" });
            x += columnWidths[i];
        });

        // Linhas da tabela
        let y = tableTop + itemHeight;
        doc.font("Helvetica").fontSize(11).fillColor("#000000");

        rows.forEach((r, index) => {
            x = 40;
            const rowColor = index % 2 === 0 ? "#f2f2f2" : "#ffffff"; // linhas alternadas
            headers.forEach((col, i) => {
                let text = "";
                switch (i) {
                    case 0: text = r.idreserva; break;
                    case 1: text = r.nomeReservante; break;
                    case 2: text = r.idSala; break;
                    case 3: text = new Date(r.dataInicio).toLocaleString(); break;
                    case 4: text = new Date(r.dataFim).toLocaleString(); break;
                    case 5: text = r.status; break;
                }
                doc.rect(x, y, columnWidths[i], itemHeight).fill(rowColor);
                doc.fillColor("#000000").text(text, x + 5, y + 5, { width: columnWidths[i] - 10, align: "left" });
                x += columnWidths[i];
            });
            y += itemHeight;
        });

        // --- Rodapé ---
        doc
            .fontSize(10)
            .fillColor("#666666")
            .text(`Total de reservas: ${rows.length}`, 40, y + 20, { align: "left" });

        doc.end();

        writeStream.on("finish", () => {
            res.download(filePath, "relatorio_reservas.pdf", (err) => {
                if (err) console.error(err);
                fs.unlinkSync(filePath);
            });
        });

    } catch (error) {
        console.error("Erro ao gerar PDF:", error);
        res.status(500).send("Erro ao gerar relatório em PDF");
    }
});

app.listen(8082, () => {
    console.log("Servidor rodando em http://localhost:8082");
});