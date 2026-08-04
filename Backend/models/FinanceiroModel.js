import { getConnection } from '../config/database.js';

class FinanceiroModel {

    // Marca automaticamente como ATRASADO toda parcela ainda PENDENTE cujo vencimento já passou.
    // Roda antes de listar/somar para manter o status sempre fiel à realidade. Retorna quantas mudaram.
    static async sincronizarAtrasados() {
        const connection = await getConnection();
        try {
            const sql = `
                UPDATE pagamentos
                SET status_pagamento = 'ATRASADO'
                WHERE status_pagamento = 'PENDENTE'
                  AND data_vencimento < CURRENT_DATE()
            `;
            const [result] = await connection.execute(sql);
            return result.affectedRows;
        } catch (error) {
            console.error('Erro ao sincronizar pagamentos atrasados:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    // Visão global do Admin: lista todas as parcelas/pagamentos de todas as empresas com paginação.
    // Aceita filtros opcionais por status e tipo de pagamento.
    static async listarTodos({ limite, offset, status, tipo }) {
        const connection = await getConnection();
        try {
            const condicoes = [];
            const filtros = [];

            if (status) {
                condicoes.push('p.status_pagamento = ?');
                filtros.push(status);
            }
            if (tipo) {
                condicoes.push('p.tipo_pagamento = ?');
                filtros.push(tipo);
            }

            const where = condicoes.length ? `WHERE ${condicoes.join(' AND ')}` : '';

            const sql = `
                SELECT p.*, e.nome_empresa
                FROM pagamentos p
                JOIN empresa_clientes e ON p.id_empresa = e.id_empresa
                ${where}
                ORDER BY
                    COALESCE(p.data_vencimento, p.data_pagamento) DESC,
                    p.id_pagamento DESC
                LIMIT ? OFFSET ?
            `;

            // .execute para blindar a paginação contra quebras de sintaxe SQL
            const [pagamentos] = await connection.execute(sql, [...filtros, Number(limite), Number(offset)]);

            const [totalResult] = await connection.execute(
                `SELECT COUNT(*) as total FROM pagamentos p ${where}`,
                filtros
            );

            // Força conversão para número comum prevenindo erros de BigInt
            const total = Number(totalResult[0].total);

            return {
                pagamentos,
                total,
                pagina: (offset / limite) + 1,
                limite,
                totalPaginas: Math.ceil(total / limite)
            };
        } catch (error) {
            console.error('Erro ao listar pagamentos globais:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    // Indicadores globais (independente de filtro/paginação) para os cards do topo
    static async obterResumo() {
        const connection = await getConnection();
        try {
            const sql = `
                SELECT
                    COALESCE(SUM(CASE WHEN status_pagamento = 'PAGO' THEN valor ELSE 0 END), 0)      AS totalRecebido,
                    COALESCE(SUM(CASE WHEN status_pagamento = 'PENDENTE' THEN valor ELSE 0 END), 0)  AS totalPendente,
                    COALESCE(SUM(CASE WHEN status_pagamento = 'ATRASADO' THEN valor ELSE 0 END), 0)  AS totalAtrasado,
                    COALESCE(SUM(CASE WHEN status_pagamento = 'PAGO' THEN 1 ELSE 0 END), 0)          AS qtdRecebidos,
                    COALESCE(SUM(CASE WHEN status_pagamento = 'PENDENTE' THEN 1 ELSE 0 END), 0)      AS qtdPendentes,
                    COALESCE(SUM(CASE WHEN status_pagamento = 'ATRASADO' THEN 1 ELSE 0 END), 0)      AS qtdAtrasados,
                    COUNT(*)                                                                          AS totalRegistros
                FROM pagamentos
            `;

            const [rows] = await connection.execute(sql);
            const r = rows[0] || {};

            return {
                totalRecebido: Number(r.totalRecebido) || 0,
                totalPendente: Number(r.totalPendente) || 0,
                totalAtrasado: Number(r.totalAtrasado) || 0,
                qtdRecebidos: Number(r.qtdRecebidos) || 0,
                qtdPendentes: Number(r.qtdPendentes) || 0,
                qtdAtrasados: Number(r.qtdAtrasados) || 0,
                totalRegistros: Number(r.totalRegistros) || 0
            };
        } catch (error) {
            console.error('Erro ao obter resumo financeiro:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    static async buscarPorId(id) {
        const connection = await getConnection();
        try {
            const sql = `
                SELECT p.*, e.nome_empresa
                FROM pagamentos p
                JOIN empresa_clientes e ON p.id_empresa = e.id_empresa
                WHERE p.id_pagamento = ?
                LIMIT 1
            `;
            const [rows] = await connection.execute(sql, [id]);
            return rows[0] || null;
        } catch (error) {
            console.error('Erro ao buscar pagamento por ID:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    // Admin dá baixa / reabre uma parcela. Ao marcar PAGO grava a data atual; caso contrário limpa.
    static async atualizarStatus(id, novoStatus) {
        const connection = await getConnection();
        try {
            const dataPagamento = novoStatus === 'PAGO' ? 'CURRENT_DATE()' : 'NULL';

            const sql = `
                UPDATE pagamentos
                SET status_pagamento = ?,
                    data_pagamento = ${dataPagamento}
                WHERE id_pagamento = ?
            `;

            const [result] = await connection.execute(sql, [novoStatus, id]);
            return result.affectedRows;
        } catch (error) {
            console.error('Erro ao atualizar status do pagamento:', error);
            throw error;
        } finally {
            connection.release();
        }
    }
}

export default FinanceiroModel;
