CREATE DATABASE reservaSalas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE reservaSalas;

CREATE TABLE salas (
    idSala INT AUTO_INCREMENT PRIMARY KEY,
    numero INT NOT NULL,
    capacidade INT NOT NULL,
    andar INT NOT NULL,
    bloco VARCHAR(3) NOT NULL,
    tipo ENUM('Sala', 'Laboratório') NOT NULL,
    UNIQUE (numero, bloco, andar) 
);

CREATE TABLE reservas (
    idReserva INT AUTO_INCREMENT PRIMARY KEY,
    nomeReservante VARCHAR(50) NOT NULL,
    idSala INT NOT NULL,
    dataInicio DATETIME NOT NULL,
    dataFim DATETIME NOT NULL,
    reservaStatus ENUM('ativa', 'cancelada', 'finalizada') DEFAULT 'ativa',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (dataFim > dataInicio),
    FOREIGN KEY (idSala) REFERENCES salas(idSala)
);

INSERT INTO salas (numero, capacidade, andar, bloco, tipo) VALUES 
(305, 20, 2, '3/C', 'Sala'),  
(306, 20, 2, '3/C', 'Laboratório'),
(307, 40, 2, '3/C', 'Laboratório');

SELECT * FROM salas;
SELECT * FROM reservas;