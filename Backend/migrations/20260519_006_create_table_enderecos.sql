-- Migration: Criar tabela endereços
-- Data: 2026-05-19
-- Descrição: Tabela para armazenar endereços dos clientes do sistema

USE luminar_api;

CREATE TABLE IF NOT EXISTS enderecos (
    id_endereco INT PRIMARY KEY AUTO_INCREMENT,
    id_empresa INT NOT NULL,
    logradouro VARCHAR(150) NOT NULL,
    numero VARCHAR(10),
    bairro VARCHAR(100),
    cidade VARCHAR(100) NOT NULL,
    estado CHAR(2) NOT NULL,
    cep VARCHAR(10),
    complemento VARCHAR(100),

    CONSTRAINT fk_endereco_empresa
        FOREIGN KEY (id_empresa)
        REFERENCES empresa_clientes(id_empresa)
);