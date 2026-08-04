-- Migration: Criar tabela alertas
-- Data: 2026-05-19
-- Descrição: Tabela para armazenar alertas do sistema

USE luminar_api;

CREATE TABLE IF NOT EXISTS alertas (
    id_alerta INT PRIMARY KEY AUTO_INCREMENT,
    id_monitoramento INT NOT NULL,
    tipo_alerta ENUM(
        'QUEDA_EFICIENCIA',
        'TEMPERATURA_ALTA',
        'FALHA_GERACAO',
        'PLACA_INATIVA'
    ) NOT NULL,
    descricao TEXT,
    nivel ENUM(
        'BAIXO',
        'MEDIO',
        'ALTO',
        'CRITICO'
    ) NOT NULL,

    status_alerta ENUM(
        'ATIVO',
        'RESOLVIDO'
    ) NOT NULL DEFAULT 'ATIVO',

    data_alerta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_alerta_monitoramento
        FOREIGN KEY (id_monitoramento)
        REFERENCES monitoramentos(id_monitoramento)
);