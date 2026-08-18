-- Migration: Popular tabela livros com dados iniciais
-- Data: 2026-08-04
-- Descrição: Catálogo de exemplo para desenvolvimento. Substitui os dados
--            que antes estavam chumbados no front (buscarLivro/page.jsx).

USE lector_hub;

INSERT INTO livros (titulo, autor, categoria, ano_publicacao, disponivel, capa_url) VALUES
  ('1984', 'George Orwell', 'Ficção', 1949, TRUE, NULL),
  ('O Pequeno Príncipe', 'Antoine de Saint-Exupéry', 'Infantil', 1943, TRUE, NULL),
  ('Dom Casmurro', 'Machado de Assis', 'Romance', 1899, TRUE, NULL),
  ('A Menina que Roubava Livros', 'Markus Zusak', 'Ficção', 2005, TRUE, NULL),
  ('O Hobbit', 'J.R.R. Tolkien', 'Fantasia', 1937, FALSE, NULL),
  ('Sapiens', 'Yuval Noah Harari', 'História', 2011, TRUE, NULL),
  ('A Revolução dos Bichos', 'George Orwell', 'Ficção', 1945, TRUE, NULL),
  ('O Senhor dos Anéis', 'J.R.R. Tolkien', 'Fantasia', 1954, TRUE, NULL),
  ('Memórias Póstumas de Brás Cubas', 'Machado de Assis', 'Romance', 1881, TRUE, NULL),
  ('O Diário de Anne Frank', 'Anne Frank', 'História', 1947, TRUE, NULL);
