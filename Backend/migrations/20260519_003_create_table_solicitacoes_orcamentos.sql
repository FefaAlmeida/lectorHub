-- Migration: Criar tabela solicitações de orçamentos
-- Data: 2026-05-19
-- Descrição: Tabela para armazenar solicitações de orçamentos do sistema

USE luminar_api;

CREATE TABLE IF NOT EXISTS solicitacoes_orcamentos (
    id_solicitacao INT PRIMARY KEY AUTO_INCREMENT,
    nome_empresa VARCHAR(150) NOT NULL,
    nome_responsavel VARCHAR(150) NOT NULL,
    email_contato VARCHAR(150) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado CHAR(2) NOT NULL,
    quantidade_placas INT NOT NULL,
    modelo_placa ENUM(
        'CANADIAN_550W',
        'JINKO_600W',
        'TRINA_575W',
        'LONGI_650W'
    ) NOT NULL,

    potencia_estimada DECIMAL(10,2),
    economia_estimada DECIMAL(10,2),
    valor_instalacao DECIMAL(10,2),
    valor_placas DECIMAL(10,2),
    valor_total DECIMAL(10,2),

    status_solicitacao ENUM(
        'PENDENTE',
        'ACEITA',
        'RECUSADA'
    ) NOT NULL DEFAULT 'PENDENTE',

    data_solicitacao DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);



