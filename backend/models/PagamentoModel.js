import { getConnection } from '../config/database.js';

class PagamentoModel {

    static async buscarEmpresaDoUsuario(idUsuario) {
        const connection = await getConnection();

        try {
            const sql = `
                SELECT id_empresa
                FROM usuarios
                WHERE id_usuario = ?
                LIMIT 1
            `;

            const [rows] = await connection.execute(sql, [idUsuario]);
            return rows[0]?.id_empresa || null;

        } finally {
            connection.release();
        }
    }

    static async pagar(idPagamento, idUsuario) {
        const idEmpresa = await this.buscarEmpresaDoUsuario(idUsuario);

        if (!idEmpresa) {
            return {
                sucesso: false,
                status: 403,
                erro: 'Usuário sem empresa vinculada'
            };
        }

        const connection = await getConnection();

        try {
            await connection.beginTransaction();

            const [pagamentoRows] = await connection.execute(
                `
                    SELECT id_pagamento, status_pagamento
                    FROM pagamentos
                    WHERE id_pagamento = ?
                      AND id_empresa = ?
                    LIMIT 1
                `,
                [idPagamento, idEmpresa]
            );

            const pagamento = pagamentoRows[0];

            if (!pagamento) {
                await connection.rollback();
                return {
                    sucesso: false,
                    status: 404,
                    erro: 'Pagamento não encontrado'
                };
            }

            if (pagamento.status_pagamento === 'PAGO') {
                await connection.rollback();
                return {
                    sucesso: false,
                    status: 400,
                    erro: 'Pagamento já foi realizado'
                };
            }

            await connection.execute(
                `
                    UPDATE pagamentos
                    SET status_pagamento = 'PAGO',
                        data_pagamento = CURRENT_DATE()
                    WHERE id_pagamento = ?
                      AND id_empresa = ?
                `,
                [idPagamento, idEmpresa]
            );

            await connection.commit();

            return {
                sucesso: true,
                status: 200
            };

        } catch (error) {
            await connection.rollback();
            console.error('Erro ao pagar parcela:', error);
            throw error;

        } finally {
            connection.release();
        }
    }
}

export default PagamentoModel;
