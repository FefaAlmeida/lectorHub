-- Migration: Criar tabela usuários
-- Data: 2026-08-04
-- Descrição: Tabela para armazenar dados dos usuários do sistema

USE lector_hub;

CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  telefone VARCHAR(20) NULL,                      
  tipo ENUM('admin', 'cliente') DEFAULT 'cliente'

 );





