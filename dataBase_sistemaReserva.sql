CREATE DATABASE reservaSalas CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE reservaSalas;

CREATE TABLE salasLabs(
	idSalasLabs INT AUTO_INCREMENT PRIMARY KEY,
	numero INT,
    capacidade INT NOT NULL,
    andar INT NOT NULL,
    bloco VARCHAR(3) NOT NULL,
    tipo VARCHAR(15) NOT NULL
);

CREATE TABLE  reservas(
	idReservas INT AUTO_INCREMENT PRIMARY KEY,
    nomeReservante VARCHAR(50) NOT NULL,
    idSalasLabs INT NOT NULL,
    dataInicio DATETIME NOT NULL,
    dataFim DATETIME NOT NULL,
    reservaStatus ENUM('ativa', 'cancelada', 'finalizada') DEFAULT 'ativa',
    FOREIGN KEY (idSalasLabs) REFERENCES salasLabs(idSalasLabs)
);

INSERT INTO	salasLabs(numero, capacidade, andar, bloco, tipo) VALUES 
(305, 20, 2, "3/C", "Sala"),  
(306, 20, 2, "3/C", "Laboratório"),
(307, 40, 2, "3/C", "Laboratório"),
(308, 25, 2, "3/C", "Sala"),
(309, 35, 2, "3/C", "Sala"),
(310, 45, 2, "3/C", "Sala");

/*DELETE FROM salas WHERE numero = 307;*/

/*SELECT * FROM salasLabs;
SELECT * FROM reservas;*/

/*DROP TABLE salasLabs;
DROP TABLE reservas;
DROP SCHEMA reservaSalas;*/