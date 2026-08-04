-- Migration: Criar tabela chamados
-- Data: 2026-05-19
-- Descrição: Tabela para armazenar chamados do sistema

USE luminar_api;

CREATE TABLE IF NOT EXISTS chamados (
    id_chamado INT PRIMARY KEY AUTO_INCREMENT,
    id_empresa INT NOT NULL,
    id_tecnico INT,   
    tipo_chamado ENUM(
        'MANUTENCAO',
        'LIMPEZA',
        'EMERGENCIA',
        'OUTROS'
    ) NOT NULL,

    titulo VARCHAR(150) NOT NULL,
    descricao TEXT,
    prioridade ENUM(
        'BAIXA',
        'MEDIA',
        'ALTA'
    ),

    status_chamado ENUM(
        'ABERTO',
        'EM_ANDAMENTO',
        'FINALIZADO',
        'CANCELADO'
    ) NOT NULL DEFAULT 'ABERTO',

    data_abertura DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_chamado_empresa
        FOREIGN KEY (id_empresa)
        REFERENCES empresa_clientes(id_empresa),

    CONSTRAINT fk_chamado_tecnico
        FOREIGN KEY (id_tecnico)
        REFERENCES tecnicos(id_tecnico)
);