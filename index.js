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
app.use(express.static(path.join(__dirname, "src")));

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "reservaSalas",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "src", "index.html"));
});

app.get("/salas", async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM salas");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/salas", async (req, res) => {
  const { numero, capacidade, andar, bloco, tipo } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO salas (numero, capacidade, andar, bloco, tipo) VALUES (?,?,?,?,?)",
      [numero, capacidade, andar, bloco, tipo]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error("Erro no MySQL:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/reservas", async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM reservas");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/reservas", async (req, res) => {
  try {
    const { nomeReservante, idSala, data, horario } = req.body;
    if (!nomeReservante || !idSala || !data || !horario) {
      return res
        .status(400)
        .json({ error: "Campos obrigatórios não enviados!" });
    }

    const [horaInicio, horaFim] = horario.split("-");
    const [dia, mes, ano] = data.split("/");
    const dataISO = `${ano}-${mes}-${dia}`;
    const dataInicio = `${dataISO} ${horaInicio.trim()}:00`;
    const dataFim = `${dataISO} ${horaFim.trim()}:00`;

    const sqlCheck = `
      SELECT * FROM reservas
      WHERE idSala = ? AND reservaStatus = 'ativa'
        AND ((dataInicio <= ? AND dataFim > ?) OR (dataInicio < ? AND dataFim >= ?))
    `;
    const [conflitos] = await pool.query(sqlCheck, [
      idSala,
      dataInicio,
      dataInicio,
      dataFim,
      dataFim,
    ]);
    if (conflitos.length > 0) {
      return res
        .status(400)
        .json({ error: "Essa sala já está reservada nesse horário!" });
    }

    const reservaStatus = "ativa";
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
  
      if (rows.length === 0)
        return res.status(404).send("Nenhuma reserva encontrada.");
  
      const doc = new PDFDocument({ margin: 40, size: "A4" });
      const filePath = path.join(process.cwd(), "relatorio_reservas.pdf");
      const writeStream = fs.createWriteStream(filePath);
      doc.pipe(writeStream);
  
      // Cabeçalho
      doc
        .fillColor("#003366")
        .fontSize(24)
        .text("Relatório de Reservas", { align: "center" })
        .moveDown(0.5);
  
      doc
        .fillColor("#000000")
        .fontSize(12)
        .text(`Data de geração: ${new Date().toLocaleString()}`, {
          align: "center",
        })
        .moveDown(1);
  
      // Config da tabela
      const tableTop = doc.y;
      const itemHeight = 35;
      const columnWidths = [50, 150, 50, 130, 130, 80];
  
      const totalTableWidth = columnWidths.reduce((a, b) => a + b, 0);
      const pageWidth =
        doc.page.width - doc.page.margins.left - doc.page.margins.right;
      const tableX =
        doc.page.margins.left + (pageWidth - totalTableWidth) / 2; // Centraliza a tabela
  
      const headers = ["ID", "Reservante", "Sala", "Início", "Fim", "Status"];
      doc.fillColor("#FFFFFF").font("Helvetica-Bold").fontSize(12);
  
      // Cabeçalhos
      let x = tableX;
      headers.forEach((header, i) => {
        doc
          .rect(x, tableTop, columnWidths[i], itemHeight)
          .fill("#003366")
          .fillColor("#FFFFFF")
          .text(header, x + 5, tableTop + 10, {
            width: columnWidths[i] - 10,
            align: "left",
          });
        x += columnWidths[i];
      });
  
      // Linhas da tabela
      let y = tableTop + itemHeight;
      doc.font("Helvetica").fontSize(11).fillColor("#000000");
  
      rows.forEach((r, index) => {
        x = tableX;
        const rowColor = index % 2 === 0 ? "#f2f2f2" : "#ffffff";
        const rowData = [
          r.idreserva,
          r.nomeReservante,
          r.idSala,
          new Date(r.dataInicio).toLocaleString(),
          new Date(r.dataFim).toLocaleString(),
          r.reservaStatus,
        ];
  
        rowData.forEach((text, i) => {
          doc.rect(x, y, columnWidths[i], itemHeight).fill(rowColor);
          doc.fillColor("#000000").text(text, x + 5, y + 10, {
            width: columnWidths[i] - 10,
            align: "left",
          });
          x += columnWidths[i];
        });
  
        y += itemHeight;
  
        // Quebra automática de página
        if (y > 750) {
          doc.addPage();
          y = 60;
        }
      });
  
      // Linha separadora opcional
      doc
        .moveTo(tableX, y + 10)
        .lineTo(tableX + totalTableWidth, y + 10)
        .strokeColor("#999999")
        .lineWidth(0.5)
        .stroke();
  
      // Rodapé
      y += 25; // espaço abaixo da tabela
      doc
        .fontSize(10)
        .fillColor("#666666")
        .text(`Total de reservas: ${rows.length}`, tableX, y, {
          width: totalTableWidth,
          align: "center",
        });
  
      // Finaliza PDF
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

app.get("/reservas/ocupadas/:idSala/:data", async (req, res) => {
  try {
    const { idSala, data } = req.params;
    const [dia, mes, ano] = data.split("-");
    const dataISO = `${ano}-${mes}-${dia}`;

    const sql = `
        SELECT dataInicio, dataFim FROM reservas
        WHERE idSala = ? AND reservaStatus = 'ativa'
        AND DATE(dataInicio) = ?
      `;
    const [rows] = await pool.query(sql, [idSala, dataISO]);

    const horariosOcupados = rows.map((r) => {
      const horaInicio = new Date(r.dataInicio).toTimeString().slice(0, 5);
      const horaFim = new Date(r.dataFim).toTimeString().slice(0, 5);
      return `${horaInicio}-${horaFim}`;
    });

    res.json(horariosOcupados);
  } catch (err) {
    console.error("Erro ao buscar horários ocupados:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

app.listen(8082, () => {
  console.log("Servidor rodando em http://localhost:8082");
});