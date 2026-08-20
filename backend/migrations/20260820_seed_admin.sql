-- Migration: inserir admin na tabela de usuarios
-- Data: 2026-08-20
-- Descrição: Criação do admin

INSERT IGNORE INTO usuarios (nome, email, senha, telefone, tipo) 
VALUES (
    'Administrador', 
    'admin@lectorhub.com', 
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    NULL, 
    'admin'
);
