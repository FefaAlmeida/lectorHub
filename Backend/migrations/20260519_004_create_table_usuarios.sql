-- Migration: Criar tabela usuários
-- Data: 2026-05-19
-- Descrição: Tabela para armazenar usuários do sistema

USE luminar_api;

CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
    id_solicitacao INT,
    nome VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario ENUM(
        'CLIENTE',
        'ADMIN') NOT NULL DEFAULT 'CLIENTE',
    status_usuario ENUM(
        'ATIVO',
        'INATIVO'
    ) NOT NULL DEFAULT 'ATIVO',
    id_empresa INT NULL,

    CONSTRAINT fk_usuario_solicitacao
        FOREIGN KEY (id_solicitacao)
        REFERENCES solicitacoes_orcamentos(id_solicitacao),

    CONSTRAINT fk_usuario_empresa
        FOREIGN KEY (id_empresa)
        REFERENCES empresa_clientes(id_empresa)
);