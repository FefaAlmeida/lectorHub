-- Migration: Adicionar campos de resposta na tabela chamados
-- Data: 2026-06-02
-- Descrição: Adiciona os campos resposta_adm para armazenar o histórico de respostas do administrador.

USE luminar_api;

ALTER TABLE chamados 
ADD COLUMN resposta_admin TEXT NULL AFTER descricao;