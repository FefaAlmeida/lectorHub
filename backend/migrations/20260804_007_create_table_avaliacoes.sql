-- Migration: Criar tabela avaliações
-- Data: 2026-08-04
-- Descrição: Nota (1 a 5) e comentário que um usuário deixa em um livro.
--            A UNIQUE KEY garante uma avaliação por usuário por livro —
--            avaliar de novo atualiza a anterior em vez de duplicar.

USE lector_hub;

CREATE TABLE IF NOT EXISTS avaliacoes (
  id_avaliacao INT PRIMARY KEY AUTO_INCREMENT,
  id_livro INT NOT NULL,
  id_usuario INT NOT NULL,
  nota TINYINT NOT NULL,
  comentario TEXT NULL,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY avaliacao_unica_por_usuario (id_livro, id_usuario),
  CONSTRAINT nota_entre_1_e_5 CHECK (nota BETWEEN 1 AND 5),
  FOREIGN KEY (id_livro) REFERENCES livros(id_livro) ON DELETE CASCADE,
  FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
);
