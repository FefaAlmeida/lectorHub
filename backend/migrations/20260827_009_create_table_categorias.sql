-- Migration: Criar tabela categorias
-- Data: 2026-08-27
-- Descrição: A categoria era um VARCHAR solto em `livros`, o que permitia
--            "Ficção", "ficção" e "Ficcao" como coisas diferentes e impedia
--            renomear uma categoria sem varrer a tabela toda.
--            Aqui ela vira entidade própria; a migration 010 liga os livros.
--
-- A lista inicial de categorias NÃO fica aqui: é carga de dados, e neste
-- projeto isso mora em scripts/ (ver `npm run seed:categorias`).

USE lector_hub;

CREATE TABLE IF NOT EXISTS categorias (
  id_categoria INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(50) NOT NULL,
  descricao VARCHAR(255) NULL,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  -- Nome único: a collation padrão da coluna é case-insensitive, então
  -- "Romance" e "romance" colidem, que é exatamente o que queremos.
  UNIQUE KEY categoria_nome_unica (nome)
);
