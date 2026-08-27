-- Migration: capas dos livros do seed
-- Data: 2026-08-27
-- Descrição: A migration 005 inseriu os livros com capa_url NULL. Aqui as capas
--            vêm do Open Library (por ISBN) — gratuito e sem hotlink de loja.
--            Os UPDATEs são inofensivos se o título não existir.

USE lector_hub;

UPDATE livros SET capa_url = 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg' WHERE titulo = '1984' AND capa_url IS NULL;
UPDATE livros SET capa_url = 'https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg' WHERE titulo = 'O Hobbit' AND capa_url IS NULL;
UPDATE livros SET capa_url = 'https://covers.openlibrary.org/b/isbn/9780156012195-L.jpg' WHERE titulo = 'O Pequeno Príncipe' AND capa_url IS NULL;
UPDATE livros SET capa_url = 'https://covers.openlibrary.org/b/isbn/9780195103090-L.jpg' WHERE titulo = 'Dom Casmurro' AND capa_url IS NULL;
UPDATE livros SET capa_url = 'https://covers.openlibrary.org/b/isbn/9780375842207-L.jpg' WHERE titulo = 'A Menina que Roubava Livros' AND capa_url IS NULL;
UPDATE livros SET capa_url = 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg' WHERE titulo = 'Sapiens' AND capa_url IS NULL;
UPDATE livros SET capa_url = 'https://covers.openlibrary.org/b/isbn/9780451526342-L.jpg' WHERE titulo = 'A Revolução dos Bichos' AND capa_url IS NULL;
UPDATE livros SET capa_url = 'https://covers.openlibrary.org/b/isbn/9780618640157-L.jpg' WHERE titulo = 'O Senhor dos Anéis' AND capa_url IS NULL;
UPDATE livros SET capa_url = 'https://covers.openlibrary.org/b/isbn/9780195101706-L.jpg' WHERE titulo = 'Memórias Póstumas de Brás Cubas' AND capa_url IS NULL;
UPDATE livros SET capa_url = 'https://covers.openlibrary.org/b/isbn/9780553296983-L.jpg' WHERE titulo = 'O Diário de Anne Frank' AND capa_url IS NULL;
