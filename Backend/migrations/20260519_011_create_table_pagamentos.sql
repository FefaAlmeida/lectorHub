-- Migration: Criar tabela pagamentos
-- Data: 2026-05-19
-- Descrição: Tabela para armazenar pagamentos do sistema

USE luminar_api;

CREATE TABLE IF NOT EXISTS pagamentos (
    id_pagamento INT PRIMARY KEY AUTO_INCREMENT,
    id_empresa INT NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    tipo_pagamento ENUM(
        'INSTALACAO',
        'PLACAS'
    ) NOT NULL,

    numero_parcela INT,
    quantidade_parcelas INT,
    
    status_pagamento ENUM(
        'PENDENTE',
        'PAGO',
        'ATRASADO'
    ) NOT NULL DEFAULT 'PENDENTE',

    forma_pagamento ENUM(
        'BOLETO',
        'PIX',
        'CARTAO'
    ) NOT NULL,

    data_vencimento DATE NOT NULL,
    data_pagamento DATE,

    CONSTRAINT fk_pagamento_empresa
        FOREIGN KEY (id_empresa)
        REFERENCES empresa_clientes(id_empresa)
);
