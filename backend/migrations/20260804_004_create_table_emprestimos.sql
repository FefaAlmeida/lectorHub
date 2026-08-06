-- Migration: Criar tabela empréstimos
-- Data: 2026-05-19
-- Descrição: Tabela para armazenar usuários do sistema

USE lector_hub;

CREATE TABLE IF NOT EXISTS emprestimos (
     id_emprestimo INT PRIMARY KEY AUTO_INCREMENT,
  id_livro INT NOT NULL,
  id_usuario INT NOT NULL,
  data_solicitacao DATETIME DEFAULT CURRENT_TIMESTAMP,
  data_emprestimo DATETIME NULL,
  data_devolucao_prevista DATETIME NULL,
  data_devolucao_real DATETIME NULL,
  status ENUM('PENDENTE', 'EMPRESTADO', 'DEVOLVIDO', 'RECUSADO', 'CANCELADO') DEFAULT 'PENDENTE',
  FOREIGN KEY (id_livro) REFERENCES livros(id_livro) ON DELETE CASCADE,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);
