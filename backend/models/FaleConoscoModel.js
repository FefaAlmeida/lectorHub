import { create, read, update, deleteRecord, getConnection } from '../config/database.js';

class FaleConoscoModel {

    // 1. LISTA GERAL (Para o Admin ver tudo com paginação, do mais novo ao mais antigo)
    static async listarTodos(limite, offset) {
        try {
            const connection = await getConnection();
            try {
                const sql = `
                SELECT *
                FROM fale_conosco
                ORDER BY id_contato DESC
                LIMIT ? OFFSET ?
                `;

                const [faleConosco] = await connection.query(sql, [limite, offset]);

                const [totalResult] = await connection.execute(
                    'SELECT COUNT(*) as total FROM fale_conosco'
                );

                const total = totalResult[0].total;

                return {
                    faleConosco,
                    total,
                    pagina: (offset / limite) + 1,
                    limite,
                    totalPaginas: Math.ceil(total / limite)
                };

            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Erro ao listar fale conosco:', error);
            throw error;
        }
    }

    // 2. BUSCA ESPECÍFICA (Para o Admin clicar em uma mensagem e ler ela inteira)
    static async buscarPorId(id) {
        try {
            const rows = await read(
                'fale_conosco',
                `id_contato = ${Number(id)}`
            );
            return rows[0] || null;
        } catch (error) {
            console.error('Erro ao buscar mensagens do fale conosco:', error);
            throw error;
        }
    }

    // 3. FILTRO: Mensagens não lidas/pendentes com PAGINAÇÃO
    static async listarPendentes(limite, offset) {
        try {
            const connection = await getConnection();
            try {
                const sql = `
                SELECT *
                FROM fale_conosco
                WHERE status_contato = 'PENDENTE'
                ORDER BY id_contato DESC
                LIMIT ? OFFSET ?
                `;

                const [faleConosco] = await connection.query(sql, [limite, offset]);

                const [totalResult] = await connection.execute(
                    "SELECT COUNT(*) as total FROM fale_conosco WHERE status_contato = 'PENDENTE'"
                );

                const total = totalResult[0].total;

                return {
                    faleConosco,
                    total,
                    pagina: (offset / limite) + 1,
                    limite,
                    totalPaginas: Math.ceil(total / limite)
                };

            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Erro ao listar pendentes:', error);
            throw error;
        }
    }

    // 4. FILTRO: Mensagens já respondidas/lidas com PAGINAÇÃO
    static async listarRespondidos(limite, offset) {
        try {
            const connection = await getConnection();
            try {
                const sql = `
                SELECT *
                FROM fale_conosco
                WHERE status_contato = 'RESPONDIDO'
                ORDER BY id_contato DESC
                LIMIT ? OFFSET ?
                `;

                const [faleConosco] = await connection.query(sql, [limite, offset]);

                const [totalResult] = await connection.execute(
                    "SELECT COUNT(*) as total FROM fale_conosco WHERE status_contato = 'RESPONDIDO'"
                );

                const total = totalResult[0].total;

                return {
                    faleConosco,
                    total,
                    pagina: (offset / limite) + 1,
                    limite,
                    totalPaginas: Math.ceil(total / limite)
                };
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Erro ao listar respondidos:', error);
            throw error;
        }
    }

    // 5. FILTRO: Linha do tempo (Da mais antiga para a mais recente) com PAGINAÇÃO
    static async listarPorData(limite, offset) {
        try {
            const connection = await getConnection();
            try {
                const sql = `
                SELECT *
                FROM fale_conosco
                ORDER BY data_contato ASC
                LIMIT ? OFFSET ?
                `;

                const [faleConosco] = await connection.query(sql, [limite, offset]);

                const [totalResult] = await connection.execute(
                    'SELECT COUNT(*) as total FROM fale_conosco'
                );

                const total = totalResult[0].total;

                return {
                    faleConosco,
                    total,
                    pagina: (offset / limite) + 1,
                    limite,
                    totalPaginas: Math.ceil(total / limite)
                };
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Erro ao listar por data:', error);
            throw error;
        }
    }

    // 6. SALVAR NO BANCO (Usado pelo formulário do site quando o cliente envia uma mensagem)
    static async criar(dadosFaleConosco) {
        try {
            return await create(
                'fale_conosco',
                dadosFaleConosco
            );
        } catch (error) {
            console.error('Erro ao criar fale conosco:', error);
            throw error;
        }
    }

    // 7. RESPONDER (Atualiza com a resposta do ADM e muda status)
    static async responder(id, resposta) {
        try {
            const connection = await getConnection();
            try {
                const sql = `
                UPDATE fale_conosco 
                SET resposta_adm = ?, 
                    data_resposta = NOW(), 
                    status_contato = 'RESPONDIDO'
                WHERE id_contato = ?
                `;
                const [result] = await connection.query(sql, [resposta, id]);
                return result.affectedRows > 0;
            } finally {
                connection.release();
            }
        } catch (error) {
            console.error('Erro ao atualizar resposta no banco:', error);
            throw error;
        }
    }
}

export default FaleConoscoModel;