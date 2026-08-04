-- Migration: Atualizar tabela solicitações orçamentos
-- Data: 2026-05-26
-- Descrição: Alteração solicitações orçamentos

USE luminar_api;

ALTER TABLE solicitacoes_orcamento
ADD COLUMN token_cadastro VARCHAR(255) NULL;