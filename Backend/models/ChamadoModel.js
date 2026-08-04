import { create, read, update, deleteRecord, getConnection } from '../config/database.js';

class ChamadoModel {

    // 1. CREATE (Cliente abrindo o chamado - prioridade nasce nula ou default)
    static async criar(dadosChamado) {
        try {
            // Garante que o chamado nasce como 'ABERTO' e sem resposta do admin
            const payload = {
                ...dadosChamado,
                status_chamado: 'ABERTO',
                resposta_admin: null,
                prioridade: null,
                id_tecnico: null
            };

            return await create('chamados', payload);
        } catch (error) {
            console.error('Erro ao criar chamado no Model:', error);
            throw error;
        }
    }

    // 2. READ (Cliente listando apenas os seus próprios chamados com paginação)
    static async listarPorEmpresa(id_empresa, limite, offset) {
        const connection = await getConnection();
        try {
            const sql = `
                SELECT * FROM chamados
                WHERE id_empresa = ?
                ORDER BY id_chamado DESC
                LIMIT ? OFFSET ?
            `;

            // Alterado para .execute para evitar problemas de tipagem com LIMIT/OFFSET
            const [chamados] = await connection.execute(sql, [Number(id_empresa), Number(limite), Number(offset)]);
            
            const [totalResult] = await connection.execute(
                'SELECT COUNT(*) as total FROM chamados WHERE id_empresa = ?',
                [id_empresa]
            );
            
            // Força a conversão para número comum prevenindo erros de BigInt
            const total = Number(totalResult[0].total);

            return {
                chamados,
                total,
                pagina: (offset / limite) + 1,
                limite,
                totalPaginas: Math.ceil(total / limite)
            };
        } catch (error) {
            console.error('Erro ao listar chamados da empresa:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    // 3. READ (ADM listando todos os chamados do sistema globalmente com paginação)
    static async listarTodosGerais(limite, offset) {
        const connection = await getConnection();
        try {
            // Ordenação inteligente: primeiro os Abertos, depois Em Andamento, Finalizados e Cancelados
            const sql = `
                SELECT c.*, e.nome_empresa 
                FROM chamados c
                JOIN empresa_clientes e ON c.id_empresa = e.id_empresa
                ORDER BY 
                    CASE c.status_chamado 
                        WHEN 'ABERTO' THEN 1 
                        WHEN 'EM_ANDAMENTO' THEN 2 
                        WHEN 'FINALIZADO' THEN 3 
                        WHEN 'CANCELADO' THEN 4 
                    END, 
                    c.id_chamado DESC
                LIMIT ? OFFSET ?
            `;
            
            // Alterado para .execute para blindar a paginação contra quebras de sintaxe SQL
            const [chamados] = await connection.execute(sql, [Number(limite), Number(offset)]);

            const [totalResult] = await connection.execute(
                'SELECT COUNT(*) as total FROM chamados'
            );
            
            // Força a conversão para número comum prevenindo erros de BigInt
            const total = Number(totalResult[0].total);

            return {
                chamados,
                total,
                pagina: (offset / limite) + 1,
                limite,
                totalPaginas: Math.ceil(total / limite)
            };
        } catch (error) {
            console.error('Erro ao listar todos os chamados globais:', error);
            throw error;
        } finally {
            connection.release();
        }
    }

    // 4. READ (Buscar dados detalhados de um único ID)
    static async buscarPorId(id) {
        try {
            const rows = await read('chamados', `id_chamado = ${id}`);
            return rows[0] || null;
        } catch (error) {
            console.error('Erro ao buscar chamado por ID:', error);
            throw error;
        }
    }

    // 5. UPDATE (ADM respondendo, definindo prioridade, técnico e status)
    static async atualizarPorAdmin(id, dadosResposta) {
        try {
            const { id_tecnico, status_chamado, resposta_admin, prioridade } = dadosResposta;
            
            const payload = {
                id_tecnico: id_tecnico || null,
                status_chamado,
                resposta_admin: resposta_admin || null,
                prioridade // Definido estritamente pelo Administrador
            };

            return await update('chamados', payload, `id_chamado = ${id}`);
        } catch (error) {
            console.error('Erro ao atualizar chamado pelo Admin:', error);
            throw error;
        }
    }

    // 6. UPDATE/DELETE (Cliente cancelando o chamado se ainda estiver ABERTO)
    static async cancelarPorCliente(id, id_empresa) {
        try {
            // Atualiza para cancelado aplicando trava de segurança por ID de empresa e Status
            return await update(
                'chamados', 
                { status_chamado: 'CANCELADO' }, 
                `id_chamado = ${id} AND id_empresa = ${id_empresa} AND status_chamado = 'ABERTO'`
            );
        } catch (error) {
            console.error('Erro ao cancelar chamado pelo cliente:', error);
            throw error;
        }
    }
    
    // 7. DELETE FÍSICO (Opcional para a gerência limpar o banco se necessário)
    static async excluirRegistro(id) {
        try {
            return await deleteRecord('chamados', `id_chamado = ${id}`);
        } catch (error) {
            console.error('Erro ao deletar registro físico do chamado:', error);
            throw error;
        }
    }
}

export default ChamadoModel;