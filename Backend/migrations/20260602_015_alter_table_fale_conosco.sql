-- Migration: Adicionar campos de resposta na tabela fale_conosco
-- Data: 2026-06-02
-- Descrição: Adiciona os campos resposta_adm e data_resposta para armazenar o histórico de respostas do administrador.

USE luminar_api;

ALTER TABLE fale_conosco 
ADD COLUMN resposta_adm TEXT,
ADD COLUMN data_resposta DATETIME;