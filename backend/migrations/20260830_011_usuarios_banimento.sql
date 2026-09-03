-- Migration: Banimento de usuários
-- Data: 2026-08-30
-- Descrição: Bloquear o acesso de um leitor sem apagar o cadastro. Excluir a
--            linha não serve: `emprestimos.id_usuario` é FK para `usuarios`,
--            então apagar o leitor levaria junto o histórico de empréstimos —
--            e com ele a contagem de "mais emprestados" e os registros de
--            devolução. Banir preserva tudo e só fecha a porta.
--
--            `banido_em` e `motivo` existem para o admin saber depois por que
--            a conta está bloqueada; o motivo aparece na tela de login.

USE lector_hub;

ALTER TABLE usuarios
  ADD COLUMN banido TINYINT(1) NOT NULL DEFAULT 0 AFTER tipo,
  ADD COLUMN banido_em DATETIME NULL AFTER banido,
  ADD COLUMN motivo_banimento VARCHAR(255) NULL AFTER banido_em;

-- Consulta mais comum da listagem do painel: leitores por situação.
CREATE INDEX idx_usuarios_tipo_banido ON usuarios (tipo, banido);
