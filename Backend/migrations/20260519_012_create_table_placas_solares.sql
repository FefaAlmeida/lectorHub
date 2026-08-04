-- Migration: Criar tabela placas solares
-- Data: 2026-05-19
-- Descrição: Tabela para armazenar placas solares do sistema

USE luminar_api;

CREATE TABLE IF NOT EXISTS placas_solares (
    id_placa INT PRIMARY KEY AUTO_INCREMENT,
    id_empresa INT NOT NULL,
    id_instalacao INT NOT NULL,
    modelo ENUM(
        'CANADIAN_550W',
        'JINKO_600W',
        'TRINA_575W',
        'LONGI_650W'
    ) NOT NULL,
    potencia_watts DECIMAL(10,2) NOT NULL,
    status_placa ENUM(
        'ATIVA',
        'INATIVA',
        'MANUTENCAO'
    ) NOT NULL DEFAULT 'INATIVA',
    data_instalacao DATE,

    CONSTRAINT fk_placa_empresa
        FOREIGN KEY (id_empresa)
        REFERENCES empresa_clientes(id_empresa),

    CONSTRAINT fk_placa_instalacao
        FOREIGN KEY (id_instalacao)
        REFERENCES instalacoes(id_instalacao)
);
