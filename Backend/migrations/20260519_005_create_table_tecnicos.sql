-- Migration: Criar tabela técnicos
-- Data: 2026-05-19
-- Descrição: Tabela para armazenar técnicos do sistema

USE luminar_api;

CREATE TABLE IF NOT EXISTS tecnicos (
    id_tecnico INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(150) NOT NULL,
    telefone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(150) NOT NULL UNIQUE,
    status_tecnico ENUM(
        'ATIVO',
        'INATIVO'
    ) NOT NULL DEFAULT 'ATIVO'
);
