-- Migration: Criar tabela empresa_clientes
-- Data: 2026-05-19
-- Descrição: Tabela para armazenar clientes (empresas) do sistema

USE luminar_api;

CREATE TABLE IF NOT EXISTS empresa_clientes (
    id_empresa INT PRIMARY KEY AUTO_INCREMENT,
    nome_empresa VARCHAR(150) NOT NULL,
    cnpj VARCHAR(18) NOT NULL UNIQUE,
    telefone_principal VARCHAR(20) NOT NULL UNIQUE,
    email_principal VARCHAR(150) NOT NULL UNIQUE,
    
    status_empresa ENUM(
        'ATIVA',
        'INATIVA'
    ) NOT NULL DEFAULT 'ATIVA'
    
); 