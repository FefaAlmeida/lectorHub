import { getConnection } from '../config/database.js';

class FinanceiroClienteModel {

    // 1. Busca o orçamento aprovado pelo id_solicitacao (que veio da tabela usuarios)
    static async obterOrcamentoAprovado(id_solicitacao) {
        const db = await getConnection();
        try {
            const query = `
                SELECT valor_total 
                FROM solicitacoes_orcamentos 
                WHERE id_solicitacao = ? AND status_solicitacao = 'ACEITA' 
                LIMIT 1
            `;
            const [rows] = await db.execute(query, [id_solicitacao]);
            return rows[0];
        } finally {
            db.release();
        }
    }

    // 2. Verifica se a empresa já possui parcelas geradas na tabela pagamentos
    static async verificarSeJaTemParcelas(id_empresa) {
        const db = await getConnection();
        try {
            const query = `SELECT COUNT(*) as total FROM pagamentos WHERE id_empresa = ?`;
            const [rows] = await db.execute(query, [id_empresa]);
            return rows[0].total > 0;
        } finally {
            db.release();
        }
    }

    // 3. Insere as parcelas na tabela pagamentos referenciando o id_empresa
    static async gerarParcelas(id_empresa, parcelas) {
        const db = await getConnection();
        try {
            const query = `
                INSERT INTO pagamentos 
                (id_empresa, valor, tipo_pagamento, numero_parcela, quantidade_parcelas, status_pagamento, forma_pagamento, data_vencimento)
                VALUES ?
            `;
            const valores = parcelas.map(p => [
                id_empresa, p.valor, p.tipo_pagamento, p.numero_parcela, p.quantidade_parcelas, 'PENDENTE', p.forma_pagamento, p.data_vencimento
            ]);

            await db.query(query, [valores]);
        } finally {
            db.release();
        }
    }

    // 4. Listagem por id_empresa
    static async listarPorEmpresa({ id_empresa, limite, offset, status }) {
        const db = await getConnection();
        try {
            let query = `SELECT * FROM pagamentos WHERE id_empresa = ?`;
            const params = [id_empresa];

            if (status) {
                query += ` AND status_pagamento = ?`;
                params.push(status);
            }

            query += ` ORDER BY data_vencimento ASC LIMIT ? OFFSET ?`;
            params.push(Number(limite), Number(offset));

            const [pagamentos] = await db.execute(query, params);

            let countQuery = `SELECT COUNT(*) as total FROM pagamentos WHERE id_empresa = ?`;
            const countParams = [id_empresa];
            if (status) {
                countQuery += ` AND status_pagamento = ?`;
                countParams.push(status);
            }
            const [countRows] = await db.execute(countQuery, countParams);

            return { pagamentos, total: countRows[0].total };
        } finally {
            db.release();
        }
    }

    // 5. Resumo baseado no id_empresa
    static async obterResumoCliente(id_empresa) {
        const db = await getConnection();
        try {
            const query = `
                SELECT 
                    COALESCE(SUM(CASE WHEN status_pagamento = 'PAGO' THEN valor END), 0) as totalPago,
                    COALESCE(SUM(CASE WHEN status_pagamento = 'PENDENTE' THEN valor END), 0) as totalPendente,
                    COALESCE(SUM(CASE WHEN status_pagamento = 'ATRASADO' THEN valor END), 0) as totalAtrasado,
                    COUNT(CASE WHEN status_pagamento = 'PAGO' THEN 1 END) as qtdRecebidos,
                    COUNT(CASE WHEN status_pagamento = 'PENDENTE' THEN 1 END) as qtdPendentes,
                    COUNT(CASE WHEN status_pagamento = 'ATRASADO' THEN 1 END) as quantidadeAtrasada
                FROM pagamentos 
                WHERE id_empresa = ?
            `;
            const [rows] = await db.execute(query, [id_empresa]);
            return rows[0];
        } finally {
            db.release();
        }
    }

    // 6. Altera forma futura por id_empresa
    static async alterarFormaPagamentoFutura(id_empresa, novaForma) {
        if (!id_empresa || !novaForma) {
            throw new Error(`Parâmetros inválidos.`);
        }
        const db = await getConnection();
        try {
            const query = `
                UPDATE pagamentos 
                SET forma_pagamento = ? 
                WHERE id_empresa = ? AND status_pagamento IN ('PENDENTE', 'ATRASADO')
            `;
            await db.execute(query, [novaForma, id_empresa]);
        } finally {
            db.release();
        }
    }

    // 7. Registra pagamento por id_pagamento e id_empresa
    static async registrarPagamento(id_pagamento, id_empresa) {
        const db = await getConnection();
        try {
            const query = `
                UPDATE pagamentos 
                SET status_pagamento = 'PAGO', data_pagamento = CURDATE() 
                WHERE id_pagamento = ? AND id_empresa = ? AND status_pagamento IN ('PENDENTE', 'ATRASADO')
            `;
            const [result] = await db.execute(query, [id_pagamento, id_empresa]);
            return result.affectedRows > 0;
        } finally {
            db.release();
        }
    }

    // 8. Sincroniza faturas atrasadas por id_empresa
    static async sincronizarAtrasadosPorEmpresa(id_empresa) {
        const db = await getConnection();
        try {
            const query = `
                UPDATE pagamentos 
                SET status_pagamento = 'ATRASADO' 
                WHERE id_empresa = ? AND status_pagamento = 'PENDENTE' AND data_vencimento < CURDATE()
            `;
            await db.execute(query, [id_empresa]);
        } finally {
            db.release();
        }
    }
}

export default FinanceiroClienteModel;