-- Migration: Criar tabela instalações
-- Data: 2026-05-19
-- Descrição: Tabela para armazenar instalações do sistema

USE luminar_api;

CREATE TABLE IF NOT EXISTS instalacoes (
    id_instalacao INT PRIMARY KEY AUTO_INCREMENT,
    id_empresa INT NOT NULL,
    id_tecnico INT,
    id_endereco INT NOT NULL,
    data_instalacao DATE,
    status_instalacao ENUM(
        'PENDENTE',
        'EM_ANDAMENTO',
        'FINALIZADA',
        'CANCELADA'
    ) NOT NULL DEFAULT 'PENDENTE',


    CONSTRAINT fk_instalacao_empresa
        FOREIGN KEY (id_empresa)
        REFERENCES empresa_clientes(id_empresa),

    CONSTRAINT fk_instalacao_tecnico
        FOREIGN KEY (id_tecnico)
        REFERENCES tecnicos(id_tecnico),

    CONSTRAINT fk_instalacao_endereco
        FOREIGN KEY (id_endereco)
        REFERENCES enderecos(id_endereco)
);
