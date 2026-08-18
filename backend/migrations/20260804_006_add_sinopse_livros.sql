-- Migration: Adicionar coluna sinopse em livros
-- Data: 2026-08-04
-- Descrição: A tela de detalhes do livro exibe a sinopse, mas a coluna não
--            existia na tabela. Também preenche o catálogo de exemplo
--            inserido pela migration 005 (os UPDATEs são inofensivos se a
--            tabela estiver vazia).

USE lector_hub;

ALTER TABLE livros ADD COLUMN sinopse TEXT NULL AFTER categoria;

UPDATE livros SET sinopse = 'Em uma Oceania governada pelo Grande Irmão, Winston Smith trabalha reescrevendo o passado no Ministério da Verdade — até decidir pensar por conta própria.' WHERE titulo = '1984';
UPDATE livros SET sinopse = 'Um piloto cai no deserto do Saara e encontra um menino vindo de outro planeta. Da conversa entre os dois nasce uma das fábulas mais lidas do mundo.' WHERE titulo = 'O Pequeno Príncipe';
UPDATE livros SET sinopse = 'Bento Santiago narra sua obsessão pela vizinha Capitu e deixa ao leitor a dúvida que atravessa o livro inteiro: houve ou não traição?' WHERE titulo = 'Dom Casmurro';
UPDATE livros SET sinopse = 'Na Alemanha nazista, a menina Liesel rouba livros e aprende a ler enquanto sua família esconde um judeu no porão. Quem narra a história é a própria Morte.' WHERE titulo = 'A Menina que Roubava Livros';
UPDATE livros SET sinopse = 'Bilbo Bolseiro deixa sua confortável toca para acompanhar treze anões e o mago Gandalf numa jornada até a Montanha Solitária, guardada pelo dragão Smaug.' WHERE titulo = 'O Hobbit';
UPDATE livros SET sinopse = 'Uma breve história da humanidade, do surgimento do Homo sapiens na savana africana às revoluções cognitiva, agrícola e científica que moldaram o mundo atual.' WHERE titulo = 'Sapiens';
UPDATE livros SET sinopse = 'Os animais de uma fazenda expulsam o dono e assumem o poder prometendo igualdade — mas os porcos logo descobrem que alguns são mais iguais que os outros.' WHERE titulo = 'A Revolução dos Bichos';
UPDATE livros SET sinopse = 'Frodo Bolseiro recebe a missão de destruir o Um Anel e atravessa a Terra-média enfrentando as forças de Sauron ao lado de uma sociedade improvável.' WHERE titulo = 'O Senhor dos Anéis';
UPDATE livros SET sinopse = 'Já morto, Brás Cubas resolve contar a própria vida. O resultado é um romance irônico e digressivo que inaugurou a maturidade de Machado de Assis.' WHERE titulo = 'Memórias Póstumas de Brás Cubas';
UPDATE livros SET sinopse = 'O diário escrito por Anne Frank durante os dois anos em que sua família viveu escondida em Amsterdã, fugindo da perseguição nazista.' WHERE titulo = 'O Diário de Anne Frank';
