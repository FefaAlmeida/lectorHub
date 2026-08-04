-- Migration: Criar tabela monitoramentos
-- Data: 2026-05-19
-- Descrição: Tabela para armazenar monitoramentos do sistema

USE luminar_api;

CREATE TABLE IF NOT EXISTS monitoramentos (
    id_monitoramento INT PRIMARY KEY AUTO_INCREMENT,
    id_placa INT NOT NULL,
    energia_gerada DECIMAL(10,2),
    eficiencia DECIMAL(5,2),
    temperatura DECIMAL(5,2),
    data_hora DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_monitoramento_placa
        FOREIGN KEY (id_placa)
        REFERENCES placas_solares(id_placa)
);
