-- Migration: Criar tabela livros
-- Data: 2026-08-04
-- Descrição: Tabela para armazenar dados dos livros do sistema

USE lector_hub;

CREATE TABLE IF NOT EXISTS livros (
  id_livro INT PRIMARY KEY AUTO_INCREMENT,
  titulo VARCHAR(150) NOT NULL,
  autor VARCHAR(100) NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  ano_publicacao INT NOT NULL,
  disponivel BOOLEAN DEFAULT TRUE,
  capa_url VARCHAR(255) NULL                      -- Opcional: Imagem da capa
);