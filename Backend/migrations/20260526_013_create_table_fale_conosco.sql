-- Migration: Criar tabela mensagens (Fale Conosco)
-- Data: 2026-05-26
-- Descrição: Tabela para armazenar mensagens (Fale Conosco) do sistema

USE luminar_api;

CREATE TABLE IF NOT EXISTS fale_conosco (
    id_contato INT PRIMARY KEY AUTO_INCREMENT,
    nome_completo VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    telefone VARCHAR(20),
    mensagem TEXT NOT NULL,

    status_contato ENUM(
        'PENDENTE',
        'RESPONDIDO'
    ) NOT NULL DEFAULT 'PENDENTE',

    data_contato DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);