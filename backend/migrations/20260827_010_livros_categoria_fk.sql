-- Migration: Trocar livros.categoria (texto) por livros.categoria_id (FK)
-- Data: 2026-08-27
-- Descrição: Depende da 009. A coluna nova é criada aceitando NULL só para o
--            backfill; ao final vira NOT NULL, ganha a FK e a coluna de texto
--            é removida.
--
-- Os INSERTs abaixo não são carga inicial (essa é o `npm run seed:categorias`):
-- são derivados do que já existe em `livros`, e sem eles a conversão perderia
-- a categoria dos livros cadastrados. Por isso a migration é autossuficiente e
-- roda independentemente de o seed ter sido executado.
--
-- ATENÇÃO: rode a 009 antes desta.

USE lector_hub;

-- 1. Toda categoria já usada em `livros` precisa existir como registro.
INSERT IGNORE INTO categorias (nome)
SELECT DISTINCT TRIM(categoria)
FROM livros
WHERE categoria IS NOT NULL AND TRIM(categoria) <> '';

-- 2. "Geral" só nasce se houver livro sem categoria para acolher.
INSERT IGNORE INTO categorias (nome, descricao)
SELECT 'Geral', 'Sem categoria específica'
FROM DUAL
WHERE EXISTS (
  SELECT 1 FROM livros WHERE categoria IS NULL OR TRIM(categoria) = ''
);

-- 3. Coluna nova, ainda sem restrição, para poder preencher.
ALTER TABLE livros ADD COLUMN categoria_id INT NULL AFTER autor;

-- 4. Backfill pelo nome.
UPDATE livros l
  JOIN categorias c ON c.nome = TRIM(l.categoria)
SET l.categoria_id = c.id_categoria;

-- 5. Sobra: livro com categoria vazia cai em "Geral".
UPDATE livros
SET categoria_id = (SELECT id_categoria FROM categorias WHERE nome = 'Geral')
WHERE categoria_id IS NULL;

-- 6. Agora sim: obrigatória, indexada e com integridade referencial.
ALTER TABLE livros MODIFY COLUMN categoria_id INT NOT NULL;

ALTER TABLE livros
  ADD CONSTRAINT fk_livros_categoria
  FOREIGN KEY (categoria_id) REFERENCES categorias(id_categoria)
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

-- 7. O texto duplicado sai de cena.
ALTER TABLE livros DROP COLUMN categoria;
